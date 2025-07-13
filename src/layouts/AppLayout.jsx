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
    showLaunchScreen,
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
    if (showLaunchScreen) {
      navigate('/launch');
    }
  }, [showLaunchScreen, navigate]);

  return (
    <div 
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      <Header />
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