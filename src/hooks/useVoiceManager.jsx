import { useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export function useVoiceManager() {
  const { voiceSettings, currentSession, currentMeditation, isSessionActive } = useAppStore();

  // Ref pour gérer les timeouts de guidage vocal
  const timeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isGuidanceStartedRef = useRef(false);
  
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 Nettoyage de tous les timeouts:', timeoutsRef.current.length);
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Reset du flag de démarrage
    isGuidanceStartedRef.current = false;
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

  // Surveiller l'état de la session pour arrêter les guidances
  useEffect(() => {
    if (!isSessionActive && isGuidanceStartedRef.current) {
      console.log('🔇 Session inactive détectée - Arrêt du guidage vocal');
      stopVoice();
    }
  }, [isSessionActive, stopVoice]);
  const tryPremiumAudio = useCallback(async (audioKey, fallbackText, timing) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée, pas de lecture premium');
      return false;
    }

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    
    // Déterminer le bon dossier selon le type de fichier
    let audioPath;
    if (audioKey.startsWith('gratitude-') || audioKey.startsWith('abundance-') || audioKey === 'metatron') {
      audioPath = `/audio/meditation/${gender}/${audioKey}.mp3`;
    } else if (audioKey.includes('head') || audioKey.includes('face') || audioKey.includes('neck') || 
               audioKey.includes('chest') || audioKey.includes('back') || audioKey.includes('abdomen') || 
               audioKey.includes('hips') || audioKey.includes('thighs') || audioKey.includes('feet') || 
               audioKey.includes('wholebody') || audioKey.includes('awareness') || audioKey.includes('breathing') ||
               audioKey.includes('presence') || audioKey.includes('completion')) {
      audioPath = `/audio/scan-corporel/${gender}/${audioKey}.mp3`;
    } else {
      audioPath = `/audio/sos-stress/${gender}/${audioKey}.mp3`;
    }
    
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
    // Éviter les démarrages multiples
    if (isGuidanceStartedRef.current) {
      console.log('🔇 Guidage vocal déjà démarré, ignoré');
      return false;
    }
    
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé dans les paramètres');
      return false;
    }
    
    isGuidanceStartedRef.current = true;
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession);
    
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
        await tryPremiumAudio('welcome', 
          "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez. Nous allons explorer chaque partie de votre corps pour une relaxation profonde.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Tête (30s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 2 (30s): Tête');
        await tryPremiumAudio('head', 
          "Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Visage (60s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 3 (60s): Visage');
        await tryPremiumAudio('face', 
          "Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières. Détendez vos mâchoires, votre langue, votre gorge.");
      }, 60000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Cou (90s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 4 (90s): Cou et épaules');
        await tryPremiumAudio('neck', 
          "Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension accumulée dans cette zone.");
      }, 90000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Poitrine (120s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 5 (120s): Poitrine');
        await tryPremiumAudio('chest', 
          "Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement.");
      }, 120000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Dos (150s)
      const timeoutId6 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 6 (150s): Dos');
        await tryPremiumAudio('back', 
          "Votre dos se détend vertèbre par vertèbre, du haut vers le bas. Chaque vertèbre s'aligne parfaitement.");
      }, 150000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Ventre (180s)
      const timeoutId7 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 7 (180s): Ventre');
        await tryPremiumAudio('abdomen', 
          "Votre ventre se gonfle et se dégonfle naturellement, sans effort. Sentez une douce chaleur s'y répandre.");
      }, 180000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Hanches (210s)
      const timeoutId8 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 8 (210s): Hanches');
        await tryPremiumAudio('hips', 
          "Vos hanches et votre bassin se relâchent complètement. Sentez le poids de votre corps s'enfoncer dans le support.");
      }, 210000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Cuisses (240s)
      const timeoutId9 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 9 (240s): Cuisses');
        await tryPremiumAudio('thighs', 
          "Vos cuisses se détendent profondément. Sentez les muscles se relâcher, devenir lourds et confortables.");
      }, 240000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Pieds (300s)
      const timeoutId10 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 10 (300s): Pieds');
        await tryPremiumAudio('feet', 
          "Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds.");
      }, 300000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Corps entier (360s)
      const timeoutId11 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 11 (360s): Corps entier');
        await tryPremiumAudio('wholebody', 
          "Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds. Vous êtes dans un état de relaxation profonde.");
      }, 360000);
      timeoutsRef.current.push(timeoutId11);
      
      // Séquence 12 : Chevilles (285s)
      const timeoutId12 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 12 (285s): Chevilles');
        await tryPremiumAudio('ankles', 
          "Vos chevilles se détendent. Sentez l'espace dans ces articulations.");
      }, 285000);
      timeoutsRef.current.push(timeoutId12);
      
      // Séquence 13 : Pieds complet (300s)
      const timeoutId13 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 13 (300s): Pieds complet');
        await tryPremiumAudio('feet', 
          "Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds.");
      }, 300000);
      timeoutsRef.current.push(timeoutId13);
      
      // Séquence 14 : Corps entier (360s)
      const timeoutId14 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 14 (360s): Corps entier');
        await tryPremiumAudio('wholebody', 
          "Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds.");
      }, 360000);
      timeoutsRef.current.push(timeoutId14);
      
      // Séquence 15 : Respiration (420s)
      const timeoutId15 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 15 (420s): Respiration');
        await tryPremiumAudio('breathing', 
          "Observez votre respiration, calme et régulière. Chaque inspiration vous apporte énergie et vitalité.");
      }, 420000);
      timeoutsRef.current.push(timeoutId15);
      
      // Séquence 16 : Conscience (480s)
      const timeoutId16 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 16 (480s): Conscience');
        await tryPremiumAudio('awareness', 
          "Prenez conscience de votre corps dans son ensemble, parfaitement détendu et en harmonie.");
      }, 480000);
      timeoutsRef.current.push(timeoutId16);
      
      // Séquence 17 : Présence (540s)
      const timeoutId17 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 17 (540s): Présence');
        await tryPremiumAudio('presence', 
          "Restez dans cet état de relaxation profonde, en pleine conscience de votre corps et de votre respiration.");
      }, 540000);
      timeoutsRef.current.push(timeoutId17);
      
      // Séquence 12 : Fin (570s)
      const timeoutId18 = setTimeout(async () => {
        console.log('🎯 Scan - Séquence 18 (570s): Fin');
        await tryPremiumAudio('completion', 
          "Progressivement, reprenez conscience de votre environnement. Bougez doucement vos doigts, vos orteils. Votre corps est maintenant complètement détendu et votre esprit apaisé.");
      }, 570000);
      timeoutsRef.current.push(timeoutId18);
      
      console.log('✅ TOUTES LES 18 SÉQUENCES SCAN CORPOREL PROGRAMMÉES');
      
    } else if (currentSession === 'meditation' && currentMeditation === 'gratitude') {
      console.log('🙏 DÉMARRAGE MÉDITATION GRATITUDE - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS GRATITUDE POUR: ${voiceName}`);
      
      // Séquence 1 : Installation (0s)
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 1 (0s): Installation');
        await tryPremiumAudio('gratitude-installation', 
          "Bienvenue dans cette méditation de gratitude. Installez-vous confortablement, le dos droit, les pieds bien ancrés au sol. Fermez doucement les yeux et prenez conscience de votre respiration naturelle.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Cohérence (30s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 2 (30s): Cohérence setup');
        await tryPremiumAudio('gratitude-coherence-setup', 
          "Commençons par établir un rythme respiratoire apaisant. Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Respiration cœur (60s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 3 (60s): Respiration cœur');
        await tryPremiumAudio('gratitude-breathing-heart', 
          "Portez maintenant votre attention sur votre cœur. Imaginez que vous respirez directement par le centre de votre poitrine.");
      }, 60000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Éveil gratitude (90s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 4 (90s): Éveil gratitude');
        await tryPremiumAudio('gratitude-awakening', 
          "Éveillez maintenant le sentiment de gratitude. Commencez simplement, par les choses les plus évidentes : l'air que vous respirez, la vie qui coule en vous.");
      }, 90000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Première gratitude (120s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 5 (120s): Première gratitude');
        await tryPremiumAudio('gratitude-first', 
          "Inspirez... et pensez à une chose pour laquelle vous êtes profondément reconnaissant aujourd'hui. Expirez... et laissez cette gratitude rayonner.");
      }, 120000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Êtres chers (150s)
      const timeoutId6 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 6 (150s): Êtres chers');
        await tryPremiumAudio('gratitude-loved-ones', 
          "Élargissez maintenant votre gratitude vers les personnes qui enrichissent votre vie. Visualisez le visage d'un être cher.");
      }, 150000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Corps (180s)
      const timeoutId7 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 7 (180s): Corps');
        await tryPremiumAudio('gratitude-body', 
          "Dirigez maintenant votre gratitude vers votre corps, ce véhicule extraordinaire qui vous permet de vivre chaque expérience.");
      }, 180000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Nature (210s)
      const timeoutId8 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 8 (210s): Nature');
        await tryPremiumAudio('gratitude-nature', 
          "Élargissez encore votre gratitude vers la nature et l'univers. Remerciez le soleil qui vous réchauffe, l'eau qui vous désaltère.");
      }, 210000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Ancrage (240s)
      const timeoutId9 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 9 (240s): Ancrage');
        await tryPremiumAudio('gratitude-anchoring', 
          "Ancrez maintenant cette énergie de gratitude dans chaque cellule de votre corps. La gratitude transforme ce que vous avez en suffisance.");
      }, 240000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Intégration (270s)
      const timeoutId10 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 10 (270s): Intégration');
        await tryPremiumAudio('gratitude-integration', 
          "Intégrez pleinement cette énergie de gratitude. Laissez-la rayonner à travers vous, transformant votre perception du monde.");
      }, 270000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Conclusion (285s)
      const timeoutId11 = setTimeout(async () => {
        console.log('🎯 Gratitude - Séquence 11 (285s): Conclusion');
        await tryPremiumAudio('gratitude-conclusion', 
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
        const success = await tryPremiumAudio('metatron', 
          "Bienvenue dans cette méditation d'invocation de l'archange Métatron. Installez-vous confortablement. Fermez les yeux et prenez quelques profondes respirations. Nous allons établir une connexion avec cet être de lumière, gardien des archives akashiques et porteur de la géométrie sacrée. Suivez le rythme respiratoire et ouvrez votre coeur à cette présence divine. Ô Metatron, ange de la Présence, scribe de Lumière, gardien du Trône Divin, toi qui as connu la chair et t'es élevé au-delà, je t'appelle avec humilité. Que ta présence sacrée se manifeste dans cet espace. Je t'invite à m'accompagner dans cette méditation, à m'envelopper de ton énergie céleste. Que ta lumière entoure mon esprit, que ta sagesse éclaire mon cœur, que ta voix me guide sur les chemins de vérité. Toi qui écris dans les Livres Célestes, inscris en moi la mémoire de mon âme. Aide-moi à me souvenir de qui je suis, au-delà des voiles de l'oubli et des peurs humaines. Toi qui transmets la pensée divine, fais descendre en moi l'inspiration claire, la parole juste, et le silence plein de sens. Entoure-moi de ton Cube sacré, géométrie vivante de la création, bouclier de lumière contre les ombres. Metatron, Archange de feu blanc, ouvre les portes de la haute conscience. Aide-moi à élever ma fréquence, à faire rayonner l'amour, et à servir ce qui est plus grand que moi. Je te rends grâce pour ta présence, ta guidance et ta protection. Amen. Doucement, prenez conscience de votre corps, de votre respiration. Quand vous êtes prêt, ouvrez les yeux en gardant cette connexion sacrée avec l'Archange Métatron.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      console.log('✅ MÉDITATION MÉTATRON PROGRAMMÉE');
        
    } else if (currentSession === 'meditation' && currentMeditation === 'abundance') {
      console.log('💰 DÉMARRAGE MÉDITATION ABONDANCE - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS ABONDANCE POUR: ${voiceName}`);
      
      // Séquence 1 : Introduction (0s)
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 1 (0s): Introduction');
        await tryPremiumAudio('abundance-introduction', 
          "Méditation de l'abondance et de l'attraction. Ouvrez-vous à la prospérité infinie de l'univers et alignez-vous avec vos désirs les plus profonds.");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Rythme (30s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 2 (30s): Rythme');
        await tryPremiumAudio('abundance-rhythm-start', 
          "Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Énergie (40s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 3 (40s): Énergie');
        await tryPremiumAudio('abundance-energy-breath', 
          "Inspirez... l'univers vous remplit d'énergie positive... Expirez... libérez toute tension...");
      }, 40000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Abondance (50s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 4 (50s): Abondance');
        await tryPremiumAudio('abundance-abundance-breath', 
          "Inspirez... accueillez l'abondance... Expirez... laissez partir les doutes...");
      }, 50000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Cohérence (60s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 5 (60s): Cohérence');
        await tryPremiumAudio('abundance-coherence', 
          "Votre cœur entre en cohérence, créant un champ magnétique puissant autour de vous.");
      }, 60000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Visualisation (65s)
      const timeoutId6 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 6 (65s): Visualisation');
        await tryPremiumAudio('abundance-visualize', 
          "Maintenant, tout en gardant ce rythme respiratoire, visualisez clairement ce que vous désirez manifester.");
      }, 65000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Réalisation (73s)
      const timeoutId7 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 7 (73s): Réalisation');
        await tryPremiumAudio('abundance-realization-breath', 
          "Inspirez... voyez votre désir comme déjà réalisé... Expirez... ressentez la gratitude...");
      }, 73000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Cellulaire (83s)
      const timeoutId8 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 8 (83s): Cellulaire');
        await tryPremiumAudio('abundance-cellular-breath', 
          "Inspirez... imprégnez chaque cellule de cette vision... Expirez... rayonnez cette énergie...");
      }, 83000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Amplification (93s)
      const timeoutId9 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 9 (93s): Amplification');
        await tryPremiumAudio('abundance-amplify', 
          "Votre cœur cohérent amplifie votre pouvoir de manifestation.");
      }, 93000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Mérite (98s)
      const timeoutId10 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 10 (98s): Mérite');
        await tryPremiumAudio('abundance-worthy-breath', 
          "Inspirez... Je suis digne de recevoir... Expirez... J'attire naturellement ce qui est bon pour moi...");
      }, 98000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Joie (108s)
      const timeoutId11 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 11 (108s): Joie');
        await tryPremiumAudio('abundance-joy-breath', 
          "Inspirez... sentez la joie de la réalisation... Expirez... ancrez cette certitude...");
      }, 108000);
      timeoutsRef.current.push(timeoutId11);
      
      // Séquence 12 : Univers (118s)
      const timeoutId12 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 12 (118s): Univers');
        await tryPremiumAudio('abundance-universe', 
          "L'univers conspire en votre faveur. Votre vibration attire ce qui lui correspond.");
      }, 118000);
      timeoutsRef.current.push(timeoutId12);
      
      // Séquence 13 : Co-création (125s)
      const timeoutId13 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 13 (125s): Co-création');
        await tryPremiumAudio('abundance-cocreate-breath', 
          "Inspirez... Je co-crée avec l'univers... Expirez... Tout se met en place parfaitement...");
      }, 125000);
      timeoutsRef.current.push(timeoutId13);
      
      // Séquence 14 : Gratitude (135s)
      const timeoutId14 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 14 (135s): Gratitude');
        await tryPremiumAudio('abundance-gratitude-breath', 
          "Inspirez... amplifiez le sentiment de gratitude... Expirez... diffusez votre lumière...");
      }, 135000);
      timeoutsRef.current.push(timeoutId14);
      
      // Séquence 15 : Cycle de manifestation (145s)
      const timeoutId15 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 15 (145s): Cycle de manifestation');
        await tryPremiumAudio('abundance-manifestation-cycle', 
          "Continuez ce rythme de respiration consciente. À chaque inspiration, vous attirez vos désirs. À chaque expiration, vous lâchez prise avec confiance. Votre cœur cohérent est un aimant puissant qui attire l'abondance sous toutes ses formes.");
      }, 145000);
      timeoutsRef.current.push(timeoutId15);
      
      // Séquence 16 : Ancrage (300s)
      const timeoutId16 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 16 (300s): Ancrage');
        await tryPremiumAudio('abundance-anchor', 
          "Continuez à respirer en cohérence cardiaque, sachant que votre désir est en route vers vous.");
      }, 300000);
      timeoutsRef.current.push(timeoutId16);
      
      // Séquence 17 : Alignement (318s)
      const timeoutId17 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 17 (318s): Alignement');
        await tryPremiumAudio('abundance-alignment', 
          "Inspirez... Je suis aligné avec mes désirs... Expirez... Je lâche prise avec confiance...");
      }, 318000);
      timeoutsRef.current.push(timeoutId17);
      
      // Séquence 18 : Boussole (328s)
      const timeoutId18 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 18 (328s): Boussole');
        await tryPremiumAudio('abundance-compass', 
          "Votre cœur cohérent est votre boussole vers l'abondance.");
      }, 328000);
      timeoutsRef.current.push(timeoutId18);
      
      // Séquence 19 : Completion (333s)
      const timeoutId19 = setTimeout(async () => {
        console.log('🎯 Abondance - Séquence 19 (333s): Completion');
        await tryPremiumAudio('abundance-completion', 
          "Doucement, prenez une respiration plus profonde. Remerciez-vous pour ce moment de connexion et de création. Quand vous êtes prêt, ouvrez les yeux, en gardant cette vibration élevée avec vous. La manifestation est en marche. Ayez confiance.");
      }, 333000);
      timeoutsRef.current.push(timeoutId19);
      
      console.log('✅ TOUTES LES SÉQUENCES ABONDANCE PROGRAMMÉES');
        
    } else {
      // Autres sessions avec synthèse vocale simple
      console.log('🎤 Session autre que SOS Stress, guidage simple');
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.", 1000);
    }
    
    return true;
  }, [currentSession, voiceSettings, speak, tryPremiumAudio]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts,
    tryPremiumAudio
  };
}