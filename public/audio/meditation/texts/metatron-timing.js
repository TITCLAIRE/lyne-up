// 🎯 TIMING EXACT MÉDITATION MÉTATRON - 7 SÉQUENCES
// Basé sur une méditation de 5 minutes (300 secondes)

export const metatronTimingsOptimized = [
  { time: 0, audioKey: 'welcome', duration: 30 },              // 0s - Introduction
  { time: 30000, audioKey: 'invocation', duration: 40 },       // 30s - Invocation initiale
  { time: 70000, audioKey: 'light', duration: 40 },            // 70s - Lumière et sagesse
  { time: 110000, audioKey: 'memory', duration: 40 },          // 110s - Mémoire de l'âme
  { time: 150000, audioKey: 'inspiration', duration: 40 },     // 150s - Inspiration divine
  { time: 190000, audioKey: 'protection', duration: 40 },      // 190s - Cube de protection
  { time: 230000, audioKey: 'elevation', duration: 70 }        // 230s - Élévation et gratitude finale (jusqu'à 300s)
];

// Mapping des fichiers audio MÉTATRON
export const METATRON_AUDIO_FILES = {
  welcome: 'metatron-welcome',
  invocation: 'metatron-invocation',
  light: 'metatron-light',
  memory: 'metatron-memory',
  inspiration: 'metatron-inspiration',
  protection: 'metatron-protection',
  elevation: 'metatron-elevation'
};

// Durée totale de la méditation MÉTATRON : 5 minutes (300 secondes)
export const TOTAL_METATRON_DURATION = 300;