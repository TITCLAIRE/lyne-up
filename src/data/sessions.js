export const sessions = {
  switch: {
    name: 'SWITCH',
    duration: 90, // 1min 30s
    description: 'Sérénité express',
    breathingPattern: {
      inhale: 4,
      hold: 0,
      exhale: 6
    },
    guidance: {
      start: "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules. Suivez simplement le rythme de la barre visuelle.",
      inhale: ["Inspirez... le calme", "Accueillez... l'air frais", "Respirez... la sérénité"],
      exhale: ["Soufflez doucement... lâchez tout", "Relâchez... toutes les tensions", "Libérez... le stress"],
      phases: [
        "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.",
        "Le stress s'évapore à chaque souffle. Votre corps se détend profondément.", 
        "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité."
      ],
      end: "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous."
    }
  },

  reset: {
    name: 'RESET',
    duration: 180, // 3 minutes
    description: 'Crise de calme & Insomnie',
    breathingPattern: {
      inhale: 4,   // 4 secondes inspiration
      hold: 7,    // 7 secondes rétention
      exhale: 8   // 8 secondes expiration
    },
    guidance: {
      start: "Bienvenue dans votre session RESET. Cette technique 4-7-8 va calmer votre système nerveux et préparer votre corps au repos profond. Installez-vous confortablement.",
      inhale: ["Inspirez par le nez pendant 4 secondes", "Remplissez vos poumons calmement", "Accueillez l'air apaisant"],
      hold: ["Retenez votre souffle pendant 7 secondes", "Gardez l'air précieux en vous", "Laissez l'oxygène circuler"],
      exhale: ["Expirez lentement pendant 8 secondes", "Relâchez tout par la bouche", "Libérez toutes les tensions"],
      phases: [
        "Cette respiration 4-7-8 active votre système nerveux parasympathique, celui du repos et de la récupération.",
        "Chaque cycle vous emmène plus profondément dans un état de calme. Votre rythme cardiaque ralentit naturellement.",
        "Votre corps reconnaît ce signal de détente. Les tensions se dissolvent, muscle par muscle.",
        "Cette technique ancestrale prépare votre esprit au lâcher-prise total. Vous glissez vers la sérénité.",
        "Votre respiration devient le pont entre l'agitation et la paix intérieure. Continuez ce rythme apaisant.",
        "Chaque expiration emporte avec elle les soucis de la journée. Vous vous sentez de plus en plus léger."
      ],
      end: "Magnifique. Votre système nerveux est maintenant apaisé. Cette technique 4-7-8 peut être utilisée à tout moment pour retrouver instantanément le calme."
    }
  },

  progressive: {
    name: 'ENTRAÎNEMENT PROGRESSIF',
    duration: 180, // 3 minutes (1min + 1min + 1min)
    description: 'Progression respiratoire guidée',
    breathingPattern: {
      inhale: 3,  // Commence par 3/3
      hold: 0,
      exhale: 3
    },
    progressivePhases: [
      {
        startTime: 0,    // 0-60s : Phase 1
        endTime: 60,
        pattern: { inhale: 3, hold: 0, exhale: 3 },
        announcement: "Phase 1 : Rythme 3/3. Respirez doucement et naturellement."
      },
      {
        startTime: 60,   // 60-120s : Phase 2
        endTime: 120,
        pattern: { inhale: 4, hold: 0, exhale: 4 },
        announcement: "Phase 2 : Passage au rythme 4/4. Respirez un peu plus profondément."
      },
      {
        startTime: 120,  // 120-180s : Phase 3
        endTime: 180,
        pattern: { inhale: 5, hold: 0, exhale: 5 },
        announcement: "Phase 3 : Rythme 5/5. Respirez profondément et calmement."
      }
    ],
    guidance: {
      start: "Bienvenue dans votre entraînement progressif. Nous allons évoluer ensemble du rythme 3/3 vers le 5/5 en trois étapes d'une minute chacune.",
      inhale: ["Inspirez en douceur", "Accueillez l'air", "Respirez calmement"],
      exhale: ["Expirez lentement", "Relâchez", "Soufflez doucement"],
      phases: [
        "Première minute : Rythme 3/3. Laissez votre corps s'habituer à cette respiration douce.",
        "Deuxième minute : Rythme 4/4. Votre respiration s'approfondit naturellement.",
        "Troisième minute : Rythme 5/5. Vous maîtrisez maintenant la respiration de cohérence cardiaque."
      ],
      end: "Excellent ! Vous avez progressé du rythme débutant 3/3 jusqu'au rythme de cohérence cardiaque 5/5. Votre capacité respiratoire s'améliore."
    }
  },

  free: {
    name: 'SESSION LIBRE',
    duration: 300, // Durée par défaut, sera remplacée par freeSessionSettings.duration
    description: 'Rythme et durée personnalisables',
    breathingPattern: {
      inhale: 5,
      hold: 0,
      exhale: 5
    },
    guidance: {
      start: "Session libre démarrée. Suivez votre rythme respiratoire personnalisé.",
      inhale: ["Inspirez selon votre rythme", "Accueillez l'air", "Respirez à votre tempo"],
      exhale: ["Expirez selon votre rythme", "Relâchez", "Soufflez à votre tempo"],
      phases: [
        "Vous contrôlez votre respiration. Maintenez ce rythme qui vous convient.",
        "Votre corps s'adapte à votre rythme personnalisé. Continuez ainsi.",
        "Vous maîtrisez parfaitement votre respiration personnalisée."
      ],
      end: "Session libre terminée. Vous avez maintenu votre rythme respiratoire personnalisé avec succès."
    }
  },

  kids: {
    name: 'KIDS',
    duration: 120, // 2 minutes - Durée adaptée aux enfants
    description: 'Respiration magique pour les petits',
    breathingPattern: {
      inhale: 4,  // 4 secondes inspiration
      hold: 0,   // Pas de pause pour les enfants
      exhale: 4  // 4 secondes expiration
    },
    guidance: {
      start: "Salut petit champion ! On va faire de la respiration magique ensemble. Assieds-toi confortablement comme un petit bouddha.",
      inhale: ["Inspire comme un ballon qui se gonfle", "Respire l'air magique", "Gonfle ton ventre comme un ballon"],
      exhale: ["Souffle doucement comme le vent", "Laisse sortir l'air magique", "Dégonfle ton ballon tout doucement"],
      phases: [
        "Imagine que tu es un arbre avec des racines qui poussent dans le sol. Tu es fort et stable !",
        "Maintenant tu es un nuage léger qui flotte dans le ciel. Tout ton corps devient tout doux.",
        "Tu es un petit chat qui s'étire et qui se détend. Tes muscles deviennent tout mous.",
        "Bravo ! Tu es maintenant calme et détendu comme un petit koala qui fait la sieste."
      ],
      end: "Super ! Tu as fait de la vraie magie avec ta respiration. Tu peux être fier de toi, petit champion !"
    }
  },

  seniors: {
    name: 'SENIORS +',
    duration: 300, // 5 minutes
    description: 'Relaxation & baisse de la tension',
    breathingPattern: {
      inhale: 3,  // 3 secondes inspiration (plus doux)
      hold: 0,   // Pas de pause pour éviter l'effort
      exhale: 4  // 4 secondes expiration (favorise la relaxation)
    },
    guidance: {
      start: "Bienvenue dans votre session de relaxation adaptée. Installez-vous confortablement dans votre fauteuil. Cette respiration douce va vous aider à vous détendre et à faire baisser votre tension.",
      inhale: ["Inspirez doucement par le nez", "Accueillez l'air frais", "Respirez calmement"],
      exhale: ["Expirez lentement par la bouche", "Relâchez toutes les tensions", "Soufflez en douceur"],
      phases: [
        "Cette respiration 3/4 est parfaitement adaptée à votre rythme. Laissez votre corps se détendre naturellement.",
        "Votre tension artérielle commence à diminuer. Votre cœur bat plus calmement.",
        "Vos muscles se relâchent progressivement. Vous vous sentez de plus en plus détendu.",
        "Cette respiration apaise votre système nerveux. Vous retrouvez votre sérénité.",
        "Continuez à respirer à ce rythme paisible. Votre corps vous remercie pour cette pause bienfaisante."
      ],
      end: "Excellent ! Vous avez pris soin de votre bien-être. Cette respiration douce peut être pratiquée à tout moment pour vous détendre et faire baisser votre tension."
    }
  },

  scan: {
    name: 'SCAN CORPOREL',
    duration: 600, // 10 minutes
    description: 'Relaxation profonde guidée de tout le corps',
    breathingPattern: {
      inhale: 5,
      hold: 0,
      exhale: 5
    },
    guidance: {
      start: "Scan corporel en cohérence 5 et 5. Installez-vous confortablement, fermez les yeux si vous le souhaitez.",
      inhale: ["Inspirez 5", "Accueillez", "Remplissez"],
      exhale: ["Expirez 5", "Relâchez", "Détendez"],
      phases: [
        "Portez votre attention sur le sommet de votre tête. Relâchez toute tension.",
        "Descendez vers votre visage et vos épaules. Laissez-les se détendre complètement.",
        "Sentez votre poitrine s'ouvrir et se détendre à chaque respiration.",
        "Votre ventre se gonfle et se dégonfle naturellement, sans effort.",
        "Relâchez vos hanches et tout votre bassin.",
        "Vos cuisses et vos genoux se détendent profondément.",
        "Vos mollets et vos chevilles se relâchent complètement.",
        "Vos pieds sont lourds et complètement détendus.",
        "Une vague de bien-être parcourt tout votre corps de la tête aux pieds.",
        "Vous êtes complètement détendu. Savourez cette sensation de paix profonde."
      ],
      end: "Scan corporel terminé. Votre corps est complètement détendu et votre esprit apaisé."
    }
  }
};

