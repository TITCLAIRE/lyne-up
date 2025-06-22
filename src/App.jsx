import React from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/screens/HomeScreen';
import { SessionScreen } from './components/screens/SessionScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { MeditationSelectionScreen } from './components/screens/MeditationSelectionScreen';
import { CoherenceSelectionScreen } from './components/screens/CoherenceSelectionScreen';
import { CoherenceSessionScreen } from './components/screens/CoherenceSessionScreen';
import { FreeSessionSelectionScreen } from './components/screens/FreeSessionSelectionScreen';
import { FreeSessionScreen } from './components/screens/FreeSessionScreen';
import { SidePanel } from './components/SidePanel';
import { useAppStore } from './store/appStore';
import { useAudioManager } from './hooks/useAudioManager';
import { useVoiceManager } from './hooks/useVoiceManager';
import { useHeartRateDetector } from './hooks/useHeartRateDetector';

function App() {
  const { currentScreen } = useAppStore();
  
  // Initialiser les gestionnaires - RETOUR AU SYSTÈME CLASSIQUE
  useAudioManager();
  useVoiceManager(); // Système vocal classique restauré
  useHeartRateDetector();

  const renderScreen = () => {
    console.log('🔄 Navigation - Écran actuel:', currentScreen);
    
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'session':
        return <SessionScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'meditationSelection':
        return <MeditationSelectionScreen />;
      case 'coherenceSelection':
        return <CoherenceSelectionScreen />;
      case 'coherenceSession':
        return <CoherenceSessionScreen />;
      case 'freeSessionSelection':
        return <FreeSessionSelectionScreen />;
      case 'freeSession':
        return <FreeSessionScreen />;
      default:
        console.log('⚠️ Écran non reconnu, retour à l\'accueil:', currentScreen);
        return <HomeScreen />;
    }
  };

  return (
    <div 
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1a3e, #1e4c8a, #0a1a3e)'
      }}
    >
      <Header />
      <main className="relative">
        {renderScreen()}
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

export default App;