import React, { useEffect, useState } from 'react';
import { Play, Pause, Home, Headphones, Settings } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager';

export const FreeSessionScreen = () => {
  const { 
    freeSessionSettings,
    isSessionActive, 
    setSessionActive, 
    setCurrentScreen,
    audioSettings,
    voiceSettings
  } = useAppStore();
  
  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { speak, stop: stopVoice } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // Créer le pattern respiratoire à partir des paramètres de session libre
  const createFreeSessionPattern = () => {
    return {
      inhale: freeSessionSettings.inhaleTime,
      hold: 0, // Pas de pause pour les sessions libres
      exhale: freeSessionSettings.exhaleTime
    };
  };

  // Obtenir le nom de la fréquence sélectionnée
  const getSelectedFrequencyName = () => {
    const frequencies = {
      coherence: '0.1 Hz - Cohérence cardiaque',
      '396hz': '396 Hz - Libération des peurs',
      '432hz': '432 Hz - Harmonie naturelle',
      '528hz': '528 Hz - Amour & Guérison',
      '639hz': '639 Hz - Relations harmonieuses',
      '741hz': '741 Hz - Éveil de l\'intuition',
      '852hz': '852 Hz - Retour à l\'ordre spirituel',
      '174hz': '174 Hz - Fréquence de la Terre',
      '285hz': '285 Hz - Régénération cellulaire',
      'theta': 'Ondes Theta (4.5Hz) - Méditation profonde',
      'theta6': 'Ondes Theta (6Hz) - Créativité',
      'theta783': 'Ondes Theta (7.83Hz) - Résonance Schumann',
      'alpha': 'Ondes Alpha (10Hz) - Relaxation active',
      'beta': 'Ondes Beta (14Hz) - Concentration',
      'delta': 'Ondes Delta (2Hz) - Sommeil profond',
      'gamma': 'Ondes Gamma (30-100Hz) - Éveil supérieur',
    };
    
    return frequencies[freeSessionSettings.frequency] || 'Cohérence cardiaque';
  };

  // Gérer les changements de phase pour le gong
  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null && freeSessionSettings.gongEnabled && !freeSessionSettings.silentMode) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, freeSessionSettings, playGong]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnded) {
      console.log('🏁 Session libre terminée');
      setSessionEnded(true);
      
      // Message de fin pour session libre
      if (!freeSessionSettings.silentMode) {
        speak("Session libre terminée. Vous avez maintenu votre rythme respiratoire personnalisé avec succès.");
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
  }, [timeRemaining, isSessionActive, sessionEnded, setCurrentScreen, freeSessionSettings.silentMode, speak, stopAudio, stopBreathing, stopVoice]);

  // DÉMARRAGE VOCAL AUTOMATIQUE - SYSTÈME SIMPLE POUR SESSION LIBRE
  useEffect(() => {
    if (isSessionActive && !voiceSystemStarted && voiceSettings.enabled && !freeSessionSettings.silentMode) {
      console.log('🎤 DÉCLENCHEMENT VOCAL AUTOMATIQUE - SESSION LIBRE');
      setVoiceSystemStarted(true);
      
      // Message de démarrage simple
      setTimeout(() => {
        const message = `Session libre démarrée. Rythme ${freeSessionSettings.inhaleTime} secondes inspiration, ${freeSessionSettings.exhaleTime} secondes expiration. Durée : ${freeSessionSettings.duration} minutes. Fréquence : ${getSelectedFrequencyName()}.`;
        speak(message);
      }, 1000);
    }
  }, [isSessionActive, voiceSystemStarted, voiceSettings.enabled, freeSessionSettings, speak, getSelectedFrequencyName]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      console.log('🎬 DÉMARRAGE SESSION LIBRE');
      console.log('🎯 Paramètres:', freeSessionSettings);
      
      setSessionActive(true);
      setSessionEnded(false);
      setVoiceSystemStarted(false);
      
      // Démarrer l'audio avec la fréquence sélectionnée - CORRECTION IMPORTANTE
      if (audioSettings.enabled && freeSessionSettings.gongEnabled && !freeSessionSettings.silentMode) {
        console.log('🎵 Démarrage audio avec fréquence:', freeSessionSettings.frequency);
        startAudio(freeSessionSettings.frequency);
      }
      
      // Démarrer le timer avec la durée personnalisée
      const durationInSeconds = freeSessionSettings.duration * 60;
      console.log('⏱️ Durée session:', durationInSeconds, 'secondes');
      startTimer(durationInSeconds);
      
      // Démarrer l'animation respiratoire avec le pattern personnalisé
      const customPattern = createFreeSessionPattern();
      console.log('🫁 PATTERN SESSION LIBRE:', customPattern);
      startBreathing(customPattern);
      
    } else {
      console.log('⏸️ PAUSE SESSION LIBRE');
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
    console.log('🏠 Retour à l\'accueil depuis session libre');
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

  const totalCycleTime = freeSessionSettings.inhaleTime + freeSessionSettings.exhaleTime;
  const cyclesPerMinute = Math.round(60 / totalCycleTime * 10) / 10;

  return (
    <div className="px-5 pb-5">
      {/* En-tête de session */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Session Libre</h1>
            <p className="text-white/70">Rythme {freeSessionSettings.inhaleTime}/{freeSessionSettings.exhaleTime} • {freeSessionSettings.duration} min</p>
            <p className="text-sm text-white/50">
              {cyclesPerMinute} cycles/min • Cycle de {totalCycleTime}s
            </p>
          </div>
        </div>

        {/* Indicateur spécial pour Session Libre */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-200 mb-2">
            🎯 <strong>SESSION LIBRE PERSONNALISÉE :</strong>
          </p>
          <div className="text-xs text-green-100/80 space-y-1">
            <div>🫁 <strong>Inspiration :</strong> {freeSessionSettings.inhaleTime} secondes</div>
            <div>💨 <strong>Expiration :</strong> {freeSessionSettings.exhaleTime} secondes</div>
            <div>⏱️ <strong>Durée totale :</strong> {freeSessionSettings.duration} minutes</div>
            <div>🔄 <strong>Cycles prévus :</strong> ~{Math.round(freeSessionSettings.duration * cyclesPerMinute)}</div>
            <div>🎵 <strong>Fréquence :</strong> {getSelectedFrequencyName()}</div>
            <div>🔊 <strong>Audio :</strong> {freeSessionSettings.silentMode ? 'Mode silencieux' : 'Sons binauraux activés'}</div>
            <div className="mt-2 text-yellow-200">
              ✨ <strong>RYTHME PERSONNALISÉ ACTIF</strong>
            </div>
          </div>
        </div>

        {/* Indication importante sur les écouteurs */}
        {!freeSessionSettings.silentMode && (
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
        {audioSettings.enabled && freeSessionSettings.gongEnabled && !freeSessionSettings.silentMode && (
          <div className="bg-white/10 rounded-lg p-2 mb-4">
            <p className="text-xs text-white/70">
              🎵 Fréquence sélectionnée : <span className="text-cyan-400 font-medium">{getSelectedFrequencyName()}</span>
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
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-1000"
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
          disabled={sessionEnded}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            sessionEnded 
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
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