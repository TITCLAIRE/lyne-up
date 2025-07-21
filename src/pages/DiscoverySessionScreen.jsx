import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Headphones, Wind } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function DiscoverySessionScreen() {
  const navigate = useNavigate();
  const [selectedRhythm, setSelectedRhythm] = useState('5-5');
  
  const { 
    updateFreeSessionSettings,
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
    setSelectedRhythm(rhythm);
  };

  const handleStartSession = () => {
    // Configurer les paramètres de la session découverte
    if (selectedRhythm === '5-5') {
      updateFreeSessionSettings({ 
        inhaleTime: 5, 
        exhaleTime: 5,
        duration: 6, // 6 minutes
        frequency: 'coherence', // 0.1 Hz
        gongEnabled: true,
        silentMode: false
      });
    } else if (selectedRhythm === '4-6') {
      updateFreeSessionSettings({ 
        inhaleTime: 4, 
        exhaleTime: 6,
        duration: 6, // 6 minutes
        frequency: 'coherence', // 0.1 Hz
        gongEnabled: true,
        silentMode: false
      });
    }
    
    // Définir la session active et naviguer vers la page de session
    setCurrentSession('free');
    navigate('/sessions/run/discovery');
  };

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Image de fond directe pour la session découverte */}
      <img 
        src="/Fond app.png" 
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: 0.05,
          filter: 'hue-rotate(180deg) brightness(1.1) contrast(0.8)',
          mixBlendMode: 'overlay'
        }}
      />
      
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 backdrop-blur-sm">
                <Heart size={32} className="text-cyan-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Séance Découverte
            </h1>
            <p className="text-white/70 text-lg">
              Cohérence cardiaque intégrative - 6 minutes
            </p>
          </div>

          {/* Sélection de rythme */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <Wind size={20} />
              Choisissez votre rythme respiratoire
            </h3>
            <div className="grid gap-4">
              {rhythms.map((rhythm) => (
                <div
                  key={rhythm.value}
                  onClick={() => handleRhythmSelect(rhythm.value)}
                  className={`bg-gradient-to-r ${rhythm.color} border-2 ${
                    selectedRhythm === rhythm.value
                      ? 'border-cyan-400/60 bg-cyan-500/20'
                      : rhythm.borderColor
                  } rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
                >
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-2">{rhythm.label}</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{rhythm.desc}</p>
                    {selectedRhythm === rhythm.value && (
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-cyan-300 text-xs font-medium">Sélectionné</span>
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
              <h4 className="font-semibold mb-4 text-center">Votre session découverte</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">6 min</div>
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
                    {selectedRhythm}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Indication importante sur les écouteurs */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
            <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-blue-200 font-medium mb-1">Important :</p>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Les sons binauraux nécessitent impérativement l'utilisation d'écouteurs stéréo 
                pour créer l'effet thérapeutique entre les deux oreilles.
              </p>
            </div>
          </div>

          {/* Bouton de démarrage */}
          <div className="mt-auto">
            <button
              onClick={handleStartSession}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
            >
              <Play size={24} />
              Commencer ma séance découverte
            </button>
            
            <p className="text-xs text-white/60 mt-3 text-center">
              Session gratuite • 6 minutes • Découverte complète
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}