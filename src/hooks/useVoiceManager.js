import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { generateSpeech, checkElevenLabsService, checkElevenLabsQuota } from '../services/elevenLabsService';

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

  // TEXTES DE FALLBACK POUR RESET (4/7/8)
  const RESET_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans votre session RESET. Cette technique 4-7-8 va calmer votre système nerveux et préparer votre corps au repos profond. Installez-vous confortablement.",
    phase1: "Inspirez par le nez pendant 4 secondes. Remplissez vos poumons calmement.",
    phase2: "Cette respiration 4-7-8 active votre système nerveux parasympathique, celui du repos et de la récupération.",
    phase3: "Chaque cycle vous emmène plus profondément dans un état de calme. Votre rythme cardiaque ralentit naturellement.",
    completion: "Magnifique. Votre système nerveux est maintenant apaisé. Cette technique 4-7-8 peut être utilisée à tout moment pour retrouver instantanément le calme."
  };

  // TEXTES DE FALLBACK POUR PROGRESSIVE (3/3 → 4/4 → 5/5)
  const PROGRESSIVE_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans votre entraînement progressif. Nous allons évoluer ensemble du rythme 3/3 vers le 5/5 en trois étapes d'une minute chacune.",
    phase1: "Phase 1 : Rythme 3/3. Laissez votre corps s'habituer à cette respiration douce.",
    transition1: "Passage au rythme 4/4. Votre respiration s'approfondit naturellement.",
    phase2: "Phase 2 : Rythme 4/4. Respirez un peu plus profondément.",
    transition2: "Passage au rythme 5/5. Respirez profondément et calmement.",
    phase3: "Phase 3 : Rythme 5/5. Vous maîtrisez maintenant la respiration de cohérence cardiaque.",
    completion: "Excellent ! Vous avez progressé du rythme débutant 3/3 jusqu'au rythme de cohérence cardiaque 5/5. Votre capacité respiratoire s'améliore."
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
      console.log('🔊 Attente fin audio en cours avant synthèse vocale');
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            speakWithSystemVoice(text).then(resolve).catch(reject);
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
        // Forcer l'initialisation de la synthèse vocale
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.onvoiceschanged = () => {
            // Continuer une fois les voix chargées
            setupAndSpeakUtterance();
          };
          // Déclencher le chargement des voix
          speechSynthesis.getVoices();
        } else {
          setupAndSpeakUtterance();
        }
      }, 300);
      
      function setupAndSpeakUtterance() {
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
          console.error('❌ Erreur synthèse vocale:', event);
          reject(new Error('Erreur synthèse vocale'));
        };

        speechSynthesis.speak(utterance);
      }
    });
  };

  // Fonction pour parler avec ElevenLabs via Netlify Function
  const speakWithElevenLabs = async (text) => {
    if (isPlayingRef.current) {
      console.log('🔊 Attente fin audio en cours avant ElevenLabs - Texte:', text.substring(0, 30));
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            speakWithElevenLabs(text).then(resolve).catch(reject);
          }
        }, 100);
      });
    }

    return new Promise(async (resolve, reject) => {
      try {
        console.log(`🎤 ELEVENLABS: Génération audio pour "${text.substring(0, 30)}..." (${voiceSettings.gender})`);
        isPlayingRef.current = true;
        
        // Appeler le service ElevenLabs
        const result = await generateSpeech(text, voiceSettings.gender);
        
        if (!result.success) {
          console.error(`❌ ELEVENLABS ÉCHEC: ${result.error}`);
          isPlayingRef.current = false;
          // Fallback vers la synthèse vocale du navigateur
          console.log(`🔄 FALLBACK vers synthèse vocale système pour: "${text.substring(0, 30)}..."`);
          return speakWithSystemVoice(text).then(resolve).catch(reject);
        }
        
        // Créer un audio à partir des données base64
        const audio = new Audio(`data:${result.format};base64,${result.audio}`);
        currentAudioRef.current = audio;
        
        audio.volume = voiceSettings.volume;
        
        audio.onended = () => {
          console.log('✅ ELEVENLABS: Audio terminé');
          currentAudioRef.current = null;
          isPlayingRef.current = false;
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error('❌ ELEVENLABS: Erreur lecture audio', e);
          currentAudioRef.current = null;
          isPlayingRef.current = false;
          console.log(`🔄 FALLBACK après erreur de lecture pour: "${text.substring(0, 30)}..."`);
          // Fallback vers la synthèse vocale du navigateur
          speakWithSystemVoice(text).then(resolve).catch(reject);
        };
        
        // Jouer l'audio
        await audio.play();
        console.log('▶️ ELEVENLABS: Lecture démarrée');
        
        // Vérifier le quota restant après utilisation
        checkElevenLabsQuota().then(result => {
          if (result.success) {
            console.log(`📊 Quota ElevenLabs: ${result.quota.charactersUsed}/${result.quota.charactersLimit} caractères utilisés`);
          }
        });
        
      } catch (error) {
        console.error('❌ ELEVENLABS: Exception', error);
        isPlayingRef.current = false;
        console.log(`🔄 FALLBACK après exception pour: "${text.substring(0, 30)}..."`);
        // Fallback vers la synthèse vocale du navigateur
        speakWithSystemVoice(text).then(resolve).catch(reject);
      }
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

  // Fonction pour jouer un audio RESET avec fallback
  const playResetAudio = async (audioKey) => {
    try {
      // Essayer d'abord les fichiers premium (si vous les avez)
      const audioPath = `/audio/reset/${voiceSettings.gender}/${audioKey}.mp3`;
      console.log(`🎵 Tentative lecture RESET premium: ${audioPath}`);
      await playLocalAudio(audioPath);
      console.log(`✅ Audio RESET premium terminé: ${audioKey}`);
    } catch (error) {
      console.log(`🔄 Fallback synthèse RESET pour: ${audioKey} - Raison: ${error.message}`);
      const fallbackText = RESET_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ Fallback RESET réussi: ${audioKey}`);
        } catch (fallbackError) {
          console.log(`❌ Fallback RESET échoué: ${audioKey}`);
        }
      }
    }
  };

  // Fonction pour jouer un audio PROGRESSIVE avec fallback
  const playProgressiveAudio = async (audioKey) => {
    try {
      // Essayer d'abord les fichiers premium (si vous les avez)
      const audioPath = `/audio/progressive/${voiceSettings.gender}/${audioKey}.mp3`;
      console.log(`🎵 Tentative lecture PROGRESSIVE premium: ${audioPath}`);
      await playLocalAudio(audioPath);
      console.log(`✅ Audio PROGRESSIVE premium terminé: ${audioKey}`);
    } catch (error) {
      console.log(`🔄 Fallback synthèse PROGRESSIVE pour: ${audioKey} - Raison: ${error.message}`);
      const fallbackText = PROGRESSIVE_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ Fallback PROGRESSIVE réussi: ${audioKey}`);
        } catch (fallbackError) {
          console.log(`❌ Fallback PROGRESSIVE échoué: ${audioKey}`);
        }
      }
    }
  };

  // Fonction principale pour parler
  const speak = (text) => {
    if (!voiceSettings.enabled || !text.trim()) {
      console.log('🔇 Voix désactivée ou texte vide:', { enabled: voiceSettings.enabled, textLength: text?.length || 0 });
      return Promise.resolve();
    }

    // Forcer l'interaction utilisateur pour débloquer l'audio
    if (typeof document !== 'undefined') {
      const unlockAudio = () => {
        // Créer un contexte audio temporaire pour débloquer l'audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        gainNode.gain.value = 0; // Volume à zéro
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Jouer un son silencieux très court
        oscillator.start(0);
        oscillator.stop(0.001);
        
        // Nettoyer les écouteurs d'événements
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      };
      
      // Ajouter des écouteurs d'événements pour débloquer l'audio
      document.addEventListener('click', unlockAudio, { once: true });
      document.addEventListener('touchstart', unlockAudio, { once: true });
    }

    // Utiliser ElevenLabs si activé, sinon utiliser la synthèse vocale du navigateur
    if (voiceSettings.useElevenLabs) {
      console.log('🎤 Utilisation d\'ElevenLabs pour la synthèse vocale');
      // Vérifier d'abord si ElevenLabs est disponible
      return checkElevenLabsService().then(available => {
        if (available) {
          return speakWithElevenLabs(text);
        } else {
          console.log('🔄 ElevenLabs non disponible, fallback vers synthèse vocale système');
          return speakWithSystemVoice(text);
        }
      }).catch(error => {
        console.error('❌ Erreur lors de la vérification ElevenLabs:', error);
        return speakWithSystemVoice(text);
      });
      return speakWithElevenLabs(text);
    } else {
      console.log('🎤 Utilisation de la synthèse vocale du navigateur');
      return speakWithSystemVoice(text);
    }
  };

  // Système vocal SOS Stress (SWITCH) - SYSTÈME ORIGINAL RESTAURÉ
  const startSosGuidance = () => {
    console.log('🚨 DÉMARRAGE GUIDAGE SOS STRESS (SWITCH) - TIMING CORRIGÉ');
    
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
      { time: 85000, audioKey: 'completion' }
    ];

    console.log(`🎵 Programmation de ${sosTimings.length} séquences vocales SOS STRESS`);

    sosTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE SOS ${index + 1}/${sosTimings.length} - ${time/1000}s: ${audioKey}`);
        if (isSessionActive && currentSession === 'switch') {
          playSosAudio(audioKey);
        } else {
          console.log(`❌ Session non active ou changée: ${currentSession}`);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${sosTimings.length} timeouts programmés pour SOS STRESS`);
  };

  // Système vocal Scan Corporel - SYSTÈME ORIGINAL RESTAURÉ
  const startScanGuidance = () => {
    console.log('🧘 DÉMARRAGE GUIDAGE SCAN CORPOREL - TIMING CORRIGÉ');
    
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const scanTimings = [
      { time: 0, audioKey: 'welcome' },
      { time: 30000, audioKey: 'head' },
      { time: 60000, audioKey: 'face' },
      { time: 90000, audioKey: 'neck' },
      { time: 120000, audioKey: 'chest' },
      { time: 150000, audioKey: 'back' },
      { time: 180000, audioKey: 'abdomen' },
      { time: 210000, audioKey: 'hips' },
      { time: 240000, audioKey: 'thighs' },
      { time: 255000, audioKey: 'knees' },
      { time: 270000, audioKey: 'calves' },
      { time: 285000, audioKey: 'ankles' },
      { time: 300000, audioKey: 'feet' },
      { time: 360000, audioKey: 'wholebody' },
      { time: 420000, audioKey: 'breathing' },
      { time: 480000, audioKey: 'awareness' },
      { time: 540000, audioKey: 'presence' },
      { time: 570000, audioKey: 'completion' }
    ];

    console.log(`🎵 Programmation de ${scanTimings.length} séquences vocales SCAN CORPOREL`);

    scanTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE SCAN ${index + 1}/${scanTimings.length} - ${time/1000}s: ${audioKey}`);
        if (isSessionActive && currentSession === 'scan') {
          playScanAudio(audioKey);
        } else {
          console.log(`❌ Session non active ou changée: ${currentSession}`);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${scanTimings.length} timeouts programmés pour SCAN CORPOREL`);
  };

  // Système vocal RESET - CORRIGÉ
  const startResetGuidance = () => {
    console.log('🔄 DÉMARRAGE GUIDAGE RESET (4/7/8) - TIMING CORRIGÉ');
    
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const resetTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 15000, audioKey: 'phase1' },
      { time: 60000, audioKey: 'phase2' },
      { time: 120000, audioKey: 'phase3' },
      { time: 170000, audioKey: 'completion' }
    ];

    console.log(`🎵 Programmation de ${resetTimings.length} séquences vocales RESET`);

    resetTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE RESET ${index + 1}/${resetTimings.length} - ${time/1000}s: ${audioKey}`);
        if (isSessionActive && currentSession === 'reset') {
          playResetAudio(audioKey);
        } else {
          console.log(`❌ Session non active ou changée: ${currentSession}`);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${resetTimings.length} timeouts programmés pour RESET`);
  };

  // Système vocal PROGRESSIVE - CORRIGÉ
  const startProgressiveGuidance = () => {
    console.log('📈 DÉMARRAGE GUIDAGE PROGRESSIVE (3/3→4/4→5/5) - TIMING CORRIGÉ');
    
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

    console.log(`🎵 Programmation de ${progressiveTimings.length} séquences vocales PROGRESSIVE`);

    progressiveTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE PROGRESSIVE ${index + 1}/${progressiveTimings.length} - ${time/1000}s: ${audioKey}`);
        if (isSessionActive && currentSession === 'progressive') {
          playProgressiveAudio(audioKey);
        } else {
          console.log(`❌ Session non active ou changée: ${currentSession}`);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${progressiveTimings.length} timeouts programmés pour PROGRESSIVE`);
  };

  // Système vocal Méditation ABONDANCE & ATTRACTION - TIMING CORRIGÉ POUR 10 MINUTES
  const startAbundanceGuidance = () => {
    console.log('💰 DÉMARRAGE MÉDITATION ABONDANCE & ATTRACTION - 10 MINUTES - TIMING CORRIGÉ');
    console.log('🔍 État session au démarrage:', { isSessionActive, currentSession, currentMeditation });
    
    // Annuler tous les timeouts précédents
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // TIMINGS CORRIGÉS POUR 10 MINUTES (600 secondes)
    const abundanceTimings = [
      { time: 0, audioKey: 'introduction' },           // 0s - Introduction (30s)
      { time: 30000, audioKey: 'rhythmStart' },        // 30s - Rythme (10s)
      { time: 50000, audioKey: 'energyBreath' },       // 50s - Énergie (10s)
      { time: 70000, audioKey: 'abundanceBreath' },    // 70s - Abondance (10s)
      { time: 90000, audioKey: 'coherence' },          // 90s - Cohérence (5s)
      { time: 105000, audioKey: 'visualize' },         // 105s - Visualisation (8s)
      { time: 123000, audioKey: 'realizationBreath' }, // 123s - Réalisation (10s)
      { time: 143000, audioKey: 'cellularBreath' },    // 143s - Cellulaire (10s)
      { time: 163000, audioKey: 'amplify' },           // 163s - Amplification (5s)
      { time: 178000, audioKey: 'worthyBreath' },      // 178s - Mérite (10s)
      { time: 198000, audioKey: 'joyBreath' },         // 198s - Joie (10s)
      { time: 218000, audioKey: 'universe' },          // 218s - Univers (7s)
      { time: 235000, audioKey: 'cocreateBreath' },    // 235s - Co-création (10s)
      { time: 255000, audioKey: 'gratitudeBreath' },   // 255s - Gratitude (10s)
      { time: 275000, audioKey: 'manifestationCycle' }, // 275s - Cycle de manifestation (240s)
      { time: 515000, audioKey: 'anchor' },            // 515s - Ancrage (18s)
      { time: 543000, audioKey: 'alignment' },         // 543s - Alignement (10s)
      { time: 563000, audioKey: 'compass' },           // 563s - Boussole (5s)
      { time: 578000, audioKey: 'completion' }         // 578s - Fin (22s) = 600s total
    ];

    console.log(`🎵 Programmation de ${abundanceTimings.length} séquences vocales ABONDANCE & ATTRACTION - 10 MINUTES CORRIGÉ`);

    // Programmer chaque séquence audio avec vérification renforcée
    abundanceTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE ${index + 1}/${abundanceTimings.length} - ${time/1000}s: ${audioKey} - ABONDANCE & ATTRACTION`);
        console.log(`🔍 Vérification état session:`, { 
          isSessionActive, 
          currentSession, 
          currentMeditation,
          timeoutStillValid: scheduledTimeoutsRef.current.includes(timeout)
        });
        
        // VÉRIFICATION RENFORCÉE
        if (isSessionActive && currentSession === 'meditation' && currentMeditation === 'abundance') {
          console.log(`🎤 DÉCLENCHEMENT EFFECTIF ABONDANCE: ${audioKey}`);
          playMeditationAudio('abundance', audioKey);
        } else {
          console.log(`❌ DÉCLENCHEMENT ANNULÉ ABONDANCE:`, {
            isSessionActive,
            currentSession,
            currentMeditation,
            expected: { currentSession: 'meditation', currentMeditation: 'abundance' }
          });
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
      console.log(`⏰ Timeout ABONDANCE ${index + 1} programmé pour ${time/1000}s (${audioKey})`);
    });

    console.log(`✅ ${abundanceTimings.length} timeouts programmés pour ABONDANCE & ATTRACTION 10 MINUTES`);
    console.log(`📊 Timeouts stockés:`, scheduledTimeoutsRef.current.length);
  };

  // Système vocal Méditation GRATITUDE - 5 MINUTES - TIMING CORRIGÉ
  const startGratitudeGuidance = () => {
    console.log('🙏 DÉMARRAGE MÉDITATION GRATITUDE - 5 MINUTES - TIMING CORRIGÉ');
    console.log('🔍 État session au démarrage:', { isSessionActive, currentSession, currentMeditation });
    
    // Annuler tous les timeouts précédents
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // TIMINGS CORRIGÉS POUR 5 MINUTES (300 secondes)
    const gratitudeTimings = [
      { time: 0, audioKey: 'installation' },         // 0s - Installation (30s)
      { time: 30000, audioKey: 'coherenceSetup' },   // 30s - Cohérence (30s)
      { time: 60000, audioKey: 'breathingHeart' },   // 60s - Respiration cœur (30s)
      { time: 90000, audioKey: 'gratitudeAwakening' }, // 90s - Éveil gratitude (30s)
      { time: 120000, audioKey: 'firstGratitude' },  // 120s - Première gratitude (30s)
      { time: 150000, audioKey: 'lovedOnes' },       // 150s - Êtres chers (30s)
      { time: 180000, audioKey: 'bodyGratitude' },   // 180s - Corps (30s)
      { time: 210000, audioKey: 'natureExpansion' }, // 210s - Nature (30s)
      { time: 240000, audioKey: 'energyAnchoring' }, // 240s - Ancrage (30s)
      { time: 270000, audioKey: 'integration' },     // 270s - Intégration (15s)
      { time: 285000, audioKey: 'conclusion' }       // 285s - Conclusion (15s) = 300s total
    ];

    console.log(`🎵 Programmation de ${gratitudeTimings.length} séquences vocales GRATITUDE - 5 MINUTES CORRIGÉ`);

    // Programmer chaque séquence audio avec vérification renforcée
    gratitudeTimings.forEach(({ time, audioKey }, index) => {
      const timeout = setTimeout(() => {
        console.log(`🎤 SÉQUENCE ${index + 1}/${gratitudeTimings.length} - ${time/1000}s: ${audioKey} - GRATITUDE`);
        console.log(`🔍 Vérification état session:`, { 
          isSessionActive, 
          currentSession, 
          currentMeditation,
          timeoutStillValid: scheduledTimeoutsRef.current.includes(timeout)
        });
        
        // VÉRIFICATION RENFORCÉE
        if (isSessionActive && currentSession === 'meditation' && currentMeditation === 'gratitude') {
          console.log(`🎤 DÉCLENCHEMENT EFFECTIF GRATITUDE: ${audioKey}`);
          playMeditationAudio('gratitude', audioKey);
        } else {
          console.log(`❌ DÉCLENCHEMENT ANNULÉ GRATITUDE:`, {
            isSessionActive,
            currentSession,
            currentMeditation,
            expected: { currentSession: 'meditation', currentMeditation: 'gratitude' }
          });
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
      console.log(`⏰ Timeout GRATITUDE ${index + 1} programmé pour ${time/1000}s (${audioKey})`);
    });

    console.log(`✅ ${gratitudeTimings.length} timeouts programmés pour GRATITUDE 5 MINUTES`);
    console.log(`📊 Timeouts stockés:`, scheduledTimeoutsRef.current.length);
  };

  // Système vocal Méditations - SYSTÈME UNIFIÉ CORRIGÉ
  const startMeditationGuidance = () => {
    console.log('🧘 DÉMARRAGE MÉDITATION - Type:', currentMeditation);
    console.log('🔍 État session complet:', { isSessionActive, currentSession, currentMeditation });
    
    if (currentMeditation === 'abundance') {
      console.log('🎯 Lancement méditation ABONDANCE & ATTRACTION - 10 MINUTES');
      startAbundanceGuidance(); // VOS ENREGISTREMENTS - 10 MINUTES
    } else if (currentMeditation === 'gratitude') {
      console.log('🎯 Lancement méditation GRATITUDE - 5 MINUTES');
      startGratitudeGuidance(); // MÉDITATION GRATITUDE - 5 MINUTES
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

  // Système vocal unifié - CORRIGÉ AVEC TOUS LES MAPPINGS
  const startSessionGuidance = (coherenceSettings = null) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé');
      return;
    }

    console.log('🎯 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession, 'Méditation:', currentMeditation);
    console.log('🔍 État complet:', { isSessionActive, currentSession, currentMeditation, voiceSettings });

    switch (currentSession) {
      case 'switch':
        console.log('🎯 Démarrage guidage SOS Stress (SWITCH)');
        startSosGuidance(); // SYSTÈME ORIGINAL
        break;
      case 'scan':
        console.log('🎯 Démarrage guidage Scan Corporel');
        startScanGuidance(); // SYSTÈME ORIGINAL
        break;
      case 'reset':
        console.log('🎯 Démarrage guidage RESET');
        startResetGuidance(); // CORRIGÉ
        break;
      case 'progressive':
        console.log('🎯 Démarrage guidage PROGRESSIVE');
        startProgressiveGuidance(); // CORRIGÉ
        break;
      case 'kids':
        console.log('🎯 Démarrage guidage KIDS');
        speak("Salut petit champion ! On va faire de la respiration magique ensemble.");
        break;
      case 'seniors':
        console.log('🎯 Démarrage guidage SENIORS');
        speak("Bienvenue dans votre session de relaxation adaptée. Cette respiration douce va vous aider.");
        break;
      case 'meditation':
        console.log('🎯 Démarrage guidage MÉDITATION');
        startMeditationGuidance(); // SYSTÈME MÉDITATIONS UNIFIÉ CORRIGÉ
        break;
      case 'coherence':
        console.log('🎯 Démarrage guidage COHÉRENCE');
        speak("Session de cohérence cardiaque démarrée. Respirez calmement et suivez le guide visuel.");
        break;
      case 'free':
        console.log('🎯 Démarrage guidage SESSION LIBRE');
        speak("Session libre démarrée. Suivez votre rythme respiratoire personnalisé.");
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
      try {
        const voices = speechSynthesis.getVoices();
        console.log('🎤 Voix disponibles:', voices.length);
        
        // Rechercher les voix françaises
        const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
        console.log('🎤 Voix françaises:', frenchVoices.length);
        
        if (frenchVoices.length > 0) {
          console.log('🎤 Voix françaises disponibles:', frenchVoices.map(v => v.name).join(', '));
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des voix:', error);
      }
    };

    try {
      if (typeof speechSynthesis !== 'undefined') {
        if (speechSynthesis.getVoices().length === 0) {
          console.log('🎤 Attente du chargement des voix...');
          speechSynthesis.addEventListener('voiceschanged', initVoices);
        } else {
          initVoices();
        }
      } else {
        console.warn('⚠️ API Speech Synthesis non disponible dans ce navigateur');
      }
      
      // Vérifier si ElevenLabs est disponible
      if (voiceSettings.useElevenLabs) {
        checkElevenLabsService().then(available => {
          console.log(`🎤 ElevenLabs disponible: ${available ? 'Oui' : 'Non'}`);
          if (available) {
            checkElevenLabsQuota().then(result => {
              if (result.success) {
                console.log(`📊 Quota ElevenLabs: ${result.quota.charactersUsed}/${result.quota.charactersLimit} caractères utilisés`);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du gestionnaire vocal:', error);
    }

    return () => {
      stop();
      try {
        if (typeof speechSynthesis !== 'undefined') {
          speechSynthesis.removeEventListener('voiceschanged', initVoices);
        }
      } catch (error) {
        console.error('❌ Erreur lors du nettoyage du gestionnaire vocal:', error);
      }
    };
  }, [currentSession]);

  return {
    speak,
    stop,
    isProcessing: isPlayingRef.current,
    checkElevenLabsService,
    checkElevenLabsQuota,
    speakWithElevenLabs,
    startSessionGuidance,
    // Fonctions spécialisées pour SOS et SCAN
    playSosAudio,
    playScanAudio,
    getSosAudioPath,
    getScanAudioPath,
    // Fonctions spécialisées pour MÉDITATIONS
    playMeditationAudio,
    getMeditationAudioPath,
    startAbundanceGuidance, // VOS ENREGISTREMENTS - 10 MINUTES (maintenant Abondance & Attraction)
    startGratitudeGuidance, // MÉDITATION GRATITUDE - 5 MINUTES
    // Fonctions pour RESET et PROGRESSIVE
    playResetAudio,
    playProgressiveAudio,
    startResetGuidance,
    startProgressiveGuidance,
    // Mappings et textes
    SOS_AUDIO_FILES,
    SCAN_AUDIO_FILES,
    SOS_FALLBACK_TEXTS,
    SCAN_FALLBACK_TEXTS,
    // Mappings et textes MÉDITATIONS
    ABUNDANCE_AUDIO_FILES, // VOS ENREGISTREMENTS (maintenant Abondance & Attraction)
    GRATITUDE_AUDIO_FILES, // MÉDITATION GRATITUDE
    ABUNDANCE_FALLBACK_TEXTS,
    GRATITUDE_FALLBACK_TEXTS,
    // Mappings et textes RESET/PROGRESSIVE
    RESET_FALLBACK_TEXTS,
    PROGRESSIVE_FALLBACK_TEXTS,
  };
};