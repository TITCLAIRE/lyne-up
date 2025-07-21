/*
  # Création de la table user_preferences

  1. Nouvelle table
    - `user_preferences` pour stocker les préférences utilisateur
    - Paramètres audio, voix, sessions favorites
    - Synchronisation entre appareils

  2. Sécurité
    - Enable RLS sur la table user_preferences
    - Politique pour que les utilisateurs gèrent leurs préférences
*/

-- Créer la table user_preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Paramètres audio
  audio_enabled boolean DEFAULT true,
  audio_volume numeric(3,2) DEFAULT 0.25 CHECK (audio_volume >= 0 AND audio_volume <= 1),
  gong_enabled boolean DEFAULT true,
  gong_volume numeric(3,2) DEFAULT 0.15 CHECK (gong_volume >= 0 AND gong_volume <= 1),
  default_frequency text DEFAULT 'coherence',
  
  -- Paramètres vocaux
  voice_enabled boolean DEFAULT true,
  voice_gender text DEFAULT 'female' CHECK (voice_gender IN ('female', 'male')),
  voice_volume numeric(3,2) DEFAULT 0.7 CHECK (voice_volume >= 0 AND voice_volume <= 1),
  
  -- Préférences de session
  favorite_sessions text[] DEFAULT '{}',
  default_coherence_duration integer DEFAULT 5 CHECK (default_coherence_duration IN (3, 5, 15)),
  default_coherence_rhythm text DEFAULT '5-5',
  
  -- Paramètres d'interface
  theme text DEFAULT 'default',
  notifications_enabled boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

-- Politique : les utilisateurs peuvent voir leurs propres préférences
CREATE POLICY "Users can view own preferences" 
  ON user_preferences 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- Politique : les utilisateurs peuvent mettre à jour leurs préférences
CREATE POLICY "Users can update own preferences" 
  ON user_preferences 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Politique : les utilisateurs peuvent insérer leurs préférences
CREATE POLICY "Users can insert own preferences" 
  ON user_preferences 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement les préférences par défaut
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger pour créer automatiquement les préférences
CREATE TRIGGER on_user_created_preferences
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();