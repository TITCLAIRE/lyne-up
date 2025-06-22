import React, { useEffect, useState } from 'react';
import { Play, Pause, Home, Headphones, Heart } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager';
import { getBreathingPattern } from '../../data/sessions';

export const CoherenceSessionScreen = () => {
  const { 
    coherenceSettings,
    isSessionActive, 
    setSessionActive, 
    setCurrentScreen,
    audioSettings,
    voiceSettings
  } = useAppStore();
  
  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { speak, stop: stopVoice, startCoherenceGuidance } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // Obtenir le pattern respiratoire pour la cohérence cardiaque
  const getCoherenceBreathingPattern = () => {
    const pattern = getBreathingPattern('coherence', coherenceSettings.rhythm);
    return pattern;
  };

  // Gérer les changements de phase pour le gong
  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null && coherenceSettings.transitionEnabled && !coherenceSettings.silentMode) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, coherenceSettings, playGong]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnded) {
      console.log('🏁 Session cohérence cardiaque terminée');
      setSessionEnded(true);
      
      // Message de fin
      if (!coherenceSettings.silentMode) {
        speak("Session de cohérence cardiaque terminée. Vous avez créé un état d'harmonie intérieure.");
      }
      
      // Arrêter l'audio et la respiration
      stopAudio();
      stopBreathing();
      stopVoice();
      
      // Redirection automatique vers les résultats
      setTimeout(() => {
        setCurrentScreen('results');
      }, 3000);
    }
  }, [timeRemaining, isSessionActive, sessionEnded, setCurrentScreen, coherenceSettings.silentMode, speak, stopAudio, stopBreathing, stopVoice]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      const breathingPattern = getCoherenceBreathingPattern();
      
      setSessionActive(true);
      setSessionEnded(false);
      setVoiceSystemStarted(false);
      
      // Utiliser la fréquence sélectionnée manuellement ou par défaut
      if (coherenceSettings.gongEnabled && !coherenceSettings.silentMode) {
        const selectedFrequency = audioSettings.frequency !== 'coherence' ? audioSettings.frequency : 'coherence';
        console.log('🎵 Démarrage audio cohérence avec fréquence:', selectedFrequency);
        startAudio(selectedFrequency);
      }
      
      // Démarrer le timer et la respiration
      const durationInSeconds = (coherenceSettings.duration || 5) * 60;
      console.log('⏱️ Durée session cohérence:', durationInSeconds, 'secondes');
      startTimer(durationInSeconds);
      startBreathing(breathingPattern);
      
      // Démarrage du guidage vocal spécialisé pour la cohérence cardiaque
      if (!coherenceSettings.silentMode) {
        startCoherenceGuidance(coherenceSettings);
      }
    } else {
      setSessionActive(false);
      stopTimer();
      stopBreathing();
      stopAudio();
      stopVoice();
      setLastPhase(null);
      setSessionEnded(false);
      setVoiceSystemStarted(false);
    }
  };

  const handleGoHome = () => {
    setSessionActive(false);
    stopTimer();
    stopBreathing();
    stopAudio();
    stopVoice();
    resetTimer();
    setLastPhase(null);
    setSessionEnded(false);
    setVoiceSystemStarted(false);
    setCurrentScreen('home');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-5 pb-5">
      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cohérence Cardiaque</h1>
            <p className="text-white/70">
              {coherenceSettings.duration} min - Rythme {coherenceSettings.rhythm}
            </p>
            <p className="text-sm text-white/50">
              Durée totale : {coherenceSettings.duration}:00
            </p>
          </div>
        </div>

        {/* Indication importante sur les écouteurs */}
        {!coherenceSettings.silentMode && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-4 flex items-start gap-3">
            <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-blue-200 font-medium mb-1">Important :</p>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Les sons binauraux nécessitent impérativement l'utilisation d'écouteurs stéréo pour créer l'effet de battement binaural entre les deux oreilles.
              </p>
            </div>
          </div>
        )}

        {/* Fréquence audio active */}
        {coherenceSettings.gongEnabled && !coherenceSettings.silentMode && (
          <div className="bg-white/10 rounded-lg p-2 mb-4">
            <p className="text-xs text-white/70">
              🎵 Fréquence active : <span className="text-cyan-400 font-medium">{getCurrentFrequencyName()}</span>
              {audioSettings.frequency !== 'coherence' && (
                <span className="text-yellow-300 ml-2">• Fréquence manuelle sélectionnée</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Guide de respiration */}
      <BreathingGuide 
        breathingState={breathingState}
        isActive={isSessionActive}
      />

      {/* Timer et progression */}
      <div className="text-center mb-8">
        <div className="text-5xl font-light mb-4 tracking-wider">
          {formatTime(timeRemaining)}
        </div>
        <div className="w-full max-w-sm mx-auto h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-white/60 mt-2">
          Progression : {Math.round(progress)}%
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleToggleSession}
          disabled={sessionEnded}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            sessionEnded 
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {sessionEnded ? (
            <>Session terminée</>
          ) : (
            <>
              {isSessionActive ? <Pause size={20} /> : <Play size={20} />}
              {isSessionActive ? 'Pause' : 'Commencer'}
            </>
          )}
        </button>
        <button
          onClick={handleGoHome}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour
        </button>
      </div>
    </div>
  );
};