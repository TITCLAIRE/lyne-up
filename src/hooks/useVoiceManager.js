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

  // NOUVEAU : SYSTÈME VOCAL POUR MÉDITATIONS
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

  // NOUVEAU : MAPPING DES FICHIERS MÉDITATION LOI D'ATTRACTION
  const ATTRACTION_AUDIO_FILES = {
    welcome: 'attraction-welcome',
    install: 'attraction-install',
    awareness: 'attraction-awareness',
    harmonize: 'attraction-harmonize',
    rhythmStart: 'attraction-rhythm-start',
    inhaleDeep: 'attraction-inhale-deep',
    exhaleGentle: 'attraction-exhale-gentle',
    inhaleEnergy: 'attraction-inhale-energy',
    exhaleTension: 'attraction-exhale-tension',
    inhaleAbundance: 'attraction-inhale-abundance',
    exhaleDoubts: 'attraction-exhale-doubts',
    coherence: 'attraction-coherence',
    visualize: 'attraction-visualize',
    inhaleRealized: 'attraction-inhale-realized',
    exhaleGratitude: 'attraction-exhale-gratitude',
    inhaleCells: 'attraction-inhale-cells',
    exhaleRadiate: 'attraction-exhale-radiate',
    amplify: 'attraction-amplify',
    inhaleWorthy: 'attraction-inhale-worthy',
    exhaleAttract: 'attraction-exhale-attract',
    inhaleJoy: 'attraction-inhale-joy',
    exhaleAnchor: 'attraction-exhale-anchor',
    universe: 'attraction-universe',
    inhaleCocreate: 'attraction-inhale-cocreate',
    exhalePerfect: 'attraction-exhale-perfect',
    inhaleAmplify: 'attraction-inhale-amplify',
    exhaleLight: 'attraction-exhale-light',
    inhaleClarity: 'attraction-inhale-clarity',
    exhaleRelease: 'attraction-exhale-release',
    inhaleDeserve: 'attraction-inhale-deserve',
    exhaleGrateful: 'attraction-exhale-grateful',
    inhaleRadiate: 'attraction-inhale-radiate',
    exhaleDesires: 'attraction-exhale-desires',
    inhaleAligned: 'attraction-inhale-aligned',
    exhalePossible: 'attraction-exhale-possible',
    inhalePeace: 'attraction-inhale-peace',
    exhaleManifest: 'attraction-exhale-manifest',
    inhaleFlows: 'attraction-inhale-flows',
    exhaleHarmony: 'attraction-exhale-harmony',
    inhaleVibration: 'attraction-inhale-vibration',
    exhaleThank: 'attraction-exhale-thank',
    inhaleMagnet: 'attraction-inhale-magnet',
    exhaleInfinite: 'attraction-exhale-infinite',
    inhaleAbundance2: 'attraction-inhale-abundance',
    exhaleDreams: 'attraction-exhale-dreams',
    inhaleSource: 'attraction-inhale-source',
    exhaleEasily: 'attraction-exhale-easily',
    inhaleOpen: 'attraction-inhale-open',
    exhaleLove: 'attraction-exhale-love',
    inhaleSupport: 'attraction-inhale-support',
    exhalePeace2: 'attraction-exhale-peace2',
    inhaleGranted: 'attraction-inhale-granted',
    exhaleTrust: 'attraction-exhale-trust',
    inhaleHears: 'attraction-inhale-hears',
    exhaleGrateful2: 'attraction-exhale-grateful2',
    inhaleProgress: 'attraction-inhale-progress',
    exhaleLetgo: 'attraction-exhale-letgo',
    continue: 'attraction-continue',
    inhaleAnchor2: 'attraction-inhale-anchor2',
    exhaleImpregnate: 'attraction-exhale-impregnate',
    inhaleAligned2: 'attraction-inhale-aligned2',
    exhaleConfidence: 'attraction-exhale-confidence',
    inhalePath: 'attraction-inhale-path',
    exhaleTrust2: 'attraction-exhale-trust2',
    inhaleNature: 'attraction-inhale-nature',
    exhalePeace3: 'attraction-exhale-peace3',
    inhaleAttracts: 'attraction-inhale-attracts',
    exhaleJoy: 'attraction-exhale-joy',
    inhaleCreator: 'attraction-inhale-creator',
    exhaleIntentions: 'attraction-exhale-intentions',
    inhaleResponds: 'attraction-inhale-responds',
    exhalePerfect2: 'attraction-exhale-perfect2',
    compass: 'attraction-compass',
    deeper: 'attraction-deeper',
    thankSelf: 'attraction-thank-self',
    openEyes: 'attraction-open-eyes',
    completion: 'attraction-completion'
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

  // NOUVEAU : TEXTES DE FALLBACK MÉDITATION LOI D'ATTRACTION
  const ATTRACTION_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans cette méditation de cohérence cardiaque intégrative sur la loi de l'attraction.",
    install: "Installez-vous confortablement, le dos droit, les pieds bien ancrés au sol.",
    awareness: "Fermez doucement les yeux et prenez conscience de votre respiration naturelle.",
    harmonize: "Durant les prochaines minutes, vous allez harmoniser votre cœur, votre corps et votre esprit pour manifester vos désirs les plus profonds.",
    rhythmStart: "Commençons par établir le rythme de la cohérence cardiaque.",
    inhaleDeep: "Inspirez profondément par le nez pendant 5 secondes...",
    exhaleGentle: "Expirez doucement par la bouche pendant 5 secondes...",
    inhaleEnergy: "Inspirez... l'univers vous remplit d'énergie positive...",
    exhaleTension: "Expirez... libérez toute tension...",
    inhaleAbundance: "Inspirez... accueillez l'abondance...",
    exhaleDoubts: "Expirez... laissez partir les doutes...",
    coherence: "Votre cœur entre en cohérence, créant un champ magnétique puissant autour de vous.",
    visualize: "Maintenant, tout en gardant ce rythme respiratoire, visualisez clairement ce que vous désirez manifester.",
    inhaleRealized: "Inspirez... voyez votre désir comme déjà réalisé...",
    exhaleGratitude: "Expirez... ressentez la gratitude...",
    inhaleCells: "Inspirez... imprégnez chaque cellule de cette vision...",
    exhaleRadiate: "Expirez... rayonnez cette énergie...",
    amplify: "Votre cœur cohérent amplifie votre pouvoir de manifestation.",
    inhaleWorthy: "Inspirez... Je suis digne de recevoir...",
    exhaleAttract: "Expirez... J'attire naturellement ce qui est bon pour moi...",
    inhaleJoy: "Inspirez... sentez la joie de la réalisation...",
    exhaleAnchor: "Expirez... ancrez cette certitude...",
    universe: "L'univers conspire en votre faveur. Votre vibration attire ce qui lui correspond.",
    inhaleCocreate: "Inspirez... Je co-crée avec l'univers...",
    exhalePerfect: "Expirez... Tout se met en place parfaitement...",
    inhaleAmplify: "Inspirez... amplifiez le sentiment de gratitude...",
    exhaleLight: "Expirez... diffusez votre lumière...",
    inhaleClarity: "Inspirez... voyez votre désir avec clarté...",
    exhaleRelease: "Expirez... lâchez prise avec confiance...",
    inhaleDeserve: "Inspirez... Je mérite l'abondance...",
    exhaleGrateful: "Expirez... Je suis reconnaissant...",
    inhaleRadiate: "Inspirez... Mon cœur rayonne...",
    exhaleDesires: "Expirez... J'attire mes désirs...",
    inhaleAligned: "Inspirez... Je suis aligné avec l'univers...",
    exhalePossible: "Expirez... Tout est possible...",
    inhalePeace: "Inspirez... Je ressens la paix...",
    exhaleManifest: "Expirez... Je manifeste avec joie...",
    inhaleFlows: "Inspirez... L'abondance coule vers moi...",
    exhaleHarmony: "Expirez... Je suis en harmonie...",
    inhaleVibration: "Inspirez... Ma vibration s'élève...",
    exhaleThank: "Expirez... Je remercie l'univers...",
    inhaleMagnet: "Inspirez... Je suis un aimant à miracles...",
    exhaleInfinite: "Expirez... Ma gratitude est infinie...",
    inhaleAbundance2: "Inspirez... Je vis dans l'abondance...",
    exhaleDreams: "Expirez... Mes rêves se réalisent...",
    inhaleSource: "Inspirez... Je suis connecté à la source...",
    exhaleEasily: "Expirez... Tout vient à moi facilement...",
    inhaleOpen: "Inspirez... Mon cœur est ouvert...",
    exhaleLove: "Expirez... Je rayonne l'amour...",
    inhaleSupport: "Inspirez... La vie me soutient...",
    exhalePeace2: "Expirez... Je suis en paix...",
    inhaleGranted: "Inspirez... Mes désirs sont exaucés...",
    exhaleTrust: "Expirez... Je fais confiance au processus...",
    inhaleHears: "Inspirez... L'univers m'entend...",
    exhaleGrateful2: "Expirez... Je suis reconnaissant...",
    inhaleProgress: "Inspirez... Ma manifestation est en cours...",
    exhaleLetgo: "Expirez... Je lâche prise...",
    continue: "Continuez à respirer en cohérence cardiaque, sachant que votre désir est en route vers vous.",
    inhaleAnchor2: "Inspirez... ancrez cette vibration élevée...",
    exhaleImpregnate: "Expirez... laissez-la imprégner votre être...",
    inhaleAligned2: "Inspirez... Je suis aligné avec mes désirs...",
    exhaleConfidence: "Expirez... Je lâche prise avec confiance...",
    inhalePath: "Inspirez... Mon cœur connaît le chemin...",
    exhaleTrust2: "Expirez... Je fais confiance à la vie...",
    inhaleNature: "Inspirez... L'abondance est ma nature...",
    exhalePeace3: "Expirez... Je suis en paix...",
    inhaleAttracts: "Inspirez... Ma gratitude attire plus de bienfaits...",
    exhaleJoy: "Expirez... Je rayonne la joie...",
    inhaleCreator: "Inspirez... Je suis un créateur puissant...",
    exhaleIntentions: "Expirez... Mes intentions se manifestent...",
    inhaleResponds: "Inspirez... La vie répond à ma vibration...",
    exhalePerfect2: "Expirez... Je suis en harmonie parfaite...",
    compass: "Votre cœur cohérent est votre boussole vers l'abondance.",
    deeper: "Doucement, prenez une respiration plus profonde.",
    thankSelf: "Remerciez-vous pour ce moment de connexion et de création.",
    openEyes: "Quand vous êtes prêt, ouvrez les yeux, en gardant cette vibration élevée avec vous.",
    completion: "La manifestation est en marche. Ayez confiance."
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
      }, 3000);

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

  // NOUVEAU : Fonction pour jouer un audio MÉDITATION avec fallback
  const playMeditationAudio = async (meditationType, audioKey) => {
    try {
      const audioPath = getMeditationAudioPath(meditationType, ATTRACTION_AUDIO_FILES[audioKey]);
      console.log(`🎵 Lecture audio MÉDITATION premium: ${audioPath} (${meditationType})`);
      await playLocalAudio(audioPath);
      console.log(`✅ Audio MÉDITATION premium terminé: ${audioKey}`);
    } catch (error) {
      console.log(`🔄 Fallback synthèse MÉDITATION pour: ${audioKey} - Raison: ${error.message}`);
      const fallbackText = ATTRACTION_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ Fallback MÉDITATION réussi: ${audioKey}`);
        } catch (fallbackError) {
          console.log(`❌ Fallback MÉDITATION échoué: ${audioKey}`);
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

  // NOUVEAU : Système vocal Méditation Loi d'Attraction
  const startAttractionGuidance = () => {
    console.log('🎯 DÉMARRAGE MÉDITATION LOI D\'ATTRACTION - Guidage vocal complet');
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // Timings complets pour la méditation Loi d'Attraction (7 minutes)
    const attractionTimings = [
      // Introduction (0:00-1:00)
      { time: 0, audioKey: 'welcome' },
      { time: 5000, audioKey: 'install' },
      { time: 10000, audioKey: 'awareness' },
      { time: 18000, audioKey: 'harmonize' },
      { time: 26000, audioKey: 'rhythmStart' },
      
      // Phase de Cohérence (1:00-2:00)
      { time: 30000, audioKey: 'inhaleDeep' },
      { time: 35000, audioKey: 'exhaleGentle' },
      { time: 40000, audioKey: 'inhaleEnergy' },
      { time: 45000, audioKey: 'exhaleTension' },
      { time: 50000, audioKey: 'inhaleAbundance' },
      { time: 55000, audioKey: 'exhaleDoubts' },
      { time: 60000, audioKey: 'coherence' },
      
      // Visualisation et Manifestation (2:00-5:00)
      { time: 65000, audioKey: 'visualize' },
      { time: 73000, audioKey: 'inhaleRealized' },
      { time: 78000, audioKey: 'exhaleGratitude' },
      { time: 83000, audioKey: 'inhaleCells' },
      { time: 88000, audioKey: 'exhaleRadiate' },
      { time: 93000, audioKey: 'amplify' },
      { time: 98000, audioKey: 'inhaleWorthy' },
      { time: 103000, audioKey: 'exhaleAttract' },
      { time: 108000, audioKey: 'inhaleJoy' },
      { time: 113000, audioKey: 'exhaleAnchor' },
      { time: 118000, audioKey: 'universe' },
      { time: 125000, audioKey: 'inhaleCocreate' },
      { time: 130000, audioKey: 'exhalePerfect' },
      { time: 135000, audioKey: 'inhaleAmplify' },
      { time: 140000, audioKey: 'exhaleLight' },
      
      // Répétition de cycles (2:25-5:00)
      { time: 145000, audioKey: 'inhaleClarity' },
      { time: 150000, audioKey: 'exhaleRelease' },
      { time: 155000, audioKey: 'inhaleDeserve' },
      { time: 160000, audioKey: 'exhaleGrateful' },
      { time: 165000, audioKey: 'inhaleRadiate' },
      { time: 170000, audioKey: 'exhaleDesires' },
      { time: 175000, audioKey: 'inhaleAligned' },
      { time: 180000, audioKey: 'exhalePossible' },
      { time: 185000, audioKey: 'inhalePeace' },
      { time: 190000, audioKey: 'exhaleManifest' },
      { time: 195000, audioKey: 'inhaleFlows' },
      { time: 200000, audioKey: 'exhaleHarmony' },
      { time: 205000, audioKey: 'inhaleVibration' },
      { time: 210000, audioKey: 'exhaleThank' },
      { time: 215000, audioKey: 'inhaleMagnet' },
      { time: 220000, audioKey: 'exhaleInfinite' },
      { time: 225000, audioKey: 'inhaleAbundance2' },
      { time: 230000, audioKey: 'exhaleDreams' },
      { time: 235000, audioKey: 'inhaleSource' },
      { time: 240000, audioKey: 'exhaleEasily' },
      { time: 245000, audioKey: 'inhaleOpen' },
      { time: 250000, audioKey: 'exhaleLove' },
      { time: 255000, audioKey: 'inhaleSupport' },
      { time: 260000, audioKey: 'exhalePeace2' },
      { time: 265000, audioKey: 'inhaleGranted' },
      { time: 270000, audioKey: 'exhaleTrust' },
      { time: 275000, audioKey: 'inhaleHears' },
      { time: 280000, audioKey: 'exhaleGrateful2' },
      { time: 285000, audioKey: 'inhaleProgress' },
      { time: 290000, audioKey: 'exhaleLetgo' },
      
      // Ancrage et Intégration (5:00-6:30)
      { time: 300000, audioKey: 'continue' },
      { time: 308000, audioKey: 'inhaleAnchor2' },
      { time: 313000, audioKey: 'exhaleImpregnate' },
      { time: 318000, audioKey: 'inhaleAligned2' },
      { time: 323000, audioKey: 'exhaleConfidence' },
      { time: 328000, audioKey: 'inhalePath' },
      { time: 333000, audioKey: 'exhaleTrust2' },
      { time: 338000, audioKey: 'inhaleNature' },
      { time: 343000, audioKey: 'exhalePeace3' },
      { time: 348000, audioKey: 'inhaleAttracts' },
      { time: 353000, audioKey: 'exhaleJoy' },
      { time: 358000, audioKey: 'inhaleCreator' },
      { time: 363000, audioKey: 'exhaleIntentions' },
      { time: 368000, audioKey: 'inhaleResponds' },
      { time: 373000, audioKey: 'exhalePerfect2' },
      { time: 378000, audioKey: 'compass' },
      
      // Retour et Clôture (6:30-7:00)
      { time: 383000, audioKey: 'deeper' },
      { time: 388000, audioKey: 'thankSelf' },
      { time: 393000, audioKey: 'openEyes' },
      { time: 400000, audioKey: 'completion' }
    ];

    console.log(`🎵 Programmation de ${attractionTimings.length} séquences vocales pour Loi d'Attraction`);

    attractionTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive && currentMeditation === 'attraction') {
          console.log(`🎤 ${time/1000}s: ${audioKey} - Loi d'Attraction`);
          playMeditationAudio('attraction', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${attractionTimings.length} timeouts programmés pour la méditation Loi d'Attraction`);
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

  // Système vocal Méditations - NOUVEAU SYSTÈME UNIFIÉ
  const startMeditationGuidance = () => {
    console.log('🧘 DÉMARRAGE MÉDITATION - Type:', currentMeditation);
    
    if (currentMeditation === 'attraction') {
      startAttractionGuidance();
    } else {
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

  // Système vocal unifié - CORRIGÉ
  const startSessionGuidance = (coherenceSettings = null) => {
    if (!voiceSettings.enabled) {
      return;
    }

    console.log('🎯 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession, 'Méditation:', currentMeditation);

    switch (currentSession) {
      case 'switch':
        startSosGuidance(); // SYSTÈME ORIGINAL
        break;
      case 'scan':
        startScanGuidance(); // SYSTÈME ORIGINAL
        break;
      case 'reset':
        startResetGuidance();
        break;
      case 'progressive':
        startProgressiveGuidance();
        break;
      case 'kids':
        startKidsGuidance();
        break;
      case 'seniors':
        startSeniorsGuidance();
        break;
      case 'meditation':
        startMeditationGuidance(); // NOUVEAU SYSTÈME MÉDITATIONS
        break;
      case 'coherence':
        if (coherenceSettings) {
          startCoherenceGuidance(coherenceSettings);
        }
        break;
      case 'free':
        startFreeSessionGuidance();
        break;
      default:
        speak("Session démarrée. Suivez le guide respiratoire.");
        break;
    }
  };

  // Arrêter tout
  const stop = () => {
    console.log('🔇 ARRÊT COMPLET DU SYSTÈME VOCAL');
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    isPlayingRef.current = false;
    
    try {
      speechSynthesis.cancel();
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
    // NOUVEAU : Fonctions spécialisées pour MÉDITATIONS
    playMeditationAudio,
    getMeditationAudioPath,
    startAttractionGuidance,
    // Fonctions génériques pour nouvelles sessions
    playSessionAudio,
    getSessionAudioPath,
    // Mappings et textes
    SOS_AUDIO_FILES,
    SCAN_AUDIO_FILES,
    SOS_FALLBACK_TEXTS,
    SCAN_FALLBACK_TEXTS,
    // NOUVEAU : Mappings et textes MÉDITATIONS
    ATTRACTION_AUDIO_FILES,
    ATTRACTION_FALLBACK_TEXTS,
    SESSION_AUDIO_MAPPINGS,
    SESSION_FALLBACK_TEXTS,
  };
};