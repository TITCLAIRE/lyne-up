// Programmes thématiques sur 7 jours
export const weeklyPrograms = {
  antiStress: {
    id: 'antiStress',
    name: '7 jours Anti-Stress',
    description: 'Programme intensif pour réduire le stress et retrouver la sérénité',
    icon: 'Shield',
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
    duration: 7,
    sessions: [
      { day: 1, session: 'switch', title: 'SWITCH - Sérénité express', duration: '1min 45s' },
      { day: 2, session: 'reset', title: 'RESET - Technique 4/7/8', duration: '3min' },
      { day: 3, session: 'coherence', title: 'Cohérence cardiaque 5min', duration: '5min', rhythm: '4-6' },
      { day: 4, session: 'meditation', subtype: 'gratitude', title: 'Méditation Gratitude', duration: '5min' },
      { day: 5, session: 'scan', title: 'Scan corporel relaxant', duration: '10min' },
      { day: 6, session: 'hypnosis', subtype: 'stress', title: 'Auto-hypnose anti-stress', duration: '10min' },
      { day: 7, session: 'free', title: 'Session libre personnalisée', duration: '15min' }
    ]
  },
  
  sommeil: {
    id: 'sommeil',
    name: 'Retrouver le Sommeil',
    description: 'Programme pour améliorer la qualité de votre sommeil en 7 jours',
    icon: 'Moon',
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
    duration: 7,
    sessions: [
      { day: 1, session: 'seniors', title: 'SENIORS+ - Relaxation douce', duration: '5min' },
      { day: 2, session: 'reset', title: 'RESET - Technique 4/7/8', duration: '3min' },
      { day: 3, session: 'meditation', subtype: 'sleep', title: 'Méditation Sommeil', duration: '10min' },
      { day: 4, session: 'scan', title: 'Scan corporel du soir', duration: '10min' },
      { day: 5, session: 'hypnosis', subtype: 'sleep', title: 'Auto-hypnose sommeil', duration: '10min' },
      { day: 6, session: 'coherence', title: 'Cohérence cardiaque relaxante', duration: '15min', rhythm: '4-6' },
      { day: 7, session: 'hypnosis', subtype: 'sieste', title: 'Sieste réparatrice', duration: '10min' }
    ]
  },
  
  energie: {
    id: 'energie',
    name: 'Boost d\'Énergie',
    description: 'Programme pour retrouver vitalité et motivation au quotidien',
    icon: 'Zap',
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    duration: 7,
    sessions: [
      { day: 1, session: 'progressive', title: 'TRAINING - Entraînement progressif', duration: '3min' },
      { day: 2, session: 'coherence', title: 'Cohérence cardiaque énergisante', duration: '5min', rhythm: '5-5' },
      { day: 3, session: 'meditation', subtype: 'confidence', title: 'Méditation Confiance', duration: '6min' },
      { day: 4, session: 'hypnosis', subtype: 'confidence', title: 'Auto-hypnose confiance', duration: '10min' },
      { day: 5, session: 'meditation', subtype: 'abundance', title: 'Méditation Abondance', duration: '10min' },
      { day: 6, session: 'coherence', title: 'Cohérence cardiaque avancée', duration: '15min', rhythm: '6-2-6' },
      { day: 7, session: 'free', title: 'Session libre énergisante', duration: '10min' }
    ]
  },
  
  equilibre: {
    id: 'equilibre',
    name: 'Équilibre Émotionnel',
    description: 'Programme pour stabiliser vos émotions et cultiver la paix intérieure',
    icon: 'Heart',
    color: 'from-pink-500/20 to-purple-500/20',
    borderColor: 'border-pink-500/30',
    duration: 7,
    sessions: [
      { day: 1, session: 'switch', title: 'SWITCH - Recentrage émotionnel', duration: '1min 45s' },
      { day: 2, session: 'meditation', subtype: 'love', title: 'Méditation Amour Universel', duration: '8min' },
      { day: 3, session: 'hypnosis', subtype: 'emotions', title: 'Apaiser les émotions fortes', duration: '10min' },
      { day: 4, session: 'coherence', title: 'Cohérence cardiaque équilibrante', duration: '5min', rhythm: '5-5' },
      { day: 5, session: 'scan', title: 'Scan corporel harmonisant', duration: '10min' },
      { day: 6, session: 'meditation', subtype: 'gratitude', title: 'Méditation Gratitude', duration: '5min' },
      { day: 7, session: 'coherence', title: 'Cohérence cardiaque profonde', duration: '15min', rhythm: '4-6' }
    ]
  }
};

