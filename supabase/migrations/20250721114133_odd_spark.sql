/*
  # Création de la table subscriptions

  1. Nouvelle table
    - `subscriptions` pour gérer les abonnements Stripe
    - Lien avec la table users
    - Statuts d'abonnement détaillés
    - Informations de facturation

  2. Sécurité
    - Enable RLS sur la table subscriptions
    - Politique pour que les utilisateurs ne voient que leurs abonnements
*/

-- Créer la table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  plan_type text NOT NULL CHECK (plan_type IN ('monthly', 'yearly', 'lifetime')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);

-- Politique : les utilisateurs ne peuvent voir que leurs propres abonnements
CREATE POLICY "Users can view own subscriptions" 
  ON subscriptions 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();