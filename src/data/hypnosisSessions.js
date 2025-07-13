export const hypnosisSessions = {
  sleep: {
    name: 'SOMMEIL PROFOND',
    duration: 600, // 10 minutes
    description: 'Sommeil Profond et Réparateur',
    breathingPattern: { inhale: 4, hold: 0, exhale: 6 },
    frequency: 'delta', // Ondes Delta (2 Hz)
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