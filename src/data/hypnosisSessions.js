export const hypnosisSessions = {
  addiction: {
    name: 'LIBÉRATION D\'UNE ADDICTION',
    duration: 600, // 10 minutes
    description: 'Se Libérer d\'une Addiction (sucre, tabac…)',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: '396hz', // Fréquence 396 Hz - libération des dépendances
    phases: [
      {
        name: 'introduction',
        startTime: 0,
        endTime: 180, // 3 minutes
        type: 'guided-breathing',
        guidedBreathing: true,
        gongEnabled: true
      },
      {
        name: 'transition',
        startTime: 180,
        endTime: 300, // 5 minutes (2 min de transition)
        type: 'deepening',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'suggestions',
        startTime: 300,
        endTime: 540, // 9 minutes (4 min de suggestions)
        type: 'suggestions',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'cloture',
        startTime: 540,
        endTime: 600, // 10 minutes (1 min de clôture)
        type: 'closure',
        guidedBreathing: false,
        gongEnabled: false
      }
    ],
    guidance: {
      start: "Bienvenue dans cette séance pour retrouver votre liberté intérieure. Aujourd'hui, vous commencez à vous détacher de ce qui vous enchaîne. Avec bienveillance et puissance.",
      inhale: ["Inspirez profondément... 4... 3... 2... 1...", "Accueillez la force... 4... 3... 2... 1...", "Inspirez la liberté... 4... 3... 2... 1..."],
      exhale: ["Expirez longuement... 6... 5... 4... 3... 2... 1...", "Relâchez la dépendance... 6... 5... 4... 3... 2... 1...", "Libérez-vous... 6... 5... 4... 3... 2... 1..."],
      phases: [
        // Phase 1: Introduction + Respiration guidée (0-3 min)
        "À chaque respiration, votre corps se calme et une sensation de force tranquille s'installe en vous. Ce besoin, cette compulsion, vous pouvez l'observer, le reconnaître, sans y répondre. Vous êtes déjà en train de reprendre le contrôle, en douceur.",
        
        // Phase 2: Respiration naturelle + Approfondissement (3-5 min)
        "Et maintenant, laissez votre respiration revenir à son rythme naturel, sans effort, fluide, libre. Visualisez cette habitude comme une ancienne attache, une corde qui vous liait. Et imaginez que cette corde se détache, se relâche, se dissout. Ce lien n'a plus de pouvoir sur vous, vous êtes en train de vous en libérer, profondément, durablement.",
        
        // Phase 3: Suggestions hypnotiques ciblées (5-9 min)
        "Vous êtes capable de dire non. Parce que vous dites oui à votre santé, à votre énergie, à votre liberté. Ce besoin est une illusion, et votre volonté réelle plus forte que lui. Vous pouvez accueillir les émotions sans les fuir, vous pouvez apaiser les tensions sans compenser. Vous respirez, et à chaque respiration, vous vous détachez davantage. Vous êtes libre de choisir, et vous choisissez ce qui vous élève, ce qui vous respecte, ce qui vous nourrit. À chaque inspiration : confiance. À chaque expiration : libération. Ce que vous laissez partir ne vous manque pas. Car ce que vous gagnez est bien plus précieux.",
        
        // Phase 4: Clôture + ancrage positif (9-10 min)
        "Revenez à vous avec cette sensation de victoire intérieure. Vous êtes plus fort(e) que cette habitude. Et chaque jour vous le prouve davantage. Bougez doucement votre corps. Respirez plus profondément."
      ],
      end: "Et quand vous serez prêt(e), ouvrez les yeux, libre, ancré(e), fier(e) de vous. Votre transformation est en marche."
    }
  },
  stress: {
    name: 'LIBÉRER LE STRESS AIGU',
    duration: 600, // 10 minutes
    description: 'Libérer le Stress en Quelques Minutes',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: '528hz', // Fréquence 528 Hz - régulation émotionnelle, équilibre
    phases: [
      {
        name: 'introduction',
        startTime: 0,
        endTime: 180, // 3 minutes
        type: 'guided-breathing',
        guidedBreathing: true,
        gongEnabled: true
      },
      {
        name: 'transition',
        startTime: 180,
        endTime: 300, // 5 minutes (2 min de transition)
        type: 'deepening',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'suggestions',
        startTime: 300,
        endTime: 540, // 9 minutes (4 min de suggestions)
        type: 'suggestions',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'cloture',
        startTime: 540,
        endTime: 600, // 10 minutes (1 min de clôture)
        type: 'closure',
        guidedBreathing: false,
        gongEnabled: false
      }
    ],
    guidance: {
      start: "Bienvenue dans cet espace de calme. Vous êtes au bon endroit… pour retrouver votre équilibre.",
      inhale: ["Inspirez lentement… 4… 3… 2… 1…", "Accueillez le calme… 4… 3… 2… 1…", "Respirez profondément… 4… 3… 2… 1…"],
      exhale: ["Expirez plus longuement… 6… 5… 4… 3… 2… 1…", "Relâchez le stress… 6… 5… 4… 3… 2… 1…", "Libérez les tensions… 6… 5… 4… 3… 2… 1…"],
      phases: [
        // Phase 1: Introduction + Respiration guidée (0-3 min)
        "À chaque souffle, le stress quitte doucement votre corps… comme une vapeur qui s'échappe… Laissez vos épaules descendre… votre ventre se détendre… et vos pensées ralentir… Le corps se relâche… le mental s'apaise… tout devient plus léger…",
        
        // Phase 2: Respiration libre + Approfondissement (3-5 min)
        "Et maintenant… laissez votre respiration trouver son propre rythme… Naturellement… sans rien forcer… Imaginez que vous êtes assis(e) au bord d'un lac calme… Chaque vaguelette emporte vos tensions… Le stress coule hors de vous… comme un fleuve qui emporte ce dont vous n'avez plus besoin… Votre cœur bat calmement… Votre esprit devient plus clair… et votre corps retrouve un sentiment de sécurité…",
        
        // Phase 3: Suggestions hypnotiques ciblées stress (5-9 min)
        "Vous êtes ici et maintenant… dans un espace paisible… où rien n'est urgent… où tout est simple… Votre corps sait comment se détendre… Et il le fait… maintenant… Le stress est une vague… vous la laissez passer… sans y résister… À chaque respiration… vous gagnez en recul… en calme… en lucidité… Votre respiration vous ancre… comme les racines d'un arbre solide… Vous êtes centré(e)… aligné(e)… en sécurité. Tout ce dont vous avez besoin… est déjà en vous.",
        
        // Phase 4: Clôture et retour à la clarté (9-10 min)
        "Respirez plus profondément maintenant… Prenez une bonne inspiration… et sentez cette énergie nouvelle vous remplir… Bougez doucement vos doigts… vos épaules… votre cou…"
      ],
      end: "Et quand vous serez prêt(e)… ouvrez les yeux… plus calme… plus clair(e)… plus serein(e)… Le stress s'est éloigné… et vous avez retrouvé votre centre."
    }
  },
  pain: {
    name: 'SOULAGER LA DOULEUR',
    duration: 600, // 10 minutes
    description: 'Soulager la Douleur par la Respiration',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: '396hz', // Fréquence 396 Hz - Libération des tensions
    phases: [
      {
        name: 'introduction',
        startTime: 0,
        endTime: 180, // 3 minutes
        type: 'guided-breathing',
        guidedBreathing: true,
        gongEnabled: true
      },
      {
        name: 'transition',
        startTime: 180,
        endTime: 300, // 5 minutes (2 min de transition)
        type: 'deepening',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'suggestions',
        startTime: 300,
        endTime: 540, // 9 minutes (4 min de suggestions)
        type: 'suggestions',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'cloture',
        startTime: 540,
        endTime: 600, // 10 minutes (1 min de clôture)
        type: 'closure',
        guidedBreathing: false,
        gongEnabled: false
      }
    ],
    guidance: {
      start: "Bienvenue dans cette séance pour apaiser la douleur. Installez-vous dans une position confortable… et laissez votre souffle devenir votre allié…",
      inhale: ["Inspirez doucement… 4… 3… 2… 1…", "Accueillez l'air apaisant… 4… 3… 2… 1…", "Respirez calmement… 4… 3… 2… 1…"],
      exhale: ["Expirez lentement… 6… 5… 4… 3… 2… 1…", "Relâchez la tension… 6… 5… 4… 3… 2… 1…", "Libérez la douleur… 6… 5… 4… 3… 2… 1…"],
      phases: [
        // Phase 1: Introduction + Respiration guidée (0-3 min)
        "À chaque souffle, votre corps se relâche un peu plus… et la zone douloureuse commence à s'apaiser… comme si un baume de calme s'y déposait… La respiration devient un massage… un soulagement qui s'amplifie… à chaque cycle… Continuez… respirez doucement… et laissez faire…",
        
        // Phase 2: Passage à la respiration libre + Approfondissement (3-5 min)
        "Et maintenant… laissez votre respiration revenir à son propre rythme… naturellement… sans la contrôler… Votre souffle sait exactement quoi faire… Imaginez que la zone douloureuse est entourée d'une lumière chaude… douce… bienveillante… Cette lumière respire avec vous… À chaque inspiration, elle s'amplifie… À chaque expiration, elle dissout la tension… La douleur diminue… fond… comme neige au soleil… Vous êtes en sécurité… ici et maintenant…",
        
        // Phase 3: Suggestions thérapeutiques ciblées (5-9 min)
        "Votre esprit est calme… votre corps est détendu… Et là où se trouvait la douleur… il y a maintenant un espace plus souple… plus léger… La zone affectée retrouve de la liberté… du mouvement… de la confiance… Vous êtes plus fort(e) que cette douleur… Votre corps sait s'auto-réguler… et il le fait en cet instant… Votre souffle devient un flux de guérison… qui circule librement… partout où c'est nécessaire… À chaque respiration… vous vous sentez mieux… plus aligné(e)… plus serein(e)…",
        
        // Phase 4: Clôture douce et ancrage (9-10 min)
        "Gardez avec vous cette sensation de soulagement… Elle est disponible à tout moment… en vous… Respirez plus profondément maintenant… bougez légèrement vos doigts… vos épaules… votre nuque…"
      ],
      end: "Et quand vous vous sentirez prêt(e)… ouvrez les yeux… avec douceur… Vous êtes apaisé(e)… et prêt(e) à poursuivre votre journée… avec plus de confort et de clarté…"
    }
  },
  sieste: {
    name: 'SIESTE RELAXANTE',
    duration: 600, // 10 minutes
    description: 'Récupération profonde en 10 minutes',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: 'alpha', // Ondes Alpha (10 Hz)
    phases: [
      {
        name: 'introduction',
        startTime: 0,
        endTime: 180, // 3 minutes
        type: 'guided-breathing',
        guidedBreathing: true,
        gongEnabled: true
      },
      {
        name: 'transition',
        startTime: 180,
        endTime: 300, // 5 minutes (2 min de transition)
        type: 'deepening',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'suggestions',
        startTime: 300,
        endTime: 540, // 9 minutes (4 min de suggestions)
        type: 'suggestions',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'cloture',
        startTime: 540,
        endTime: 600, // 10 minutes (1 min de clôture)
        type: 'closure',
        guidedBreathing: false,
        gongEnabled: false
      }
    ],
    guidance: {
      start: "Bienvenue dans cette parenthèse de détente. Installez-vous confortablement… Et laissez-vous guider vers un état de repos profond…",
      inhale: ["Inspirez lentement… 4… 3… 2… 1…", "Inspirez profondément… 4… 3… 2… 1…", "Accueillez l'air… 4… 3… 2… 1…"],
      exhale: ["Expirez doucement… 6… 5… 4… 3… 2… 1…", "Relâchez tout… 6… 5… 4… 3… 2… 1…", "Laissez aller… 6… 5… 4… 3… 2… 1…"],
      phases: [
        // Phase 1: Introduction + Respiration guidée (0-3 min)
        "À chaque souffle, vous relâchez un peu plus… Le corps se détend… Le mental ralentit… Rien à faire, rien à forcer… Juste respirer… et s'abandonner au calme…",
        
        // Phase 2: Transition vers respiration naturelle + Approfondissement (3-5 min)
        "Et maintenant… laissez votre respiration revenir à son propre rythme… tranquillement… sans chercher à la contrôler… Juste la laisser faire… naturellement… comme le va-et-vient d'une vague… Imaginez que vous êtes allongé(e)… dans un hamac suspendu entre deux arbres… La lumière est douce… l'air tiède… Et vous vous balancez doucement… À chaque mouvement… votre corps devient plus lourd… plus détendu… comme si le hamac absorbait toute fatigue… Votre esprit s'ouvre à un silence intérieur… apaisant… nourrissant… régénérant…",
        
        // Phase 3: Suggestions pour récupération profonde (5-9 min)
        "Chaque minute passée ici équivaut à une heure de repos profond… Votre corps recharge ses batteries… Vos cellules se régénèrent… Tous les bruits extérieurs glissent au loin… Votre mental flotte… dans un espace de douceur et de paix… Vous êtes à l'abri… serein(e)… parfaitement détendu(e)… Le calme entre dans vos épaules… dans votre ventre… dans votre cœur… Votre respiration devient le rythme de votre énergie retrouvée…",
        
        // Phase 4: Retour à la conscience (9-10 min)
        "Dans un instant… vous allez revenir à vous, parfaitement reposé(e)… plein(e) de clarté… et d'énergie douce… Commencez par bouger légèrement vos doigts… puis vos pieds… Respirez plus profondément…"
      ],
      end: "Et quand vous vous sentirez prêt(e)… ouvrez les yeux… avec le sourire… vous êtes calme, centré(e), disponible pour la suite de votre journée."
    }
  },
  sleep: {
    name: 'SOMMEIL PROFOND',
    duration: 600, // 10 minutes
    description: 'Sommeil Profond et Réparateur',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: 'alpha', // Ondes Alpha (10 Hz)
    phases: [
      {
        name: 'introduction',
        startTime: 0,
        endTime: 180, // 3 minutes
        type: 'guided-breathing',
        guidedBreathing: true,
        gongEnabled: true
      },
      {
        name: 'approfondissement',
        startTime: 180,
        endTime: 300, // 5 minutes (2 min d'approfondissement)
        type: 'deepening',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'suggestions',
        startTime: 300,
        endTime: 540, // 9 minutes (4 min de suggestions)
        type: 'suggestions',
        guidedBreathing: false,
        gongEnabled: false
      },
      {
        name: 'cloture',
        startTime: 540,
        endTime: 600, // 10 minutes (1 min de clôture)
        type: 'closure',
        guidedBreathing: false,
        gongEnabled: false
      }
    ],
    guidance: {
      start: "Bienvenue dans cette séance de sommeil profond. Allongez-vous confortablement… Fermez doucement les yeux… Et laissez-vous guider par votre souffle…",
      inhale: ["Inspirez doucement… 4… 3… 2… 1…", "Accueillez le calme… 4… 3… 2… 1…", "Respirez profondément… 4… 3… 2… 1…"],
      exhale: ["Expirez lentement… 6… 5… 4… 3… 2… 1…", "Relâchez toute tension… 6… 5… 4… 3… 2… 1…", "Laissez-vous aller… 6… 5… 4… 3… 2… 1…"],
      phases: [
        // Phase 1: Introduction + Respiration guidée (0-3 min)
        "Inspirez doucement… 4… 3… 2… 1… Expirez lentement… 6… 5… 4… 3… 2… 1… Chaque respiration vous rapproche d'un état de calme… Votre corps se relâche… votre esprit ralentit… Rien à faire… juste respirer… et vous laisser porter…",
        
        // Phase 2: Approfondissement hypnotique (3-5 min)
        "Suivez le guide - Respirez en mode 4/6… Imaginez maintenant que votre corps repose sur un lit de nuages… Flottant dans un ciel paisible… À chaque respiration… vous vous enfoncez doucement… plus profondément… plus calmement… Votre corps devient lourd… Comme s'il s'endormait avant vous… Et c'est très bien ainsi…",
        
        // Phase 3: Suggestions hypnotiques ciblées sommeil (5-9 min)
        "Votre respiration est lente… tranquille… naturelle… Et votre esprit… glisse… dans un sommeil réparateur… Tout ce dont vous n'avez plus besoin… s'éloigne… Vos pensées deviennent floues… comme des bulles qui flottent et disparaissent… Chaque cellule de votre corps se régénère… Votre lit est un cocon de douceur… sécurisant… Vous êtes parfaitement en sécurité… Votre sommeil est profond… continu… sans interruption… Et demain… vous vous réveillerez pleinement reposé(e)… serein(e)…",
        
        // Phase 4: Clôture (9-10 min)
        "Laissez ma voix s'éloigner… Vous pouvez maintenant dormir profondément… Et savourer cette nuit régénérante…"
      ],
      end: "Votre corps et votre esprit sont maintenant parfaitement préparés pour un sommeil profond et réparateur."
    }
  }
};

// Exporter les fonctions utilitaires
export const getHypnosisSession = (sessionId) => {
  return hypnosisSessions[sessionId] || null;
};

// Obtenir la fréquence binaurale recommandée pour une session d'hypnose
export const getHypnosisFrequency = (sessionId) => {
  const session = hypnosisSessions[sessionId];
  if (!session) return 'theta'; // Fréquence par défaut
  
  return session.frequency || 'theta';
};

// Obtenir le pattern respiratoire pour une session d'hypnose
export const getHypnosisBreathingPattern = (sessionId) => {
  const session = hypnosisSessions[sessionId];
  if (!session) return { inhale: 4, hold: 0, exhale: 6 }; // Pattern par défaut
  
  return session.breathingPattern || { inhale: 4, hold: 0, exhale: 6 };
};