import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Home, Headphones, Target, RotateCcw, TrendingUp, Settings, Baby, Users, Brain, Sparkles, Heart, Wind, Waves } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BreathingGuide } from '../../components/BreathingGuide';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation';
import { useAudioManager } from '../../hooks/useAudioManager';
import { useVoiceManager } from '../../hooks/useVoiceManager'; 
import { sessions, getBreathingPattern } from '../../data/sessions';
import { meditations, spiritualMeditations } from '../../data/meditations';

import { useCallback } from 'react';

export default function GuidedSessionRunner() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentSession, 
    setCurrentSession,
    isSessionActive, 
    setSessionActive, 
    currentMeditation,
    audioSettings,
    voiceSettings
  } = useAppStore();

  // Fonction de fin de session - DOIT être définie AVANT useSessionTimer
  const handleSessionComplete = useCallback(() => {
    console.log('🏁 Session terminée, redirection vers les résultats');
    navigate('/results');
  }, [navigate]);

  const { timeRemaining, progress, startTimer, stopTimer, resetTimer } = useSessionTimer(handleSessionComplete);
  const { breathingState, startBreathing, stopBreathing } = useBreathingAnimation();
  const { startAudio, stopAudio, playGong, getCurrentFrequencyName } = useAudioManager();
  const { speak, stop: stopVoice, startSessionGuidance, clearAllTimeouts } = useVoiceManager();

  const [lastPhase, setLastPhase] = useState(null);
  const [sessionEnding, setSessionEnding] = useState(false);
  const [voiceSystemStarted, setVoiceSystemStarted] = useState(false);

  // État pour l'entraînement progressif
  const [currentProgressivePhase, setCurrentProgressivePhase] = useState(0);
  const [progressivePhaseChanged, setProgressivePhaseChanged] = useState(false);
  const [lastProgressiveCheck, setLastProgressiveCheck] = useState(0);

  // Initialiser la session en fonction du paramètre d'URL
  useEffect(() => {
    if (sessionId) {
      if (sessionId === 'meditation' && currentMeditation === null) {
        // Si c'est une méditation mais qu'aucune n'est sélectionnée, rediriger
        navigate('/sessions/voyage/meditations');
      } else {
        setCurrentSession(sessionId);
      }
    }
  }, [sessionId, currentMeditation, setCurrentSession, navigate]);

  // Obtenir les données de session selon le type
  const getSessionData = () => {
    if (currentSession === 'meditation' && currentMeditation) {
      // Vérifier dans les deux collections de méditations
      const meditation = meditations[currentMeditation] || spiritualMeditations[currentMeditation];
      if (meditation) {
        return {
          name: meditation.name,
          duration: meditation.duration,
          desc: meditation.description
        };
      }
      return null;
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

  // Obtenir l'icône de session
  const getSessionIcon = () => {
    const sessionIcons = {
      switch: Target,      // Target (rouge-orange)
      reset: RotateCcw,    // RotateCcw (indigo-purple) 
      progressive: TrendingUp, // TrendingUp (vert-emerald)
      free: Settings,      // Settings (purple-pink)
      kids: Baby,          // Baby (pink-purple) 
      seniors: Users,      // Users (blue-cyan)
      scan: Brain,         // Brain (indigo-purple)
      meditation: Sparkles // Sparkles (pink-rose)
    };
    
    return sessionIcons[currentSession] || Heart;
  };

  const SessionIcon = getSessionIcon();

  // Obtenir le pattern respiratoire
  const getCurrentBreathingPattern = () => {
    // Pour les méditations, vérifier si un pattern spécifique est défini
    if (currentSession === 'meditation' && currentMeditation) {
      const meditation = meditations[currentMeditation] || spiritualMeditations[currentMeditation];
      if (meditation && meditation.breathingPattern) {
        console.log('🫁 Utilisation du pattern spécifique pour la méditation:', currentMeditation, meditation.breathingPattern);
        return meditation.breathingPattern;
      }
    }
    
    // Sinon utiliser le pattern par défaut
    const pattern = getBreathingPattern(currentSession);
    return pattern;
  };

  // Gestion de l'entraînement progressif
  useEffect(() => {
    if (currentSession === 'progressive' && isSessionActive && sessions.progressive?.progressivePhases) {
      const totalDuration = sessionData?.duration || 180;
      const elapsedTime = totalDuration - timeRemaining;
      const phases = sessions.progressive.progressivePhases;
      
      // Éviter les vérifications trop fréquentes
      if (Math.abs(elapsedTime - lastProgressiveCheck) < 2) {
        return;
      }
      setLastProgressiveCheck(elapsedTime);
      
      // Trouver la phase actuelle basée sur le temps écoulé
      let newPhaseIndex = -1;
      for (let i = 0; i < phases.length; i++) {
        if (elapsedTime >= phases[i].startTime && elapsedTime < phases[i].endTime) {
          newPhaseIndex = i;
          break;
        }
      }
      
      // Si on a trouvé une nouvelle phase différente de l'actuelle
      if (newPhaseIndex !== -1 && newPhaseIndex !== currentProgressivePhase) {
        const newPhase = phases[newPhaseIndex];
        
        setCurrentProgressivePhase(newPhaseIndex);
        setProgressivePhaseChanged(true);
        
        // Changer le pattern respiratoire
        const newPattern = newPhase.pattern;
        
        // Arrêter l'ancienne animation et démarrer la nouvelle
        stopBreathing();
        setTimeout(() => {
          startBreathing(newPattern);
        }, 100);
        
        // Annoncer le changement
        if (voiceSettings.enabled && newPhase.announcement) {
          setTimeout(() => {
            speak(newPhase.announcement);
          }, 500);
        }
      }
    }
  }, [timeRemaining, currentSession, isSessionActive, currentProgressivePhase, voiceSettings.enabled, speak, startBreathing, stopBreathing, sessionData?.duration, lastProgressiveCheck]);

  // Gérer les changements de phase pour le gong
  useEffect(() => {
    if (isSessionActive && breathingState.phase !== 'idle' && breathingState.phase !== lastPhase) {
      if (lastPhase !== null && audioSettings.gongEnabled) {
        playGong(breathingState.phase);
      }
      setLastPhase(breathingState.phase);
    }
  }, [breathingState.phase, isSessionActive, lastPhase, playGong, audioSettings.gongEnabled]);

  // Gérer la fin de session
  useEffect(() => {
    if (timeRemaining === 0 && isSessionActive && !sessionEnding) {
      console.log('🏁 Session guidée terminée - Redirection vers résultats');
      setSessionEnding(true);
      
      // Message de fin adapté aux différentes sessions
      if (currentSession === 'kids') {
        speak("Super ! Tu as fait de la vraie magie avec ta respiration. Tu peux être fier de toi, petit champion !");
      } else if (currentSession === 'reset') {
        speak("Magnifique. Votre système nerveux est maintenant apaisé. Cette technique 4-7-8 peut être utilisée à tout moment pour retrouver instantanément le calme.");
      } else if (currentSession === 'progressive') {
        speak("Excellent ! Vous avez progressé du rythme débutant 3/3 jusqu'au rythme de cohérence cardiaque 5/5. Votre capacité respiratoire s'améliore.");
      } else if (currentSession === 'seniors') {
        speak("Excellent ! Vous avez pris soin de votre bien-être. Cette respiration douce peut être pratiquée à tout moment pour vous détendre et faire baisser votre tension.");
      } else {
        speak("Session terminée. Félicitations pour cette pratique.");
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
  }, [timeRemaining, isSessionActive, sessionEnding, currentSession, speak, stopAudio, stopBreathing, stopVoice, navigate]);

  // Démarrage vocal automatique
  useEffect(() => {
    if (isSessionActive && !voiceSystemStarted && voiceSettings.enabled) {
      console.log('🎤 DÉMARRAGE VOCAL AUTOMATIQUE pour session guidée:', currentSession || sessionId, 'Méditation:', currentMeditation); 
      setVoiceSystemStarted(true);
      
      // Démarrage immédiat du guidage vocal
      if (currentSession === 'switch' || sessionId === 'switch') {
        console.log('🚨 DÉMARRAGE DIRECT GUIDAGE SWITCH');
        // Message d'accueil (0s)
        speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");
        
        // Séquence 2 - Inspiration (12s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            speak("Inspirez le calme");
          }
        }, 12000);
        
        // Séquence 3 - Ancrage (28s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.");
          }
        }, 28000);
      } else if (currentMeditation === 'metatron') {
        // Pour Métatron, on utilise le système normal mais sans démarrer le guidage vocal
        console.log('🌟 Méditation Métatron - Utilisation des fichiers audio uniquement'); 
        // On marque quand même comme démarré pour éviter les doublons
        setVoiceSystemStarted(true);
      } else {
        // Pour les autres sessions, utiliser le système normal
        setTimeout(() => {
          const success = startSessionGuidance();
          console.log('🎤 Démarrage guidage vocal guidé:', success ? 'réussi' : 'échoué');
        }, 500);
      }
    }
  }, [isSessionActive, voiceSystemStarted, voiceSettings.enabled, startSessionGuidance, currentSession, sessionId, speak, currentMeditation]);

  const handleToggleSession = () => {
    if (!isSessionActive) {
      const breathingPattern = getCurrentBreathingPattern();
      console.log('▶️ DÉMARRAGE session guidée:', currentSession || sessionId);
      setSessionActive(true);
      setSessionEnding(false); 
      setVoiceSystemStarted(false); 
      
      // Reset pour l'entraînement progressif
      if (currentSession === 'progressive') {
        setCurrentProgressivePhase(0);
        setProgressivePhaseChanged(false);
        setLastProgressiveCheck(0);
      }
      
      // Démarrer l'audio
      if (audioSettings.enabled) {
        console.log('Démarrage audio session:', currentSession);
        
        // Utiliser la fréquence appropriée pour la session ou méditation
        let sessionFrequency = null;
        
        if (currentSession === 'meditation' && currentMeditation) {
          // Chercher dans les deux collections de méditations
          const meditation = meditations[currentMeditation] || spiritualMeditations[currentMeditation];
          if (meditation && meditation.frequency) {
            sessionFrequency = meditation.frequency;
            console.log('🎵 Fréquence spécifique trouvée pour la méditation:', currentMeditation, sessionFrequency);
          }
        }
        
        startAudio(sessionFrequency);
      }
      
      // Démarrer le timer et la respiration
      const duration = sessionData?.duration || 180;
      console.log('⏱️ Durée session:', duration, 'secondes');
      startTimer(duration);
      startBreathing(breathingPattern);
      
      // Démarrage du guidage vocal pour la session
      // Attendre un peu pour que tout soit initialisé
      const guidanceTimeout = setTimeout(() => {
        if (voiceSettings.enabled && currentMeditation !== 'metatron') {
          console.log('🎤 Démarrage guidage vocal après délai');
          const success = startSessionGuidance();
          console.log('🎤 Démarrage guidage vocal guidé:', success ? 'réussi' : 'échoué');
        } else if (currentMeditation === 'metatron') {
          console.log('🌟 Méditation Métatron - Pas de démarrage automatique du guidage vocal');
          // Pour Métatron, on gère les fichiers audio manuellement
          const gender = voiceSettings.gender;
          const welcomePath = `/audio/meditation/${gender}/metatron-welcome.mp3`;
          
          console.log('🎵 Lecture directe audio Métatron welcome:', welcomePath);
          const audio = new Audio(welcomePath);
          audio.volume = voiceSettings.volume;
          
          // Événements pour détecter les erreurs
          audio.onerror = (e) => {
            console.error('❌ Erreur lecture audio welcome Métatron:', e);
            speak("Bienvenue dans cette méditation d'invocation de l'archange Métatron. Installez-vous confortablement. Fermez les yeux et prenez quelques profondes respirations. Nous allons établir une connexion avec cet être de lumière, gardien des archives akashiques et porteur de la géométrie sacrée. Suivez le rythme respiratoire et ouvrez votre coeur à cette présence divine.");
          };
          
          // Jouer l'audio
          audio.play().catch(error => {
            console.error('❌ Erreur lecture audio welcome Métatron:', error);
            speak("Bienvenue dans cette méditation d'invocation de l'archange Métatron. Installez-vous confortablement. Fermez les yeux et prenez quelques profondes respirations. Nous allons établir une connexion avec cet être de lumière, gardien des archives akashiques et porteur de la géométrie sacrée. Suivez le rythme respiratoire et ouvrez votre coeur à cette présence divine.");
          });
          
          // Programmer les séquences suivantes
          const sequences = [
            { time: 30000, name: 'invocation' },
            { time: 70000, name: 'light' },
            { time: 110000, name: 'memory' },
            { time: 150000, name: 'inspiration' },
            { time: 190000, name: 'protection' },
            { time: 230000, name: 'elevation' }
          ];
          
          // Créer des timeouts pour chaque séquence
          sequences.forEach(seq => {
            setTimeout(() => {
              if (isSessionActive && voiceSettings.enabled) {
                const audioPath = `/audio/meditation/${gender}/metatron-${seq.name}.mp3`;
                console.log(`🎵 Lecture audio Métatron ${seq.name}:`, audioPath);
                const seqAudio = new Audio(audioPath);
                seqAudio.volume = voiceSettings.volume;
                seqAudio.play().catch(error => {
                  console.error(`❌ Erreur lecture audio ${seq.name}:`, error);
                  // Fallback vers le texte correspondant dans les phases
                  const metatron = spiritualMeditations.metatron;
                  if (metatron && metatron.guidance && metatron.guidance.phases) {
                    const index = sequences.findIndex(s => s.name === seq.name);
                    if (index >= 0 && index < metatron.guidance.phases.length) {
                      speak(metatron.guidance.phases[index]);
                    }
                  }
                });
              }
            }, seq.time);
          });
        }
      }, 1000);
      
      // Nettoyer le timeout si la session est arrêtée avant qu'il ne se déclenche
      return () => clearTimeout(guidanceTimeout);
    } else {
      setSessionActive(false);
      console.log('⏸️ PAUSE session guidée:', currentSession || sessionId);
      stopTimer();
      if (stopBreathing) stopBreathing(); 
      if (stopAudio) stopAudio(); 
      
      // Arrêt explicite de la voix avec vérification
      if (stopVoice) {
        console.log('🔇 ARRÊT FORCÉ de la voix lors de la pause');
        stopVoice();
      }

      // Nettoyage explicite de tous les timeouts
      if (clearAllTimeouts) {
        console.log('🧹 Nettoyage forcé de tous les timeouts lors de la pause');
        clearAllTimeouts();
      }
      
      setLastPhase(null);
      setSessionEnding(false); 
      setVoiceSystemStarted(false); 
      
      // Arrêt forcé de tous les timeouts
      const highestId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestId; i++) {
        clearTimeout(i);
      }
      
      // Arrêt forcé de la synthèse vocale
      window.speechSynthesis.cancel();

      // Arrêter tous les éléments audio en cours
      document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      
      // Reset pour l'entraînement progressif
      if (currentSession === 'progressive') {
        setCurrentProgressivePhase(0);
        setProgressivePhaseChanged(false);
        setLastProgressiveCheck(0);
      }
    }
  };

  const handleGoBack = () => {
    console.log('🏠 RETOUR à l\'accueil depuis session guidée');
    setSessionActive(false);
    if (stopTimer) stopTimer();
    
    // Arrêter l'audio et la respiration avec vérification
    if (stopBreathing) stopBreathing();
    if (stopAudio) stopAudio();
    
    // Arrêt forcé de la voix
    console.log('🔇 ARRÊT FORCÉ de la voix avant navigation');
    if (stopVoice) stopVoice();
    
    // Forcer l'arrêt de la synthèse vocale
    window.speechSynthesis.cancel();

    // Nettoyage explicite de tous les timeouts
    if (clearAllTimeouts) {
      console.log('🧹 Nettoyage forcé de tous les timeouts avant navigation');
      clearAllTimeouts();
    }
    
    if (resetTimer) resetTimer();
    setLastPhase(null);
    setSessionEnding(false);
    setVoiceSystemStarted(false);
    
    // Arrêt forcé de tous les timeouts
    const highestId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
      clearTimeout(i);
    }
    
    // Arrêt forcé de la synthèse vocale
    window.speechSynthesis.cancel();
    
    // Reset pour l'entraînement progressif
    if (currentSession === 'progressive') {
      setCurrentProgressivePhase(0);
      setProgressivePhaseChanged(false);
      setLastProgressiveCheck(0);
    }
    
    // Redirection en fonction du type de session
    if (currentSession === 'meditation') {
      navigate('/sessions/voyage/meditations');
    } else if (currentSession === 'switch' || currentSession === 'reset') {
      navigate('/sessions/guidees/recentrage');
    } else if (currentSession === 'progressive') {
      navigate('/sessions/guidees/evolution');
    } else if (currentSession === 'kids' || currentSession === 'seniors') {
      navigate('/sessions/guidees/famille');
    } else if (currentSession === 'scan') {
      navigate('/sessions/guidees/scan');
    } else {
      navigate('/');
    }
  };

  // Nettoyage complet lors du démontage du composant
  useEffect(() => {
    return () => {
      console.log('🧹 Nettoyage lors du démontage de GuidedSessionRunner');
      
      // Arrêter toute synthèse vocale
      if (stopVoice) {
        stopVoice();
      }
      
      // Forcer l'arrêt de la synthèse vocale
      window.speechSynthesis.cancel();
      
      // Nettoyer tous les timeouts
      if (clearAllTimeouts) {
        clearAllTimeouts();
      }
      
      // Arrêter tous les timeouts manuellement
      const highestId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestId; i++) {
        clearTimeout(i);
      }
    };
  }, [stopVoice, clearAllTimeouts]);

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
            <SessionIcon size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{sessionData.name}</h1>
            <p className="text-white/70">{sessionData.desc}</p>
            <p className="text-sm text-white/50">
              Durée : {Math.floor(sessionData.duration / 60)}:{(sessionData.duration % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Indicateur spécial pour ENTRAÎNEMENT PROGRESSIF */}
        {currentSession === 'progressive' && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-200 mb-2 flex items-center justify-center gap-2">
              <TrendingUp size={16} />
              <strong>ENTRAÎNEMENT PROGRESSIF - PHASE {currentProgressivePhase + 1}/3 :</strong>
            </p>
            <div className="text-xs text-green-100/80 space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Target size={12} />
                <strong>Phase actuelle :</strong> {
                  currentProgressivePhase === 0 ? 'Rythme 3/3 (Débutant)' :
                  currentProgressivePhase === 1 ? 'Rythme 4/4 (Intermédiaire)' :
                  'Rythme 5/5 (Cohérence cardiaque)'
                }
              </div>
              <div className="flex items-center justify-center gap-1">
                <Wind size={12} />
                <strong>Rythme actuel :</strong> {breathingState.inhaleTime || 3}/{breathingState.exhaleTime || 3}
              </div>
              <div className="mt-2 text-yellow-200 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                <strong>PROGRESSION AUTOMATIQUE ACTIVÉE</strong>
              </div>
            </div>
          </div>
        )}

        {/* Indicateur spécial pour RESET - RYTHME 4/7/8 */}
        {currentSession === 'reset' && (
          <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-indigo-200 mb-2 flex items-center justify-center gap-2">
              <RotateCcw size={16} />
              <strong>MODULE RESET - RYTHME 4/7/8 :</strong>
            </p>
            <div className="text-xs text-indigo-100/80 space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Wind size={12} />
                <strong>Inspiration :</strong> 4 secondes (par le nez)
              </div>
              <div className="flex items-center justify-center gap-1">
                <Target size={12} />
                <strong>Usage :</strong> Crise de calme, insomnie, stress intense
              </div>
              <div className="mt-2 text-yellow-200 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                <strong>TECHNIQUE DU DR. ANDREW WEIL</strong>
              </div>
            </div>
          </div>
        )}

        {/* Indicateur spécial pour KIDS - RYTHME 4/4 */}
        {currentSession === 'kids' && (
          <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-pink-200 mb-2 flex items-center justify-center gap-2">
              <Baby size={16} />
              <strong>MODE ENFANTS - RYTHME 4/4 :</strong>
            </p>
            <div className="text-xs text-pink-100/80 space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Wind size={12} />
                <strong>Rythme :</strong> 4/4 (parfait pour les enfants)
              </div>
              <div className="mt-2 text-yellow-200 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                <strong>RESPIRATION MAGIQUE ACTIVÉE</strong>
              </div>
            </div>
          </div>
        )}

        {/* Indicateur spécial pour SENIORS - RYTHME 3/4 */}
        {currentSession === 'seniors' && (
          <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-cyan-200 mb-2 flex items-center justify-center gap-2">
              <Users size={16} />
              <strong>MODULE SENIORS + - RYTHME 3/4 :</strong>
            </p>
            <div className="text-xs text-cyan-100/80 space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Wind size={12} />
                <strong>Inspiration :</strong> 3 secondes (doux et naturel)
              </div>
              <div className="flex items-center justify-center gap-1">
                <Heart size={12} />
                <strong>Effet :</strong> Baisse de la tension artérielle
              </div>
              <div className="mt-2 text-yellow-200 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                <strong>RESPIRATION ADAPTÉE AUX SENIORS</strong>
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
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : currentSession === 'kids'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                : currentSession === 'reset'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                : currentSession === 'progressive'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : currentSession === 'seniors'
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {sessionEnding ? (
            <>Session terminée</>
          ) : (
            <>
              {isSessionActive ? <Pause size={20} /> : <Play size={20} />}
              {isSessionActive ? 'Pause' : (
                currentSession === 'kids' ? 'C\'est parti !' : 
                currentSession === 'reset' ? 'Commencer RESET' : 
                currentSession === 'progressive' ? 'Commencer l\'entraînement' :
                currentSession === 'seniors' ? 'Commencer SENIORS +' :
                'Commencer'
              )}
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