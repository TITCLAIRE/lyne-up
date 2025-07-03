import React from 'react';
import { Play, Heart, Headphones, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const TrialCoherenceSelectionScreen = () => {
  const { 
    setCurrentScreen, 
    trialCoherenceSettings, 
    updateTrialCoherenceSettings,
    setCurrentSession 
  } = useAppStore();

  const rhythms = [
    { 
      value: '5-5', 
      label: 'Rythme 5/5', 
      desc: 'Équilibre classique - Recommandé pour débuter',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      value: '4-6', 
      label: 'Rythme 4/6', 
      desc: 'Anti-stress - Expiration plus longue pour la relaxation',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
  ];

  const handleRhythmSelect = (rhythm) => {
    updateTrialCoherenceSettings({ rhythm });
  };

  const handleStart = () => {
    setCurrentSession('coherence');
    setCurrentScreen('coherenceSession');
  };

  return (
    <div className="px-5 pb-5">
      {/* En-tête spécial session d'essai */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-400/30 backdrop-blur-sm">
            <Heart size={32} className="text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Session d'Essai Gratuite
            </h1>
            <p className="text-white/70 text-lg">Découvrez la cohérence cardiaque</p>
          </div>
        </div>

        {/* Message d'accueil pour l'essai */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <Sparkles size={24} className="text-green-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-green-200 mb-2">Bienvenue dans votre première expérience !</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Cette session d'essai de <strong>5 minutes</strong> vous permettra de découvrir les bienfaits 
                de la cohérence cardiaque avec des sons binauraux thérapeutiques.
              </p>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs text-green-100/90">
                  ✨ <strong>Inclus dans votre essai :</strong> Guidage vocal premium, sons binauraux 0.1Hz, 
                  animation respiratoire synchronisée et gong de transition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélection de rythme */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Choisissez votre rythme respiratoire</h3>
        <div className="grid gap-4">
          {rhythms.map((rhythm) => (
            <div
              key={rhythm.value}
              onClick={() => handleRhythmSelect(rhythm.value)}
              className={`bg-gradient-to-r ${rhythm.color} border-2 ${
                trialCoherenceSettings.rhythm === rhythm.value
                  ? 'border-green-400/60 bg-green-500/20'
                  : rhythm.borderColor
              } rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2">{rhythm.label}</h4>
                <p className="text-white/80 text-sm leading-relaxed">{rhythm.desc}</p>
                {trialCoherenceSettings.rhythm === rhythm.value && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-xs font-medium">Sélectionné</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations sur la session */}
      <div className="mb-8">
        <div className="bg-white/8 rounded-2xl p-6">
          <h4 className="font-semibold mb-4 text-center">Votre session d'essai</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-cyan-400 mb-1">5 min</div>
              <div className="text-sm text-white/70">Durée</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">0.1Hz</div>
              <div className="text-sm text-white/70">Fréquence</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-white/70">
              Rythme sélectionné : <span className="text-white font-medium">
                {trialCoherenceSettings.rhythm || 'Aucun'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Indication importante sur les écouteurs */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-left">
          <p className="text-sm text-blue-200 font-medium mb-1">Important pour votre essai :</p>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Les sons binauraux nécessitent impérativement l'utilisation d'écouteurs stéréo 
            pour créer l'effet thérapeutique entre les deux oreilles.
          </p>
        </div>
      </div>

      {/* Bouton de démarrage */}
      <div className="text-center">
        <button
          onClick={handleStart}
          disabled={!trialCoherenceSettings.rhythm}
          className={`w-full py-6 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
            trialCoherenceSettings.rhythm
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-[1.02]'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          <Play size={24} />
          {trialCoherenceSettings.rhythm 
            ? 'Commencer Ma Session d\'Essai Gratuite' 
            : 'Sélectionnez un rythme pour commencer'
          }
        </button>
        
        {trialCoherenceSettings.rhythm && (
          <p className="text-xs text-white/60 mt-3">
            Session gratuite • Aucun engagement • Découverte complète
          </p>
        )}
      </div>
    </div>
  );
};