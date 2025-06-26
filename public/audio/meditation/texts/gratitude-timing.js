// 🎯 TIMING EXACT MÉDITATION GRATITUDE - 11 SÉQUENCES
// Basé sur le document PDF fourni

export const gratitudeTimingsOptimized = [
  { time: 0, audioKey: 'installation', duration: 30 },         // 0s - Installation - premier paragraphe
  { time: 30000, audioKey: 'coherenceSetup', duration: 30 },   // 30s - Mise en place cohérence cardiaque
  { time: 60000, audioKey: 'breathingHeart', duration: 30 },   // 60s - Approfondissement respiration cœur
  { time: 90000, audioKey: 'gratitudeAwakening', duration: 30 }, // 90s - Éveil gratitude simple
  { time: 120000, audioKey: 'firstGratitude', duration: 30 },  // 120s - Respiration avec première gratitude
  { time: 150000, audioKey: 'lovedOnes', duration: 30 },       // 150s - Expansion vers personne chère
  { time: 180000, audioKey: 'bodyGratitude', duration: 30 },   // 180s - Gratitude pour le corps
  { time: 210000, audioKey: 'natureExpansion', duration: 30 }, // 210s - Élargissement nature/univers
  { time: 240000, audioKey: 'energyAnchoring', duration: 30 }, // 240s - Ancrage de l'énergie
  { time: 270000, audioKey: 'integration', duration: 15 },     // 270s - Intégration et rayonnement
  { time: 285000, audioKey: 'conclusion', duration: 15 }       // 285s - Conclusion et retour (fin à 300s = 5min)
];

// Mapping des fichiers audio GRATITUDE
export const GRATITUDE_AUDIO_FILES = {
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

// Durée totale de la méditation GRATITUDE : 5 minutes (300 secondes)
export const TOTAL_GRATITUDE_DURATION = 300;