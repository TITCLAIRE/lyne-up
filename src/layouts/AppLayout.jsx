import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { user, loading } = useSupabase();
  
  // Initialiser les gestionnaires
  useAudioManager();
  useVoiceManager();
  useHeartRateDetector();

  // Gérer l'authentification et les redirections de manière centralisée
  useEffect(() => {
    console.log('🔄 AppLayout: useEffect auth - Loading:', loading, 'User:', !!user, 'Authenticated:', isAuthenticated, 'Path:', location.pathname);
    
    // Ne rien faire tant que Supabase charge
    if (!loading) {
      const currentPath = location.pathname;
      const publicPaths = ['/start', '/auth', '/free-session', '/discovery-session'];
      const isPublicPath = publicPaths.includes(currentPath);
      
      console.log('🔄 AppLayout: Vérification auth - User:', !!user, 'Authenticated:', isAuthenticated, 'Path:', currentPath, 'IsPublic:', isPublicPath);
      
      if (user) {
        // Utilisateur connecté dans Supabase
        if (!isAuthenticated) {
          // Synchroniser le store avec Supabase
          console.log('✅ AppLayout: Synchronisation store avec utilisateur Supabase');
          setAuthenticated(true, {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || 'Utilisateur',
            isPremium: false, // Sera mis à jour selon l'abonnement
            subscriptionStatus: 'free', // Par défaut
            trialEndsAt: null // Sera mis à jour si essai gratuit actif
          });
          return; // Éviter les redirections multiples
        }
        
        // Rediriger les utilisateurs connectés depuis les pages publiques vers l'accueil
        if (isAuthenticated && isPublicPath && currentPath !== '/free-session' && currentPath !== '/discovery-session') {
          console.log('🏠 AppLayout: Redirection utilisateur connecté vers accueil');
          navigate('/', { replace: true });
        }
      } else {
        // Utilisateur non connecté dans Supabase
        if (isAuthenticated) {
          // Nettoyer le store
          console.log('❌ AppLayout: Nettoyage store - utilisateur déconnecté de Supabase');
          setAuthenticated(false, null);
          return; // Éviter les redirections multiples
        }
        
        // Rediriger vers l'authentification si sur une route protégée
        if (!isPublicPath) {
          console.log('🔒 AppLayout: Redirection vers authentification - route protégée');
          navigate('/auth', { replace: true });
        }
      }
    } else {
      console.log('⏳ AppLayout: Chargement en cours...');
    }
  }, [user, loading, isAuthenticated, setAuthenticated, navigate, location.pathname]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    console.log('⏳ AppLayout: Affichage du loader');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  console.log('🔄 AppLayout: Rendu final - User:', !!user, 'Authenticated:', isAuthenticated, 'Loading:', loading, 'Path:', location.pathname);

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