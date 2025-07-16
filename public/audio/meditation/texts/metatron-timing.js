// 🎯 TIMING EXACT MÉDITATION MÉTATRON - 7 SÉQUENCES
// Basé sur une méditation de 5 minutes (300 secondes)

export const metatronTimingsOptimized = [
  { time: 0, audioKey: 'introduction', duration: 30 },         // 0s - Introduction
  { time: 30000, audioKey: 'invocation', duration: 40 },       // 30s - Invocation initiale
  { time: 70000, audioKey: 'light', duration: 40 },            // 70s - Lumière et sagesse
  { time: 110000, audioKey: 'memory', duration: 40 },          // 110s - Mémoire de l'âme
  { time: 150000, audioKey: 'inspiration', duration: 40 },     // 150s - Inspiration divine
  { time: 190000, audioKey: 'protection', duration: 40 },      // 190s - Cube de protection
  { time: 230000, audioKey: 'elevation', duration: 40 },       // 230s - Élévation de conscience
  { time: 270000, audioKey: 'gratitude', duration: 30 }        // 270s - Gratitude finale
];

// Mapping des fichiers audio MÉTATRON
export const METATRON_AUDIO_FILES = {
  introduction: 'metatron-introduction',
  invocation: 'metatron-invocation',
  light: 'metatron-light',
  memory: 'metatron-memory',
  inspiration: 'metatron-inspiration',
  protection: 'metatron-protection',
  elevation: 'metatron-elevation',
  gratitude: 'metatron-gratitude'
};

// Durée totale de la méditation MÉTATRON : 5 minutes (300 secondes)
export const TOTAL_METATRON_DURATION = 300;