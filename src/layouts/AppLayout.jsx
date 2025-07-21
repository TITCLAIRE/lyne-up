import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SidePanel } from '../components/SidePanel';
import { useAppStore } from '../store/appStore';
import { useSupabase } from '../hooks/useSupabase';
import { useAudioManager } from '../hooks/useAudioManager';
import { useVoiceManager } from '../hooks/useVoiceManager';
import { useHeartRateDetector } from '../hooks/useHeartRateDetector';

function AppLayout() {
  const { 
    isAuthenticated,
    setAuthenticated
  } = useAppStore();
  
  const navigate = useNavigate();
  const { user, loading } = useSupabase();
  
  // Initialiser les gestionnaires
  useAudioManager();
  useVoiceManager();
  useHeartRateDetector();

  // Gérer l'authentification avec Supabase
  useEffect(() => {
    if (!loading) {
      if (user && !isAuthenticated) {
        // Utilisateur connecté dans Supabase mais pas dans le store
        console.log('✅ Utilisateur connecté, mise à jour du store');
        setAuthenticated(true, {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'Utilisateur',
          isPremium: false // Sera mis à jour selon l'abonnement
        });
      } else if (!user && isAuthenticated) {
        // Utilisateur déconnecté de Supabase
        console.log('❌ Utilisateur déconnecté, nettoyage du store');
        setAuthenticated(false, null);
      }
    }
  }, [user, loading, isAuthenticated, setAuthenticated]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    console.log('⏳ Chargement de la session...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Chargement...</p>
        </div>
      </div>
    );
  }

  console.log('🔄 Rendu AppLayout - User:', !!user, 'Authenticated:', isAuthenticated, 'Loading:', loading);

  return (
    <div 
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Image de fond directe */}
      <img 
        src="/Fond app.png" 
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: 0.08,
          filter: 'hue-rotate(200deg) brightness(1.2) contrast(0.9)',
          mixBlendMode: 'overlay'
        }}
        onLoad={() => console.log('✅ Image de fond chargée avec succès')}
        onError={() => console.log('❌ Erreur de chargement de l\'image de fond')}
      />
      
      <div className="relative z-10">
        <Header />
      </div>
      <main className="relative">
        <Outlet />
      </main>
      <SidePanel />
      
      {/* Overlay pour le menu */}
      <div 
        id="overlay" 
        className="fixed inset-0 bg-black/50 opacity-0 invisible transition-all duration-300 z-40"
      />
    </div>
  );
}

export default AppLayout;