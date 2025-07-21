/*
  # Création de la table usage_stats

  1. Nouvelle table
    - `usage_stats` pour suivre l'utilisation des fonctionnalités
    - Permet de limiter l'accès pour les utilisateurs gratuits
    - Statistiques pour l'analyse d'usage

  2. Sécurité
    - Enable RLS sur la table usage_stats
    - Politique pour que les utilisateurs ne voient que leurs statistiques
*/

-- Créer la table usage_stats
CREATE TABLE IF NOT EXISTS usage_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('switch', 'reset', 'progressive', 'kids', 'seniors', 'scan', 'coherence', 'meditation', 'hypnosis', 'free')),
  session_subtype text, -- Pour les méditations spécifiques (gratitude, abundance, etc.)
  duration_seconds integer NOT NULL DEFAULT 0,
  completed boolean DEFAULT false,
  session_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS usage_stats_user_id_idx ON usage_stats(user_id);
CREATE INDEX IF NOT EXISTS usage_stats_session_date_idx ON usage_stats(session_date);
CREATE INDEX IF NOT EXISTS usage_stats_session_type_idx ON usage_stats(session_type);

-- Politique : les utilisateurs ne peuvent voir que leurs propres statistiques
CREATE POLICY "Users can view own usage stats" 
  ON usage_stats 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- Politique : les utilisateurs peuvent insérer leurs propres statistiques
CREATE POLICY "Users can insert own usage stats" 
  ON usage_stats 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Vue pour les statistiques quotidiennes
CREATE OR REPLACE VIEW daily_usage_stats AS
SELECT 
  user_id,
  session_date::date as usage_date,
  session_type,
  COUNT(*) as session_count,
  SUM(duration_seconds) as total_duration,
  COUNT(*) FILTER (WHERE completed = true) as completed_sessions
FROM usage_stats
GROUP BY user_id, session_date::date, session_type
ORDER BY usage_date DESC;