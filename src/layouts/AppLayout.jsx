import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SidePanel } from '../components/SidePanel';
import { useAppStore } from '../store/appStore';
import { useAudioManager } from '../hooks/useAudioManager';
import { useVoiceManager } from '../hooks/useVoiceManager';
import { useHeartRateDetector } from '../hooks/useHeartRateDetector';

function AppLayout() {
  const { 
    showStartScreen,
    isTrialMode,
    isAuthenticated
  } = useAppStore();
  
  const navigate = useNavigate();
  
  // Initialiser les gestionnaires
  useAudioManager();
  useVoiceManager();
  useHeartRateDetector();

  // Redirection si l'utilisateur n'a pas encore terminé les pages de lancement
  useEffect(() => {
    // Ne pas faire de redirection automatique depuis AppLayout
    // La redirection se fait directement dans resetOnboarding
  }, [showStartScreen, navigate]);

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