import React from 'react';
import { Home, Moon, Brain, Zap, Flame, Cookie, Shield } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const hypnosisSessions = [
  { 
    id: 'stress', 
    name: 'Libérer le Stress Aigu', 
    icon: Zap, 
    duration: 10, 
    desc: 'Retrouver calme et équilibre', 
    color: 'from-green-500/20 to-teal-500/20',
    borderColor: 'border-green-500/30',
    isPremium: false
  },
  { 
    id: 'pain', 
    name: 'Soulager la Douleur', 
    icon: Flame, 
    duration: 10, 
    desc: 'Libération des tensions et apaisement', 
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
    isPremium: false
  },
  { 
    id: 'sieste', 
    name: 'Sieste Relaxante', 
    icon: Moon, 
    duration: 10, 
    desc: 'Récupération profonde en 10 min', 
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    isPremium: false
  },
  { 
    id: 'stress', 
    name: 'Gestion du Stress', 
    icon: Brain, 
    duration: 10, 
    desc: 'Anxiété & Stress', 
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    isPremium: true
  },
  { 
    id: 'cravings', 
    name: 'Libération Compulsions', 
    icon: Cookie, 
    duration: 10, 
    desc: 'Sucre, tabac, écrans...', 
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'border-amber-500/30',
    isPremium: true
  },
  { 
    id: 'confidence', 
    name: 'Confiance & Résilience', 
    icon: Shield, 
    duration: 10, 
    desc: 'Renforcement mental', 
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    isPremium: true
  },
];

export const HypnosisSelectionScreen = () => {
  const { setCurrentScreen, setCurrentSession, isAuthenticated } = useAppStore();

  const handleSessionSelect = (sessionId, isPremium) => {
    if (isPremium && !isAuthenticated) {
      // Rediriger vers la page d'authentification si session premium et non connecté
      setCurrentScreen('auth');
      return;
    }
    
    setCurrentSession(sessionId);
    setCurrentScreen('hypnosisSession');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Auto-Hypnose</h1>
        <p className="text-white/70">Séances guidées pour transformation profonde</p>
      </div>

      <div className="grid gap-3 mb-8">
        {hypnosisSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => handleSessionSelect(session.id, session.isPremium)}
            className={`bg-gradient-to-r ${session.color} border ${session.borderColor} rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl">
                <session.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{session.name}</h3>
                  {session.isPremium && (
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-xs text-black font-bold px-2 py-0.5 rounded-full">
                      PREMIUM
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm">{session.duration}min • {session.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Moon size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-indigo-200 font-medium mb-1">Comment ça fonctionne :</p>
            <p className="text-xs text-white/70 mb-2">
              Chaque séance combine respiration guidée, sons binauraux et suggestions hypnotiques pour une transformation profonde.
            </p>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• 3 min d'induction douce avec respiration guidée</li>
              <li>• 6 min de suggestions hypnotiques ciblées</li>
              <li>• 1 min de retour progressif à l'éveil</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGoHome}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour
        </button>
      </div>
    </div>
  );
};