// Rythmes respiratoires par défaut pour les sessions sans pattern défini
export const defaultBreathingPatterns = {
  // Sessions d'urgence - Rythme anti-stress
  'sos': { inhale: 4, hold: 0, exhale: 6 }, // Même pattern que switch
  'focus': { inhale: 4, hold: 0, exhale: 6 },
  'recovery': { inhale: 4, hold: 0, exhale: 6 },
  'transition': { inhale: 4, hold: 0, exhale: 6 },
  
  // Module RESET - RYTHME 4/7/8
  'reset': { inhale: 4, hold: 7, exhale: 8 },
  
  // Module enfants - RYTHME 4/4
  'kids': { inhale: 4, hold: 0, exhale: 4 },

  // Module seniors - RYTHME 3/4
  'seniors': { inhale: 3, hold: 0, exhale: 4 },

  // Module entraînement progressif - RYTHME INITIAL 3/3
  'progressive': { inhale: 3, hold: 0, exhale: 3 },

  // Session libre - RYTHME PAR DÉFAUT 5/5
  'free': { inhale: 5, hold: 0, exhale: 5 },
  
  // Méditations - Rythme équilibré
  'meditation': { inhale: 5, hold: 0, exhale: 5 },
  
  // Cohérence cardiaque - Selon le rythme choisi
  'coherence': { inhale: 5, hold: 0, exhale: 5 }, // Par défaut 5/5
  
  // Fallback général
  'default': { inhale: 5, hold: 0, exhale: 5 }
};

