import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('📋 Ajoutez dans votre fichier .env :');
  console.log('VITE_SUPABASE_URL=https://votre-projet.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici');
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Fonction utilitaire pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('⚠️ Supabase connecté mais tables pas encore créées:', error.message);
      return { connected: true, tablesReady: false };
    }
    console.log('✅ Supabase connecté et tables prêtes');
    return { connected: true, tablesReady: true };
  } catch (error) {
    console.error('❌ Erreur de connexion Supabase:', error);
    return { connected: false, tablesReady: false };
  }
};

// Types TypeScript pour la base de données (optionnel mais recommandé)
export const USER_ROLES = {
  FREE: 'free',
  PREMIUM: 'premium',
  EXPIRED: 'expired'
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  INCOMPLETE: 'incomplete',
  TRIALING: 'trialing'
};

export const PLAN_TYPES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime'
};