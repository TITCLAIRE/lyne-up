import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Home, Headphones } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager';
import { sessions, getBreathingPattern } from '../../data/sessions';
import { meditations } from '../../data/meditations';

export const SessionScreen = () => {
  const { 
    currentSession, 
    isSessionActive, 
    setSessionActive, 
    setCurrentScreen,
    currentMeditation,
    audioSettings,
    voiceSettings,
    coherenceSettings
  } = useAppStore();
  
  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { speak, stop: stopVoice, startSessionGuidance } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // NOUVEAU : État pour le debug du pattern respiratoire
  const [debugPattern, setDebugPattern] = useState(null);

  // NOUVEAU : État pour l'entraînement progressif
  const [currentProgressivePhase, setCurrentProgressivePhase] = useState(0);
  const [progressivePhaseChanged, setProgressivePhaseChanged] = useState(false);

  // Obtenir les données de session selon le type
  const getSessionData = () => {
    if (currentSession === 'meditation' && currentMeditation) {
      const meditation = meditations[currentMeditation];
      return {
        name: meditation.name,
        duration: meditation.duration,
        desc: meditation.description
      };
    } else if (currentSession && sessions[currentSession]) {
      const session = sessions[currentSession];
      return {
        name: session.name,
        duration: session.duration,
        desc: session.description
      };
    }
    return null;
  };

  const sessionData = getSessionData();

  // NOUVEAU : Obtenir le pattern respiratoire EXPLICITEMENT
  const getCurrentBreathingPattern = () => {
    console.log('🔍 RÉCUPÉRATION PATTERN POUR SESSION:', currentSession);
    
    if (currentSession === 'coherence') {
      const pattern = getBreathingPattern('coherence', coherenceSettings.rhythm);
      console.log('💖 Pattern cohérence cardiaque:', pattern);
      return pattern;
    } else {
      const pattern = getBreathingPattern(currentSession);
      console.log(`🎯 Pattern session ${currentSession}:`, pattern);
      return pattern;
    }
  };

  // NOUVEAU : Gestion de l'entraînement progressif
  useEffect(() => {
    if (currentSession === 'progressive' && isSessionActive && sessions.progressive?.progressivePhases) {
      const elapsedTime = (sessionData?.duration || 180) - timeRemaining;
      const phases = sessions.progressive.progressivePhases;
      
      // Trouver la phase actuelle
      const currentPhase = phases.findIndex(phase => 
        elapsedTime >= phase.startTime && elapsedTime < phase.endTime
      );
      
      if (currentPhase !== -1 && currentPhase !== currentProgressivePhase) {
        console.log(`📈 PROGRESSION: Passage à la phase ${currentPhase + 1}/${phases.length}`);
        console.log(`📈 Nouveau pattern:`, phases[currentPhase].pattern);
        
        setCurrentProgressivePhase(currentPhase);
        setProgressivePhaseChanged(true);
        
        // Changer le pattern respiratoire
        const newPattern = phases[currentPhase].pattern;
        console.log(`🫁 CHANGEMENT PATTERN PROGRESSIF:`, newPattern);
        startBreathing(newPattern);
        
        // Annoncer le changement
        if (voiceSettings.enabled && phases[currentPhase].announcement) {
          speak(phases[currentPhase].announcement);
        }
        
        // Mettre à jour le debug pattern
        setDebugPattern(newPattern);
      }
    }
  }, [timeRemaining, currentSession, isSessionActive, currentProgressivePhase, voiceSettings.enabled, speak, startBreathing, sessionData?.duration]);

  // Gérer les changements de phase pour le gong SEULEMENT
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
      setSessionEnded(true);
      
      // Message de fin adapté aux enfants, RESET et PROGRESSIVE
      if (currentSession === 'kids') {
        speak("Super ! Tu as fait de la vraie magie avec ta respiration. Tu peux être fier de toi, petit champion !");
      } else if (currentSession === 'reset') {
        speak("Magnifique. Votre système nerveux est maintenant apaisé. Cette technique 4-7-8 peut être utilisée à tout moment pour retrouver instantanément le calme.");
      } else if (currentSession === 'progressive') {
        speak("Excellent ! Vous avez progressé du rythme débutant 3/3 jusqu'au rythme de cohérence cardiaque 5/5. Votre capacité respiratoire s'améliore.");
      } else {
        speak("Session terminée. Félicitations pour cette pratique.");
      }
      
      // Délai standard
      const delayBeforeResults = 3000;
      
      setTimeout(() => {
        setCurrentScreen('results');
      }, delayBeforeResults);
    }
  }, [timeRemaining, isSessionActive, sessionEnded, setCurrentScreen, currentSession, speak]);

  // DÉMARRAGE VOCAL AUTOMATIQUE - SYSTÈME PREMIUM UNIFIÉ
  useEffect(() => {
    if (isSessionActive && !voiceSystemStarted && voiceSettings.enabled) {
      setVoiceSystemStarted(true);
      
      // Délai court pour laisser le temps à la session de se stabiliser
      setTimeout(() => {
        startSessionGuidance();
      }, 200);
    }
  }, [isSessionActive, voiceSystemStarted, voiceSettings.enabled, startSessionGuidance]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      console.log('🎬 DÉMARRAGE SESSION:', currentSession);
      
      // NOUVEAU : Récupérer le pattern respiratoire EXPLICITEMENT
      const breathingPattern = getCurrentBreathingPattern();
      console.log('🫁 PATTERN RÉCUPÉRÉ POUR DÉMARRAGE:', breathingPattern);
      setDebugPattern(breathingPattern); // Pour l'affichage debug
      
      setSessionActive(true);
      setSessionEnded(false);
      setVoiceSystemStarted(false);
      
      // NOUVEAU : Reset pour l'entraînement progressif
      if (currentSession === 'progressive') {
        setCurrentProgressivePhase(0);
        setProgressivePhaseChanged(false);
      }
      
      // Démarrer l'audio avec la fréquence par défaut de la session
      if (audioSettings.enabled) {
        startAudio();
      }
      
      // Démarrer le timer et la respiration avec la durée correcte
      const duration = sessionData?.duration || 180;
      startTimer(duration);
      
      // NOUVEAU : Passer le pattern EXPLICITEMENT à l'animation
      console.log('🚀 DÉMARRAGE ANIMATION AVEC PATTERN:', breathingPattern);
      startBreathing(breathingPattern);
      
    } else {
      console.log('⏸️ PAUSE SESSION');
      setSessionActive(false);
      stopTimer();
      stopBreathing();
      stopAudio();
      
      // ARRÊT IMMÉDIAT ET COMPLET DU SYSTÈME VOCAL
      stopVoice();
      
      setLastPhase(null);
      setSessionEnded(false);
      setVoiceSystemStarted(false);
      setDebugPattern(null);
      
      // NOUVEAU : Reset pour l'entraînement progressif
      if (currentSession === 'progressive') {
        setCurrentProgressivePhase(0);
        setProgressivePhaseChanged(false);
      }
    }
  };

  const handleGoHome = () => {
    setSessionActive(false);
    stopTimer();
    stopBreathing();
    stopAudio();
    
    // ARRÊT IMMÉDIAT ET COMPLET DU SYSTÈME VOCAL
    stopVoice();
    
    resetTimer();
    setLastPhase(null);
    setSessionEnded(false);
    setVoiceSystemStarted(false);
    setDebugPattern(null);
    
    // NOUVEAU : Reset pour l'entraînement progressif
    if (currentSession === 'progressive') {
      setCurrentProgressivePhase(0);
      setProgressivePhaseChanged(false);
    }
    
    setCurrentScreen('home');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Session non trouvée</p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      {/* En-tête de session */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
            <img 
              src="/assets/logo.png" 
              alt="Lyne-Up Logo" 
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
            <p className="text-white/70">{sessionData.desc}</p>
            <p className="text-sm text-white/50">
              Durée : {Math.floor(sessionData.duration / 60)}:{(sessionData.duration % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* NOUVEAU : Debug du pattern respiratoire */}
        {debugPattern && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-200 mb-2">
              🫁 <strong>PATTERN RESPIRATOIRE ACTUEL :</strong>
            </p>
            <div className="text-xs text-green-100/80 space-y-1">
              <div>⏱️ <strong>Inspiration :</strong> {debugPattern.inhale} secondes</div>
              {debugPattern.hold > 0 && (
                <div>⏸️ <strong>Pause :</strong> {debugPattern.hold} secondes</div>
              )}
              <div>⏱️ <strong>Expiration :</strong> {debugPattern.exhale} secondes</div>
              <div>🎯 <strong>Rythme :</strong> {debugPattern.inhale}/{debugPattern.hold > 0 ? debugPattern.hold + '/' : ''}{debugPattern.exhale}</div>
              <div>🔧 <strong>Session :</strong> {currentSession}</div>
              <div className="mt-2 text-yellow-200">
                ✅ <strong>PATTERN TRANSMIS À L'ANIMATION</strong>
              </div>
            </div>
          </div>
        )}

        {/* NOUVEAU : Debug de l'état de l'animation */}
        {breathingState.currentPattern && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-200 mb-2">
              🎬 <strong>ANIMATION EN COURS :</strong>
            </p>
            <div className="text-xs text-blue-100/80 space-y-1">
              <div>⏱️ <strong>Utilise :</strong> {breathingState.inhaleTime}s inspiration / {breathingState.exhaleTime}s expiration</div>
              {breathingState.holdTime > 0 && (
                <div>⏸️ <strong>Pause :</strong> {breathingState.holdTime}s</div>
              )}
              <div>📊 <strong>Phase actuelle :</strong> {breathingState.phase}</div>
              <div>🔄 <strong>Progression :</strong> {Math.round(breathingState.progress)}%</div>
              <div className="mt-2 text-cyan-200">
                🎯 <strong>ANIMATION ACTIVE AVEC PATTERN CORRECT</strong>
              </div>
            </div>
          </div>
        )}

        {/* NOUVEAU : Indicateur spécial pour ENTRAÎNEMENT PROGRESSIF */}
        {currentSession === 'progressive' && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-200 mb-2">
              📈 <strong>ENTRAÎNEMENT PROGRESSIF - PHASE {currentProgressivePhase + 1}/3 :</strong>
            </p>
            <div className="text-xs text-green-100/80 space-y-1">
              <div>🎯 <strong>Phase actuelle :</strong> {
                currentProgressivePhase === 0 ? 'Rythme 3/3 (Débutant)' :
                currentProgressivePhase === 1 ? 'Rythme 4/4 (Intermédiaire)' :
                'Rythme 5/5 (Cohérence cardiaque)'
              }</div>
              <div>⏱️ <strong>Progression :</strong> 
                {currentProgressivePhase === 0 && ' 0-60s : Apprentissage doux'}
                {currentProgressivePhase === 1 && ' 60-120s : Approfondissement'}
                {currentProgressivePhase === 2 && ' 120-180s : Maîtrise'}
              </div>
              <div>🫁 <strong>Rythme actuel :</strong> {debugPattern?.inhale || 3}/{debugPattern?.exhale || 3}</div>
              <div className="mt-2 text-yellow-200">
                ✨ <strong>PROGRESSION AUTOMATIQUE ACTIVÉE</strong>
              </div>
            </div>
          </div>
        )}

        {/* Indicateur spécial pour RESET - RYTHME 4/7/8 */}
        {currentSession === 'reset' && (
          <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-indigo-200 mb-2">
              🔄 <strong>MODULE RESET - RYTHME 4/7/8 :</strong>
            </p>
            <div className="text-xs text-indigo-100/80 space-y-1">
              <div>🫁 <strong>Inspiration :</strong> 4 secondes (par le nez)</div>
              <div>⏸️ <strong>Rétention :</strong> 7 secondes (gardez l'air)</div>
              <div>💨 <strong>Expiration :</strong> 8 secondes (par la bouche)</div>
              <div>🧠 <strong>Effet :</strong> Active le système nerveux parasympathique</div>
              <div>🎯 <strong>Usage :</strong> Crise de calme, insomnie, stress intense</div>
              <div className="mt-2 text-yellow-200">
                ✨ <strong>TECHNIQUE DU DR. ANDREW WEIL</strong>
              </div>
            </div>
          </div>
        )}

        {/* Indicateur spécial pour KIDS - RYTHME 4/4 */}
        {currentSession === 'kids' && (
          <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-pink-200 mb-2">
              👶 <strong>MODE ENFANTS - RYTHME 4/4 :</strong>
            </p>
            <div className="text-xs text-pink-100/80 space-y-1">
              <div>🎈 <strong>Inspiration :</strong> 4 secondes (gonfle ton ballon)</div>
              <div>🌸 <strong>Expiration :</strong> 4 secondes (souffle doucement)</div>
              <div>🦄 <strong>Rythme :</strong> 4/4 (parfait pour les enfants)</div>
              <div>🎯 <strong>Session :</strong> {currentSession}</div>
              <div className="mt-2 text-yellow-200">
                ✨ <strong>RESPIRATION MAGIQUE ACTIVÉE</strong>
              </div>
            </div>
          </div>
        )}

        {/* Indication importante sur les écouteurs */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-4 flex items-start gap-3">
          <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm text-blue-200 font-medium mb-1">Important :</p>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              {currentSession === 'kids' 
                ? "Les sons magiques sont encore plus beaux avec des écouteurs !" 
                : currentSession === 'reset'
                ? "Pour une efficacité maximale de la technique 4-7-8, utilisez des écouteurs pour une immersion complète."
                : currentSession === 'progressive'
                ? "L'entraînement progressif est plus efficace avec des écouteurs pour bien entendre les changements de rythme."
                : "Les sons binauraux nécessitent impérativement l'utilisation d'écouteurs stéréo pour créer l'effet de battement binaural entre les deux oreilles."
              }
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

      {/* Contrôles */}
      <div className="flex gap-3 justify-center mt-8">
        <button
          onClick={handleToggleSession}
          disabled={sessionEnded}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            sessionEnded 
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : currentSession === 'kids'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                : currentSession === 'reset'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                : currentSession === 'progressive'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {sessionEnded ? (
            <>Session terminée</>
          ) : (
            <>
              {isSessionActive ? <Pause size={20} /> : <Play size={20} />}
              {isSessionActive ? 'Pause' : (
                currentSession === 'kids' ? 'C\'est parti !' : 
                currentSession === 'reset' ? 'Commencer RESET' : 
                currentSession === 'progressive' ? 'Commencer l\'entraînement' :
                'Commencer'
              )}
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