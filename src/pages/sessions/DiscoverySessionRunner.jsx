import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Home, Headphones, Heart, Wind } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../../components/BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager';

export default function DiscoverySessionRunner() {
  const navigate = useNavigate();
  
  const { 
    freeSessionSettings,
    isSessionActive, 
    setSessionActive,
    setCurrentSession,
    audioSettings,
    voiceSettings
  } = useAppStore();
  
  // Initialiser la session comme 'free' pour la compatibilité
  useEffect(() => {
    setCurrentSession('free');
  }, [setCurrentSession]);
  
  // Fonction de fin de session - redirige vers la page d'authentification
  const handleSessionComplete = useCallback(() => {
    console.log('🏁 Session découverte terminée, redirection vers création de compte');
    navigate('/auth');
  }, [navigate]);

  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer(handleSessionComplete);
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong } = useAudioManager();
  const { speak, stop: stopVoice } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnding, setSessionEnding] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // Créer le pattern respiratoire à partir des paramètres
  const createDiscoveryPattern = () => {
    return {
      inhale: freeSessionSettings.inhaleTime,
      hold: 0,
      exhale: freeSessionSettings.exhaleTime
    };
  };

  // Gérer les changements de phase pour le gong
  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null && audioSettings.enabled) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, playGong, audioSettings.enabled]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnding) {
      console.log('🏁 Session découverte terminée - Redirection vers création de compte');
      setSessionEnding(true);
      
      // Message de fin
      speak("Félicitations ! Vous avez terminé votre séance découverte de cohérence cardiaque intégrative. Créez maintenant votre compte pour accéder à toutes nos sessions.");
      
      // Arrêter l'audio et la respiration
      stopAudio();
      stopBreathing();
      
      // Redirection après un court délai
      setTimeout(() => {
        stopVoice();
        navigate('/auth');
      }, 3000);
    }
  }, [timeRemaining, isSessionActive, sessionEnding, speak, stopAudio, stopBreathing, stopVoice, navigate]);

  // Démarrage vocal automatique
  useEffect(() => {
    if (isSessionActive && !voiceSystemStarted && voiceSettings.enabled) {
      console.log('🎤 Démarrage vocal automatique - Session découverte');
      setVoiceSystemStarted(true);
      
      // Message de démarrage spécifique
      setTimeout(() => {
        speak("Bienvenue dans cette séance découverte de la cohérence cardiaque intégrative. Inspirez et expirez lentement et profondément en suivant le guide respiratoire visuel ou le rythme du gong.");
      }, 1000);
    }
  }, [isSessionActive, voiceSystemStarted, voiceSettings.enabled, speak]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      console.log('Démarrage session découverte');
      
      setSessionActive(true);
      setSessionEnding(false);
      setVoiceSystemStarted(false);
      
      // Démarrer l'audio avec la fréquence 0.1Hz (cohérence cardiaque)
      if (audioSettings.enabled) {
        console.log('Démarrage audio découverte avec fréquence 0.1Hz');
        startAudio('coherence');
      }
      
      // Démarrer le timer avec 6 minutes
      const durationInSeconds = 6 * 60; // 6 minutes
      console.log('Durée session découverte:', durationInSeconds, 'secondes');
      startTimer(durationInSeconds);
      
      // Démarrer l'animation respiratoire
      const customPattern = createDiscoveryPattern();
      console.log('Pattern session découverte:', customPattern);
      startBreathing(customPattern);
      
    } else {
      console.log('Pause session découverte');
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
    console.log('Retour à l\'écran de démarrage');
    setSessionActive(false);
    stopTimer();
    stopBreathing();
    stopAudio();
    stopVoice();
    resetTimer();
    setLastPhase(null);
    setSessionEnding(false);
    setVoiceSystemStarted(false);
    navigate('/start');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalCycleTime = freeSessionSettings.inhaleTime + freeSessionSettings.exhaleTime;
  const cyclesPerMinute = Math.round(60 / totalCycleTime * 10) / 10;

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Image de fond directe pour la session en cours */}
      <img 
        src="/Fond app.png" 
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: 0.08,
          filter: 'hue-rotate(180deg) brightness(1.3) contrast(1.0)',
          mixBlendMode: 'overlay'
        }}
      />
      
      <div className="px-5 pb-5 flex-1 flex flex-col relative z-10">
        {/* En-tête de session */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 backdrop-blur-sm">
              <Heart size={24} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Séance Découverte
              </h1>
              <p className="text-white/70">Cohérence cardiaque intégrative</p>
              <p className="text-sm text-white/50">
                6 minutes • Rythme {freeSessionSettings.inhaleTime}/{freeSessionSettings.exhaleTime} • 0.1Hz
              </p>
            </div>
          </div>

          {/* Indicateur spécial pour Session Découverte */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-cyan-200 mb-2 flex items-center justify-center gap-2">
              <Heart size={16} />
              <strong>SESSION DÉCOUVERTE :</strong>
            </p>
            <div className="text-xs text-cyan-100/80 space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Wind size={12} />
                <strong>Rythme :</strong> {freeSessionSettings.inhaleTime}s inspiration / {freeSessionSettings.exhaleTime}s expiration
              </div>
              <div>Durée : 6 minutes</div>
              <div>Fréquence : 0.1 Hz (cohérence cardiaque)</div>
              <div>Sons binauraux + Gong de transition</div>
            </div>
          </div>

          {/* Indication importante sur les écouteurs */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-4 flex items-start gap-3">
            <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-blue-200 font-medium mb-1">Important :</p>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Les sons binauraux nécessitent impérativement l'utilisation d'écouteurs stéréo pour créer l'effet de battement binaural entre les deux oreilles.
              </p>
            </div>
          </div>
        </div>

        {/* Guide de respiration */}
        <div className="flex-1 flex flex-col justify-center">
          <BreathingGuide 
            breathingState={breathingState}
            isActive={isSessionActive}
          />
        </div>

        {/* Timer et progression */}
        <div className="text-center mb-8">
          <div className="text-5xl font-light mb-4 tracking-wider">
            {formatTime(timeRemaining)}
          </div>
          <div className="w-full max-w-sm mx-auto h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-1000"
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
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
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
    </div>
  );
}