import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Home, Headphones, Moon, Wind } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../../components/BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager';
import { getHypnosisSession, getHypnosisBreathingPattern, getHypnosisFrequency } from '../../data/hypnosisSessions';

export default function HypnosisSessionRunner() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const { 
    setCurrentSession,
    isSessionActive,
    setSessionActive,
    audioSettings,
    voiceSettings
  } = useAppStore();
  
  // Fonction de fin de session
  const handleSessionComplete = useCallback(() => {
    console.log('🏁 Session hypnose terminée, redirection vers les résultats');
    navigate('/results');
  }, [navigate]);

  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer(handleSessionComplete);
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { speak, stop: stopVoice } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnding, setSessionEnding] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isGongEnabled, setIsGongEnabled] = useState(true);
  const [isGuidedBreathing, setIsGuidedBreathing] = useState(true);
  const phaseTimeoutRef = useRef(null);


  // Initialiser la session en fonction du paramètre d'URL
  useEffect(() => {
    if (sessionId) {
      setCurrentSession(sessionId);
    }
  }, [sessionId, setCurrentSession]);

  // Obtenir les données de session d'hypnose
  const hypnosisSession = getHypnosisSession(sessionId);
  
  // Si la session n'existe pas, rediriger vers la sélection
  useEffect(() => {
    if (!hypnosisSession && sessionId) {
      console.log('Session d\'hypnose non trouvée:', sessionId);
      navigate('/sessions/voyage/hypnose');
    }
  }, [hypnosisSession, sessionId, navigate]);

  // Gérer les changements de phase pour le gong
  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null && isGongEnabled && audioSettings.enabled) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, isGongEnabled, playGong, audioSettings.enabled]);

  // Gérer les phases de la session d'hypnose
  useEffect(() => {
    if (isSessionActive && hypnosisSession && hypnosisSession.phases) {
      const totalDuration = hypnosisSession.duration;
      const elapsedTime = totalDuration - timeRemaining;
      
      // Trouver la phase actuelle
      const phases = hypnosisSession.phases;
      let newPhaseIndex = -1;
      
      for (let i = 0; i < phases.length; i++) {
        if (elapsedTime >= phases[i].startTime && elapsedTime < phases[i].endTime) {
          newPhaseIndex = i;
          break;
        }
      }
      
      // Si on a trouvé une nouvelle phase différente de l'actuelle
      if (newPhaseIndex !== -1 && newPhaseIndex !== currentPhase) {
        console.log(`Changement de phase: ${currentPhase} → ${newPhaseIndex}`);
        setCurrentPhase(newPhaseIndex);
        
        const newPhase = phases[newPhaseIndex];
        
        // Mettre à jour les paramètres selon la phase
        setIsGongEnabled(newPhase.gongEnabled);
        setIsGuidedBreathing(newPhase.guidedBreathing);
        
        // Annoncer le changement de phase si nécessaire
        if (voiceSettings.enabled && newPhase.type === 'deepening') {
          speak(hypnosisSession.guidance.phases[1]);
        } else if (voiceSettings.enabled && newPhase.type === 'suggestions') {
          speak(hypnosisSession.guidance.phases[2]);
        } else if (voiceSettings.enabled && newPhase.type === 'closure') {
          speak(hypnosisSession.guidance.phases[3]);
        }
      }
    }
  }, [timeRemaining, isSessionActive, hypnosisSession, currentPhase, voiceSettings.enabled, speak]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnding) {
      console.log('🏁 Session d\'hypnose terminée - Redirection vers résultats');
      setSessionEnding(true);
      
      // Message de fin
      if (voiceSettings.enabled && hypnosisSession) {
        speak(hypnosisSession.guidance.end);
      }
      
      // Arrêter l'audio et la respiration
      stopAudio();
      stopBreathing();
      
      // Redirection après un court délai pour permettre au message de fin de se jouer
      setTimeout(() => {
        stopVoice();
        navigate('/results');
      }, 2000);
    }
  }, [timeRemaining, isSessionActive, sessionEnding, sessionId, hypnosisSession, speak, stopAudio, stopBreathing, stopVoice, voiceSettings.enabled, navigate]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      if (!hypnosisSession) {
        console.error('Session d\'hypnose non trouvée');
        return;
      }
      
      const breathingPattern = getHypnosisBreathingPattern(sessionId);
      const frequency = getHypnosisFrequency(sessionId);
      
      setSessionActive(true);
      setSessionEnding(false);
      setCurrentPhase(0);
      setIsGongEnabled(true);
      setIsGuidedBreathing(true);
      
      // Démarrer l'audio
      console.log('Démarrage audio hypnose avec fréquence:', frequency);
      if (audioSettings.enabled) {
        startAudio(frequency);
      }
      
      // Démarrer le timer et la respiration
      const duration = hypnosisSession.duration;
      console.log('Durée session hypnose:', duration, 'secondes');
      startTimer(duration);
      startBreathing(breathingPattern);
      
      // Message d'introduction
      if (voiceSettings.enabled) {
        setTimeout(() => {
          if (voiceSettings.enabled) {
            speak(hypnosisSession.guidance.start);
          }
        }, 1000);
        
        // Programmer le message de la première phase
        phaseTimeoutRef.current = setTimeout(() => {
          if (voiceSettings.enabled) {
            speak(hypnosisSession.guidance.phases[0]);
          }
        }, 10000);
      }
    } else {
      setSessionActive(false);
      stopTimer();
      stopBreathing();
      stopAudio();
      stopVoice();
      
      setLastPhase(null);
      setSessionEnding(false);
      setCurrentPhase(0);
      setIsGongEnabled(true);
      setIsGuidedBreathing(true);
      
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
        phaseTimeoutRef.current = null;
      }
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
    setCurrentPhase(0);
    setIsGongEnabled(true);
    setIsGuidedBreathing(true);
    
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    
    navigate('/sessions/voyage/hypnose');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hypnosisSession) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Session d'hypnose non trouvée</p>
      </div>
    );
  }

  // Obtenir le nom de la phase actuelle
  const getCurrentPhaseName = () => {
    if (!hypnosisSession || !hypnosisSession.phases || currentPhase >= hypnosisSession.phases.length) {
      return '';
    }
    
    const phase = hypnosisSession.phases[currentPhase];
    switch (phase.type) {
      case 'guided-breathing':
        return 'Induction & Respiration Guidée';
      case 'deepening':
        return 'Approfondissement Hypnotique';
      case 'suggestions':
        return 'Suggestions Thérapeutiques';
      case 'closure':
        return 'Retour Progressif';
      default:
        return '';
    }
  };

  // Force l'affichage de la fréquence correcte pour le sommeil
  const getDisplayFrequency = () => {
    if (sessionId === 'sleep') {
      return 'Ondes Delta (2Hz)';
    } else if (sessionId === 'confidence') {
      return 'Ondes Alpha (10Hz) - Clarté mentale';
    } else if (sessionId === 'emotions') {
      return 'Fréquence 432 Hz - Harmonie intérieure';
    } else if (sessionId === 'addiction') {
      return 'Fréquence 396 Hz - Libération';
    } else if (sessionId === 'sieste') {
      return 'Ondes Alpha (10Hz) - Récupération';
    } else if (sessionId === 'stress') {
      return 'Fréquence 528 Hz - Équilibre';
    } else if (sessionId === 'pain') {
      return 'Fréquence 396 Hz - Libération des tensions';
    }
    return getCurrentFrequencyName();
  };

  return (
    <div className="px-5 pb-5">
      {/* En-tête de session */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-400/20 to-purple-500/20 border border-indigo-400/30 backdrop-blur-sm">
            <Moon size={24} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{hypnosisSession.name}</h1>
            <p className="text-white/70">{hypnosisSession.description}</p>
            <p className="text-sm text-white/50">
              Durée : {Math.floor(hypnosisSession.duration / 60)}:{(hypnosisSession.duration % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Phase actuelle */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3 mb-4">
          <p className="text-sm text-indigo-200 mb-1 flex items-center justify-center gap-2">
            <Moon size={16} />
            <strong>Phase actuelle : {getCurrentPhaseName()}</strong>
          </p>
          <div className="text-xs text-indigo-100/80">
            {currentPhase === 0 ? (
              <span>Respiration guidée en rythme 4/6 avec gong</span>
            ) : currentPhase === 1 ? (
              <span>Respiration libre, approfondissement de l'état hypnotique</span>
            ) : currentPhase === 2 ? (
              <span>Suggestions thérapeutiques pour le sommeil profond</span>
            ) : (
              <span>Retour progressif à l'état d'éveil</span>
            )}
          </div>
        </div>

        {/* Indication importante sur les écouteurs */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-4 flex items-start gap-3">
          <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm text-blue-200 font-medium mb-1">Important :</p>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Pour une expérience optimale, utilisez des écouteurs et installez-vous dans un endroit calme où vous ne serez pas dérangé(e).
            </p>
          </div>
        </div>

        {/* Fréquence audio active */}
        <div className="bg-white/10 rounded-lg p-2 mb-4">
          <p className="text-xs text-white/70 flex items-center justify-center gap-1">
            <Wind size={12} className="text-indigo-400" />
            <span className="text-indigo-400 font-medium">{getDisplayFrequency()}</span>
          </p>
        </div>
      </div>

      {/* Guide de respiration (visible uniquement pendant la phase d'induction) */}
      {isGuidedBreathing && (
        <BreathingGuide 
          breathingState={breathingState}
          isActive={isSessionActive}
        />
      )}

      {/* Message pour les phases sans respiration guidée */}
      {!isGuidedBreathing && isSessionActive && (
        <div className="text-center mb-8 py-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
            <p className="text-lg text-white/80 italic">
              {currentPhase === 1 ? (
                "Respirez naturellement... laissez-vous porter..."
              ) : currentPhase === 2 ? (
                "Laissez les suggestions s'ancrer profondément..."
              ) : (
                "Préparez-vous à revenir doucement..."
              )}
            </p>
          </div>
        </div>
      )}

      {/* Timer et progression */}
      <div className="text-center mb-8">
        <div className="text-5xl font-light mb-4 tracking-wider">
          {formatTime(timeRemaining)}
        </div>
        <div className="w-full max-w-sm mx-auto h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-white/60 mt-2">
          Progression : {Math.round(progress)}%
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex gap-3 justify-center mt-8">
        <button
          onClick={handleToggleSession}
          disabled={sessionEnding}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            sessionEnding 
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
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