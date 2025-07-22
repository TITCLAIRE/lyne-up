import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/appStore';

export const useSupabase = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { setAuthenticated } = useAppStore();

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Récupérer les données utilisateur complètes
        const userData = await getUserProfile(session.user.id);
        setAuthenticated(true, userData);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Changement d\'état auth:', event, !!session?.user);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Récupérer les données utilisateur complètes
          const userData = await getUserProfile(session.user.id);
          setAuthenticated(true, userData);
        } else {
          setAuthenticated(false, null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setAuthenticated]);

  // Fonction pour récupérer le profil utilisateur complet
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('⚠️ Profil utilisateur non trouvé, création automatique via trigger');
        // Le profil sera créé automatiquement par le trigger
        // Retourner un profil par défaut en attendant
        return {
          id: userId,
          email: user?.email || '',
          name: user?.user_metadata?.full_name || 'Utilisateur',
          isPremium: false,
          subscriptionStatus: 'free',
          trialEndsAt: null
        };
      }

      return {
        id: data.id,
        email: data.email,
        name: data.full_name || 'Utilisateur',
        isPremium: data.subscription_status === 'premium',
        subscriptionStatus: data.subscription_status || 'free',
        trialEndsAt: data.trial_ends_at
      };
    } catch (error) {
      console.error('❌ Erreur getUserProfile:', error);
      return null;
    }
  };

  // Fonction d'inscription
  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('❌ Erreur inscription:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Inscription réussie:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erreur signUp:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erreur connexion:', error);
        // Gestion spécifique pour email non confirmé
        if (error.message === 'Email not confirmed') {
          return { 
            success: false, 
            error: 'Votre email n\'a pas encore été confirmé. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation.',
            errorCode: 'email_not_confirmed',
            email: email
          };
        }
        return { success: false, error: error.message };
      }

      console.log('✅ Connexion réussie:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erreur signIn:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour renvoyer l'email de confirmation
  const resendConfirmation = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('❌ Erreur renvoi email:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email de confirmation renvoyé');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur resendConfirmation:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erreur déconnexion:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Déconnexion réussie');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur signOut:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    resendConfirmation
  };
};