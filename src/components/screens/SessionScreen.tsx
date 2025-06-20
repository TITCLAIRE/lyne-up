import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Home, Headphones } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../BreathingGuide';
import { BiometricDisplay } from '../BiometricDisplay';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { sessions } from '../../data/sessions';
import { meditations } from '../../data/meditations';

export const SessionScreen: React.FC = () => {
  const { 
    currentSession, 
    isSessionActive, 
    setSessionActive, 
    setCurrentScreen,
    currentMeditation,
    audioSettings,
    voiceSettings
  } = useAppStore();
  
  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer();
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();

  const [lastPhase, setLastPhase] = useState<'inhale' | 'exhale' | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  
  // SYSTÈME VOCAL ULTRA-SIMPLE
  const voiceTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

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

  // Déterminer le rythme respiratoire selon la session
  const getBreathingRhythm = () => {
    if (currentSession === 'sos' || 
        currentSession === 'focus' || 
        currentSession === 'recovery' || 
        currentSession === 'transition') {
      return '4-6'; // 4 secondes inspiration / 6 secondes expiration
    }
    return '5-5'; // 5/5 pour scan corporel et méditations
  };

  // FONCTION VOCAL ULTRA-SIMPLE QUI MARCHE
  const speak = (text: string) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée');
      return;
    }
    
    console.log(`🗣️ TENTATIVE PAROLE: "${text}"`);
    
    // Arrêter toute parole en cours
    speechSynthesis.cancel();
    
    // Attendre un peu puis parler
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 1.0;
      utterance.lang = 'fr-FR';
      
      utterance.onstart = () => console.log('✅ PAROLE DÉMARRÉE:', text);
      utterance.onend = () => console.log('✅ PAROLE TERMINÉE:', text);
      utterance.onerror = (e) => console.error('❌ ERREUR PAROLE:', e);
      
      speechSynthesis.speak(utterance);
    }, 200);
  };

  // VARIANTES DE GUIDAGE RESPIRATOIRE
  const breathingVariants = {
    inhale: [
      "Inspirez le calme",
      "Accueillez l'air frais", 
      "Respirez la sérénité"
    ],
    exhale: [
      "Soufflez doucement",
      "Relâchez tout",
      "Libérez le stress"
    ]
  };

  // SYSTÈME VOCAL POUR SOS STRESS - TIMINGS CORRIGÉS
  const startSOSVoiceSystem = () => {
    if (currentSession !== 'sos' || !voiceSettings.enabled) {
      speak("Session démarrée. Suivez le guide respiratoire.");
      return;
    }

    console.log('🚨 DÉMARRAGE SYSTÈME VOCAL SOS STRESS - TIMINGS CORRIGÉS');
    
    // Nettoyer les anciens timeouts
    voiceTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    voiceTimeoutsRef.current = [];

    // MESSAGE DE DÉMARRAGE IMMÉDIAT
    speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");

    // GUIDAGES RESPIRATOIRES PROGRAMMÉS - DÉCALÉS DE 5 SECONDES
    const breathingTimeout1 = setTimeout(() => {
      speak(breathingVariants.inhale[0]); // "Inspirez le calme" - maintenant à 10s (inspiration)
    }, 10000); // 10s au lieu de 15s

    const breathingTimeout2 = setTimeout(() => {
      speak(breathingVariants.exhale[0]); // "Soufflez doucement"
    }, 35000); // 35s au lieu de 30s

    const breathingTimeout3 = setTimeout(() => {
      speak(breathingVariants.inhale[1]); // "Accueillez l'air frais"
    }, 50000); // 50s au lieu de 45s

    const breathingTimeout4 = setTimeout(() => {
      speak(breathingVariants.exhale[1]); // "Relâchez tout"
    }, 65000); // 65s au lieu de 60s

    // MESSAGES DE PHASES PROGRAMMÉS - DÉCALÉS DE 5 SECONDES
    const phaseTimeout1 = setTimeout(() => {
      speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.");
    }, 30000); // 30s au lieu de 25s

    const phaseTimeout2 = setTimeout(() => {
      speak("Le stress s'évapore à chaque souffle. Votre corps se détend profondément.");
    }, 55000); // 55s au lieu de 50s

    const phaseTimeout3 = setTimeout(() => {
      speak("Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.");
    }, 80000); // 80s au lieu de 75s

    // MESSAGE DE FIN PROGRAMMÉ - DÉCALÉ DE 5 SECONDES
    const endTimeout = setTimeout(() => {
      speak("Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.");
    }, 90000); // 90s au lieu de 85s (fin exacte)

    // Stocker tous les timeouts
    voiceTimeoutsRef.current = [
      breathingTimeout1, breathingTimeout2, breathingTimeout3, breathingTimeout4,
      phaseTimeout1, phaseTimeout2, phaseTimeout3, endTimeout
    ];

    console.log('✅ TOUS LES TIMEOUTS PROGRAMMÉS - TIMINGS CORRIGÉS');
  };

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
      console.log('🏁 Session terminée');
      setSessionEnded(true);
      
      // Nettoyer les timeouts
      voiceTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      voiceTimeoutsRef.current = [];
      
      // Pour les sessions autres que SOS Stress
      if (currentSession !== 'sos') {
        speak("Session terminée. Félicitations pour cette pratique.");
      }
      
      // Redirection automatique vers les résultats
      setTimeout(() => {
        setCurrentScreen('results');
      }, 3000);
    }
  }, [timeRemaining, isSessionActive, sessionEnded, setCurrentScreen, currentSession]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      console.log('🎬 DÉMARRAGE SESSION:', currentSession);
      setSessionActive(true);
      setSessionEnded(false);
      
      // Démarrer l'audio avec la fréquence par défaut de la session
      if (audioSettings.enabled) {
        startAudio(); // Utilise automatiquement la fréquence par défaut
      }
      
      // Démarrer le timer et la respiration avec la durée correcte
      const duration = sessionData?.duration || 180;
      startTimer(duration);
      startBreathing(getBreathingRhythm());
      
      // DÉMARRER LE SYSTÈME VOCAL ULTRA-SIMPLE
      startSOSVoiceSystem();
      
    } else {
      console.log('⏸️ PAUSE SESSION');
      setSessionActive(false);
      stopTimer();
      stopBreathing();
      stopAudio();
      
      // Arrêter la voix et nettoyer
      speechSynthesis.cancel();
      voiceTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      voiceTimeoutsRef.current = [];
      
      setLastPhase(null);
      setSessionEnded(false);
    }
  };

  const handleGoHome = () => {
    console.log('🏠 Retour à l\'accueil');
    setSessionActive(false);
    stopTimer();
    stopBreathing();
    stopAudio();
    
    // Arrêter la voix et nettoyer
    speechSynthesis.cancel();
    voiceTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    voiceTimeoutsRef.current = [];
    
    resetTimer();
    setLastPhase(null);
    setSessionEnded(false);
    setCurrentScreen('home');
  };

  const formatTime = (seconds: number) => {
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
              alt="Instant Opportun Logo" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
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

        {/* Indicateur spécial pour SOS Stress - TIMINGS CORRIGÉS */}
        {currentSession === 'sos' && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-200 mb-2">
              ✅ <strong>SOS Stress - TIMINGS CORRIGÉS :</strong>
            </p>
            <div className="text-xs text-green-100/80 space-y-1">
              <div>• 0s : Message d'accueil complet</div>
              <div>• <span className="text-yellow-200">10s</span> : "Inspirez le calme" (sur inspiration)</div>
              <div>• 30s : "Vos pieds touchent le sol..."</div>
              <div>• 35s : "Soufflez doucement"</div>
              <div>• 50s : "Accueillez l'air frais"</div>
              <div>• 55s : "Le stress s'évapore..."</div>
              <div>• 65s : "Relâchez tout"</div>
              <div>• 80s : "Vous retrouvez votre centre..."</div>
              <div>• <span className="text-cyan-200">90s</span> : Message de fin (fin exacte)</div>
              <div className="mt-2 text-yellow-200">
                ⚡ <strong>Synchronisation parfaite avec la respiration</strong>
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
        
        {/* Debug pour SOS Stress */}
        {currentSession === 'sos' && isSessionActive && (
          <div className="mt-2 text-xs text-white/50 bg-black/20 rounded-lg p-2">
            <div>Temps écoulé : {(sessionData?.duration || 90) - timeRemaining}s</div>
            <div>Timeouts actifs : {voiceTimeoutsRef.current.length}</div>
            <div>Phase respiration : {breathingState.phase}</div>
            <div className="text-green-300 mt-1">
              ✅ Système vocal : TIMINGS CORRIGÉS
            </div>
          </div>
        )}
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