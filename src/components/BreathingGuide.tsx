import React from 'react';

export interface BreathingState {
  phase: 'inhale' | 'exhale' | 'idle';
  progress: number;
  counter: number;
  instruction: string;
  emoji: string;
}

interface BreathingGuideProps {
  breathingState: BreathingState;
  isActive: boolean;
}

export const BreathingGuide: React.FC<BreathingGuideProps> = ({ 
  breathingState, 
  isActive 
}) => {
  // Déterminer la couleur selon la phase
  const getBarColor = () => {
    switch (breathingState.phase) {
      case 'inhale':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500';
      case 'exhale':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="max-w-md mx-auto">
        {/* Instruction */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-4xl">{breathingState.emoji}</span>
          <span className="text-xl font-medium">{breathingState.instruction}</span>
        </div>

        {/* Barre de respiration */}
        <div className="relative mb-6">
          {/* Container de la barre */}
          <div className="w-full h-16 bg-white/10 rounded-full border-2 border-white/20 relative overflow-hidden">
            {/* Barre de progression */}
            <div 
              className={`h-full rounded-full transition-all duration-100 ease-linear ${getBarColor()}`}
              style={{ 
                width: `${breathingState.progress}%`,
                minWidth: breathingState.progress > 0 ? '2%' : '0%'
              }}
            />
          </div>
          
          {/* Compteur au centre */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white drop-shadow-lg">
              {isActive ? breathingState.counter : '--'}
            </span>
          </div>
        </div>

        {/* Indicateurs de phase */}
        <div className="flex justify-between text-sm">
          <div className={`px-4 py-2 rounded-full transition-all duration-300 ${
            breathingState.phase === 'inhale' 
              ? 'bg-cyan-500/30 border-2 border-cyan-500/50 text-white font-semibold' 
              : 'text-white/60 border-2 border-transparent'
          }`}>
            🌬️ Inspire
          </div>
          
          <div className={`px-4 py-2 rounded-full transition-all duration-300 ${
            breathingState.phase === 'exhale' 
              ? 'bg-purple-500/30 border-2 border-purple-500/50 text-white font-semibold' 
              : 'text-white/60 border-2 border-transparent'
          }`}>
            💨 Expire
          </div>
        </div>
      </div>
    </div>
  );
};