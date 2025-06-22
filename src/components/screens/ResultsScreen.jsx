import React from 'react';
import { Home, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const ResultsScreen = () => {
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

        <h1 className="text-3xl font-bold mb-2 text-blue-900">Session complétée !</h1>
        <p className="text-blue-700 mb-8">Félicitations pour cette pratique</p>

        {/* Résultats simplifiés */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 shadow-md">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {biometricData.coherence}%
            </div>
            <div className="text-sm text-blue-200">Cohérence estimée</div>
          </div>
          <div className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {biometricData.breathingRate.toFixed(1)}
            </div>
            <div className="text-sm text-blue-200">Rythme final</div>
          </div>
          <div className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 shadow-md">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              Excellent
            </div>
            <div className="text-sm text-blue-200">Qualité session</div>
          </div>
          <div className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 shadow-md">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              Complet
            </div>
            <div className="text-sm text-blue-200">Statut</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
          >
            <Home size={20} />
            Retour
          </button>
          <button
            onClick={handleNewSession}
            className="bg-blue-900/50 border-2 border-blue-700 text-blue-100 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-800/50 transition-all duration-200 shadow-md"
          >
            <RotateCcw size={20} />
            Nouvelle
          </button>
        </div>
      </div>
    </div>
  );
};