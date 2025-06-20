import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Home, Headphones } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../BreathingGuide';
import { BiometricDisplay } from '../BiometricDisplay';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManagerScan } from '../../hooks/useVoiceManagerScan';

export const ScanCorporelScreen = () => {
  const { 
    isSessionActive, 
    setSessionActive, 
    setCurrentScreen,
    audioSettings,
    voiceSettings
  } = useAppStore();
  
  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { startScanGuidance, stop: stopVoice } = useVoiceManagerScan();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // Données de session pour le scan corporel
  const sessionData = {
    name: 'Scan Corporel',
    duration: 600, // 10 minutes
    description: 'Relaxation profonde guidée de tout le corps'
  };

  // Gérer les changements de phase pour le gong
  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, playGong]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnded) {
      console.log('🏁 Session terminée');
      setSessionEnded(true);
      
      // Redirection automatique vers les résultats
      setTimeout(() => {
        setCurrentScreen('results');
      }, 3000);
    }
  }, [timeRemaining, isSessionActive, sessionEnded, setCurrentScreen]);

  // DÉMARRAGE VOCAL AUTOMATIQUE - SYSTÈME SCAN CORPOREL
  useEffect(() => {
    if (isSessionActive && !voiceSystemStarted && voiceSettings.enabled) {
      console.log('🧘 DÉCLENCHEMENT VOCAL AUTOMATIQUE - SCAN CORPOREL');
      setVoiceSystemStarted(true);
      
      // Délai court pour laisser le temps à la session de se stabiliser
      setTimeout(() => {
        console.log('🎤 LANCEMENT GUIDAGE VOCAL - SCAN CORPOREL 18 SÉQUENCES');
        startScanGuidance();
      }, 200);
    }
  }, [isSessionActive, voiceSystemStarted, voiceSettings.enabled, startScanGuidance]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      console.log('🧘 DÉMARRAGE SCAN CORPOREL');
      setSessionActive(true);
      setSessionEnded(false);
      setVoiceSystemStarted(false);
      
      // Démarrer l'audio avec la fréquence par défaut
      if (audioSettings.enabled) {
        startAudio('delta'); // Fréquence delta pour relaxation profonde
      }
      
      // Démarrer le timer et la respiration
      startTimer(sessionData.duration);
      startBreathing('5-5'); // Rythme 5/5 pour le scan corporel
      
    } else {
      console.log('⏸️ PAUSE SCAN CORPOREL');
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
    console.log('🏠 Retour à l\'accueil');
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
      {/* En-tête de session */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
            <img 
              src="/assets/logo.png" 
              alt="Instant Opportun Logo" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-2xl">🧘‍♀️</span>';
                  parent.classList.add('bg-gradient-to-br', 'from-cyan-400', 'to-purple-500');
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{sessionData.name}</h1>
            <p className="text-white/70">{sessionData.description}</p>
            <p className="text-sm text-white/50">
              Durée : {Math.floor(sessionData.duration / 60)}:{(sessionData.duration % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Indicateur spécial pour Scan Corporel */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-200 mb-2">
            ✅ <strong>SCAN CORPOREL - 18 séquences :</strong>
          </p>
          <div className="text-xs text-blue-100/80 space-y-1">
            <div>🧘 <strong>Type :</strong> Relaxation profonde guidée</div>
            <div>🎤 <strong>Voix :</strong> {voiceSettings.gender === 'female' ? 'Claire (premium)' : 'Thierry (premium)'}</div>
            <div>⚡ <strong>Rythme :</strong> 5/5 (5s inspiration, 5s expiration)</div>
            <div>🔄 <strong>Fallback :</strong> Synthèse vocale si nécessaire</div>
            <div>🎯 <strong>Statut :</strong> {voiceSettings.enabled ? '✅ Activé' : '❌ Désactivé'}</div>
            <div>🚨 <strong>Système :</strong> {voiceSystemStarted ? '✅ Démarré' : '⏳ En attente'}</div>
            <div className="mt-2 text-yellow-200">
              🎵 <strong>18 SÉQUENCES GUIDÉES SUR 10 MINUTES</strong>
            </div>
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

        {/* Fréquence audio active */}
        {audioSettings.enabled && (
          <div className="bg-white/10 rounded-lg p-2 mb-4">
            <p className="text-xs text-white/70">
              🎵 Fréquence active : <span className="text-cyan-400 font-medium">{getCurrentFrequencyName()}</span>
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

      {/* Métriques biométriques */}
      <BiometricDisplay />

      {/* Contrôles */}
      <div className="flex gap-3 justify-center mt-8">
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