import React from 'react';
import { Heart, Target, Zap, Waves, Brain, Sparkles, Baby, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

// Sessions d'urgence et réalignement
const urgencyAndRealignmentSessions = [
  { id: 'switch', icon: Zap, name: 'SWITCH', time: '1min 45s', color: 'from-red-500 to-orange-500', baseline: 'Sérénité express' },
  { id: 'reset', icon: RotateCcw, name: 'RESET', time: '3min', color: 'from-indigo-500 to-purple-500', baseline: 'Crise de calme & Insomnie' },
];

// NOUVEAU : Sessions pour enfants
const kidsSessions = [
  { id: 'kids', icon: Baby, name: 'KIDS', time: '2min', color: 'from-pink-400 to-purple-400', baseline: 'Respiration magique pour les petits' },
];

// Sessions de voyage intérieur
const innerJourneySessions = [
  { id: 'scan', icon: Brain, name: 'Scan Corporel', time: '10min', color: 'from-indigo-500 to-purple-500', baseline: 'Relaxation profonde guidée' },
  { id: 'meditation', icon: Sparkles, name: 'Méditations', time: '5-10min', color: 'from-pink-500 to-rose-500', baseline: 'Thèmes personnalisés' },
];

export const HomeScreen = () => {
  const { setCurrentScreen, setCurrentSession } = useAppStore();

  const handleSessionClick = (sessionId) => {
    console.log('🎯 Clic sur session:', sessionId);
    if (sessionId === 'meditation') {
      setCurrentScreen('meditationSelection');
    } else {
      setCurrentSession(sessionId);
      setCurrentScreen('session');
    }
  };

  const handleCoherenceClick = () => {
    console.log('💖 Clic sur Cohérence Cardiaque');
    setCurrentScreen('coherenceSelection');
  };

  return (
    <div className="px-5 pb-5">
      {/* Module Cohérence Cardiaque principal */}
      <div 
        onClick={handleCoherenceClick}
        className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 rounded-2xl p-6 mb-6 cursor-pointer hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cohérence Cardiaque</h2>
          <p className="text-white/70">3 min - 5 min - 15 min<br />Pour recentrer le système nerveux</p>
        </div>
      </div>

      {/* NOUVEAU : Section Enfants */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            👶 Espace Enfants
          </h2>
          <span className="text-sm text-white/60 italic">respiration magique</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {kidsSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-white/8 border border-white/15 rounded-2xl p-4 cursor-pointer hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{session.name}</h3>
                    <p className="text-sm text-white/60 mb-1">{session.time}</p>
                    <p className="text-sm text-white/50 italic">{session.baseline}</p>
                    <div className="text-xs text-pink-300 mt-1">
                      🫁 Rythme 4/4 • Adapté aux enfants
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Urgence & Réalignement */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            ⚡ Urgence & Réalignement
          </h2>
          <span className="text-sm text-white/60 italic">sessions guidées</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {urgencyAndRealignmentSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-white/8 border border-white/15 rounded-2xl p-4 cursor-pointer hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{session.name}</h3>
                    <p className="text-sm text-white/60 mb-1">{session.time}</p>
                    <p className="text-sm text-white/50 italic">{session.baseline}</p>
                    {session.id === 'reset' && (
                      <div className="text-xs text-indigo-300 mt-1">
                        🫁 Rythme 4/7/8 • Technique du Dr. Andrew Weil
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Voyage Intérieur */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🧘‍♀️ Voyage Intérieur
          </h2>
          <span className="text-sm text-white/60 italic">sessions guidées</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {innerJourneySessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-white/8 border border-white/15 rounded-2xl p-4 cursor-pointer hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="text-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{session.name}</h3>
                  <p className="text-xs text-white/60 mb-1">{session.time}</p>
                  <p className="text-xs text-white/50 italic">{session.baseline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};