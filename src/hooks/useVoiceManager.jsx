import { useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { sessions } from '../data/sessions';
import { meditations, spiritualMeditations } from '../data/meditations';

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, currentMeditation } = useAppStore();
  const currentAudioRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isPlayingRef = useRef(false);

  // Fonction pour nettoyer tous les timeouts
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 Nettoyage de tous les timeouts vocaux');
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // Fonction pour arrêter complètement la voix
  const stop = useCallback(() => {
    console.log('🔇 ARRÊT COMPLET DE LA VOIX');
    
    // Arrêter l'audio premium en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    
    // Arrêter la synthèse vocale
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Nettoyer tous les timeouts
    clearAllTimeouts();
    
    isPlayingRef.current = false;
    console.log('✅ Voix complètement arrêtée');
  }, [clearAllTimeouts]);

  // Fonction de synthèse vocale simple
  const speak = useCallback((text) => {
    if (!voiceSettings.enabled || !text) {
      console.log('🔇 Voix désactivée ou texte vide');
      return false;
    }

    try {
      // Arrêter toute synthèse en cours
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8; // Vitesse normale
      utterance.volume = voiceSettings.volume;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        console.log('🎤 Synthèse vocale démarrée');
        isPlayingRef.current = true;
      };

      utterance.onend = () => {
        console.log('✅ Synthèse vocale terminée');
        isPlayingRef.current = false;
      };

      utterance.onerror = (event) => {
        console.error('❌ Erreur synthèse vocale:', event.error);
        isPlayingRef.current = false;
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('❌ Erreur speak:', error);
      return false;
    }
  }, [voiceSettings]);

  // Fonction pour jouer un fichier audio premium
  const playPremiumAudio = useCallback((audioPath) => {
    return new Promise((resolve) => {
      try {
        // Arrêter l'audio précédent
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current.currentTime = 0;
        }

        const audio = new Audio(audioPath);
        audio.volume = voiceSettings.volume;
        currentAudioRef.current = audio;

        audio.onloadeddata = () => {
          console.log('🎵 Audio premium chargé:', audioPath);
        };

        audio.onplay = () => {
          console.log('▶️ Lecture audio premium démarrée:', audioPath);
          isPlayingRef.current = true;
        };

        audio.onended = () => {
          console.log('✅ Audio premium terminé:', audioPath);
          isPlayingRef.current = false;
          currentAudioRef.current = null;
          resolve();
        };

        audio.onerror = (error) => {
          console.error('❌ Erreur audio premium:', audioPath, error);
          isPlayingRef.current = false;
          currentAudioRef.current = null;
          resolve();
        };

        audio.play().catch(error => {
          console.error('❌ Erreur play audio:', error);
          resolve();
        });

      } catch (error) {
        console.error('❌ Erreur playPremiumAudio:', error);
        resolve();
      }
    });
  }, [voiceSettings.volume]);

  // Fonction pour démarrer le guidage de session
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé');
      return false;
    }

    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession, 'Méditation:', currentMeditation);

    // Nettoyer les anciens timeouts
    clearAllTimeouts();

    // MÉTATRON - SYSTÈME ULTRA-SIMPLIFIÉ
    if (currentSession === 'meditation' && currentMeditation === 'metatron') {
      console.log('🌟 MÉTATRON: Démarrage audio premium unique');
      
      const audioPath = `/audio/meditation/${voiceSettings.gender}/metatron.mp3`;
      
      const timeout = setTimeout(async () => {
        console.log('🎵 Lecture fichier Métatron:', audioPath);
        await playPremiumAudio(audioPath);
      }, 1000);
      
      timeoutsRef.current.push(timeout);
      return true;
    }

    // Autres sessions - synthèse vocale simple
    if (currentSession && sessions[currentSession]) {
      const session = sessions[currentSession];
      if (session.guidance?.start) {
        const timeout = setTimeout(() => {
          speak(session.guidance.start);
        }, 1000);
        timeoutsRef.current.push(timeout);
        return true;
      }
    }

    return false;
  }, [voiceSettings, currentSession, currentMeditation, clearAllTimeouts, playPremiumAudio, speak]);

  return {
    speak,
    stop,
    startSessionGuidance,
    clearAllTimeouts,
    isPlaying: isPlayingRef.current
  };
};