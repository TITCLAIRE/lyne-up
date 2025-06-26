import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, isSessionActive, currentMeditation } = useAppStore();
  const scheduledTimeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // SYSTÈME VOCAL POUR SOS STRESS (SWITCH) - CONSERVÉ EXACTEMENT
  const getSosAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/sos-stress/${gender}/${filename}.mp3`;
  };

  // SYSTÈME VOCAL POUR SCAN CORPOREL - CONSERVÉ EXACTEMENT
  const getScanAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/scan-corporel/${gender}/${filename}.mp3`;
  };

  // SYSTÈME VOCAL POUR MÉDITATIONS
  const getMeditationAudioPath = (meditationType, filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/meditation/${gender}/${filename}.mp3`;
  };

  // MAPPING EXACT DES FICHIERS SOS STRESS - NOMS RÉELS
  const SOS_AUDIO_FILES = {
    welcome: 'welcome',
    breatheCalm: 'breathe-calm',
    grounding: 'grounding',
    breatheSoftly: 'breathe-softly',
    breatheFresh: 'breathe-fresh',
    stressRelease: 'stress-release',
    breatheRelease: 'breathe-release',
    centerPeace: 'center-peace',
    completion: 'completion'
  };

  // MAPPING EXACT DES FICHIERS SCAN CORPOREL - NOMS RÉELS
  const SCAN_AUDIO_FILES = {
    welcome: 'welcome',
    head: 'head',
    face: 'face',
    neck: 'neck',
    chest: 'chest',
    back: 'back',
    abdomen: 'abdomen',
    hips: 'hips',
    thighs: 'thighs',
    knees: 'knees',
    calves: 'calves',
    ankles: 'ankles',
    feet: 'feet',
    wholebody: 'wholebody',
    breathing: 'breathing',
    awareness: 'awareness',
    presence: 'presence',
    completion: 'completion'
  };

  // MAPPING DES FICHIERS MÉDITATION ABONDANCE & ATTRACTION - VOS ENREGISTREMENTS
  const ABUNDANCE_AUDIO_FILES = {
    introduction: 'abundance-introduction',
    rhythmStart: 'abundance-rhythm-start',
    energyBreath: 'abundance-energy-breath',
    abundanceBreath: 'abundance-abundance-breath',
    coherence: 'abundance-coherence',
    visualize: 'abundance-visualize',
    realizationBreath: 'abundance-realization-breath',
    cellularBreath: 'abundance-cellular-breath',
    amplify: 'abundance-amplify',
    worthyBreath: 'abundance-worthy-breath',
    joyBreath: 'abundance-joy-breath',
    universe: 'abundance-universe',
    cocreateBreath: 'abundance-cocreate-breath',
    gratitudeBreath: 'abundance-gratitude-breath',
    manifestationCycle: 'abundance-manifestation-cycle',
    anchor: 'abundance-anchor',
    alignment: 'abundance-alignment',
    compass: 'abundance-compass',
    completion: 'abundance-completion'
  };

  // MAPPING DES FICHIERS MÉDITATION GRATITUDE
  const GRATITUDE_AUDIO_FILES = {
    installation: 'gratitude-installation',
    coherenceSetup: 'gratitude-coherence-setup',
    breathingHeart: 'gratitude-breathing-heart',
    gratitudeAwakening: 'gratitude-awakening',
    firstGratitude: 'gratitude-first',
    lovedOnes: 'gratitude-loved-ones',
    bodyGratitude: 'gratitude-body',
    natureExpansion: 'gratitude-nature',
    energyAnchoring: 'gratitude-anchoring',
    integration: 'gratitude-integration',
    conclusion: 'gratitude-conclusion'
  };

  // TEXTES DE FALLBACK SOS STRESS
  const SOS_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.",
    breatheCalm: "Inspirez le calme",
    grounding: "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.",
    breatheSoftly: "Soufflez doucement",
    breatheFresh: "Accueillez l'air frais",
    stressRelease: "Le stress s'évapore à chaque souffle. Votre corps se détend profondément.",
    breatheRelease: "Relâchez tout",
    centerPeace: "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.",
    completion: "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous."
  };

  // TEXTES DE FALLBACK SCAN CORPOREL
  const SCAN_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement.",
    head: "Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre.",
    face: "Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières.",
    neck: "Votre cou et vos épaules se relâchent maintenant.",
    chest: "Votre poitrine s'ouvre et se détend à chaque respiration.",
    back: "Votre dos se détend vertèbre par vertèbre, du haut vers le bas.",
    abdomen: "Votre ventre se gonfle et se dégonfle naturellement, sans effort.",
    hips: "Vos hanches et votre bassin se relâchent complètement.",
    thighs: "Vos cuisses se détendent profondément.",
    knees: "Vos genoux se détendent. Sentez l'espace dans vos articulations.",
    calves: "Vos mollets se relâchent entièrement.",
    ankles: "Vos chevilles se détendent.",
    feet: "Vos pieds sont maintenant complètement détendus et lourds.",
    wholebody: "Une vague de bien-être parcourt maintenant tout votre corps.",
    breathing: "Observez votre respiration, calme et régulière.",
    awareness: "Prenez conscience de votre corps dans son ensemble.",
    presence: "Restez dans cet état de relaxation profonde.",
    completion: "Progressivement, reprenez conscience de votre environnement."
  };

  // TEXTES DE FALLBACK MÉDITATION ABONDANCE & ATTRACTION - VOS ENREGISTREMENTS
  const ABUNDANCE_FALLBACK_TEXTS = {
    introduction: "Bienvenue dans cette méditation de l'abondance et de l'attraction. Installez-vous confortablement et ouvrez-vous à la prospérité infinie de l'univers tout en alignant vos vibrations avec vos désirs les plus profonds.",
    rhythmStart: "Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...",
    energyBreath: "Inspirez... l'énergie d'abondance et de manifestation vous remplit... Expirez... libérez toute limitation et résistance...",
    abundanceBreath: "Inspirez... accueillez la prospérité et vos désirs... Expirez... laissez partir la pénurie et les doutes...",
    coherence: "Votre cœur entre en cohérence avec la fréquence de l'abondance universelle et de la manifestation.",
    visualize: "Visualisez maintenant votre vie idéale d'abondance et vos désirs manifestés. Voyez-vous vivre dans la joie, la générosité et l'accomplissement.",
    realizationBreath: "Inspirez... voyez votre prospérité et vos désirs comme déjà réalisés... Expirez... ressentez la gratitude profonde...",
    cellularBreath: "Inspirez... imprégnez chaque cellule de cette abondance et de cette manifestation... Expirez... rayonnez cette richesse et cette réalisation...",
    amplify: "Votre cœur cohérent amplifie votre pouvoir d'attraction de l'abondance et de manifestation de vos désirs.",
    worthyBreath: "Inspirez... Je mérite l'abondance et mes désirs... Expirez... J'attire naturellement la prospérité et la manifestation...",
    joyBreath: "Inspirez... sentez la joie de l'abondance et de la réalisation... Expirez... ancrez cette richesse et cette manifestation...",
    universe: "L'univers est infiniment abondant et conspire en votre faveur. Votre vibration attire la prospérité et manifeste vos désirs sous toutes leurs formes.",
    cocreateBreath: "Inspirez... Je co-crée l'abondance et mes désirs avec l'univers... Expirez... Tout s'organise pour ma prospérité et ma manifestation...",
    gratitudeBreath: "Inspirez... amplifiez la gratitude pour vos richesses et vos réalisations... Expirez... diffusez cette abondance et cette joie...",
    manifestationCycle: "Continuez ce rythme de respiration consciente. À chaque inspiration, vous attirez l'abondance et vos désirs. À chaque expiration, vous lâchez prise avec confiance. Votre cœur cohérent est un aimant puissant qui attire la prospérité et manifeste vos rêves sous toutes leurs formes. Inspirez l'abondance... Expirez la gratitude... Inspirez vos désirs... Expirez la confiance... Vous êtes un canal d'abondance infinie et de manifestation parfaite. L'univers vous comble de ses bienfaits et exauce vos souhaits les plus chers. Chaque respiration vous connecte davantage à cette source inépuisable de prospérité et de réalisation.",
    anchor: "Continuez à respirer en cohérence cardiaque, sachant que l'abondance et vos désirs coulent vers vous. Inspirez... ancrez cette vibration de prospérité et de manifestation... Expirez... laissez-la imprégner votre être...",
    alignment: "Inspirez... Je suis aligné avec l'abondance et mes désirs... Expirez... Je lâche prise avec confiance...",
    compass: "Votre cœur cohérent est votre boussole vers la prospérité infinie et la manifestation parfaite.",
    completion: "Doucement, prenez une respiration plus profonde. Remerciez-vous pour ce moment de connexion à l'abondance et à la manifestation. Quand vous êtes prêt, ouvrez les yeux, en gardant cette vibration de prospérité et de réalisation avec vous. L'abondance et la manifestation sont en marche. Ayez confiance."
  };

  // TEXTES DE FALLBACK MÉDITATION GRATITUDE
  const GRATITUDE_FALLBACK_TEXTS = {
    installation: "Bienvenue dans cette méditation de gratitude. Installez-vous confortablement, le dos droit, les pieds bien ancrés au sol. Fermez doucement les yeux et prenez conscience de votre respiration naturelle. Pendant les prochaines minutes, vous allez cultiver la reconnaissance et ouvrir votre cœur à l'abondance qui vous entoure déjà.",
    coherenceSetup: "Commençons par établir un rythme respiratoire apaisant. Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes... Continuez ce rythme tranquille. À chaque inspiration, accueillez l'énergie de gratitude. À chaque expiration, diffusez cette reconnaissance.",
    breathingHeart: "Portez maintenant votre attention sur votre cœur. Imaginez que vous respirez directement par le centre de votre poitrine. À chaque inspiration, votre cœur s'emplit de lumière dorée. À chaque expiration, cette lumière s'étend dans tout votre corps. Sentez votre cœur s'ouvrir, s'adoucir, s'épanouir.",
    gratitudeAwakening: "Éveillez maintenant le sentiment de gratitude. Commencez simplement, par les choses les plus évidentes : l'air que vous respirez, la vie qui coule en vous, le confort de l'endroit où vous êtes. Ressentez la chaleur de la reconnaissance s'éveiller dans votre cœur. C'est une énergie douce et puissante à la fois.",
    firstGratitude: "Inspirez... et pensez à une chose pour laquelle vous êtes profondément reconnaissant aujourd'hui. Expirez... et laissez cette gratitude rayonner. Inspirez... accueillez pleinement ce sentiment de reconnaissance. Expirez... et sentez comme il nourrit votre être. La gratitude est une porte vers l'abondance.",
    lovedOnes: "Élargissez maintenant votre gratitude vers les personnes qui enrichissent votre vie. Visualisez le visage d'un être cher. Ressentez la reconnaissance pour sa présence dans votre existence. Envoyez-lui silencieusement votre gratitude. Remarquez comme ce sentiment approfondit votre connexion.",
    bodyGratitude: "Dirigez maintenant votre gratitude vers votre corps, ce véhicule extraordinaire qui vous permet de vivre chaque expérience. Remerciez votre cœur qui bat sans relâche, vos poumons qui vous donnent le souffle, vos sens qui vous permettent de goûter la richesse de la vie. Ressentez une profonde reconnaissance pour ce temple vivant.",
    natureExpansion: "Élargissez encore votre gratitude vers la nature et l'univers. Remerciez le soleil qui vous réchauffe, l'eau qui vous désaltère, la terre qui vous nourrit. Ressentez votre connexion avec toute forme de vie. Nous faisons tous partie d'un grand tout, et la gratitude renforce ce lien sacré.",
    energyAnchoring: "Ancrez maintenant cette énergie de gratitude dans chaque cellule de votre corps. À chaque inspiration, cette reconnaissance s'enracine plus profondément en vous. À chaque expiration, elle devient une partie intégrante de votre être. La gratitude transforme ce que vous avez en suffisance. Vous êtes comblé de bienfaits.",
    integration: "Intégrez pleinement cette énergie de gratitude. Laissez-la rayonner à travers vous, transformant votre perception du monde. Chaque jour est une opportunité de cultiver cette reconnaissance qui ouvre votre cœur à l'abondance.",
    conclusion: "Doucement, prenez une respiration plus profonde. Remerciez-vous pour ce moment de connexion. Quand vous êtes prêt, ouvrez les yeux, en gardant cette gratitude vivante en vous. Merci."
  };

  // Fonction générique pour obtenir le chemin audio d'une session (NOUVELLES SESSIONS)
  const getSessionAudioPath = (sessionId, filename) => {
    const gender = voiceSettings.gender;
    return `/audio/${sessionId}/${gender}/${filename}.mp3`;
  };

  // Mapping des fichiers audio pour les NOUVELLES sessions
  const SESSION_AUDIO_MAPPINGS = {
    // RESET (4/7/8)
    reset: {
      welcome: 'welcome',
      phase1: 'phase1',
      phase2: 'phase2',
      phase3: 'phase3',
      completion: 'completion'
    },
    
    // PROGRESSIVE (3/3 → 4/4 → 5/5)
    progressive: {
      welcome: 'welcome',
      phase1: 'phase1',
      transition1: 'transition1',
      phase2: 'phase2',
      transition2: 'transition2',
      phase3: 'phase3',
      completion: 'completion'
    },
    
    // KIDS
    kids: {
      welcome: 'welcome',
      breathe1: 'breathe1',
      breathe2: 'breathe2',
      breathe3: 'breathe3',
      completion: 'completion'
    },
    
    // SENIORS
    seniors: {
      welcome: 'welcome',
      relax1: 'relax1',
      relax2: 'relax2',
      relax3: 'relax3',
      completion: 'completion'
    },
    
    // COHÉRENCE CARDIAQUE
    coherence: {
      welcome: 'welcome',
      midSession: 'mid-session',
      finalMinute: 'final-minute',
      completion: 'completion'
    },
    
    // SESSION LIBRE
    free: {
      welcome: 'welcome',
      guidance: 'guidance',
      completion: 'completion'
    }
  };

  // Textes de fallback pour les NOUVELLES sessions
  const SESSION_FALLBACK_TEXTS = {
    // RESET
    reset: {
      welcome: "Bienvenue dans votre session RESET. Cette technique 4-7-8 va calmer votre système nerveux.",
      phase1: "Inspirez par le nez pendant 4 secondes. Remplissez vos poumons calmement.",
      phase2: "Retenez votre souffle pendant 7 secondes. Gardez l'air précieux en vous.",
      phase3: "Expirez lentement pendant 8 secondes. Relâchez tout par la bouche.",
      completion: "Magnifique. Votre système nerveux est maintenant apaisé."
    },
    
    // PROGRESSIVE
    progressive: {
      welcome: "Bienvenue dans votre entraînement progressif. Nous allons évoluer du rythme 3/3 vers le 5/5.",
      phase1: "Phase 1 : Rythme 3/3. Respirez doucement et naturellement.",
      transition1: "Passage au rythme 4/4. Respirez un peu plus profondément.",
      phase2: "Phase 2 : Rythme 4/4. Votre respiration s'approfondit naturellement.",
      transition2: "Passage au rythme 5/5. Respirez profondément et calmement.",
      phase3: "Phase 3 : Rythme 5/5. Vous maîtrisez maintenant la cohérence cardiaque.",
      completion: "Excellent ! Vous avez progressé du rythme débutant 3/3 jusqu'au rythme 5/5."
    },
    
    // KIDS
    kids: {
      welcome: "Salut petit champion ! On va faire de la respiration magique ensemble.",
      breathe1: "Inspire comme un ballon qui se gonfle. Respire l'air magique.",
      breathe2: "Imagine que tu es un arbre avec des racines. Tu es fort et stable !",
      breathe3: "Tu es un petit chat qui s'étire et qui se détend.",
      completion: "Super ! Tu as fait de la vraie magie avec ta respiration."
    },
    
    // SENIORS
    seniors: {
      welcome: "Bienvenue dans votre session de relaxation adaptée. Cette respiration douce va vous aider.",
      relax1: "Cette respiration 3/4 est parfaitement adaptée à votre rythme.",
      relax2: "Votre tension artérielle commence à diminuer. Votre cœur bat plus calmement.",
      relax3: "Vos muscles se relâchent progressivement. Vous vous sentez de plus en plus détendu.",
      completion: "Excellent ! Vous avez pris soin de votre bien-être."
    },
    
    // COHÉRENCE CARDIAQUE
    coherence: {
      welcome: "Session de cohérence cardiaque démarrée. Respirez calmement et suivez le guide visuel.",
      midSession: "Vous êtes dans un excellent rythme. Continuez à respirer calmement.",
      finalMinute: "Dernière minute de votre session. Maintenez ce rythme apaisant.",
      completion: "Session de cohérence cardiaque terminée. Vous avez créé un état d'harmonie intérieure."
    },
    
    // SESSION LIBRE
    free: {
      welcome: "Session libre démarrée. Suivez votre rythme respiratoire personnalisé.",
      guidance: "Vous contrôlez votre respiration. Maintenez ce rythme qui vous convient.",
      completion: "Session libre terminée. Vous avez maintenu votre rythme personnalisé avec succès."
    }
  };

  // Fonction pour jouer un fichier audio local avec retry
  const playLocalAudio = async (audioPath) => {
    if (isPlayingRef.current) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            playLocalAudio(audioPath).then(resolve);
          }
        }, 100);
      });
    }
    
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      audio.preload = 'auto';
      currentAudioRef.current = audio;
      isPlayingRef.current = true;

      const timeout = setTimeout(() => {
        isPlayingRef.current = false;
        reject(new Error(`Fichier audio non trouvé: ${audioPath}`));
      }, 5000);

      audio.oncanplaythrough = () => {
        clearTimeout(timeout);
      };

      audio.onended = () => {
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        resolve();
      };

      audio.onerror = (e) => {
        clearTimeout(timeout);
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        reject(new Error(`Erreur lecture fichier: ${audioPath}`));
      };

      audio.play().then(() => {
        clearTimeout(timeout);
      }).catch((playError) => {
        clearTimeout(timeout);
        isPlayingRef.current = false;
        reject(playError);
      });
    });
  };

  // Fonction pour synthèse vocale (fallback)
  const speakWithSystemVoice = (text) => {
    if (isPlayingRef.current) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            speakWithSystemVoice(text).then(resolve);
          }
        }, 100);
      });
    }

    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech Synthesis non supporté'));
        return;
      }

      speechSynthesis.cancel();
      isPlayingRef.current = true;
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.75;
        utterance.pitch = voiceSettings.gender === 'male' ? 0.85 : 1.1;
        utterance.volume = voiceSettings.volume;
        utterance.lang = 'fr-FR';

        const voices = speechSynthesis.getVoices();
        const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
        
        if (frenchVoices.length > 0) {
          const preferredVoices = voiceSettings.gender === 'female' 
            ? ['Claire', 'Amélie', 'Marie', 'Audrey', 'Google français', 'Samantha']
            : ['Thierry', 'Thomas', 'Nicolas', 'Google français', 'Alex'];
          
          let selectedVoice = null;
          for (const preferred of preferredVoices) {
            selectedVoice = frenchVoices.find(v => v.name.includes(preferred));
            if (selectedVoice) break;
          }
          
          utterance.voice = selectedVoice || frenchVoices[0];
        }

        utterance.onend = () => {
          isPlayingRef.current = false;
          resolve();
        };

        utterance.onerror = (event) => {
          isPlayingRef.current = false;
          resolve();
        };

        speechSynthesis.speak(utterance);
      }, 300);
    });
  };

  // Fonction pour jouer un audio SOS avec fallback - SYSTÈME ORIGINAL
  const playSosAudio = async (audioKey) => {
    try {
      const audioPath = getSosAudioPath(SOS_AUDIO_FILES[audioKey]);
      console.log(`🎵 Lecture audio SOS premium: ${audioPath}`);
      await playLocalAudio(audioPath);
      console.log(`✅ Audio SOS premium terminé: ${audioKey}`);
    } catch (error) {
      console.log(`🔄 Fallback synthèse SOS pour: ${audioKey} - Raison: ${error.message}`);
      const fallbackText = SOS_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ Fallback SOS réussi: ${audioKey}`);
        } catch (fallbackError) {
          console.log(`❌ Fallback SOS échoué: ${audioKey}`);
        }
      }
    }
  };

  // Fonction pour jouer un audio SCAN avec fallback - SYSTÈME ORIGINAL
  const playScanAudio = async (audioKey) => {
    try {
      const audioPath = getScanAudioPath(SCAN_AUDIO_FILES[audioKey]);
      console.log(`🎵 Lecture audio SCAN premium: ${audioPath}`);
      await playLocalAudio(audioPath);
      console.log(`✅ Audio SCAN premium terminé: ${audioKey}`);
    } catch (error) {
      console.log(`🔄 Fallback synthèse SCAN pour: ${audioKey} - Raison: ${error.message}`);
      const fallbackText = SCAN_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ Fallback SCAN réussi: ${audioKey}`);
        } catch (fallbackError) {
          console.log(`❌ Fallback SCAN échoué: ${audioKey}`);
        }
      }
    }
  };

  // Fonction pour jouer un audio MÉDITATION avec fallback - SYSTÈME UNIFIÉ
  const playMeditationAudio = async (meditationType, audioKey) => {
    try {
      let audioFiles, fallbackTexts;
      
      // SÉLECTION DES FICHIERS SELON LE TYPE DE MÉDITATION
      if (meditationType === 'abundance') {
        audioFiles = ABUNDANCE_AUDIO_FILES;
        fallbackTexts = ABUNDANCE_FALLBACK_TEXTS;
        console.log(`🎵 TENTATIVE LECTURE ABONDANCE & ATTRACTION: ${audioKey} - Fichier: ${audioFiles[audioKey]}`);
      } else if (meditationType === 'gratitude') {
        audioFiles = GRATITUDE_AUDIO_FILES;
        fallbackTexts = GRATITUDE_FALLBACK_TEXTS;
        console.log(`🎵 TENTATIVE LECTURE GRATITUDE: ${audioKey} - Fichier: ${audioFiles[audioKey]}`);
      } else {
        // Autres méditations - synthèse vocale par défaut
        console.log(`🗣️ Synthèse vocale méditation: ${audioKey} (${meditationType})`);
        throw new Error('Pas de fichiers enregistrés pour cette méditation');
      }

      const audioPath = getMeditationAudioPath(meditationType, audioFiles[audioKey]);
      console.log(`🎵 TENTATIVE LECTURE AUDIO LOCAL: ${audioPath}`);
      await playLocalAudio(audioPath);
      console.log(`✅ AUDIO MÉDITATION PREMIUM TERMINÉ: ${audioKey} (${meditationType})`);
    } catch (error) {
      console.log(`🔄 FALLBACK SYNTHÈSE MÉDITATION pour: ${audioKey} - Raison: ${error.message}`);
      
      // Sélectionner les bons textes de fallback
      let fallbackTexts;
      if (meditationType === 'abundance') {
        fallbackTexts = ABUNDANCE_FALLBACK_TEXTS;
      } else if (meditationType === 'gratitude') {
        fallbackTexts = GRATITUDE_FALLBACK_TEXTS;
      } else {
        // Texte générique pour autres méditations
        fallbackTexts = { [audioKey]: `Méditation ${meditationType} - ${audioKey}` };
      }
      
      const fallbackText = fallbackTexts[audioKey];
      if (fallbackText) {
        try {
          console.log(`🗣️ SYNTHÈSE VOCALE MÉDITATION: "${fallbackText.substring(0, 50)}..."`);
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ FALLBACK MÉDITATION RÉUSSI: ${audioKey} (${meditationType})`);
        } catch (fallbackError) {
          console.log(`❌ FALLBACK MÉDITATION ÉCHOUÉ: ${audioKey} (${meditationType})`);
        }
      }
    }
  };

  // Fonction générique pour jouer un audio avec fallback (NOUVELLES SESSIONS)
  const playSessionAudio = async (sessionId, audioKey) => {
    try {
      const mapping = SESSION_AUDIO_MAPPINGS[sessionId];
      if (!mapping || !mapping[audioKey]) {
        throw new Error(`Mapping non trouvé pour ${sessionId}.${audioKey}`);
      }

      const audioPath = getSessionAudioPath(sessionId, mapping[audioKey]);
      await playLocalAudio(audioPath);
    } catch (error) {
      const fallbackTexts = SESSION_FALLBACK_TEXTS[sessionId];
      if (fallbackTexts && fallbackTexts[audioKey]) {
        try {
          await speakWithSystemVoice(fallbackTexts[audioKey]);
        } catch (fallbackError) {
          // Silencieux
        }
      }
    }
  };

  // Fonction principale pour parler
  const speak = (text) => {
    if (!voiceSettings.enabled || !text.trim()) {
      return Promise.resolve();
    }

    return speakWithSystemVoice(text);
  };

  // Système vocal SOS Stress (SWITCH) - SYSTÈME ORIGINAL RESTAURÉ
  const startSosGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const sosTimings = [
      { time: 500, audioKey: 'welcome' },
      { time: 12000, audioKey: 'breatheCalm' },
      { time: 28000, audioKey: 'grounding' },
      { time: 37000, audioKey: 'breatheSoftly' },
      { time: 48000, audioKey: 'breatheFresh' },
      { time: 58000, audioKey: 'stressRelease' },
      { time: 67000, audioKey: 'breatheRelease' },
      { time: 78000, audioKey: 'centerPeace' },
      { time: 82000, audioKey: 'completion' }
    ];

    sosTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSosAudio(audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Scan Corporel - SYSTÈME ORIGINAL RESTAURÉ
  const startScanGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const scanTimings = [
      { time: 0, audioKey: 'welcome' },
      { time: 30, audioKey: 'head' },
      { time: 60, audioKey: 'face' },
      { time: 90, audioKey: 'neck' },
      { time: 120, audioKey: 'chest' },
      { time: 150, audioKey: 'back' },
      { time: 180, audioKey: 'abdomen' },
      { time: 210, audioKey: 'hips' },
      { time: 240, audioKey: 'thighs' },
      { time: 255, audioKey: 'knees' },
      { time: 270, audioKey: 'calves' },
      { time: 285, audioKey: 'ankles' },
      { time: 300, audioKey: 'feet' },
      { time: 360, audioKey: 'wholebody' },
      { time: 420, audioKey: 'breathing' },
      { time: 480, audioKey: 'awareness' },
      { time: 540, audioKey: 'presence' },
      { time: 570, audioKey: 'completion' }
    ];

    scanTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playScanAudio(audioKey);
        }
      }, time * 1000);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Méditation ABONDANCE & ATTRACTION - TIMING ADAPTÉ POUR 10 MINUTES
  const startAbundanceGuidance = () => {
    console.log('💰 DÉMARRAGE MÉDITATION ABONDANCE & ATTRACTION - 10 MINUTES avec pauses d\'assimilation');
    console.log('🔍 TEST DES FICHIERS AUDIO ABONDANCE & ATTRACTION...');
    console.log('🎯 Session active:', isSessionActive);
    console.log('🎯 Méditation actuelle:', currentMeditation);
    
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // TEST IMMÉDIAT DES FICHIERS AUDIO ABONDANCE & ATTRACTION
    const testFiles = async () => {
      console.log('🔍 VÉRIFICATION DES FICHIERS ABONDANCE & ATTRACTION:');
      for (const [key, filename] of Object.entries(ABUNDANCE_AUDIO_FILES)) {
        const audioPath = getMeditationAudioPath('abundance', filename);
        try {
          const response = await fetch(audioPath, { method: 'HEAD' });
          if (response.ok) {
            console.log(`✅ ${audioPath} (${response.status})`);
          } else {
            console.log(`❌ ${audioPath} (${response.status})`);
          }
        } catch (error) {
          console.log(`❌ ${audioPath} (erreur réseau)`);
        }
      }
    };

    // Lancer le test des fichiers
    testFiles();

    // NOUVEAUX TIMINGS POUR 10 MINUTES (600 secondes) avec pauses d'assimilation
    const abundanceTimings = [
      { time: 0, audioKey: 'introduction' },           // 0s - Introduction (30s)
      { time: 45000, audioKey: 'rhythmStart' },        // 45s - Pause 15s + rythme (10s)
      { time: 70000, audioKey: 'energyBreath' },       // 70s - Pause 15s + énergie (10s)
      { time: 95000, audioKey: 'abundanceBreath' },    // 95s - Pause 15s + abondance (10s)
      { time: 120000, audioKey: 'coherence' },         // 120s - Pause 15s + cohérence (5s)
      { time: 140000, audioKey: 'visualize' },         // 140s - Pause 15s + visualisation (8s)
      { time: 163000, audioKey: 'realizationBreath' }, // 163s - Pause 15s + réalisation (10s)
      { time: 188000, audioKey: 'cellularBreath' },    // 188s - Pause 15s + cellulaire (10s)
      { time: 213000, audioKey: 'amplify' },           // 213s - Pause 15s + amplification (5s)
      { time: 233000, audioKey: 'worthyBreath' },      // 233s - Pause 15s + mérite (10s)
      { time: 258000, audioKey: 'joyBreath' },         // 258s - Pause 15s + joie (10s)
      { time: 283000, audioKey: 'universe' },          // 283s - Pause 15s + univers (7s)
      { time: 305000, audioKey: 'cocreateBreath' },    // 305s - Pause 15s + co-création (10s)
      { time: 330000, audioKey: 'gratitudeBreath' },   // 330s - Pause 15s + gratitude (10s)
      { time: 355000, audioKey: 'manifestationCycle' }, // 355s - Cycle de manifestation (120s)
      { time: 490000, audioKey: 'anchor' },            // 490s - Ancrage (18s)
      { time: 523000, audioKey: 'alignment' },         // 523s - Pause 15s + alignement (10s)
      { time: 548000, audioKey: 'compass' },           // 548s - Pause 15s + boussole (5s)
      { time: 568000, audioKey: 'completion' }         // 568s - Pause 15s + fin (22s) = 590s total
    ];

    console.log(`🎵 Programmation de ${abundanceTimings.length} séquences vocales ABONDANCE & ATTRACTION - 10 MINUTES avec pauses d'assimilation`);

    abundanceTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE ${index + 1}/${abundanceTimings.length} - ${time/1000}s: ${audioKey} - ABONDANCE & ATTRACTION 10min`);
        console.log(`🔍 Session active au moment du déclenchement:`, isSessionActive);
        console.log(`🔍 Méditation actuelle au moment du déclenchement:`, currentMeditation);
        
        if (isSessionActive && currentMeditation === 'abundance') {
          console.log(`🎤 DÉCLENCHEMENT EFFECTIF: ${audioKey}`);
          playMeditationAudio('abundance', audioKey);
        } else {
          console.log(`❌ DÉCLENCHEMENT ANNULÉ: Session inactive ou méditation différente`);
          console.log(`   - isSessionActive: ${isSessionActive}`);
          console.log(`   - currentMeditation: ${currentMeditation}`);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
      console.log(`⏰ Timeout ${index + 1} programmé pour ${time/1000}s (${audioKey})`);
    });

    console.log(`✅ ${abundanceTimings.length} timeouts programmés pour la méditation ABONDANCE & ATTRACTION 10 MINUTES avec pauses d'assimilation`);
    console.log(`📊 Timeouts stockés:`, scheduledTimeoutsRef.current.length);
  };

  // Système vocal Méditation GRATITUDE - 5 MINUTES
  const startGratitudeGuidance = () => {
    console.log('🙏 DÉMARRAGE MÉDITATION GRATITUDE - 5 MINUTES');
    console.log('🔍 TEST DES FICHIERS AUDIO GRATITUDE...');
    console.log('🎯 Session active:', isSessionActive);
    console.log('🎯 Méditation actuelle:', currentMeditation);
    
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // TEST IMMÉDIAT DES FICHIERS AUDIO GRATITUDE
    const testFiles = async () => {
      console.log('🔍 VÉRIFICATION DES FICHIERS GRATITUDE:');
      for (const [key, filename] of Object.entries(GRATITUDE_AUDIO_FILES)) {
        const audioPath = getMeditationAudioPath('gratitude', filename);
        try {
          const response = await fetch(audioPath, { method: 'HEAD' });
          if (response.ok) {
            console.log(`✅ ${audioPath} (${response.status})`);
          } else {
            console.log(`❌ ${audioPath} (${response.status})`);
          }
        } catch (error) {
          console.log(`❌ ${audioPath} (erreur réseau)`);
        }
      }
    };

    // Lancer le test des fichiers
    testFiles();

    // TIMINGS POUR 5 MINUTES (300 secondes)
    const gratitudeTimings = [
      { time: 0, audioKey: 'installation' },         // 0s - Installation - premier paragraphe
      { time: 30000, audioKey: 'coherenceSetup' },   // 30s - Mise en place cohérence cardiaque
      { time: 60000, audioKey: 'breathingHeart' },   // 60s - Approfondissement respiration cœur
      { time: 90000, audioKey: 'gratitudeAwakening' }, // 90s - Éveil gratitude simple
      { time: 120000, audioKey: 'firstGratitude' },  // 120s - Respiration avec première gratitude
      { time: 150000, audioKey: 'lovedOnes' },       // 150s - Expansion vers personne chère
      { time: 180000, audioKey: 'bodyGratitude' },   // 180s - Gratitude pour le corps
      { time: 210000, audioKey: 'natureExpansion' }, // 210s - Élargissement nature/univers
      { time: 240000, audioKey: 'energyAnchoring' }, // 240s - Ancrage de l'énergie
      { time: 270000, audioKey: 'integration' },     // 270s - Intégration et rayonnement
      { time: 285000, audioKey: 'conclusion' }       // 285s - Conclusion et retour
    ];

    console.log(`🎵 Programmation de ${gratitudeTimings.length} séquences vocales GRATITUDE - 5 MINUTES`);

    gratitudeTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE ${index + 1}/${gratitudeTimings.length} - ${time/1000}s: ${audioKey} - GRATITUDE 5min`);
        console.log(`🔍 Session active au moment du déclenchement:`, isSessionActive);
        console.log(`🔍 Méditation actuelle au moment du déclenchement:`, currentMeditation);
        
        if (isSessionActive && currentMeditation === 'gratitude') {
          console.log(`🎤 DÉCLENCHEMENT EFFECTIF: ${audioKey}`);
          playMeditationAudio('gratitude', audioKey);
        } else {
          console.log(`❌ DÉCLENCHEMENT ANNULÉ: Session inactive ou méditation différente`);
          console.log(`   - isSessionActive: ${isSessionActive}`);
          console.log(`   - currentMeditation: ${currentMeditation}`);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
      console.log(`⏰ Timeout ${index + 1} programmé pour ${time/1000}s (${audioKey})`);
    });

    console.log(`✅ ${gratitudeTimings.length} timeouts programmés pour la méditation GRATITUDE 5 MINUTES`);
    console.log(`📊 Timeouts stockés:`, scheduledTimeoutsRef.current.length);
  };

  // Système vocal RESET
  const startResetGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const resetTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 15000, audioKey: 'phase1' },
      { time: 45000, audioKey: 'phase2' },
      { time: 90000, audioKey: 'phase3' },
      { time: 170000, audioKey: 'completion' }
    ];

    resetTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('reset', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal PROGRESSIVE
  const startProgressiveGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const progressiveTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 5000, audioKey: 'phase1' },
      { time: 58000, audioKey: 'transition1' },
      { time: 62000, audioKey: 'phase2' },
      { time: 118000, audioKey: 'transition2' },
      { time: 122000, audioKey: 'phase3' },
      { time: 175000, audioKey: 'completion' }
    ];

    progressiveTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('progressive', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal KIDS
  const startKidsGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const kidsTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 15000, audioKey: 'breathe1' },
      { time: 45000, audioKey: 'breathe2' },
      { time: 75000, audioKey: 'breathe3' },
      { time: 115000, audioKey: 'completion' }
    ];

    kidsTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('kids', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal SENIORS
  const startSeniorsGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const seniorsTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 30000, audioKey: 'relax1' },
      { time: 120000, audioKey: 'relax2' },
      { time: 210000, audioKey: 'relax3' },
      { time: 290000, audioKey: 'completion' }
    ];

    seniorsTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('seniors', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Méditations - SYSTÈME UNIFIÉ
  const startMeditationGuidance = () => {
    console.log('🧘 DÉMARRAGE MÉDITATION - Type:', currentMeditation);
    console.log('🔍 État session:', { isSessionActive, currentSession, currentMeditation });
    
    if (currentMeditation === 'abundance') {
      console.log('🎯 Lancement méditation ABONDANCE & ATTRACTION');
      startAbundanceGuidance(); // VOS ENREGISTREMENTS - 10 MINUTES
    } else if (currentMeditation === 'gratitude') {
      console.log('🎯 Lancement méditation GRATITUDE');
      startGratitudeGuidance(); // NOUVELLE MÉDITATION - 5 MINUTES
    } else {
      console.log('🎯 Lancement méditation générique pour:', currentMeditation);
      // Pour les autres méditations, utiliser un système générique
      scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      scheduledTimeoutsRef.current = [];

      const genericMeditationTimings = [
        { time: 1000, text: "Bienvenue dans cette méditation. Installez-vous confortablement." },
        { time: 60000, text: "Laissez votre respiration vous guider vers un état de paix intérieure." },
        { time: 180000, text: "Accueillez les sensations de détente qui se répandent dans votre corps." },
        { time: 240000, text: "Savourez ce moment de connexion avec vous-même." },
        { time: 290000, text: "Votre méditation se termine. Gardez cette sérénité avec vous." }
      ];

      genericMeditationTimings.forEach(({ time, text }) => {
        const timeout = setTimeout(() => {
          if (isSessionActive && currentSession === 'meditation') {
            speak(text);
          }
        }, time);
        
        scheduledTimeoutsRef.current.push(timeout);
      });
    }
  };

  // Système vocal Cohérence Cardiaque
  const startCoherenceGuidance = (coherenceSettings) => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    if (!voiceSettings.enabled || coherenceSettings.silentMode) {
      return;
    }

    const durationMs = coherenceSettings.duration * 60 * 1000;
    const midSessionTime = Math.floor(durationMs * 0.4);
    const finalMinuteTime = durationMs - 60000;

    const coherenceTimings = [
      { time: 2000, audioKey: 'welcome' },
      { time: midSessionTime, audioKey: 'midSession' },
      { time: finalMinuteTime, audioKey: 'finalMinute' }
    ];

    if (coherenceSettings.duration >= 2) {
      coherenceTimings.push({ 
        time: durationMs - 5000, 
        audioKey: 'completion'
      });
    }

    coherenceTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('coherence', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Session Libre
  const startFreeSessionGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const freeTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 60000, audioKey: 'guidance' },
      { time: 290000, audioKey: 'completion' }
    ];

    freeTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('free', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal unifié
  const startSessionGuidance = (coherenceSettings = null) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé');
      return;
    }

    console.log('🎯 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession, 'Méditation:', currentMeditation);
    console.log('🔍 État complet:', { isSessionActive, currentSession, currentMeditation, voiceSettings });

    switch (currentSession) {
      case 'switch':
        console.log('🎯 Démarrage guidage SOS Stress');
        startSosGuidance(); // SYSTÈME ORIGINAL
        break;
      case 'scan':
        console.log('🎯 Démarrage guidage Scan Corporel');
        startScanGuidance(); // SYSTÈME ORIGINAL
        break;
      case 'reset':
        console.log('🎯 Démarrage guidage RESET');
        startResetGuidance();
        break;
      case 'progressive':
        console.log('🎯 Démarrage guidage PROGRESSIVE');
        startProgressiveGuidance();
        break;
      case 'kids':
        console.log('🎯 Démarrage guidage KIDS');
        startKidsGuidance();
        break;
      case 'seniors':
        console.log('🎯 Démarrage guidage SENIORS');
        startSeniorsGuidance();
        break;
      case 'meditation':
        console.log('🎯 Démarrage guidage MÉDITATION');
        startMeditationGuidance(); // SYSTÈME MÉDITATIONS UNIFIÉ
        break;
      case 'coherence':
        console.log('🎯 Démarrage guidage COHÉRENCE');
        if (coherenceSettings) {
          startCoherenceGuidance(coherenceSettings);
        }
        break;
      case 'free':
        console.log('🎯 Démarrage guidage SESSION LIBRE');
        startFreeSessionGuidance();
        break;
      default:
        console.log('🎯 Session non reconnue, guidage générique');
        speak("Session démarrée. Suivez le guide respiratoire.");
        break;
    }
  };

  // Arrêter tout
  const stop = () => {
    console.log('🔇 ARRÊT COMPLET DU SYSTÈME VOCAL');
    console.log('📊 Timeouts à annuler:', scheduledTimeoutsRef.current.length);
    
    scheduledTimeoutsRef.current.forEach((timeout, index) => {
      console.log(`❌ Annulation timeout ${index + 1}`);
      clearTimeout(timeout);
    });
    scheduledTimeoutsRef.current = [];
    
    if (currentAudioRef.current) {
      console.log('🔇 Arrêt audio en cours');
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    isPlayingRef.current = false;
    
    try {
      speechSynthesis.cancel();
      console.log('🔇 Synthèse vocale annulée');
    } catch (error) {
      // Silencieux
    }
  };

  // Initialisation
  useEffect(() => {
    const initVoices = () => {
      const voices = speechSynthesis.getVoices();
      
      const claire = voices.find(v => v.name.includes('Claire'));
      const thierry = voices.find(v => v.name.includes('Thierry'));
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', initVoices);
    } else {
      initVoices();
    }

    return () => {
      stop();
      speechSynthesis.removeEventListener('voiceschanged', initVoices);
    };
  }, [currentSession]);

  return {
    speak,
    stop,
    isProcessing: isPlayingRef.current,
    startSessionGuidance,
    startCoherenceGuidance,
    // Fonctions spécialisées pour SOS et SCAN
    playSosAudio,
    playScanAudio,
    getSosAudioPath,
    getScanAudioPath,
    // Fonctions spécialisées pour MÉDITATIONS
    playMeditationAudio,
    getMeditationAudioPath,
    startAbundanceGuidance, // VOS ENREGISTREMENTS - 10 MINUTES (maintenant Abondance & Attraction)
    startGratitudeGuidance, // NOUVELLE MÉDITATION - 5 MINUTES
    // Fonctions génériques pour nouvelles sessions
    playSessionAudio,
    getSessionAudioPath,
    // Mappings et textes
    SOS_AUDIO_FILES,
    SCAN_AUDIO_FILES,
    SOS_FALLBACK_TEXTS,
    SCAN_FALLBACK_TEXTS,
    // Mappings et textes MÉDITATIONS
    ABUNDANCE_AUDIO_FILES, // VOS ENREGISTREMENTS (maintenant Abondance & Attraction)
    GRATITUDE_AUDIO_FILES, // NOUVELLE MÉDITATION GRATITUDE
    ABUNDANCE_FALLBACK_TEXTS,
    GRATITUDE_FALLBACK_TEXTS,
    SESSION_AUDIO_MAPPINGS,
    SESSION_FALLBACK_TEXTS,
  };
};