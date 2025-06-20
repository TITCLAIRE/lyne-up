import React from 'react';
import { Home, Play } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const CoherenceSelectionScreen: React.FC = () => {
  const { 
    setCurrentScreen, 
    coherenceSettings, 
    updateCoherenceSettings,
    setCurrentSession 
  } = useAppStore();

  const durations = [
    { value: 3, label: '3 min', icon: '⚡', desc: 'Rapide' },
    { value: 5, label: '5 min', icon: '🎯', desc: 'Standard' },
    { value: 15, label: '15 min', icon: '🧘', desc: 'Profond' },
  ];

  const rhythms = [
    { value: '5-5', label: 'Rythme 5/5', icon: '⚖️', desc: 'Équilibre' },
    { value: '4-6', label: 'Rythme 4/6', icon: '😌', desc: 'Anti-stress' },
  ];

  const handleDurationSelect = (duration: number) => {
    updateCoherenceSettings({ duration });
  };

  const handleRhythmSelect = (rhythm: string) => {
    updateCoherenceSettings({ rhythm });
  };

  const handleToggleGong = () => {
    updateCoherenceSettings({ gongEnabled: !coherenceSettings.gongEnabled });
  };

  const handleToggleTransition = () => {
    updateCoherenceSettings({ transitionEnabled: !coherenceSettings.transitionEnabled });
  };

  const handleToggleSilent = () => {
    const newSilentMode = !coherenceSettings.silentMode;
    updateCoherenceSettings({ 
      silentMode: newSilentMode,
      gongEnabled: !newSilentMode,
      transitionEnabled: !newSilentMode
    });
  };

  const handleStart = () => {
    setCurrentSession('coherence');
    setCurrentScreen('coherenceSession');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  const canStart = coherenceSettings.duration && coherenceSettings.rhythm;

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Cohérence Cardiaque</h1>
        <p className="text-white/70">Recentrer le système nerveux</p>
      </div>

      {/* Sélection de durée */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">⏱️ Durée de la session</h3>
        <div className="grid grid-cols-3 gap-3">
          {durations.map((duration) => (
            <div
              key={duration.value}
              onClick={() => handleDurationSelect(duration.value)}
              className={`bg-white/8 border rounded-2xl p-3 cursor-pointer text-center transition-all duration-200 ${
                coherenceSettings.duration === duration.value
                  ? 'border-pink-500/50 bg-pink-500/20'
                  : 'border-white/15 hover:bg-white/12'
              }`}
            >
              <div className="text-2xl mb-1">{duration.icon}</div>
              <div className="font-medium text-sm">{duration.label}</div>
              <div className="text-xs text-white/60">{duration.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sélection de rythme */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">🌬️ Rythme respiratoire</h3>
        <div className="grid grid-cols-2 gap-3">
          {rhythms.map((rhythm) => (
            <div
              key={rhythm.value}
              onClick={() => handleRhythmSelect(rhythm.value)}
              className={`bg-white/8 border rounded-2xl p-3 cursor-pointer text-center transition-all duration-200 ${
                coherenceSettings.rhythm === rhythm.value
                  ? 'border-pink-500/50 bg-pink-500/20'
                  : 'border-white/15 hover:bg-white/12'
              }`}
            >
              <div className="text-2xl mb-1">{rhythm.icon}</div>
              <div className="font-medium text-sm">{rhythm.label}</div>
              <div className="text-xs text-white/60">{rhythm.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Options audio */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🔊 Options audio</h3>
        <div className="bg-white/8 rounded-2xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span>Fréquence sonore (0,1 Hz)</span>
            <button
              onClick={handleToggleGong}
              className={`w-12 h-6 rounded-full transition-colors ${
                coherenceSettings.gongEnabled ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                coherenceSettings.gongEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>Gong de transition</span>
            <button
              onClick={handleToggleTransition}
              className={`w-12 h-6 rounded-full transition-colors ${
                coherenceSettings.transitionEnabled ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                coherenceSettings.transitionEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <div className="text-center pt-2">
            <button
              onClick={handleToggleSilent}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                coherenceSettings.silentMode
                  ? 'bg-pink-500/30 border-2 border-pink-500/50 text-white'
                  : 'bg-white/10 border-2 border-white/30 text-white/70'
              }`}
            >
              {coherenceSettings.silentMode ? '🔊 Mode normal' : '🔇 Mode silencieux'}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            canStart
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          <Play size={20} />
          Commencer
        </button>
        <button
          onClick={handleGoHome}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour
        </button>
      </div>
    </div>
  );
};