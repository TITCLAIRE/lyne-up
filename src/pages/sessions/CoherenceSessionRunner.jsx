import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Home, Headphones, Heart } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../../components/BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager';
import { getBreathingPattern } from '../../data/sessions';

export default function CoherenceSessionRunner() {
  const navigate = useNavigate();
  
  const { 
    coherenceSettings,
    trialCoherenceSettings,
    isSessionActive, 
    setSessionActive, 
    audioSettings,
    voiceSettings,
    isTrialMode,
    setCurrentScreen
  } = useAppStore();
  
  // Fonction de fin de session
  const handleSessionComplete = useCallback(() => {
    console.log('🏁 Session cohérence terminée, redirection vers les résultats');
    navigate('/results');
  }, [navigate]);

  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { speak, stop: stopVoice, startSessionGuidance } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnding, setSessionEnding] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // Utiliser les paramètres appropriés selon le mode
  const currentSettings = isTrialMode ? trialCoherenceSettings : coherenceSettings;


  // Obtenir le pattern respiratoire pour la cohérence cardiaque
  const getCoherenceBreathingPattern = () => {
    const pattern = getBreathingPattern('coherence', currentSettings.rhythm);
    return pattern;
  };

  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null && currentSettings.gongEnabled && !currentSettings.silentMode) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, currentSettings, playGong]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnding) {
      console.log('🏁 Session cohérence cardiaque terminée - Redirection vers résultats');
      setSessionEnding(true);
      
      // Message de fin
      if (!currentSettings.silentMode) {
        const endMessage = isTrialMode 
          ? "Félicitations ! Vous avez terminé votre session d'essai de cohérence cardiaque. Vous avez créé un état d'harmonie intérieure."
          : "Session de cohérence cardiaque terminée. Vous avez créé un état d'harmonie intérieure.";
        speak(endMessage);
      }
      
      // Arrêter l'audio et la respiration
      stopAudio();
      stopBreathing();
      
      // Redirection après un court délai pour permettre au message de fin de se jouer
      setTimeout(() => {
        stopVoice();
        if (isTrialMode) {
          setCurrentScreen('trialResults');
        } else {
          setCurrentScreen('results');
        }
      }, 2000);
    }
  }, [timeRemaining, isSessionActive, sessionEnding, currentSettings.silentMode, speak, stopAudio, stopBreathing, stopVoice, isTrialMode, setCurrentScreen]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      const breathingPattern = getCoherenceBreathingPattern();
      
      setSessionActive(true);
      setSessionEnding(false);
      setVoiceSystemStarted(false);
      
      // Utiliser la fréquence sélectionnée manuellement ou par défaut
      if (currentSettings.gongEnabled && !currentSettings.silentMode) {
        const selectedFrequency = audioSettings.frequency !== 'coherence' ? audioSettings.frequency : 'coherence';
        console.log('🎵 Démarrage audio cohérence avec fréquence:', selectedFrequency, 'Gong activé:', currentSettings.gongEnabled);
        startAudio(selectedFrequency);
      }
      
      // Démarrer le timer et la respiration
      const durationInSeconds = (currentSettings.duration || 5) * 60;
      console.log('⏱️ Durée session cohérence:', durationInSeconds, 'secondes');
      startTimer(durationInSeconds);
      startBreathing(breathingPattern);
      
      // Démarrage du guidage vocal pour la session
      if (!currentSettings.silentMode && voiceSettings.enabled) {
        console.log('🎤 Démarrage guidage vocal pour cohérence cardiaque');
        setTimeout(() => {
          startSessionGuidance();
        }, 500);
      }
    } else {
      setSessionActive(false);
      stopTimer();
      stopBreathing();
      stopAudio();
      stopVoice();
      setLastPhase(null);
      setSessionEnding(false);
      setVoiceSystemStarted(false);
    }
  };

  const handleGoBack = () => {
    setSessionActive(false);
    stopTimer();
    stopBreathing();
    stopAudio();
    stopVoice();
    resetTimer();
    setLastPhase(null);
    setSessionEnding(false);
    setVoiceSystemStarted(false);
    
    navigate('/sessions/libre');
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden backdrop-blur-sm border ${
            isTrialMode 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-white/10 border-white/20'
          }`}>
            <Heart size={24} className={isTrialMode ? 'text-green-400' : 'text-white'} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              isTrialMode 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' 
                : ''
            }`}>
              {isTrialMode ? 'Session d\'Essai Gratuite' : 'Cohérence Cardiaque'}
            </h1>
            <p className="text-white/70">
              {currentSettings.duration} min - Rythme {currentSettings.rhythm}
            </p>
            <p className="text-sm text-white/50">
              Durée totale : {currentSettings.duration}:00
            </p>
          </div>
        </div>

        {/* Message spécial pour la session d'essai */}
        {isTrialMode && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-green-200 font-medium mb-1">🎁 Session d'essai en cours</p>
            <p className="text-xs text-green-100/80">
              Découvrez les bienfaits de la cohérence cardiaque avec cette session complète de 5 minutes.
            </p>
          </div>
        )}

        {/* Indication importante sur les écouteurs */}
        {!currentSettings.silentMode && (
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
        {currentSettings.gongEnabled && !currentSettings.silentMode && (
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
            className={`h-full transition-all duration-1000 ${
              isTrialMode 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                : 'bg-gradient-to-r from-cyan-400 to-purple-400'
            }`}
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
          disabled={sessionEnding}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            sessionEnding 
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : isTrialMode
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {sessionEnding ? (
            <>Session terminée</>
          ) : (
            <>
              {isSessionActive ? <Pause size={20} /> : <Play size={20} />}
              {isSessionActive ? 'Pause' : 'Commencer'}
            </>
          )}
        </button>
        <button
          onClick={handleGoBack}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour
        </button>
      </div>
    </div>
  );
}