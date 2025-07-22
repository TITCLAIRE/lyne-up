import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { SidePanel } from '../components/SidePanel';
import { useAppStore } from '../store/appStore';
import { useSupabase } from '../hooks/useSupabase';
import { useAudioManager } from '../hooks/useAudioManager';
import { useVoiceManager } from '../hooks/useVoiceManager';
import { useHeartRateDetector } from '../hooks/useHeartRateDetector';
import { useRef } from 'react';

function AppLayout() {
  const { 
    isAuthenticated,
    setAuthenticated
  } = useAppStore();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSupabase();
  const lastAuthState = useRef({ user: null, isAuthenticated: null, loading: true });
  const hasRedirected = useRef(false);
  
  // Initialiser les gestionnaires
  useAudioManager();
  useVoiceManager();
  useHeartRateDetector();

  // Gérer l'authentification et les redirections de manière centralisée
  useEffect(() => {
    // Éviter les re-exécutions inutiles
    const currentState = { user: !!user, isAuthenticated, loading };
    const lastState = lastAuthState.current;
    
    if (
      currentState.user === lastState.user &&
      currentState.isAuthenticated === lastState.isAuthenticated &&
      currentState.loading === lastState.loading
    ) {
      return; // Aucun changement, pas besoin de re-exécuter
    }
    
    lastAuthState.current = currentState;
    console.log('🔄 AppLayout: Auth state changed - Loading:', loading, 'User:', !!user, 'Auth:', isAuthenticated);
    
    // Ne rien faire tant que Supabase charge
    if (!loading && !hasRedirected.current) {
      const currentPath = location.pathname;
      const publicPaths = ['/', '/start', '/auth', '/free-session', '/discovery-session'];
      const isPublicPath = publicPaths.includes(currentPath);
      
      if (user) {
        // Utilisateur connecté dans Supabase
        // Rediriger les utilisateurs connectés depuis les pages publiques vers l'accueil
        if (isAuthenticated && isPublicPath && currentPath !== '/free-session' && currentPath !== '/discovery-session') {
          console.log('🏠 AppLayout: Redirection utilisateur connecté vers accueil');
          hasRedirected.current = true;
          navigate('/', { replace: true });
          setTimeout(() => { hasRedirected.current = false; }, 1000);
        }
      } else {
        // Utilisateur non connecté dans Supabase
        // Rediriger vers l'authentification si sur une route protégée
        if (!isPublicPath) {
          console.log('🔒 AppLayout: Redirection vers authentification - route protégée');
          hasRedirected.current = true;
          navigate('/auth', { replace: true });
          setTimeout(() => { hasRedirected.current = false; }, 1000);
        }
      }
    }
  }, [user, loading, isAuthenticated, setAuthenticated, navigate, location.pathname]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Vérification de votre session...</p>
        </div>
      </div>
    );
  }


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