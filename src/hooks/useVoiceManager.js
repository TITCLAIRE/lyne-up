import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

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
  }, []);
  
  // Réinitialiser le guidage vocal lorsque la session change
  useEffect(() => {
    sessionGuidanceStarted.current = false;
    sessionGuidancePhase.current = 0;
    clearAllTimeouts();
  }, [currentSession, currentMeditation]);
  
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
        audioElementRef.current = null;
        console.log('🔇 Lecture audio arrêtée');
      }
      
      // Vider la file d'attente
      audioQueue.current = [];
      isPlayingAudio.current = false;
      
      sessionGuidanceStarted.current = false;
      sessionGuidancePhase.current = 0;
      console.log('🔄 État du guidage vocal réinitialisé');
    }
  }, [isSessionActive, clearAllTimeouts]);
  
  // Fonction pour jouer le prochain audio dans la file d'attente
  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length === 0) {
      isPlayingAudio.current = false;
      return;
    }
    
    isPlayingAudio.current = true;
    const nextAudio = audioQueue.current.shift();
    
    try {
      // Créer un nouvel élément audio
      const audio = new Audio(nextAudio.url);
      audioElementRef.current = audio;
      
      // Configurer les événements
      audio.onended = () => {
        console.log('✅ AUDIO TERMINÉ:', nextAudio.url);
        audioElementRef.current = null;
        playNextInQueue();
      };
      
      audio.onerror = (error) => {
        console.error('❌ ERREUR AUDIO:', error, nextAudio.url);
        audioElementRef.current = null;
        
        // Fallback vers synthèse vocale si l'audio échoue
        if (nextAudio.fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour:', nextAudio.key, '- Raison:', error.type || 'Erreur audio');
          speakWithSynthesis(nextAudio.fallbackText);
        }
        
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
  }, [voiceSettings.volume]);
  
  // Fonction pour ajouter un audio à la file d'attente
  const queueAudio = useCallback((url, key, fallbackText) => {
    console.log('🎵 TENTATIVE LECTURE AUDIO:', url);
    
    // Vérifier si l'URL existe
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ FICHIER AUDIO TROUVÉ:', url, `(${response.status})`);
          
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
          console.log('❌ FICHIER AUDIO NON TROUVÉ:', url, `(${response.status})`);
          
          // Fallback vers synthèse vocale
          if (fallbackText) {
            console.log('🔄 FALLBACK SYNTHÈSE pour:', key, '- Raison:', 'Fichier non trouvé');
            speakWithSynthesis(fallbackText);
          }
        }
      })
      .catch(error => {
        console.error('❌ ERREUR VÉRIFICATION AUDIO:', error, url);
        
        // Fallback vers synthèse vocale
        if (fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour:', key, '- Raison:', error.message);
          speakWithSynthesis(fallbackText);
        }
      });
  }, []);
  
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
  
  // Fonction principale pour parler (avec audio ou synthèse)
  const speak = useCallback((text) => {
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
    let audioKey = null;
    
    if (sessionType === 'switch') {
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
      // Essayer de trouver un fichier audio pour Scan Corporel
      if (text.includes('Bienvenue dans cette séance de scan')) {
        audioPath = `/audio/scan-corporel/${gender}/welcome.mp3`;
        audioKey = 'welcome';
      } else if (text.includes('Portez votre attention sur le sommet')) {
        audioPath = `/audio/scan-corporel/${gender}/head.mp3`;
        audioKey = 'head';
      } else if (text.includes('Descendez vers votre visage')) {
        audioPath = `/audio/scan-corporel/${gender}/face.mp3`;
        audioKey = 'face';
      } else if (text.includes('Votre cou et vos épaules')) {
        audioPath = `/audio/scan-corporel/${gender}/neck.mp3`;
        audioKey = 'neck';
      } else if (text.includes('Votre poitrine s\'ouvre')) {
        audioPath = `/audio/scan-corporel/${gender}/chest.mp3`;
        audioKey = 'chest';
      } else if (text.includes('Votre dos se détend')) {
        audioPath = `/audio/scan-corporel/${gender}/back.mp3`;
        audioKey = 'back';
      } else if (text.includes('Votre ventre se gonfle')) {
        audioPath = `/audio/scan-corporel/${gender}/abdomen.mp3`;
        audioKey = 'abdomen';
      } else if (text.includes('Vos hanches et votre bassin')) {
        audioPath = `/audio/scan-corporel/${gender}/hips.mp3`;
        audioKey = 'hips';
      } else if (text.includes('Vos cuisses')) {
        audioPath = `/audio/scan-corporel/${gender}/thighs.mp3`;
        audioKey = 'thighs';
      } else if (text.includes('Vos genoux')) {
        audioPath = `/audio/scan-corporel/${gender}/knees.mp3`;
        audioKey = 'knees';
      } else if (text.includes('Vos mollets')) {
        audioPath = `/audio/scan-corporel/${gender}/calves.mp3`;
        audioKey = 'calves';
      } else if (text.includes('Vos chevilles')) {
        audioPath = `/audio/scan-corporel/${gender}/ankles.mp3`;
        audioKey = 'ankles';
      } else if (text.includes('Vos pieds')) {
        audioPath = `/audio/scan-corporel/${gender}/feet.mp3`;
        audioKey = 'feet';
      } else if (text.includes('Une vague de bien-être')) {
        audioPath = `/audio/scan-corporel/${gender}/wholebody.mp3`;
        audioKey = 'wholebody';
      } else if (text.includes('Observez votre respiration')) {
        audioPath = `/audio/scan-corporel/${gender}/breathing.mp3`;
        audioKey = 'breathing';
      } else if (text.includes('Prenez conscience de votre corps')) {
        audioPath = `/audio/scan-corporel/${gender}/awareness.mp3`;
        audioKey = 'awareness';
      } else if (text.includes('Restez dans cet état')) {
        audioPath = `/audio/scan-corporel/${gender}/presence.mp3`;
        audioKey = 'presence';
      } else if (text.includes('Progressivement, reprenez conscience')) {
        audioPath = `/audio/scan-corporel/${gender}/completion.mp3`;
        audioKey = 'completion';
      }
    } else if (sessionType === 'meditation' && currentMeditation === 'gratitude') {
      // Essayer de trouver un fichier audio pour Méditation Gratitude
      if (text.includes('Bienvenue dans cette méditation de gratitude')) {
        audioPath = `/audio/meditation/${gender}/gratitude-installation.mp3`;
        audioKey = 'gratitude-installation';
      } else if (text.includes('Commençons par établir un rythme respiratoire')) {
        audioPath = `/audio/meditation/${gender}/gratitude-coherence-setup.mp3`;
        audioKey = 'gratitude-coherence-setup';
      } else if (text.includes('Portez maintenant votre attention sur votre cœur')) {
        audioPath = `/audio/meditation/${gender}/gratitude-breathing-heart.mp3`;
        audioKey = 'gratitude-breathing-heart';
      } else if (text.includes('Éveillez maintenant le sentiment de gratitude')) {
        audioPath = `/audio/meditation/${gender}/gratitude-awakening.mp3`;
        audioKey = 'gratitude-awakening';
      } else if (text.includes('Inspirez... et pensez à une chose')) {
        audioPath = `/audio/meditation/${gender}/gratitude-first.mp3`;
        audioKey = 'gratitude-first';
      } else if (text.includes('Élargissez maintenant votre gratitude vers les personnes')) {
        audioPath = `/audio/meditation/${gender}/gratitude-loved-ones.mp3`;
        audioKey = 'gratitude-loved-ones';
      } else if (text.includes('Dirigez maintenant votre gratitude vers votre corps')) {
        audioPath = `/audio/meditation/${gender}/gratitude-body.mp3`;
        audioKey = 'gratitude-body';
      } else if (text.includes('Élargissez encore votre gratitude vers la nature')) {
        audioPath = `/audio/meditation/${gender}/gratitude-nature.mp3`;
        audioKey = 'gratitude-nature';
      } else if (text.includes('Ancrez maintenant cette énergie de gratitude')) {
        audioPath = `/audio/meditation/${gender}/gratitude-anchoring.mp3`;
        audioKey = 'gratitude-anchoring';
      } else if (text.includes('Intégrez pleinement cette énergie de gratitude')) {
        audioPath = `/audio/meditation/${gender}/gratitude-integration.mp3`;
        audioKey = 'gratitude-integration';
      } else if (text.includes('Doucement, prenez une respiration plus profonde. Remerciez-vous')) {
        audioPath = `/audio/meditation/${gender}/gratitude-conclusion.mp3`;
        audioKey = 'gratitude-conclusion';
      }
    } else if (sessionType === 'meditation' && currentMeditation === 'abundance') {
      // Essayer de trouver un fichier audio pour Méditation Abondance
      if (text.includes('Bienvenue dans cette méditation')) {
        audioPath = `/audio/meditation/${gender}/abundance-introduction.mp3`;
        audioKey = 'abundance-introduction';
      } else if (text.includes('Inspirez profondément par le nez pendant 5 secondes')) {
        audioPath = `/audio/meditation/${gender}/abundance-rhythm-start.mp3`;
        audioKey = 'abundance-rhythm-start';
      } else if (text.includes('Inspirez... l\'univers vous remplit')) {
        audioPath = `/audio/meditation/${gender}/abundance-energy-breath.mp3`;
        audioKey = 'abundance-energy-breath';
      } else if (text.includes('Inspirez... accueillez l\'abondance')) {
        audioPath = `/audio/meditation/${gender}/abundance-abundance-breath.mp3`;
        audioKey = 'abundance-abundance-breath';
      } else if (text.includes('Votre cœur entre en cohérence')) {
        audioPath = `/audio/meditation/${gender}/abundance-coherence.mp3`;
        audioKey = 'abundance-coherence';
      } else if (text.includes('Maintenant, tout en gardant ce rythme respiratoire, visualisez')) {
        audioPath = `/audio/meditation/${gender}/abundance-visualize.mp3`;
        audioKey = 'abundance-visualize';
      } else if (text.includes('Inspirez... voyez votre désir comme déjà réalisé')) {
        audioPath = `/audio/meditation/${gender}/abundance-realization-breath.mp3`;
        audioKey = 'abundance-realization-breath';
      } else if (text.includes('Inspirez... imprégnez chaque cellule')) {
        audioPath = `/audio/meditation/${gender}/abundance-cellular-breath.mp3`;
        audioKey = 'abundance-cellular-breath';
      } else if (text.includes('Votre cœur cohérent amplifie')) {
        audioPath = `/audio/meditation/${gender}/abundance-amplify.mp3`;
        audioKey = 'abundance-amplify';
      } else if (text.includes('Inspirez... Je suis digne de recevoir')) {
        audioPath = `/audio/meditation/${gender}/abundance-worthy-breath.mp3`;
        audioKey = 'abundance-worthy-breath';
      } else if (text.includes('Inspirez... sentez la joie de la réalisation')) {
        audioPath = `/audio/meditation/${gender}/abundance-joy-breath.mp3`;
        audioKey = 'abundance-joy-breath';
      } else if (text.includes('L\'univers conspire en votre faveur')) {
        audioPath = `/audio/meditation/${gender}/abundance-universe.mp3`;
        audioKey = 'abundance-universe';
      } else if (text.includes('Inspirez... Je co-crée avec l\'univers')) {
        audioPath = `/audio/meditation/${gender}/abundance-cocreate-breath.mp3`;
        audioKey = 'abundance-cocreate-breath';
      } else if (text.includes('Inspirez... amplifiez le sentiment de gratitude')) {
        audioPath = `/audio/meditation/${gender}/abundance-gratitude-breath.mp3`;
        audioKey = 'abundance-gratitude-breath';
      } else if (text.includes('Continuez ce rythme de respiration consciente')) {
        audioPath = `/audio/meditation/${gender}/abundance-manifestation-cycle.mp3`;
        audioKey = 'abundance-manifestation-cycle';
      } else if (text.includes('Continuez à respirer en cohérence cardiaque, sachant que votre désir')) {
        audioPath = `/audio/meditation/${gender}/abundance-anchor.mp3`;
        audioKey = 'abundance-anchor';
      } else if (text.includes('Inspirez... Je suis aligné avec mes désirs')) {
        audioPath = `/audio/meditation/${gender}/abundance-alignment.mp3`;
        audioKey = 'abundance-alignment';
      } else if (text.includes('Votre cœur cohérent est votre boussole')) {
        audioPath = `/audio/meditation/${gender}/abundance-compass.mp3`;
        audioKey = 'abundance-compass';
      } else if (text.includes('Doucement, prenez une respiration plus profonde. Remerciez-vous')) {
        audioPath = `/audio/meditation/${gender}/abundance-completion.mp3`;
        audioKey = 'abundance-completion';
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
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    
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
  }, [voiceSettings.enabled, voiceSettings.gender, isSessionActive, speak, clearAllTimeouts]);
  
  // Fonction pour démarrer le guidage vocal pour la session Scan Corporel
  const startScanGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal désactivé ou session inactive');
      return false;
    }
    
    console.log('🧠 DÉMARRAGE SCAN CORPOREL', voiceSettings.gender === 'female' ? '(Claire)' : '(Thierry)');
    
    // Nettoyer tout timeout existant pour éviter les doublons
    clearAllTimeouts(); 
    
    // Séquence 1 - Message d'accueil (0s)
    speak("Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez. Nous allons explorer chaque partie de votre corps pour une relaxation profonde.");
    
    // Séquence 2 - Tête (30s)
    createTrackedTimeout(() => {
      speak("Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.");
    }, 30000);
    
    // Séquence 3 - Visage (60s)
    createTrackedTimeout(() => {
      speak("Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières. Détendez vos mâchoires, votre langue, votre gorge.");
    }, 60000);
    
    // Séquence 4 - Cou (90s)
    createTrackedTimeout(() => {
      speak("Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension accumulée dans cette zone.");
    }, 90000);
    
    // Séquence 5 - Poitrine (120s)
    createTrackedTimeout(() => {
      speak("Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement.");
    }, 120000);
    
    // Séquence 6 - Dos (150s)
    createTrackedTimeout(() => {
      speak("Votre dos se détend vertèbre par vertèbre, du haut vers le bas. Chaque vertèbre s'aligne parfaitement.");
    }, 150000);
    
    // Séquence 7 - Ventre (180s)
    createTrackedTimeout(() => {
      speak("Votre ventre se gonfle et se dégonfle naturellement, sans effort. Sentez une douce chaleur s'y répandre.");
    }, 180000);
    
    // Séquence 8 - Hanches (210s)
    createTrackedTimeout(() => {
      speak("Vos hanches et votre bassin se relâchent complètement. Sentez le poids de votre corps s'enfoncer dans le support.");
    }, 210000);
    
    // Séquence 9 - Cuisses (240s)
    createTrackedTimeout(() => {
      speak("Vos cuisses se détendent profondément. Toute tension s'évapore à chaque expiration.");
    }, 240000);
    
    // Séquence 10 - Genoux (255s)
    createTrackedTimeout(() => {
      speak("Vos genoux se détendent. Sentez l'espace dans vos articulations.");
    }, 255000);
    
    // Séquence 11 - Mollets (270s)
    createTrackedTimeout(() => {
      speak("Vos mollets se relâchent entièrement. Sentez l'énergie circuler librement.");
    }, 270000);
    
    // Séquence 12 - Chevilles (285s)
    createTrackedTimeout(() => {
      speak("Vos chevilles se détendent. Sentez l'espace dans ces articulations.");
    }, 285000);
    
    // Séquence 13 - Pieds (300s)
    createTrackedTimeout(() => {
      speak("Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds.");
    }, 300000);
    
    // Séquence 14 - Corps entier (360s)
    createTrackedTimeout(() => {
      speak("Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds. Vous êtes dans un état de relaxation profonde.");
    }, 360000);
    
    // Séquence 15 - Respiration (420s)
    createTrackedTimeout(() => {
      speak("Observez votre respiration, calme et régulière. Chaque inspiration vous apporte énergie et vitalité. Chaque expiration approfondit votre relaxation.");
    }, 420000);
    
    // Séquence 16 - Conscience (480s)
    createTrackedTimeout(() => {
      speak("Prenez conscience de votre corps dans son ensemble, parfaitement détendu et en harmonie.");
    }, 480000);
    
    // Séquence 17 - Présence (540s)
    createTrackedTimeout(() => {
      speak("Restez dans cet état de relaxation profonde, en pleine conscience de votre corps et de votre respiration.");
    }, 540000);
    
    // Séquence 18 - Fin (570s)
    createTrackedTimeout(() => {
      speak("Progressivement, reprenez conscience de votre environnement. Bougez doucement vos doigts, vos orteils. Étirez-vous si vous le souhaitez. Votre corps est maintenant complètement détendu et votre esprit apaisé.");
    }, 570000);
    
    return true;
  }, [voiceSettings.enabled, voiceSettings.gender, isSessionActive, speak, clearAllTimeouts]);
  
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
  }, [voiceSettings.enabled, voiceSettings.gender, isSessionActive, speak, clearAllTimeouts]);
  
  // Fonction pour démarrer le guidage vocal pour n'importe quelle session
  const startSessionGuidance = useCallback(() => {
    if (sessionGuidanceStarted.current) {
      console.log('🔇 Guidage vocal déjà démarré pour:', currentSession);
      return false;
    }
    sessionGuidanceStarted.current = true;
    
    console.log('🎯 Démarrage guidage vocal pour session:', currentSession);
    
    // Utiliser le même guidage pour 'switch' et 'sos'
    if (currentSession === 'switch' || currentSession === 'sos') {
      return startSosStressGuidance();
    } else if (currentSession === 'scan') {
      return startScanGuidance();
    } else if (currentSession === 'coherence') {
      return startCoherenceGuidance();
    } else if (currentSession === 'meditation') {
      // Guidage pour les méditations géré séparément
      console.log('🧘 Méditation:', currentMeditation);
      
      // Méditation Métatron
      if (currentSession === 'meditation' && currentMeditation === 'metatron') {
        console.log('🌟 DÉMARRAGE DIRECT GUIDAGE MÉTATRON avec voix premium');
        
        // Message d'introduction (0s)
        const gender = voiceSettings.gender;
        const introPath = `/audio/meditation/${gender}/metatron-introduction.mp3`;
        queueAudio(introPath, 'metatron-introduction', "Bienvenue dans cette méditation d'invocation de l'Archange Métatron. Installez-vous confortablement, fermez les yeux et prenez quelques respirations profondes. Nous allons établir une connexion avec cet être de lumière, gardien des archives akashiques et porteur de la géométrie sacrée. Suivez le rythme respiratoire et ouvrez votre cœur à cette présence divine.");
        
        // Invocation (30s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            const invocationPath = `/audio/meditation/${gender}/metatron-invocation.mp3`;
            queueAudio(invocationPath, 'metatron-invocation', "Ô Metatron, ange de la Présence, scribe de Lumière, gardien du Trône Divin, toi qui as connu la chair et t'es élevé au-delà, je t'appelle avec humilité. Que ta présence sacrée se manifeste dans cet espace. Je t'invite à m'accompagner dans cette méditation, à m'envelopper de ton énergie céleste.");
          }
        }, 30000);
        
        // Lumière (70s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            const lightPath = `/audio/meditation/${gender}/metatron-light.mp3`;
            queueAudio(lightPath, 'metatron-light', "Que ta lumière entoure mon esprit, que ta sagesse éclaire mon cœur, que ta voix me guide sur les chemins de vérité. Je sens ta présence comme une lumière dorée qui m'enveloppe, qui purifie mon aura et élève ma vibration. Ta lumière pénètre chaque cellule de mon être.");
          }
        }, 70000);
        
        // Mémoire (110s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            const memoryPath = `/audio/meditation/${gender}/metatron-memory.mp3`;
            queueAudio(memoryPath, 'metatron-memory', "Toi qui écris dans les Livres Célestes, inscris en moi la mémoire de mon âme. Aide-moi à me souvenir de qui je suis, au-delà des voiles de l'oubli et des peurs humaines. Révèle-moi ma véritable nature, mon essence divine, ma mission sacrée sur cette Terre.");
          }
        }, 110000);
        
        // Inspiration (150s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            const inspirationPath = `/audio/meditation/${gender}/metatron-inspiration.mp3`;
            queueAudio(inspirationPath, 'metatron-inspiration', "Toi qui transmets la pensée divine, fais descendre en moi l'inspiration claire, la parole juste, et le silence plein de sens. Guide-moi vers la connaissance qui m'est nécessaire en ce moment. Ouvre les canaux de ma perception pour que je puisse recevoir les messages divins.");
          }
        }, 150000);
        
        // Protection (190s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            const protectionPath = `/audio/meditation/${gender}/metatron-protection.mp3`;
            queueAudio(protectionPath, 'metatron-protection', "Entoure-moi de ton Cube sacré, géométrie vivante de la création, bouclier de lumière contre les ombres, structure de l'ordre cosmique. Protège mon corps, mon cœur, mon esprit. Que ce Cube de Métatron m'enveloppe de ses lignes de force, équilibrant mes énergies et harmonisant mes chakras.");
          }
        }, 190000);
        
        // Élévation et gratitude (230s)
        setTimeout(() => {
          if (isSessionActive && voiceSettings.enabled) {
            const elevationPath = `/audio/meditation/${gender}/metatron-elevation.mp3`;
            queueAudio(elevationPath, 'metatron-elevation', "Metatron, Archange de feu blanc, ouvre les portes de la haute conscience. Aide-moi à élever ma fréquence, à faire rayonner l'amour, et à servir ce qui est plus grand que moi. Que ta présence m'accompagne dans mon quotidien, m'inspirant sagesse et discernement. Je te rends grâce pour ta présence, ta guidance et ta protection. Amen. Amen. Amen. Doucement, prenez conscience de votre corps, de votre respiration. Quand vous êtes prêt, ouvrez les yeux en gardant cette connexion sacrée avec l'Archange Métatron.");
          }
        }, 230000);
        
        return true;
      }
      
      return true;
    } else {
      // Pour les autres sessions, utiliser un guidage générique
      speak("Bienvenue dans votre session. Suivez le rythme respiratoire et laissez-vous guider.");
      return true;
    }
  }, [currentSession, currentMeditation, startSosStressGuidance, startScanGuidance, startCoherenceGuidance, speak, queueAudio, voiceSettings.enabled, voiceSettings.gender, isSessionActive]);
  
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