// Fonction pour obtenir le pattern respiratoire d'une session
export const getBreathingPattern = (sessionId, coherenceRhythm = null) => {
  // Si la session a un pattern défini dans sessions.js, l'utiliser
  if (sessions[sessionId]?.breathingPattern) {
    const pattern = sessions[sessionId].breathingPattern;
    return pattern;
  }
  
  // Pour la cohérence cardiaque, utiliser le rythme choisi
  if (sessionId === 'coherence' && coherenceRhythm) {
    switch (coherenceRhythm) {
      case '4-6':
        return { inhale: 4, hold: 0, exhale: 6 };
      case '5-5':
        return { inhale: 5, hold: 0, exhale: 5 };
      case '4-4':
        return { inhale: 4, hold: 0, exhale: 4 };
      case '4-7-8':
        return { inhale: 4, hold: 7, exhale: 8 };
      case '6-2-6':
        return { inhale: 6, hold: 2, exhale: 6 };
      case '3-3-3':
        return { inhale: 3, hold: 3, exhale: 3 };
      default:
        return { inhale: 5, hold: 0, exhale: 5 };
    }
  }
  
  // Utiliser le pattern par défaut pour cette session
  const defaultPattern = defaultBreathingPatterns[sessionId] || defaultBreathingPatterns.default;
  
  return defaultPattern;
};