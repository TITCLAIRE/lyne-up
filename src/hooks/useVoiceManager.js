import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { meditations, spiritualMeditations } from '../data/meditations';

export const useVoiceManager = () => {
  const { 
    voiceSettings, 
    currentSession, 
    currentMeditation,
    isSessionActive
  } = useAppStore();
  
  const synth = useRef(window.speechSynthesis);
  const voices = useRef([]);
  const currentUtterance = useRef(null);
  const isInitialized = useRef(false);
  const sessionGuidanceStarted = useRef(false);
  const sessionGuidancePhase = useRef(0);
  const lastSpeakTime = useRef(0);
  const audioElementRef = useRef(null);
  const audioQueue = useRef([]);
  const isPlayingAudio = useRef(false);
  const timeoutsRef = useRef([]);
  const fullAudioRef = useRef(null);
  
  // Fonction pour créer un timeout qui sera automatiquement suivi
  const createTrackedTimeout = useCallback((callback, delay) => {
    const timeoutId = setTimeout(() => {
      // Supprimer ce timeout de la liste des timeouts actifs
      timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId);
      callback();
    }, delay);
    
    // Ajouter ce timeout à la liste des timeouts actifs
    timeoutsRef.current.push(timeoutId);
    
    return timeoutId;
  }, []);
  
  // Fonction pour nettoyer tous les timeouts
  const clearAllTimeouts = useCallback(() => {
    console.log(`🧹 Nettoyage de TOUS les timeouts (${timeoutsRef.current.length} timeouts actifs)`);
    
    timeoutsRef.current.forEach(id => {
      clearTimeout(id);
    });
    
    // Vider la liste des timeouts
    timeoutsRef.current = [];
    
    console.log('✅ Tous les timeouts ont été nettoyés');
  }, []);
  
  // Initialiser les voix
  useEffect(() => {
    const initVoices = () => {
      if (synth.current) {
        voices.current = synth.current.getVoices().filter(voice => 
          voice.lang.includes('fr') || voice.name.includes('French')
        );
        
        if (voices.current.length > 0) {
          isInitialized.current = true;
          console.log('🎤 Voix françaises disponibles:', voices.current.length);
        } else {
          console.log('⚠️ Aucune voix française trouvée, utilisation de la voix par défaut');
          voices.current = synth.current.getVoices();
          isInitialized.current = true;
        }
      }
    };
    
    // Initialiser les voix au chargement
    if (synth.current) {
      if (synth.current.getVoices().length > 0) {
        initVoices();
      }
      
      // Écouter l'événement voiceschanged
      synth.current.onvoiceschanged = initVoices;
    }
    
    return () => {
      if (synth.current) {
        synth.current.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Nettoyer les timeouts à la destruction du composant
  useEffect(() => {
    return () => {
      console.log('🧹 Nettoyage lors de la destruction du hook');
      
      // Nettoyer tous les timeouts
      clearAllTimeouts(); 
      
      // Arrêter toute synthèse vocale en cours
      if (synth.current) {
        synth.current.cancel();
      }
      
      // Arrêter tout audio en cours
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      
      // Vider la file d'attente
      audioQueue.current = [];
      isPlayingAudio.current = false;
    };
  }, [clearAllTimeouts]);
  
  // Réinitialiser le guidage vocal lorsque la session change
  useEffect(() => {
    sessionGuidanceStarted.current = false;
    sessionGuidancePhase.current = 0;
    clearAllTimeouts();
  }, [currentSession, currentMeditation, clearAllTimeouts]);
  
  // Arrêter le guidage vocal lorsque la session est arrêtée
  useEffect(() => {
    if (!isSessionActive) {
      console.log('🔇 Session inactive détectée - ARRÊT COMPLET de tout guidage vocal');
      
      // Nettoyer tous les timeouts
      clearAllTimeouts();
      
      // Arrêter toute synthèse vocale en cours
      if (synth.current) {
        synth.current.cancel();
        console.log('🔇 Synthèse vocale arrêtée');
      }
      
      // Arrêter tout audio en cours
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        audioElementRef.current = null;
        console.log('🔇 Lecture audio arrêtée');
      }
      
      // Arrêter l'audio complet en cours (Métatron)
      if (fullAudioRef.current) {
        fullAudioRef.current.pause();
        fullAudioRef.current.src = '';
        fullAudioRef.current = null;
        console.log('🔇 Audio complet Métatron arrêté');
      }
      
      // Vider la file d'attente
      audioQueue.current = [];
      isPlayingAudio.current = false;
      
      sessionGuidanceStarted.current = false;
      sessionGuidancePhase.current = 0;
      console.log('🔄 État du guidage vocal réinitialisé');
    }
  }, [isSessionActive, clearAllTimeouts]);
  
  // Fonction pour parler avec la synthèse vocale
  const speakWithSynthesis = useCallback((text) => {
    if (!voiceSettings.enabled || !text) return;
    
    try {
      // Arrêter toute synthèse vocale en cours
      if (synth.current) {
        synth.current.cancel();
      }
      
      // Créer une nouvelle utterance
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;
      
      // Sélectionner une voix française
      if (voices.current.length > 0) {
        utterance.voice = voices.current[0];
      }
      
      // Configurer les paramètres
      utterance.volume = voiceSettings.volume;
      utterance.rate = 0.9; // Légèrement plus lent pour la clarté
      utterance.pitch = 1.0;
      utterance.lang = 'fr-FR';
      
      // Événements
      utterance.onstart = () => {
        console.log('🗣️ SYNTHÈSE VOCALE:', text.substring(0, 30) + (text.length > 30 ? '...' : ''));
      };
      
      utterance.onend = () => {
        console.log('✅ SYNTHÈSE TERMINÉE');
        currentUtterance.current = null;
      };
      
      utterance.onerror = (event) => {
        if (event.error === 'interrupted') {
          console.warn('⚠️ SYNTHÈSE INTERROMPUE:', event);
        } else {
          console.error('❌ ERREUR SYNTHÈSE:', event);
        }
        currentUtterance.current = null;
      };
      
      // Parler
      synth.current.speak(utterance);
    } catch (error) {
      console.error('❌ ERREUR LORS DE LA SYNTHÈSE VOCALE:', error);
    }
  }, [voiceSettings.enabled, voiceSettings.volume]);
  
  // Fonction pour jouer le prochain audio dans la file d'attente
  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length === 0) {
      isPlayingAudio.current = false;
      console.log('🔇 File d\'attente audio vide');
      return;
    }
    
    const nextAudio = audioQueue.current.shift();
    isPlayingAudio.current = true;
    
    console.log('🎵 LECTURE AUDIO:', nextAudio.key, nextAudio.url);
    
    try {
      const audio = new Audio(nextAudio.url);
      audioElementRef.current = audio;
      
      audio.onended = () => {
        console.log('✅ AUDIO TERMINÉ:', nextAudio.key);
        audioElementRef.current = null;
        playNextInQueue();
      };
      
      audio.onerror = (error) => {
        console.error('❌ ERREUR AUDIO:', error, nextAudio.url);
        
        // Fallback vers synthèse vocale
        if (nextAudio.fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour:', nextAudio.key, '- Raison:', error.message);
          speakWithSynthesis(nextAudio.fallbackText);
        }
        
        audioElementRef.current = null;
        playNextInQueue();
      };
      
      // Définir le volume
      audio.volume = voiceSettings.volume;
      
      // Jouer l'audio
      console.log('🔊 LECTURE DÉMARRÉE:', nextAudio.url);
      audio.play()
        .catch(error => {
          console.error('❌ ERREUR LECTURE AUDIO:', error, nextAudio.url);
          
          // Fallback vers synthèse vocale
          if (nextAudio.fallbackText) {
            console.log('🔄 FALLBACK SYNTHÈSE pour:', nextAudio.key, '- Raison:', error.message);
            speakWithSynthesis(nextAudio.fallbackText);
          }
          
          audioElementRef.current = null;
          playNextInQueue();
        });
    } catch (error) {
      console.error('❌ ERREUR CRÉATION AUDIO:', error);
      
      // Fallback vers synthèse vocale
      if (nextAudio.fallbackText) {
        console.log('🔄 FALLBACK SYNTHÈSE pour:', nextAudio.key, '- Raison:', error.message);
        speakWithSynthesis(nextAudio.fallbackText);
      }
      
      playNextInQueue();
    }
  }, [voiceSettings.volume, speakWithSynthesis]);
  
  // Fonction pour ajouter un audio à la file d'attente
  const queueAudio = useCallback((url, key, fallbackText) => {
    console.log('🎵 TENTATIVE LECTURE AUDIO:', url);
    
    // Vérifier si l'URL existe
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ FICHIER AUDIO TROUVÉ:', url, `(${response.status}) - Clé: ${key}`);
          
          // Ajouter à la file d'attente
          audioQueue.current.push({
            url,
            key,
            fallbackText
          });
          
          // Démarrer la lecture si rien n'est en cours
          if (!isPlayingAudio.current) {
            playNextInQueue();
          }
        } else {
          console.log('❌ FICHIER AUDIO NON TROUVÉ:', url, `(${response.status}) - Clé: ${key}`);
          
          // Fallback vers synthèse vocale
          if (fallbackText) {
            console.log('🔄 FALLBACK SYNTHÈSE pour:', key, '- Raison:', 'Fichier non trouvé');
            speakWithSynthesis(fallbackText);
          }
        }
      })
      .catch(error => {
        console.error('❌ ERREUR VÉRIFICATION AUDIO:', error, url, '- Clé:', key);
        
        // Fallback vers synthèse vocale
        if (fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour:', key, '- Raison:', error.message);
          speakWithSynthesis(fallbackText);
        }
      });
  }, [playNextInQueue, speakWithSynthesis]);
  
  // Fonction pour jouer un fichier audio complet (pour les méditations avec un seul fichier)
  const playFullAudio = useCallback((audioPath, fallbackText) => {
    if (!voiceSettings.enabled) return;
    
    // Vérifier que la session est toujours active
    if (!isSessionActive) {
      console.log('🔇 Session inactive, annulation lecture audio complet');
      return;
    }
    
    console.log('🎵 TENTATIVE LECTURE AUDIO COMPLET:', audioPath);
    
    // Vérifier que le fallbackText n'est pas trop long pour éviter les plantages
    if (fallbackText && fallbackText.length > 500) {
      console.warn('⚠️ Texte de fallback très long, risque de plantage de la synthèse vocale');
      console.log('📏 Longueur du texte:', fallbackText.length, 'caractères');
    }
    
    // Vérifier si l'URL existe
    fetch(audioPath, { method: 'HEAD' })
      .then(response => {
        console.log('📡 Réponse serveur:', response.status, response.statusText);
        if (response.ok) {
          console.log('✅ FICHIER AUDIO COMPLET TROUVÉ:', audioPath, `(${response.status})`);
          
          try {
            const audio = new Audio(audioPath);
            fullAudioRef.current = audio;
            
            // Logs détaillés pour le debug
            audio.onloadstart = () => {
              console.log('🔄 Début du chargement audio:', audioPath);
            };
            
            audio.oncanplay = () => {
              console.log('✅ Audio prêt à être joué:', audioPath);
            };
            
            audio.onloadeddata = () => {
              console.log('📊 Données audio chargées:', audioPath);
            };
            
            audio.onended = () => {
              console.log('✅ AUDIO COMPLET TERMINÉ:', audioPath);
              fullAudioRef.current = null;
              
              // Vérifier si la session est toujours active après la fin de l'audio
              if (!isSessionActive) {
                console.log('🔇 Session inactive après fin audio, pas de message de fin');
                return;
              }
            };
            
            audio.onerror = (error) => {
              console.error('❌ ERREUR AUDIO COMPLET:', audioPath);
              console.error('📄 Détails de l\'erreur audio:', {
                errorCode: error.target?.error?.code,
                errorMessage: error.target?.error?.message,
                networkState: error.target?.networkState,
                readyState: error.target?.readyState,
                src: error.target?.src,
                currentTime: error.target?.currentTime,
                duration: error.target?.duration
              });
              
              // Diagnostic spécifique pour les erreurs courantes
              if (error.target?.error?.code === 4) {
                console.error('🚫 ERREUR MEDIA_ELEMENT_ERROR: Fichier audio corrompu ou format non supporté');
                console.log('💡 SOLUTION: Ré-encoder le fichier metatron.mp3 en MP3 standard (128kbps, 44.1kHz)');
              } else if (error.target?.error?.code === 2) {
                console.error('🌐 ERREUR NETWORK: Problème de réseau ou fichier non accessible');
              } else if (error.target?.error?.code === 3) {
                console.error('🔧 ERREUR DECODE: Impossible de décoder le fichier audio');
              }
              
              // Fallback vers synthèse vocale
              if (fallbackText) {
                console.log('🔄 FALLBACK SYNTHÈSE pour audio complet - Raison: Erreur audio code', error.target?.error?.code);
                try {
                  speakWithSynthesis(fallbackText);
                } catch (synthError) {
                  console.error('❌ ERREUR SYNTHÈSE VOCALE FALLBACK:', synthError);
                }
              }
              
              fullAudioRef.current = null;
            };
            
            // Définir le volume
            audio.volume = voiceSettings.volume;
            
            // Jouer l'audio
            console.log('🔊 LECTURE AUDIO COMPLET DÉMARRÉE:', audioPath);
            audio.play()
              .catch(error => {
                console.error('❌ ERREUR LECTURE AUDIO COMPLET:', error);
                console.error('📄 Détails play() error:', error.name, error.message);
                
                // Fallback vers synthèse vocale
                if (fallbackText) {
                  console.log('🔄 FALLBACK SYNTHÈSE pour audio complet - Raison: Erreur play()');
                  try {
                    speakWithSynthesis(fallbackText);
                  } catch (synthError) {
                    console.error('❌ ERREUR SYNTHÈSE VOCALE FALLBACK:', synthError);
                  }
                }
                
                fullAudioRef.current = null;
              });
          } catch (error) {
            console.error('❌ ERREUR CRÉATION AUDIO COMPLET:', error);
            
            // Fallback vers synthèse vocale
            if (fallbackText) {
              console.log('🔄 FALLBACK SYNTHÈSE pour audio complet - Raison: Erreur création');
              try {
                speakWithSynthesis(fallbackText);
              } catch (synthError) {
                console.error('❌ ERREUR SYNTHÈSE VOCALE FALLBACK:', synthError);
              }
            }
          }
        } else {
          console.error('❌ FICHIER AUDIO COMPLET NON ACCESSIBLE:', audioPath, `(${response.status} ${response.statusText})`);
          
          if (response.status === 429) {
            console.error('🚫 ERREUR 429: Trop de requêtes - GitHub bloque l\'accès direct aux fichiers');
            console.log('💡 SOLUTION: Utiliser GitHub Pages ou un CDN pour servir les fichiers audio');
          }
          
          // Fallback vers synthèse vocale
          if (fallbackText) {
            console.log('🔄 FALLBACK SYNTHÈSE pour audio complet - Raison: Fichier non accessible');
            try {
              speakWithSynthesis(fallbackText);
            } catch (synthError) {
              console.error('❌ ERREUR SYNTHÈSE VOCALE FALLBACK:', synthError);
            }
          }
        }
      })
      .catch(error => {
        console.error('❌ ERREUR RÉSEAU VÉRIFICATION AUDIO:', error);
        console.error('📄 Détails réseau:', error.name, error.message);
        
        // Fallback vers synthèse vocale
        if (fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour audio complet - Raison: Erreur réseau');
          try {
            speakWithSynthesis(fallbackText);
          } catch (synthError) {
            console.error('❌ ERREUR SYNTHÈSE VOCALE FALLBACK:', synthError);
          }
        }
      });
  }, [voiceSettings.enabled, voiceSettings.volume, speakWithSynthesis]);
  
  // Fonction principale pour parler (avec audio ou synthèse)
  const speak = useCallback((text, audioKey = null) => {
    if (!voiceSettings.enabled || !text) return;
    
    // Éviter les répétitions trop rapprochées
    const now = Date.now();
    if (now - lastSpeakTime.current < 500) {
      console.log('⏱️ Trop rapide, ignoré:', text.substring(0, 30));
      return;
    }
    lastSpeakTime.current = now;
    
    // Essayer d'abord de trouver un fichier audio correspondant
    const sessionType = currentSession;
    const gender = voiceSettings.gender;
    
    // Construire le chemin du fichier audio en fonction du type de session
    let audioPath = null;
    
    // MÉDITATIONS - Système amélioré avec audioKey
    if (currentSession === 'meditation' && currentMeditation) {
      if (currentMeditation === 'metatron') {
        // Cas spécial pour Métatron - fichier audio complet
        audioPath = `/audio/meditation/${gender}/metatron.mp3`;
        audioKey = 'metatron-complete';
        console.log(`🌟 Méditation Métatron - Fichier audio complet: ${audioPath}`);
      } else if (currentMeditation === 'gratitude' && audioKey) {
        // Méditation Gratitude avec audioKey
        audioPath = `/audio/meditation/${gender}/gratitude-${audioKey}.mp3`;
        console.log(`🙏 Méditation Gratitude - Fichier audio: ${audioPath} (${audioKey})`);
      } else if (currentMeditation === 'abundance' && audioKey) {
        // Méditation Abondance avec audioKey
        audioPath = `/audio/meditation/${gender}/abundance-${audioKey}.mp3`;
        console.log(`💰 Méditation Abondance - Fichier audio: ${audioPath} (${audioKey})`);
      } else {
        // Autres méditations - système générique
        const meditationData = meditations[currentMeditation] || spiritualMeditations[currentMeditation];
        if (meditationData && meditationData.audioFiles && audioKey) {
          const fileName = meditationData.audioFiles[audioKey];
          if (fileName) {
            audioPath = `/audio/meditation/${gender}/${fileName}.mp3`;
            console.log(`🎤 Tentative de lecture audio de méditation: ${audioPath} (${audioKey})`);
          }
        }
      }
    } else if (sessionType === 'switch') {
      // Essayer de trouver un fichier audio pour SOS Stress
      if (text.includes('Bienvenue dans votre bulle')) {
        audioPath = `/audio/sos-stress/${gender}/welcome.mp3`;
        audioKey = 'welcome';
      } else if (text.includes('Inspirez le calme')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-calm.mp3`;
        audioKey = 'breathe-calm';
      } else if (text.includes('Vos pieds touchent le sol')) {
        audioPath = `/audio/sos-stress/${gender}/grounding.mp3`;
        audioKey = 'grounding';
      } else if (text.includes('Soufflez doucement')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-softly.mp3`;
        audioKey = 'breathe-softly';
      } else if (text.includes('Accueillez l\'air frais')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-fresh.mp3`;
        audioKey = 'breathe-fresh';
      } else if (text.includes('Le stress s\'évapore')) {
        audioPath = `/audio/sos-stress/${gender}/stress-release.mp3`;
        audioKey = 'stress-release';
      } else if (text.includes('Relâchez tout')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-release.mp3`;
        audioKey = 'breathe-release';
      } else if (text.includes('Vous retrouvez votre centre')) {
        audioPath = `/audio/sos-stress/${gender}/center-peace.mp3`;
        audioKey = 'center-peace';
      } else if (text.includes('Parfait. Vous avez retrouvé')) {
        audioPath = `/audio/sos-stress/${gender}/completion.mp3`;
        audioKey = 'completion';
      }
    } else if (sessionType === 'scan') {
      // SCAN CORPOREL - Système amélioré avec audioKey
      if (audioKey === 'welcome' || text.includes('Bienvenue dans cette séance de scan')) {
        audioPath = `/audio/scan-corporel/${gender}/welcome.mp3`;
        audioKey = 'welcome';
      } else if (audioKey === 'head' || text.includes('Portez votre attention sur le sommet')) {
        audioPath = `/audio/scan-corporel/${gender}/head.mp3`;
        audioKey = 'head';
      } else if (audioKey === 'face' || text.includes('Descendez vers votre visage')) {
        audioPath = `/audio/scan-corporel/${gender}/face.mp3`;
        audioKey = 'face';
      } else if (audioKey === 'neck' || text.includes('Votre cou et vos épaules')) {
        audioPath = `/audio/scan-corporel/${gender}/neck.mp3`;
        audioKey = 'neck';
      } else if (audioKey === 'chest' || text.includes('Votre poitrine s\'ouvre')) {
        audioPath = `/audio/scan-corporel/${gender}/chest.mp3`;
        audioKey = 'chest';
      } else if (audioKey === 'back' || text.includes('Votre dos se détend')) {
        audioPath = `/audio/scan-corporel/${gender}/back.mp3`;
        audioKey = 'back';
      } else if (audioKey === 'abdomen' || text.includes('Votre ventre se gonfle')) {
        audioPath = `/audio/scan-corporel/${gender}/abdomen.mp3`;
        audioKey = 'abdomen';
      } else if (audioKey === 'hips' || text.includes('Vos hanches et votre bassin')) {
        audioPath = `/audio/scan-corporel/${gender}/hips.mp3`;
        audioKey = 'hips';
      } else if (audioKey === 'thighs' || text.includes('Vos cuisses')) {
        audioPath = `/audio/scan-corporel/${gender}/thighs.mp3`;
        audioKey = 'thighs';
      } else if (audioKey === 'knees' || text.includes('Vos genoux')) {
        audioPath = `/audio/scan-corporel/${gender}/knees.mp3`;
        audioKey = 'knees';
      } else if (audioKey === 'calves' || text.includes('Vos mollets')) {
        audioPath = `/audio/scan-corporel/${gender}/calves.mp3`;
        audioKey = 'calves';
      } else if (audioKey === 'ankles' || text.includes('Vos chevilles')) {
        audioPath = `/audio/scan-corporel/${gender}/ankles.mp3`;
        audioKey = 'ankles';
      } else if (audioKey === 'feet' || text.includes('Vos pieds')) {
        audioPath = `/audio/scan-corporel/${gender}/feet.mp3`;
        audioKey = 'feet';
      } else if (audioKey === 'wholebody' || text.includes('Une vague de bien-être')) {
        audioPath = `/audio/scan-corporel/${gender}/wholebody.mp3`;
        audioKey = 'wholebody';
      } else if (audioKey === 'breathing' || text.includes('Observez votre respiration')) {
        audioPath = `/audio/scan-corporel/${gender}/breathing.mp3`;
        audioKey = 'breathing';
      } else if (audioKey === 'awareness' || text.includes('Prenez conscience de votre corps')) {
        audioPath = `/audio/scan-corporel/${gender}/awareness.mp3`;
        audioKey = 'awareness';
      } else if (audioKey === 'presence' || text.includes('Restez dans cet état')) {
        audioPath = `/audio/scan-corporel/${gender}/presence.mp3`;
        audioKey = 'presence';
      } else if (audioKey === 'completion' || text.includes('Progressivement, reprenez conscience')) {
        audioPath = `/audio/scan-corporel/${gender}/completion.mp3`;
        audioKey = 'completion';
      }
    }
    
    // Si un fichier audio a été trouvé, essayer de le jouer
    if (audioPath && audioKey) {
      console.log(`🎤 ${Date.now() % 100000}ms: ${audioKey} - ${text.substring(0, 30)}... (${gender}) - PREMIUM`);
      queueAudio(audioPath, audioKey, text);
    } else {
      // Sinon, utiliser la synthèse vocale
      console.log(`🗣️ ${Date.now() % 100000}ms: SYNTHÈSE DIRECTE: "${text.substring(0, 30)}..."`);
      speakWithSynthesis(text);
    }
  }, [voiceSettings.enabled, voiceSettings.gender, currentSession, currentMeditation, queueAudio, speakWithSynthesis]);
  
  // Fonction pour arrêter toute parole
  const stop = useCallback(() => {
    // Arrêter la synthèse vocale
    console.log('🔇 ARRÊT FORCÉ de toute parole et guidage'); 
    if (synth.current) {
      synth.current.cancel();
    }
    
    // Arrêter l'audio en cours
    if (audioElementRef.current) {
      console.log('🔇 Arrêt forcé de l\'audio en cours:', audioElementRef.current.src);
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current = null;
    }
    
    // Arrêter l'audio complet en cours
    if (fullAudioRef.current) {
      fullAudioRef.current.pause();
      fullAudioRef.current = null;
    }
    
    // Arrêter tous les éléments audio en cours
    document.querySelectorAll('audio').forEach(audio => {
      console.log('🔇 Arrêt forcé d\'un élément audio:', audio.src);
      audio.pause();
      audio.src = '';
    });
    
    // Vider la file d'attente
    audioQueue.current = [];
    isPlayingAudio.current = false;

    // Arrêt direct de la synthèse vocale
    window.speechSynthesis.cancel();
    
    // Réinitialiser les variables de guidage
    console.log('🔄 Réinitialisation complète du système de guidage vocal');
    sessionGuidanceStarted.current = false;
    sessionGuidancePhase.current = 0;
    
    // Nettoyer tous les timeouts possibles
    const highestId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
      clearTimeout(i);
    }
    
    console.log('🔇 Toute parole arrêtée');
    return true;
  }, [clearAllTimeouts]);
  
  // Fonction pour démarrer le guidage vocal pour la session SOS Stress
  const startSosStressGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal SWITCH/SOS désactivé ou session inactive');
      return false;
    }
    
    // Nettoyer tout timeout existant pour éviter les doublons
    clearAllTimeouts();
    
    console.log('🚨 DÉMARRAGE SWITCH/SOS STRESS - DIAGNOSTIC COMPLET', voiceSettings.gender === 'female' ? '(Claire)' : '(Thierry)');
    
    // Tester tous les fichiers audio pour SOS Stress
    console.log('🔍 TEST DES FICHIERS AUDIO SWITCH/SOS STRESS...');
    const gender = voiceSettings.gender;
    const filesToTest = [
      'welcome', 'breathe-calm', 'grounding', 'breathe-softly', 
      'breathe-fresh', 'stress-release', 'breathe-release', 
      'center-peace', 'completion'
    ];
    
    filesToTest.forEach(file => {
      const url = `/audio/sos-stress/${gender}/${file}.mp3`;
      fetch(url, { method: 'HEAD' })
        .then(response => {
          console.log(`${response.ok ? '✅' : '❌'} ${url} (${response.status})`);
        })
        .catch(error => {
          console.error('❌ Erreur test fichier:', url, error);
        });
    });
    
    // Séquence 1 - Message d'accueil (0s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: welcome (0.5s - accueil)');
      speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");
    }, 500);
    
    // Séquence 2 - Inspiration (12s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: breathe-calm (12s - inspiration)');
      speak("Inspirez le calme");
    }, 12000);
    
    // Séquence 3 - Ancrage (28s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: grounding (28s - ancrage)');
      speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.");
    }, 28000);
    
    // Séquence 4 - Expiration (37s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: breathe-softly (37s - expiration)');
      speak("Soufflez doucement");
    }, 37000);
    
    // Séquence 5 - Inspiration (48s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: breathe-fresh (48s - inspiration)');
      speak("Accueillez l'air frais");
    }, 48000);
    
    // Séquence 6 - Libération (58s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: stress-release (58s - libération)');
      speak("Le stress s'évapore à chaque souffle. Votre corps se détend profondément.");
    }, 58000);
    
    // Séquence 7 - Expiration (67s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: breathe-release (67s - expiration)');
      speak("Relâchez tout");
    }, 67000);
    
    // Séquence 8 - Recentrage (78s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: center-peace (78s - recentrage)');
      speak("Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.");
    }, 78000);
    
    // Séquence 9 - Message de fin (85s)
    createTrackedTimeout(() => {
      console.log('🎯 SOS: completion (85s - fin)');
      speak("Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.");
    }, 85000);
    
    return true;
  }, [voiceSettings.enabled, voiceSettings.gender, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal pour la session Scan Corporel
  const startScanGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal désactivé ou session inactive');
      return false;
    }
    
    console.log('🧠 DÉMARRAGE SCAN CORPOREL COMPLET', voiceSettings.gender === 'female' ? '(Claire)' : '(Thierry)');
    
    // Nettoyer tout timeout existant pour éviter les doublons
    clearAllTimeouts(); 
    
    // Séquence 1 - Message d'accueil (0s) - AVEC FICHIER AUDIO
    speak("Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez. Nous allons explorer chaque partie de votre corps pour une relaxation profonde.", "welcome");
    
    // Séquence 2 - Tête (30s)
    createTrackedTimeout(() => {
      speak("Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.", "head");
    }, 30000);
    
    // Séquence 3 - Visage (60s)
    createTrackedTimeout(() => {
      speak("Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières. Détendez vos mâchoires, votre langue, votre gorge.", "face");
    }, 60000);
    
    // Séquence 4 - Cou (90s)
    createTrackedTimeout(() => {
      speak("Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension accumulée dans cette zone.", "neck");
    }, 90000);
    
    // Séquence 5 - Poitrine (120s)
    createTrackedTimeout(() => {
      speak("Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement.", "chest");
    }, 120000);
    
    // Séquence 6 - Dos (150s)
    createTrackedTimeout(() => {
      speak("Votre dos se détend vertèbre par vertèbre, du haut vers le bas. Chaque vertèbre s'aligne parfaitement.", "back");
    }, 150000);
    
    // Séquence 7 - Ventre (180s)
    createTrackedTimeout(() => {
      speak("Votre ventre se gonfle et se dégonfle naturellement, sans effort. Sentez une douce chaleur s'y répandre.", "abdomen");
    }, 180000);
    
    // Séquence 8 - Hanches (210s)
    createTrackedTimeout(() => {
      speak("Vos hanches et votre bassin se relâchent complètement. Sentez le poids de votre corps s'enfoncer dans le support.", "hips");
    }, 210000);
    
    // Séquence 9 - Cuisses (240s)
    createTrackedTimeout(() => {
      speak("Vos cuisses se détendent profondément. Toute tension s'évapore à chaque expiration.", "thighs");
    }, 240000);
    
    // Séquence 10 - Genoux (255s) - NOUVEAU
    createTrackedTimeout(() => {
      speak("Vos genoux se détendent. Sentez l'espace dans vos articulations.", "knees");
    }, 255000);
    
    // Séquence 11 - Mollets (270s)
    createTrackedTimeout(() => {
      speak("Vos mollets se relâchent entièrement. Sentez l'énergie circuler librement.", "calves");
    }, 270000);
    
    // Séquence 12 - Chevilles (285s) - NOUVEAU
    createTrackedTimeout(() => {
      speak("Vos chevilles se détendent. Sentez l'espace dans ces articulations.", "ankles");
    }, 285000);
    
    // Séquence 13 - Pieds (300s)
    createTrackedTimeout(() => {
      speak("Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds.", "feet");
    }, 300000);
    
    // Séquence 14 - Corps entier (360s)
    createTrackedTimeout(() => {
      speak("Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds. Vous êtes dans un état de relaxation profonde.", "wholebody");
    }, 360000);
    
    // Séquence 15 - Respiration (420s) - NOUVEAU
    createTrackedTimeout(() => {
      speak("Observez votre respiration, calme et régulière. Chaque inspiration vous apporte énergie et vitalité. Chaque expiration approfondit votre relaxation.", "breathing");
    }, 420000);
    
    // Séquence 16 - Conscience (480s) - NOUVEAU
    createTrackedTimeout(() => {
      speak("Prenez conscience de votre corps dans son ensemble, parfaitement détendu et en harmonie.", "awareness");
    }, 480000);
    
    // Séquence 17 - Présence (540s) - NOUVEAU
    createTrackedTimeout(() => {
      speak("Restez dans cet état de relaxation profonde, en pleine conscience de votre corps et de votre respiration.", "presence");
    }, 540000);
    
    // Séquence 18 - Fin (570s)
    createTrackedTimeout(() => {
      speak("Progressivement, reprenez conscience de votre environnement. Bougez doucement vos doigts, vos orteils. Étirez-vous si vous le souhaitez. Votre corps est maintenant complètement détendu et votre esprit apaisé.", "completion");
    }, 570000);
    
    return true;
  }, [voiceSettings.enabled, voiceSettings.gender, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal pour la session de cohérence cardiaque
  const startCoherenceGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal désactivé ou session inactive');
      return false;
    }
    
    console.log('💓 DÉMARRAGE COHÉRENCE CARDIAQUE', voiceSettings.gender === 'female' ? '(Claire)' : '(Thierry)');
    
    // Nettoyer tout timeout existant pour éviter les doublons
    clearAllTimeouts(); 
    
    // Message d'accueil
    speak("Bienvenue dans votre session de cohérence cardiaque. Installez-vous confortablement et suivez le rythme respiratoire.");
    
    // Message à mi-session (calculé dynamiquement)
    const sessionDuration = 300; // 5 minutes par défaut
    const midPoint = Math.floor(sessionDuration / 2) * 1000;
    
    createTrackedTimeout(() => {
      speak("Vous êtes à mi-parcours. Continuez ce rythme respiratoire qui harmonise votre cœur et votre esprit.");
    }, midPoint);
    
    // Message à 1 minute de la fin
    const oneMinuteBeforeEnd = (sessionDuration - 60) * 1000;
    
    createTrackedTimeout(() => {
      speak("Plus qu'une minute. Savourez ces derniers instants de cohérence.");
    }, oneMinuteBeforeEnd);
    
    // Message de fin
    const endTime = (sessionDuration - 10) * 1000;
    
    createTrackedTimeout(() => {
      speak("Votre session de cohérence cardiaque se termine. Gardez cette harmonie avec vous tout au long de votre journée.");
    }, endTime);
    
    return true;
  }, [voiceSettings.enabled, voiceSettings.gender, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal pour n'importe quelle session
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal désactivé ou session inactive');
      return false;
    }
    
    if (sessionGuidanceStarted.current) {
      console.log('⚠️ Guidage vocal déjà démarré');
      return false;
    }
    
    sessionGuidanceStarted.current = true;
    
    console.log('🎤 DÉMARRAGE GUIDAGE - Session:', currentSession, 'Méditation:', currentMeditation);
    
    if (currentSession === 'switch') {
      return startSosStressGuidance();
    } else if (currentSession === 'scan') {
      return startScanGuidance();
    } else if (currentSession === 'coherence') {
      return startCoherenceGuidance();
    } else if (currentSession === 'meditation' && currentMeditation === 'metatron') {
      // Pour la méditation Métatron avec fichier audio complet
      console.log('🌟 DÉMARRAGE MÉDITATION MÉTATRON');
      const meditationData = spiritualMeditations[currentMeditation] || meditations[currentMeditation];
      if (!meditationData) {
        console.error('❌ Données de méditation Métatron non trouvées');
        return false;
      }

      console.log('🌟 Démarrage méditation Métatron avec fichier audio complet');
      
      // Message d'accueil immédiat avec fallback court
      const fallbackMessage = meditationData.fallbackStart || "Bienvenue dans cette méditation spirituelle. Installez-vous confortablement.";
      speak(fallbackMessage);
      
      // Essayer de charger l'audio complet après 5 secondes
      createTrackedTimeout(() => {
        // Vérifier que la session est toujours active avant de démarrer l'audio
        if (!isSessionActive) {
          console.log('🔇 Session inactive, annulation du démarrage audio Métatron');
          return;
        }
        
        // Pour les autres méditations - SYSTÈME AMÉLIORÉ
        const meditationData = meditations[currentMeditation] || spiritualMeditations[currentMeditation];
        const fallbackText = meditationData.fallbackStart; // Utiliser le fallback court
        
        console.log('🎵 TENTATIVE LECTURE MÉTATRON:', audioPath);
        playFullAudio(audioPath, fallbackText);
      }, 5000); // Démarrage à 5 secondes
        console.log(`🧘 DÉMARRAGE MÉDITATION ${currentMeditation.toUpperCase()}`, voiceSettings.gender === 'female' ? '(Claire)' : '(Thierry)');
        
        // Nettoyer tout timeout existant
        clearAllTimeouts();
        
        if (currentMeditation === 'gratitude') {
          // MÉDITATION GRATITUDE - 11 séquences avec timings précis
          speak(meditationData.guidance.start, "installation");
          
          createTrackedTimeout(() => {
            speak("Commençons par établir un rythme respiratoire apaisant. Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...", "coherence-setup");
          }, 30000);
          
          createTrackedTimeout(() => {
            speak("Portez maintenant votre attention sur votre cœur. Imaginez que vous respirez directement par le centre de votre poitrine.", "breathing-heart");
          }, 60000);
          
          createTrackedTimeout(() => {
            speak("Éveillez maintenant le sentiment de gratitude. Commencez simplement, par les choses les plus évidentes.", "awakening");
          }, 90000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... et pensez à une chose pour laquelle vous êtes profondément reconnaissant aujourd'hui.", "first");
          }, 120000);
          
          createTrackedTimeout(() => {
            speak("Élargissez maintenant votre gratitude vers les personnes qui enrichissent votre vie.", "loved-ones");
          }, 150000);
          
          createTrackedTimeout(() => {
            speak("Dirigez maintenant votre gratitude vers votre corps, ce véhicule extraordinaire.", "body");
          }, 180000);
          
          createTrackedTimeout(() => {
            speak("Élargissez encore votre gratitude vers la nature et l'univers.", "nature");
          }, 210000);
          
          createTrackedTimeout(() => {
            speak("Ancrez maintenant cette énergie de gratitude dans chaque cellule de votre corps.", "anchoring");
          }, 240000);
          
          createTrackedTimeout(() => {
            speak("Intégrez pleinement cette énergie de gratitude. Laissez-la rayonner à travers vous.", "integration");
          }, 270000);
          
          createTrackedTimeout(() => {
            speak(meditationData.guidance.end, "conclusion");
          }, 285000);
          
        } else if (currentMeditation === 'abundance') {
          // MÉDITATION ABONDANCE - 19 séquences avec timings précis
          speak(meditationData.guidance.start, "introduction");
          
          createTrackedTimeout(() => {
            speak("Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...", "rhythm-start");
          }, 30000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... l'univers vous remplit d'énergie positive... Expirez... libérez toute tension...", "energy-breath");
          }, 40000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... accueillez l'abondance... Expirez... laissez partir les doutes...", "abundance-breath");
          }, 50000);
          
          createTrackedTimeout(() => {
            speak("Votre cœur entre en cohérence, créant un champ magnétique puissant autour de vous.", "coherence");
          }, 60000);
          
          createTrackedTimeout(() => {
            speak("Maintenant, tout en gardant ce rythme respiratoire, visualisez clairement ce que vous désirez manifester.", "visualize");
          }, 65000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... voyez votre désir comme déjà réalisé... Expirez... ressentez la gratitude...", "realization-breath");
          }, 73000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... imprégnez chaque cellule de cette vision... Expirez... rayonnez cette énergie...", "cellular-breath");
          }, 83000);
          
          createTrackedTimeout(() => {
            speak("Votre cœur cohérent amplifie votre pouvoir de manifestation.", "amplify");
          }, 93000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... Je suis digne de recevoir... Expirez... J'attire naturellement ce qui est bon pour moi...", "worthy-breath");
          }, 98000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... sentez la joie de la réalisation... Expirez... ancrez cette certitude...", "joy-breath");
          }, 108000);
          
          createTrackedTimeout(() => {
            speak("L'univers conspire en votre faveur. Votre vibration attire ce qui lui correspond.", "universe");
          }, 118000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... Je co-crée avec l'univers... Expirez... Tout se met en place parfaitement...", "cocreate-breath");
          }, 125000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... amplifiez le sentiment de gratitude... Expirez... diffusez votre lumière...", "gratitude-breath");
          }, 135000);
          
          createTrackedTimeout(() => {
            speak("Continuez ce rythme de respiration consciente. À chaque inspiration, vous attirez vos désirs. À chaque expiration, vous lâchez prise avec confiance.", "manifestation-cycle");
          }, 145000);
          
          createTrackedTimeout(() => {
            speak("Continuez à respirer en cohérence cardiaque, sachant que votre désir est en route vers vous.", "anchor");
          }, 300000);
          
          createTrackedTimeout(() => {
            speak("Inspirez... Je suis aligné avec mes désirs... Expirez... Je lâche prise avec confiance...", "alignment");
          }, 318000);
          
          createTrackedTimeout(() => {
            speak("Votre cœur cohérent est votre boussole vers l'abondance.", "compass");
          }, 328000);
          
          createTrackedTimeout(() => {
            speak(meditationData.guidance.end, "completion");
          }, 333000);
          
        } else {
          // Autres méditations - système générique
          speak(meditationData.guidance.start, meditationData.audioFiles?.welcome);
      // On va les programmer avec une vérification de session active
          createTrackedTimeout(() => {
            // Vérifier que la session est toujours active
            if (!isSessionActive) {
              console.log(`🔇 Session inactive, annulation phase Métatron ${index + 1}`);
          // Programmer les phases avec des délais génériques
          meditationData.guidance.phases.forEach((phaseText, index) => {
            createTrackedTimeout(() => {
              console.log(`🧘 Méditation ${currentMeditation} - Phase ${index + 1}`);
              speak(phaseText);
            }, (index + 1) * 30000);
          });
      }
      
      // Message de fin avec vérification de session active
      createTrackedTimeout(() => {
        // Vérifier que la session est toujours active
        if (!isSessionActive) {
          console.log('🔇 Session inactive, annulation message de fin Métatron');
          return;
        }
        speak(meditationData.guidance.end);
      }, 270000); // 4min 30s

      return true;
    } else if (currentSession === 'meditation' && currentMeditation && currentMeditation !== 'metatron') {
      // Pour les autres méditations
      const meditationData = meditations[currentMeditation];
      if (!meditationData) {
        console.error('❌ Données de méditation non trouvées pour:', currentMeditation);
        return false;
      }

      // Message d'accueil
      speak(meditationData.guidance.start, meditationData.audioFiles?.welcome);

      // Programmer les phases avec des délais génériques
      meditationData.guidance.phases.forEach((phaseText, index) => {
          // Message de fin
          createTrackedTimeout(() => {
            speak(meditationData.guidance.end);
          }, meditationData.duration * 1000 - 10000);
        }
        }, (index + 1) * 30000);
      });

      // Message de fin
      createTrackedTimeout(() => {
        speak(meditationData.guidance.end);
      }, meditationData.duration * 1000 - 10000); // 10 secondes avant la fin

      return true;
    } else {
      // Pour les autres sessions, utiliser un guidage générique
      speak("Bienvenue dans votre session. Suivez le rythme respiratoire et laissez-vous guider.");
      return true;
    }
  }, [currentSession, currentMeditation, startSosStressGuidance, startScanGuidance, startCoherenceGuidance, speak, voiceSettings.enabled, voiceSettings.gender, isSessionActive, createTrackedTimeout, playFullAudio]);
  
  return {
    speak,
    stop,
    clearAllTimeouts: useCallback(() => {
      console.log('🧹 Nettoyage explicite des timeouts demandé');
      clearAllTimeouts();
      return true;
    }, [clearAllTimeouts]),
    startSessionGuidance: useCallback(() => {
      console.log('🔄 Réinitialisation du guidage avant démarrage');
      // Réinitialiser l'état pour permettre un nouveau démarrage
      sessionGuidanceStarted.current = false;
      
      // Nettoyer tous les timeouts existants
      clearAllTimeouts();
      
      return startSessionGuidance();
    }, [startSessionGuidance, clearAllTimeouts]),
    isInitialized: isInitialized.current,
  };
};