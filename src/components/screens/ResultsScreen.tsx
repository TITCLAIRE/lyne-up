import React from 'react';
import { Home, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const ResultsScreen: React.FC = () => {
  const { setCurrentScreen, biometricData } = useAppStore();

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  const handleNewSession = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center max-w-md mx-auto">
        {/* Icône de succès */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🧘‍♀️</span>
          </div>
          <div className="text-6xl">🎉</div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Session complétée !</h1>
        <p className="text-white/70 mb-8">Félicitations pour cette pratique</p>

        {/* Résultats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {biometricData.coherence}%
            </div>
            <div className="text-sm text-white/70">Cohérence finale</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {biometricData.breathingRate.toFixed(1)}
            </div>
            <div className="text-sm text-white/70">Rythme final</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {biometricData.heartRate || '--'}
            </div>
            <div className="text-sm text-white/70">FC finale</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {biometricData.hrv || '--'}
            </div>
            <div className="text-sm text-white/70">HRV finale</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            <Home size={20} />
            Retour
          </button>
          <button
            onClick={handleNewSession}
            className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
          >
            <RotateCcw size={20} />
            Nouvelle
          </button>
        </div>
      </div>
    </div>
  );
};