// Fonction pour obtenir la session du jour pour un programme
export const getTodaySession = (programId, dayNumber) => {
  const program = weeklyPrograms[programId];
  if (!program || dayNumber < 1 || dayNumber > 7) {
    return null;
  }
  
  return program.sessions.find(session => session.day === dayNumber);
};

// Fonction pour calculer le jour actuel d'un programme (basé sur la date de début)
export const getCurrentProgramDay = (startDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Retourner le jour du programme (1-7) ou null si terminé
  return diffDays <= 7 ? diffDays : null;
};

// Sessions disponibles pour la routine quotidienne aléatoire
export const dailyRoutineSessions = [
  { id: 'switch', name: 'SWITCH', duration: '1min 45s', desc: 'Sérénité express', type: 'guided' },
  { id: 'reset', name: 'RESET', duration: '3min', desc: 'Crise de calme', type: 'guided' },
  { id: 'progressive', name: 'TRAINING', duration: '3min', desc: 'Entraînement progressif', type: 'guided' },
  { id: 'kids', name: 'KIDS', duration: '2min', desc: 'Respiration magique', type: 'guided' },
  { id: 'seniors', name: 'SENIORS+', duration: '5min', desc: 'Relaxation douce', type: 'guided' },
  { id: 'scan', name: 'SCAN CORPOREL', duration: '10min', desc: 'Relaxation profonde', type: 'guided' },
  { id: 'coherence-5', name: 'Cohérence 5min', duration: '5min', desc: 'Rythme 5/5', type: 'coherence', rhythm: '5-5' },
  { id: 'coherence-15', name: 'Cohérence 15min', duration: '15min', desc: 'Rythme 4/6', type: 'coherence', rhythm: '4-6' },
  { id: 'meditation-gratitude', name: 'Gratitude', duration: '5min', desc: 'Reconnaissance', type: 'meditation', subtype: 'gratitude' },
  { id: 'meditation-confidence', name: 'Confiance', duration: '6min', desc: 'Estime de soi', type: 'meditation', subtype: 'confidence' },
  { id: 'hypnosis-stress', name: 'Anti-Stress', duration: '10min', desc: 'Libération du stress', type: 'hypnosis', subtype: 'stress' },
  { id: 'hypnosis-sieste', name: 'Sieste', duration: '10min', desc: 'Récupération rapide', type: 'hypnosis', subtype: 'sieste' }
];

// Fonction pour obtenir une session aléatoire pour la routine quotidienne
export const getRandomDailySession = () => {
  const randomIndex = Math.floor(Math.random() * dailyRoutineSessions.length);
  return dailyRoutineSessions[randomIndex];
};

// Fonction pour obtenir la route appropriée pour une session
export const getSessionRoute = (session) => {
  switch (session.type) {
    case 'guided':
      return `/sessions/run/guided/${session.id}`;
    case 'coherence':
      // Pour la cohérence cardiaque, on va vers la sélection puis on configure automatiquement
      return `/sessions/libre`; // On utilisera la session libre avec les paramètres prédéfinis
    case 'meditation':
      return `/sessions/run/guided/meditation`; // Il faudra définir currentMeditation avant
    case 'hypnosis':
      return `/sessions/run/hypnosis/${session.subtype}`;
    default:
      return '/';
  }
};