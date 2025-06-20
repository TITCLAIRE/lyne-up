import React from 'react';

export const BreathingGuide = ({ breathingState, isActive }) => {
  
  // Calculer la progression depuis le centre (50%)
  const getCenterExpansion = () => {
    const { phase, progress } = breathingState;
    
    if (phase === 'inhale') {
      // Inspiration : expansion depuis le centre vers les extrémités
      const expansion = (progress / 100) * 50;
      return {
        left: 50 - expansion,
        right: 50 + expansion,
        width: expansion * 2
      };
    } else if (phase === 'hold') {
      // Rétention : barre reste à l'expansion maximale
      return {
        left: 0,
        right: 100,
        width: 100
      };
    } else if (phase === 'exhale') {
      // Expiration : contraction progressive depuis l'expansion complète vers le centre
      const currentExpansion = (progress / 100) * 50;
      
      return {
        left: 50 - currentExpansion,
        right: 50 + currentExpansion,
        width: currentExpansion * 2
      };
    } else {
      // État de repos : centre
      return {
        left: 50,
        right: 50,
        width: 0
      };
    }
  };

  // Déterminer la couleur selon la phase et détecter le mode enfants
  const getBarColor = () => {
    // Détection automatique du mode enfants basée sur le pattern 4/4
    const isKidsMode = breathingState.inhaleTime === 4 && breathingState.exhaleTime === 4;
    
    // Couleurs spéciales pour les enfants
    if (isKidsMode) {
      switch (breathingState.phase) {
        case 'inhale':
          return 'bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400'; // Rose magique
        case 'hold':
          return 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400'; // Jaune soleil
        case 'exhale':
          return 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-400'; // Vert nature
        default:
          return 'bg-gradient-to-r from-blue-400 to-purple-400';
      }
    }
    
    // Couleurs standard pour les autres sessions
    switch (breathingState.phase) {
      case 'inhale':
        return 'bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400'; // Bleu azur
      case 'hold':
        return 'bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400'; // Violet pour rétention
      case 'exhale':
        return 'bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400'; // Rose violet
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const expansion = getCenterExpansion();

  // Détection automatique du mode enfants
  const isKidsMode = breathingState.inhaleTime === 4 && breathingState.exhaleTime === 4;

  return (
    <div className="text-center mb-8">
      <div className="max-w-md mx-auto">
        {/* Instruction avec emoji dynamique */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-4xl">{breathingState.emoji}</span>
          <span className="text-xl font-medium">{breathingState.instruction}</span>
        </div>

        {/* Barre de respiration avec expansion centrale */}
        <div className="relative mb-6">
          {/* Container de la barre */}
          <div className="w-full h-16 bg-white/10 rounded-full border-2 border-white/20 relative overflow-hidden">
            {/* Point central de référence (invisible) */}
            <div className="absolute top-1/2 left-1/2 w-1 h-1 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full" />
            
            {/* Barre de progression avec expansion centrale */}
            <div 
              className={`h-full rounded-full transition-all duration-100 ease-linear ${getBarColor()}`}
              style={{ 
                position: 'absolute',
                left: `${expansion.left}%`,
                width: `${expansion.width}%`,
                minWidth: expansion.width > 0 ? '2%' : '0%'
              }}
            />
          </div>
          
          {/* Compteur au centre */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white drop-shadow-lg z-10">
              {isActive ? breathingState.counter : '--'}
            </span>
          </div>
        </div>

        {/* Indicateurs de phase avec timings dynamiques */}
        <div className="flex justify-between text-sm">
          <div className={`px-4 py-2 rounded-full transition-all duration-300 ${
            breathingState.phase === 'inhale' 
              ? 'bg-cyan-500/30 border-2 border-cyan-500/50 text-white font-semibold' 
              : 'text-white/60 border-2 border-transparent'
          }`}>
            {isKidsMode ? '🎈' : '🌬️'} Inspire ({breathingState.inhaleTime}s)
          </div>
          
          {breathingState.holdTime > 0 && (
            <div className={`px-4 py-2 rounded-full transition-all duration-300 ${
              breathingState.phase === 'hold' 
                ? 'bg-purple-500/30 border-2 border-purple-500/50 text-white font-semibold' 
                : 'text-white/60 border-2 border-transparent'
            }`}>
              {isKidsMode ? '⭐' : '⏸️'} Pause ({breathingState.holdTime}s)
            </div>
          )}
          
          <div className={`px-4 py-2 rounded-full transition-all duration-300 ${
            breathingState.phase === 'exhale' 
              ? 'bg-purple-500/30 border-2 border-purple-500/50 text-white font-semibold' 
              : 'text-white/60 border-2 border-transparent'
          }`}>
            {isKidsMode ? '🌸' : '💨'} Expire ({breathingState.exhaleTime}s)
          </div>
        </div>

        {/* Indication visuelle du mouvement */}
        <div className="mt-4 text-xs text-white/50 text-center">
          {breathingState.phase === 'idle' && '• Centre de repos •'}
          {breathingState.phase === 'inhale' && (isKidsMode ? '🎈 Ton ballon magique se gonfle 🎈' : '← Expansion depuis le centre →')}
          {breathingState.phase === 'hold' && (isKidsMode ? '⭐ Garde l\'air magique dans ton ballon ⭐' : '• Rétention - Maintenez l\'air •')}
          {breathingState.phase === 'exhale' && (isKidsMode ? '🌸 Laisse sortir l\'air tout doucement 🌸' : '→ Contraction progressive vers le centre ←')}
        </div>

        {/* NOUVEAU : Debug des timings utilisés par l'animation */}
        {breathingState.currentPattern && (
          <div className="mt-4 text-xs text-blue-300 bg-black/20 rounded-lg p-2">
            🫁 <strong>ANIMATION ACTIVE :</strong> {breathingState.inhaleTime}s inspiration 
            {breathingState.holdTime > 0 && ` / ${breathingState.holdTime}s pause`} / {breathingState.exhaleTime}s expiration
            <div className="text-green-300 mt-1">
              ✅ Pattern reçu et appliqué correctement
              {isKidsMode && ' • 👶 Mode enfants détecté automatiquement'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};