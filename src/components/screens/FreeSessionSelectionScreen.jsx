import React from 'react';
import { Home, Play, Minus, Plus } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const FreeSessionSelectionScreen = () => {
  const { 
    setCurrentScreen, 
    freeSessionSettings, 
    updateFreeSessionSettings,
    setCurrentSession 
  } = useAppStore();

  const handleInhaleTimeChange = (delta) => {
    const newTime = Math.max(3, Math.min(9, freeSessionSettings.inhaleTime + delta));
    updateFreeSessionSettings({ inhaleTime: newTime });
  };

  const handleExhaleTimeChange = (delta) => {
    const newTime = Math.max(3, Math.min(9, freeSessionSettings.exhaleTime + delta));
    updateFreeSessionSettings({ exhaleTime: newTime });
  };

  const handleDurationChange = (delta) => {
    const newDuration = Math.max(3, Math.min(20, freeSessionSettings.duration + delta));
    updateFreeSessionSettings({ duration: newDuration });
  };

  const handleToggleGong = () => {
    updateFreeSessionSettings({ gongEnabled: !freeSessionSettings.gongEnabled });
  };

  const handleToggleSilent = () => {
    const newSilentMode = !freeSessionSettings.silentMode;
    updateFreeSessionSettings({ 
      silentMode: newSilentMode,
      gongEnabled: !newSilentMode
    });
  };

  const handleStart = () => {
    setCurrentSession('free');
    setCurrentScreen('freeSession');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  const totalCycleTime = freeSessionSettings.inhaleTime + freeSessionSettings.exhaleTime;
  const cyclesPerMinute = Math.round(60 / totalCycleTime * 10) / 10;

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Session Libre</h1>
        <p className="text-white/70">Personnalisez votre rythme respiratoire</p>
      </div>

      {/* Configuration du rythme respiratoire */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">🫁 Rythme respiratoire</h3>
        
        {/* Temps d'inspiration */}
        <div className="bg-white/8 border border-white/15 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Inspiration</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleInhaleTimeChange(-1)}
                disabled={freeSessionSettings.inhaleTime <= 3}
                className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <span className="text-2xl font-bold w-12 text-center">
                {freeSessionSettings.inhaleTime}s
              </span>
              <button
                onClick={() => handleInhaleTimeChange(1)}
                disabled={freeSessionSettings.inhaleTime >= 9}
                className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="text-xs text-white/60">
            Durée de l'inspiration (3-9 secondes)
          </div>
        </div>

        {/* Temps d'expiration */}
        <div className="bg-white/8 border border-white/15 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Expiration</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExhaleTimeChange(-1)}
                disabled={freeSessionSettings.exhaleTime <= 3}
                className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <span className="text-2xl font-bold w-12 text-center">
                {freeSessionSettings.exhaleTime}s
              </span>
              <button
                onClick={() => handleExhaleTimeChange(1)}
                disabled={freeSessionSettings.exhaleTime >= 9}
                className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="text-xs text-white/60">
            Durée de l'expiration (3-9 secondes)
          </div>
        </div>

        {/* Résumé du rythme */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold mb-1">
              Rythme {freeSessionSettings.inhaleTime}/{freeSessionSettings.exhaleTime}
            </div>
            <div className="text-sm text-white/70">
              {cyclesPerMinute} cycles par minute • Cycle de {totalCycleTime}s
            </div>
          </div>
        </div>
      </div>

      {/* Configuration de la durée */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">⏱️ Durée de la session</h3>
        <div className="bg-white/8 border border-white/15 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Durée totale</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDurationChange(-1)}
                disabled={freeSessionSettings.duration <= 3}
                className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <span className="text-2xl font-bold w-16 text-center">
                {freeSessionSettings.duration} min
              </span>
              <button
                onClick={() => handleDurationChange(1)}
                disabled={freeSessionSettings.duration >= 20}
                className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="text-xs text-white/60">
            Durée de la session (3-20 minutes)
          </div>
        </div>
      </div>

      {/* Options audio */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🔊 Options audio</h3>
        <div className="bg-white/8 rounded-2xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span>Sons binauraux</span>
            <button
              onClick={handleToggleGong}
              className={`w-12 h-6 rounded-full transition-colors ${
                freeSessionSettings.gongEnabled ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                freeSessionSettings.gongEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <div className="text-center pt-2">
            <button
              onClick={handleToggleSilent}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                freeSessionSettings.silentMode
                  ? 'bg-pink-500/30 border-2 border-pink-500/50 text-white'
                  : 'bg-white/10 border-2 border-white/30 text-white/70'
              }`}
            >
              {freeSessionSettings.silentMode ? '🔊 Mode normal' : '🔇 Mode silencieux'}
            </button>
          </div>
        </div>
      </div>

      {/* Aperçu de la session */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
          <h4 className="font-semibold mb-2">📊 Aperçu de votre session</h4>
          <div className="text-sm text-white/80 space-y-1">
            <div>• Rythme : {freeSessionSettings.inhaleTime}s inspiration / {freeSessionSettings.exhaleTime}s expiration</div>
            <div>• Durée : {freeSessionSettings.duration} minutes</div>
            <div>• Cycles totaux : ~{Math.round(freeSessionSettings.duration * cyclesPerMinute)}</div>
            <div>• Audio : {freeSessionSettings.silentMode ? 'Mode silencieux' : 'Sons binauraux activés'}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleStart}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
        >
          <Play size={20} />
          Commencer la session
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