import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Home, Headphones, Heart, Lock, Music, Wind } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function FreeSessionScreen() {
  const navigate = useNavigate();
  const { endFreeSession, updateFreeSessionSettings, freeSessionSettings, setCurrentSession } = useAppStore();
  
  // État local pour les paramètres de session
  const [selectedRhythm, setSelectedRhythm] = React.useState('5-5');
  const [selectedFrequency, setSelectedFrequency] = React.useState('coherence');
  
  // Information sur la session de cohérence cardiaque
  const sessionInfo = {
    name: 'COHÉRENCE CARDIAQUE',
    icon: Heart,
    description: 'Harmonisez votre rythme cardiaque et respiratoire',
    duration: '5 minutes',
    color: 'from-pink-500 to-purple-500'
  };

  // Liste des fréquences disponibles
  const frequencies = [
    { value: 'coherence', name: '0.1 Hz - Cohérence cardiaque', category: 'Cohérence' },
    { value: '396hz', name: '396 Hz - Libération des peurs', category: 'Solfège' },
    { value: '432hz', name: '432 Hz - Harmonie naturelle', category: 'Solfège' },
    { value: '528hz', name: '528 Hz - Amour & Guérison', category: 'Solfège' },
    { value: '639hz', name: '639 Hz - Relations harmonieuses', category: 'Solfège' },
    { value: 'theta', name: 'Ondes Theta (4.5Hz) - Méditation profonde', category: 'Ondes cérébrales' },
    { value: 'alpha', name: 'Ondes Alpha (10Hz) - Relaxation active', category: 'Ondes cérébrales' },
    { value: 'delta', name: 'Ondes Delta (2Hz) - Sommeil profond', category: 'Ondes cérébrales' },
  ];
  
  // Fonction pour mettre à jour le rythme
  const handleRhythmChange = (rhythm) => {
    setSelectedRhythm(rhythm);
    
    // Mettre à jour les paramètres de session libre
    if (rhythm === '5-5') {
      updateFreeSessionSettings({ inhaleTime: 5, exhaleTime: 5 });
    } else if (rhythm === '4-6') {
      updateFreeSessionSettings({ inhaleTime: 4, exhaleTime: 6 });
    }
  };
  
  // Fonction pour mettre à jour la fréquence
  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    setSelectedFrequency(frequency);
    updateFreeSessionSettings({ frequency });
  };
  
  const handleStartSession = () => {
    // Mettre à jour les paramètres finaux
    updateFreeSessionSettings({ 
      duration: 5, // 5 minutes pour la session découverte
      rhythm: selectedRhythm,
      frequency: selectedFrequency,
      gongEnabled: true,
      silentMode: false
    });
    
    // Définir la session active et naviguer vers la page de session
    setCurrentSession('coherence');
    navigate('/sessions/run/guided/coherence');
  };
  
  const handleGoBack = () => {
    endFreeSession();
    navigate('/start');
  };
  
  const handlePremiumClick = () => {
    // Cette fonction sera mise à jour dans la Phase 3 pour naviguer vers PremiumScreen
    alert('Fonctionnalité premium - Bientôt disponible !');
    // Rediriger vers la page d'authentification
    navigate('/auth');
  };
  
  const SessionIcon = sessionInfo.icon;
  
  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Image de fond directe pour la session libre */}
      <img 
        src="/Fond app.png" 
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: 0.06,
          filter: 'hue-rotate(190deg) brightness(1.1) contrast(0.8)',
          mixBlendMode: 'overlay'
        }}
      />
      
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Séance Gratuite
            </h1>
            <p className="text-white/70 text-lg">
              Découvrez la puissance de la cohérence cardiaque
            </p>
          </div>
          
          {/* Carte de session */}
          <div className={`bg-gradient-to-r ${sessionInfo.color} border border-${sessionInfo.color.split(' ')[0]}/30 rounded-2xl p-6 mb-8`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${sessionInfo.color} rounded-xl flex items-center justify-center`}>
                <SessionIcon size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{sessionInfo.name}</h2>
                <p className="text-white/70">{sessionInfo.description}</p>
                <p className="text-sm text-white/50">{sessionInfo.duration}</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-white/80">
                Cette séance gratuite vous permet de découvrir les bienfaits de la cohérence cardiaque 
                avec un guidage vocal et une animation respiratoire synchronisée.
              </p>
            </div>
          </div>

          {/* Options de personnalisation */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Personnalisez votre expérience</h3>
            
            {/* Sélection du rythme respiratoire */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Wind size={18} />
                Rythme respiratoire
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => handleRhythmChange('5-5')}
                  className={`bg-white/8 border rounded-xl p-3 cursor-pointer text-center transition-all duration-200 ${
                    selectedRhythm === '5-5'
                      ? 'border-pink-500/50 bg-pink-500/20'
                      : 'border-white/15 hover:bg-white/12'
                  }`}
                >
                  <div className="font-medium">Rythme 5/5</div>
                  <div className="text-xs text-white/70">Équilibre classique</div>
                </div>
                <div
                  onClick={() => handleRhythmChange('4-6')}
                  className={`bg-white/8 border rounded-xl p-3 cursor-pointer text-center transition-all duration-200 ${
                    selectedRhythm === '4-6'
                      ? 'border-pink-500/50 bg-pink-500/20'
                      : 'border-white/15 hover:bg-white/12'
                  }`}
                >
                  <div className="font-medium">Rythme 4/6</div>
                  <div className="text-xs text-white/70">Anti-stress</div>
                </div>
              </div>
            </div>
            
            {/* Sélection de fréquence */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Music size={18} />
                Fréquence thérapeutique
              </h4>
              <div className="bg-white/8 border border-white/15 rounded-xl p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Choisissez votre fréquence
                  </label>
                  <select
                    value={selectedFrequency}
                    onChange={handleFrequencyChange}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Indication importante sur les écouteurs */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
            <Headphones size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-blue-200 font-medium mb-1">Pour une expérience optimale :</p>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Utilisez des écouteurs stéréo et installez-vous dans un endroit calme où vous ne serez pas dérangé(e).
              </p>
            </div>
          </div>
          
          {/* Fonctionnalités premium verrouillées */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-purple-300" />
                <span className="text-sm text-white font-medium">Voix premium</span>
              </div>
              <button 
                onClick={handlePremiumClick}
                className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                Premium
              </button>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-purple-300" />
                <span className="text-sm text-white font-medium">Scan corporel guidé</span>
              </div>
              <button 
                onClick={handlePremiumClick}
                className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                Premium
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-purple-300" />
                <span className="text-sm text-white font-medium">Toutes les séances (15+)</span>
              </div>
              <button 
                onClick={handlePremiumClick}
                className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                Premium
              </button>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="mt-auto">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleStartSession}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                <Play size={24} />
                Commencer ma séance de cohérence cardiaque
              </button>
              <button
                onClick={handleGoBack}
                className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
              >
                <Home size={20} />
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}