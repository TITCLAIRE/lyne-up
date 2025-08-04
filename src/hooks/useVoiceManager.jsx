import { useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export function useVoiceManager() {
  const { voiceSettings, currentSession } = useAppStore();

  // Ref pour gérer les timeouts de guidage vocal
  const timeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 Nettoyage de tous les timeouts:', timeoutsRef.current.length);
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, []);
  
  const speak = useCallback((text, delay = 0) => {
    if (!text || !voiceSettings.enabled) {
      console.log('🔇 Synthèse vocale désactivée ou texte vide');
      return;
    }
    
    console.log('🎤 SYNTHÈSE VOCALE DÉCLENCHÉE:', text);
    
    // Arrêter toute synthèse en cours
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.volume = voiceSettings.volume;
    
    utterance.onstart = () => {
      console.log('🎤 Synthèse démarrée avec succès');
    };
    
    utterance.onend = () => {
      console.log('🎤 Synthèse terminée avec succès');
    };
    
    utterance.onerror = (event) => {
      console.log('⚠️ Erreur synthèse:', event.error);
    };
    
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        console.log('🎤 Exécution synthèse après délai:', delay, 'ms');
        window.speechSynthesis.speak(utterance);
      }, delay);
      timeoutsRef.current.push(timeoutId);
    } else {
      console.log('🎤 Exécution synthèse immédiate');
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceSettings]);

  const stopVoice = useCallback(() => {
    console.log('🔇 ARRÊT COMPLET DU SYSTÈME VOCAL');
    
    // Arrêter la synthèse vocale
    window.speechSynthesis.cancel();
    
    // Arrêter l'audio premium
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Nettoyer tous les timeouts
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  const tryPremiumAudio = useCallback(async (audioKey, fallbackText, timing) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée, pas de lecture premium');
      return false;
    }

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    const audioPath = `/audio/sos-stress/${gender}/${audioKey}.mp3`;
    
    console.log(`🎵 TENTATIVE LECTURE PREMIUM: ${audioPath} (${voiceName})`);
    
    try {
      // Test de l'existence du fichier
      const response = await fetch(audioPath, { method: 'HEAD' });
      
      if (!response.ok) {
        console.log(`❌ FICHIER NON TROUVÉ: ${audioPath} (${response.status})`);
        console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Fichier non trouvé`);
        speak(fallbackText);
        return false;
      }
      
      console.log(`✅ FICHIER TROUVÉ: ${audioPath} (${response.status})`);
      
      // Créer et jouer l'audio
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      currentAudioRef.current = audio;
      
      return new Promise((resolve) => {
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            console.log(`🔊 LECTURE PREMIUM DÉMARRÉE: ${audioPath}`);
            
            audio.onended = () => {
              console.log(`✅ AUDIO PREMIUM TERMINÉ: ${audioKey}`);
              currentAudioRef.current = null;
              resolve(true);
            };
            
          } catch (playError) {
            console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur lecture`);
            speak(fallbackText);
            resolve(false);
          }
        };
        
        audio.onerror = () => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur audio`);
          speak(fallbackText);
          resolve(false);
        };
        
        // Timeout de sécurité
        setTimeout(() => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Timeout`);
          speak(fallbackText);
          resolve(false);
        }, 3000);
        
        audio.load();
      });
      
    } catch (error) {
      console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur réseau`);
      speak(fallbackText);
      return false;
    }
  }, [voiceSettings, speak]);
  
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé dans les paramètres');
      return false;
    }
    
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession);
    console.log('🎤 Paramètres vocaux:', voiceSettings);
    
    // Test immédiat pour vérifier que la synthèse fonctionne
    console.log('🎤 TEST VOCAL IMMÉDIAT AU DÉMARRAGE');
    speak("Démarrage du guidage vocal", 500);
    
    // Démarrage spécifique pour SOS Stress (session SWITCH)
    if (currentSession === 'switch') {
      console.log('🚨 DÉMARRAGE SOS STRESS - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS PREMIUM POUR: ${voiceName}`);
      
      // Séquence 1 : Message d'accueil (0.5s)
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Séquence 1 (0.5s): Message d\'accueil');
        await tryPremiumAudio(
          'welcome', 
          "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.",
          500
        );
      }, 500);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Guidage respiratoire (12s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Séquence 2 (12s): Inspirez le calme');
        await tryPremiumAudio('breathe-calm', "Inspirez le calme", 12000);
      }, 12000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Ancrage (28s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Séquence 3 (28s): Ancrage');
        await tryPremiumAudio(
          'grounding', 
          "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.",
          28000
        );
      }, 28000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Guidage respiratoire (37s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Séquence 4 (37s): Soufflez doucement');
        await tryPremiumAudio('breathe-softly', "Soufflez doucement", 37000);
      }, 37000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Message de fin (85s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Séquence 5 (85s): Message de fin');
        await tryPremiumAudio(
          'completion', 
          "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.",
          85000
        );
      }, 85000);
      timeoutsRef.current.push(timeoutId5);
      
      console.log('✅ TOUTES LES SÉQUENCES SOS STRESS PROGRAMMÉES');
        
    } else if (currentSession === 'scan') {
      console.log('🧘 DÉMARRAGE SCAN CORPOREL - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS SCAN CORPOREL POUR: ${voiceName}`);
      
      // Séquence 1 : Message d'accueil (0s)
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 1 (0s): Message d\'accueil');
        await tryPremiumAudioScan('welcome', 
          "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez. Nous allons explorer chaque partie de votre corps pour une relaxation profonde.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Tête (30s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 2 (30s): Tête');
        await tryPremiumAudioScan('head', 
          "Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Visage (60s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 3 (60s): Visage');
        await tryPremiumAudioScan('face', 
          "Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières. Détendez vos mâchoires, votre langue, votre gorge.");
      }, 60000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Cou (90s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 4 (90s): Cou et épaules');
        await tryPremiumAudioScan('neck', 
          "Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension accumulée dans cette zone.");
      }, 90000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Poitrine (120s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 5 (120s): Poitrine');
        await tryPremiumAudioScan('chest', 
          "Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement.");
      }, 120000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Dos (150s)
      const timeoutId6 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 6 (150s): Dos');
        await tryPremiumAudioScan('back', 
          "Votre dos se détend vertèbre par vertèbre, du haut vers le bas. Chaque vertèbre s'aligne parfaitement.");
      }, 150000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Ventre (180s)
      const timeoutId7 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 7 (180s): Ventre');
        await tryPremiumAudioScan('abdomen', 
          "Votre ventre se gonfle et se dégonfle naturellement, sans effort. Sentez une douce chaleur s'y répandre.");
      }, 180000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Hanches (210s)
      const timeoutId8 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 8 (210s): Hanches');
        await tryPremiumAudioScan('hips', 
          "Vos hanches et votre bassin se relâchent complètement. Sentez le poids de votre corps s'enfoncer dans le support.");
      }, 210000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Cuisses (240s)
      const timeoutId9 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 9 (240s): Cuisses');
        await tryPremiumAudioScan('thighs', 
          "Vos cuisses se détendent profondément. Sentez les muscles se relâcher, devenir lourds et confortables.");
      }, 240000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Pieds (300s)
      const timeoutId10 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 10 (300s): Pieds');
        await tryPremiumAudioScan('feet', 
          "Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds.");
      }, 300000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Corps entier (360s)
      const timeoutId11 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 11 (360s): Corps entier');
        await tryPremiumAudioScan('wholebody', 
          "Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds. Vous êtes dans un état de relaxation profonde.");
      }, 360000);
      timeoutsRef.current.push(timeoutId11);
      
      // Séquence 12 : Fin (570s)
      const timeoutId12 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 12 (570s): Fin');
        await tryPremiumAudioScan('completion', 
          "Progressivement, reprenez conscience de votre environnement. Bougez doucement vos doigts, vos orteils. Votre corps est maintenant complètement détendu et votre esprit apaisé.");
      }, 570000);
      timeoutsRef.current.push(timeoutId12);
      
      console.log('✅ TOUTES LES SÉQUENCES SCAN CORPOREL PROGRAMMÉES');
      
    } else if (currentSession === 'meditation' && currentMeditation === 'gratitude') {
      console.log('🙏 DÉMARRAGE MÉDITATION GRATITUDE - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS GRATITUDE POUR: ${voiceName}`);
      
      // Séquence 1 : Installation (0s)
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 1 (0s): Installation');
        await tryPremiumAudioMeditation('gratitude-installation', 
          "Bienvenue dans cette méditation de gratitude. Installez-vous confortablement, le dos droit, les pieds bien ancrés au sol. Fermez doucement les yeux et prenez conscience de votre respiration naturelle.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Cohérence (30s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 2 (30s): Cohérence setup');
        await tryPremiumAudioMeditation('gratitude-coherence-setup', 
          "Commençons par établir un rythme respiratoire apaisant. Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Respiration cœur (60s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 3 (60s): Respiration cœur');
        await tryPremiumAudioMeditation('gratitude-breathing-heart', 
          "Portez maintenant votre attention sur votre cœur. Imaginez que vous respirez directement par le centre de votre poitrine.");
      }, 60000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Éveil gratitude (90s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 4 (90s): Éveil gratitude');
        await tryPremiumAudioMeditation('gratitude-awakening', 
          "Éveillez maintenant le sentiment de gratitude. Commencez simplement, par les choses les plus évidentes : l'air que vous respirez, la vie qui coule en vous.");
      }, 90000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Première gratitude (120s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 5 (120s): Première gratitude');
        await tryPremiumAudioMeditation('gratitude-first', 
          "Inspirez... et pensez à une chose pour laquelle vous êtes profondément reconnaissant aujourd'hui. Expirez... et laissez cette gratitude rayonner.");
      }, 120000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Êtres chers (150s)
      const timeoutId6 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 6 (150s): Êtres chers');
        await tryPremiumAudioMeditation('gratitude-loved-ones', 
          "Élargissez maintenant votre gratitude vers les personnes qui enrichissent votre vie. Visualisez le visage d'un être cher.");
      }, 150000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Corps (180s)
      const timeoutId7 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 7 (180s): Corps');
        await tryPremiumAudioMeditation('gratitude-body', 
          "Dirigez maintenant votre gratitude vers votre corps, ce véhicule extraordinaire qui vous permet de vivre chaque expérience.");
      }, 180000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Nature (210s)
      const timeoutId8 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 8 (210s): Nature');
        await tryPremiumAudioMeditation('gratitude-nature', 
          "Élargissez encore votre gratitude vers la nature et l'univers. Remerciez le soleil qui vous réchauffe, l'eau qui vous désaltère.");
      }, 210000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Ancrage (240s)
      const timeoutId9 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 9 (240s): Ancrage');
        await tryPremiumAudioMeditation('gratitude-anchoring', 
          "Ancrez maintenant cette énergie de gratitude dans chaque cellule de votre corps. La gratitude transforme ce que vous avez en suffisance.");
      }, 240000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Intégration (270s)
      const timeoutId10 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 10 (270s): Intégration');
        await tryPremiumAudioMeditation('gratitude-integration', 
          "Intégrez pleinement cette énergie de gratitude. Laissez-la rayonner à travers vous, transformant votre perception du monde.");
      }, 270000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Conclusion (285s)
      const timeoutId11 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 11 (285s): Conclusion');
        await tryPremiumAudioMeditation('gratitude-conclusion', 
          "Doucement, prenez une respiration plus profonde. Remerciez-vous pour ce moment de connexion. Quand vous êtes prêt, ouvrez les yeux, en gardant cette gratitude vivante en vous.");
      }, 285000);
      timeoutsRef.current.push(timeoutId11);
      
      console.log('✅ TOUTES LES SÉQUENCES GRATITUDE PROGRAMMÉES');
      
    } else if (currentSession === 'meditation' && currentMeditation === 'metatron') {
      console.log('🌟 DÉMARRAGE MÉDITATION MÉTATRON - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS MÉTATRON POUR: ${voiceName}`);
      
      // Vérifier si on a le fichier audio complet
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Métatron - Tentative fichier complet');
        const success = await tryPremiumAudioMeditation('metatron', 
          "Bienvenue dans cette méditation d'invocation de l'archange Métatron. Installez-vous confortablement. Fermez les yeux et prenez quelques profondes respirations. Nous allons établir une connexion avec cet être de lumière, gardien des archives akashiques et porteur de la géométrie sacrée. Suivez le rythme respiratoire et ouvrez votre coeur à cette présence divine. Ô Metatron, ange de la Présence, scribe de Lumière, gardien du Trône Divin, toi qui as connu la chair et t'es élevé au-delà, je t'appelle avec humilité. Que ta présence sacrée se manifeste dans cet espace. Je t'invite à m'accompagner dans cette méditation, à m'envelopper de ton énergie céleste. Que ta lumière entoure mon esprit, que ta sagesse éclaire mon cœur, que ta voix me guide sur les chemins de vérité. Toi qui écris dans les Livres Célestes, inscris en moi la mémoire de mon âme. Aide-moi à me souvenir de qui je suis, au-delà des voiles de l'oubli et des peurs humaines. Toi qui transmets la pensée divine, fais descendre en moi l'inspiration claire, la parole juste, et le silence plein de sens. Entoure-moi de ton Cube sacré, géométrie vivante de la création, bouclier de lumière contre les ombres. Metatron, Archange de feu blanc, ouvre les portes de la haute conscience. Aide-moi à élever ma fréquence, à faire rayonner l'amour, et à servir ce qui est plus grand que moi. Je te rends grâce pour ta présence, ta guidance et ta protection. Amen. Doucement, prenez conscience de votre corps, de votre respiration. Quand vous êtes prêt, ouvrez les yeux en gardant cette connexion sacrée avec l'Archange Métatron.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      console.log('✅ MÉDITATION MÉTATRON PROGRAMMÉE');
        
    } else {
      // Autres sessions avec synthèse vocale simple
      console.log('🎤 Session autre que SOS Stress, guidage simple');
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.", 1000);
    }
    
    return true;
  }, [currentSession, voiceSettings, speak, tryPremiumAudio]);
  
  // Fonction spécialisée pour les fichiers scan corporel
  const tryPremiumAudioScan = useCallback(async (audioKey, fallbackText) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée, pas de lecture premium');
      return false;
    }

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    const audioPath = `/audio/scan-corporel/${gender}/${audioKey}.mp3`;
    
    console.log(`🎵 TENTATIVE LECTURE SCAN: ${audioPath} (${voiceName})`);
    
    try {
      const response = await fetch(audioPath, { method: 'HEAD' });
      
      if (!response.ok) {
        console.log(`❌ FICHIER SCAN NON TROUVÉ: ${audioPath} (${response.status})`);
        console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Fichier non trouvé`);
        speak(fallbackText);
        return false;
      }
      
      console.log(`✅ FICHIER SCAN TROUVÉ: ${audioPath} (${response.status})`);
      
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      currentAudioRef.current = audio;
      
      return new Promise((resolve) => {
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            console.log(`🔊 LECTURE SCAN DÉMARRÉE: ${audioPath}`);
            
            audio.onended = () => {
              console.log(`✅ AUDIO SCAN TERMINÉ: ${audioKey}`);
              currentAudioRef.current = null;
              resolve(true);
            };
            
          } catch (playError) {
            console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur lecture`);
            speak(fallbackText);
            resolve(false);
          }
        };
        
        audio.onerror = () => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur audio`);
          speak(fallbackText);
          resolve(false);
        };
        
        setTimeout(() => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Timeout`);
          speak(fallbackText);
          resolve(false);
        }, 3000);
        
        audio.load();
      });
      
    } catch (error) {
      console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur réseau`);
      speak(fallbackText);
      return false;
    }
  }, [voiceSettings, speak]);
  
  // Fonction spécialisée pour les fichiers méditation
  const tryPremiumAudioMeditation = useCallback(async (audioKey, fallbackText) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée, pas de lecture premium');
      return false;
    }

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    const audioPath = `/audio/meditation/${gender}/${audioKey}.mp3`;
    
    console.log(`🎵 TENTATIVE LECTURE MÉDITATION: ${audioPath} (${voiceName})`);
    
    try {
      const response = await fetch(audioPath, { method: 'HEAD' });
      
      if (!response.ok) {
        console.log(`❌ FICHIER MÉDITATION NON TROUVÉ: ${audioPath} (${response.status})`);
        console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Fichier non trouvé`);
        speak(fallbackText);
        return false;
      }
      
      console.log(`✅ FICHIER MÉDITATION TROUVÉ: ${audioPath} (${response.status})`);
      
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      currentAudioRef.current = audio;
      
      return new Promise((resolve) => {
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            console.log(`🔊 LECTURE MÉDITATION DÉMARRÉE: ${audioPath}`);
            
            audio.onended = () => {
              console.log(`✅ AUDIO MÉDITATION TERMINÉ: ${audioKey}`);
              currentAudioRef.current = null;
              resolve(true);
            };
            
          } catch (playError) {
            console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur lecture`);
            speak(fallbackText);
            resolve(false);
          }
        };
        
        audio.onerror = () => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur audio`);
          speak(fallbackText);
          resolve(false);
        };
        
        setTimeout(() => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Timeout`);
          speak(fallbackText);
          resolve(false);
        }, 3000);
        
        audio.load();
      });
      
    } catch (error) {
      console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur réseau`);
      speak(fallbackText);
      return false;
    }
  }, [voiceSettings, speak]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts,
    tryPremiumAudio,
    tryPremiumAudioScan,
    tryPremiumAudioMeditation
  };
}