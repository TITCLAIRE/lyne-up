import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabase = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      try {
      }
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

      (event, session) => {
      }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour récupérer le profil utilisateur complet
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erreur récupération profil:', error);
        return null;
      }

      return data;
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