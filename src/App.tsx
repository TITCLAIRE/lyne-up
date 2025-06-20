import React from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/screens/HomeScreen';
import { SessionScreen } from './components/screens/SessionScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { MeditationSelectionScreen } from './components/screens/MeditationSelectionScreen';
import { CoherenceSelectionScreen } from './components/screens/CoherenceSelectionScreen';
import { CoherenceSessionScreen } from './components/screens/CoherenceSessionScreen';
import { SidePanel } from './components/SidePanel';
import { useAppStore } from './store/appStore';
import { useAudioManager } from './hooks/useAudioManager';
import { useVoiceManager } from './hooks/useVoiceManager';
import { useHeartRateDetector } from './hooks/useHeartRateDetector';

function App() {
  const { currentScreen } = useAppStore();
  
  // Initialiser les gestionnaires
  useAudioManager();
  useVoiceManager();
  useHeartRateDetector();

  const renderScreen = () => {
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
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
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