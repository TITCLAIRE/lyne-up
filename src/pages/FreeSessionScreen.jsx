import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Home, Headphones, Target, Brain, Lock } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function FreeSessionScreen() {
  const navigate = useNavigate();
  const { freeSessionType, endFreeSession } = useAppStore();
  
  // Détermine quelle session gratuite afficher
  const sessionInfo = freeSessionType === 'scan' 
    ? {
        name: 'SCAN CORPOREL',
        icon: Brain,
        description: 'Relaxation profonde guidée de tout le corps',
        duration: '10 minutes',
        color: 'from-indigo-500 to-purple-500'
      }
    : {
        name: 'FOCUS',
        icon: Target,
        description: 'Concentration et clarté mentale',
        duration: '5 minutes',
        color: 'from-blue-500 to-cyan-500'
      };
  
  const handleStartSession = () => {
    // Naviguer vers la page de session appropriée
    if (freeSessionType === 'scan') {
      navigate('/sessions/run/guided/scan');
    } else {
      navigate('/sessions/run/guided/focus');
    }
  };
  
  const handleGoBack = () => {
    endFreeSession();
    navigate('/start');
  };
  
  const handlePremiumClick = () => {
    // Cette fonction sera mise à jour dans la Phase 3 pour naviguer vers PremiumScreen
    alert('Fonctionnalité premium - Bientôt disponible !');
  };
  
  const SessionIcon = sessionInfo.icon;
  
  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      <div className="p-5 flex-1 flex flex-col">
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
          <div className={`bg-gradient-to-r ${sessionInfo.color}/20 border border-${sessionInfo.color.split(' ')[0]}/30 rounded-2xl p-6 mb-8`}>
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
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-purple-400" />
                <span className="text-sm text-purple-200 font-medium">Voix premium</span>
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
                <Lock size={16} className="text-purple-400" />
                <span className="text-sm text-purple-200 font-medium">Sons binauraux thérapeutiques</span>
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
                <Lock size={16} className="text-purple-400" />
                <span className="text-sm text-purple-200 font-medium">Toutes les séances (15+)</span>
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
                <Play size={20} />
                Commencer la séance gratuite
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