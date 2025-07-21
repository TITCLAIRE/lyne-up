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

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Changement d\'authentification:', event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userData = await getUserProfile(session.user.id);
          setAuthenticated(true, userData);
        } else {
          setAuthenticated(false, null);
        }
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
    getUserProfile
  };
};