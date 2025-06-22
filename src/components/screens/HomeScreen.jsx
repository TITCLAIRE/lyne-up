import React from 'react';
import { Heart, Target, Zap, Waves, Brain, Sparkles, Baby, RotateCcw, TrendingUp, Settings, Users } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

// Sessions d'urgence et réalignement
const urgencyAndRealignmentSessions = [
  { id: 'switch', icon: Target, name: 'SWITCH', time: '1min 45s', color: 'from-red-500 to-orange-500', baseline: 'Sérénité express' },
  { id: 'reset', icon: RotateCcw, name: 'RESET', time: '3min', color: 'from-indigo-500 to-purple-500', baseline: 'Crise de calme & Insomnie' },
];

// Sessions d'initiation et perfectionnement
const initiationAndPerfectionSessions = [
  { id: 'progressive', icon: TrendingUp, name: 'TRAINING', time: '3min', color: 'from-green-500 to-emerald-500', baseline: 'Progression 3/3 → 4/4 → 5/5' },
  { id: 'freeSessionSelection', icon: Settings, name: 'SESSION LIBRE', time: '3-20min', color: 'from-purple-500 to-pink-500', baseline: 'Rythme et durée personnalisables' },
];

// Sessions pour enfants et seniors
const ageSpecificSessions = [
  { id: 'kids', icon: Baby, name: 'KIDS', time: '2min', color: 'from-pink-400 to-purple-400', baseline: 'Respiration magique pour les petits' },
  { id: 'seniors', icon: Users, name: 'SENIORS +', time: '5min', color: 'from-blue-400 to-cyan-400', baseline: 'Relaxation & baisse de la tension' },
];

// Sessions de voyage intérieur - NOMS EN CAPITALES
const innerJourneySessions = [
  { id: 'scan', icon: Brain, name: 'SCAN CORPOREL', time: '10min', color: 'from-indigo-500 to-purple-500', baseline: 'Relaxation profonde guidée' },
  { id: 'meditation', icon: Sparkles, name: 'MÉDITATIONS', time: '5-10min', color: 'from-pink-500 to-rose-500', baseline: 'Thèmes personnalisés' },
];

export const HomeScreen = () => {
  const { setCurrentScreen, setCurrentSession } = useAppStore();

  const handleSessionClick = (sessionId) => {
    console.log('🎯 Clic sur session:', sessionId);
    if (sessionId === 'meditation') {
      setCurrentScreen('meditationSelection');
    } else if (sessionId === 'freeSessionSelection') {
      setCurrentScreen('freeSessionSelection');
    } else {
      setCurrentSession(sessionId);
      setCurrentScreen('session');
    }
  };

  const handleCoherenceClick = () => {
    console.log('💖 Clic sur Cohérence Cardiaque Intégrative');
    setCurrentScreen('coherenceSelection');
  };

  return (
    <div className="px-5 pb-5">
      {/* Module Cohérence Cardiaque Intégrative principal - EN CAPITALES */}
      <div 
        onClick={handleCoherenceClick}
        className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-blue-700 rounded-2xl p-6 mb-6 cursor-pointer hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-[1.02] shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-blue-900">COHÉRENCE CARDIAQUE INTÉGRATIVE</h2>
          <p className="text-blue-700">3 min - 5 min - 15 min<br />Pour recentrer le système nerveux</p>
        </div>
      </div>

      {/* Section Urgence & Réalignement - SWITCH et RESET côte à côte */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
            ⚡ Urgence & Réalignement
          </h2>
          <span className="text-sm text-blue-700 italic">sessions guidées</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {urgencyAndRealignmentSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 cursor-pointer hover:bg-blue-800/50 transition-all duration-200 hover:scale-[1.02] shadow-md"
              >
                <div className="text-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-blue-100">{session.name}</h3>
                  <p className="text-xs text-blue-200 mb-1">{session.time}</p>
                  <p className="text-xs text-blue-300 italic">{session.baseline}</p>
                  {session.id === 'reset' && (
                    <div className="text-xs text-indigo-300 mt-1">
                      🫁 Rythme 4/7/8
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Initiation & Perfectionnement - TRAINING et SESSION LIBRE côte à côte */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
            📈 Initiation & Perfectionnement
          </h2>
          <span className="text-sm text-blue-700 italic">progression guidée</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {initiationAndPerfectionSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 cursor-pointer hover:bg-blue-800/50 transition-all duration-200 hover:scale-[1.02] shadow-md"
              >
                <div className="text-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-blue-100">{session.name}</h3>
                  <p className="text-xs text-blue-200 mb-1">{session.time}</p>
                  <p className="text-xs text-blue-300 italic">{session.baseline}</p>
                  {session.id === 'progressive' && (
                    <div className="text-xs text-green-300 mt-1">
                      🫁 3/3 → 4/4 → 5/5
                    </div>
                  )}
                  {session.id === 'freeSessionSelection' && (
                    <div className="text-xs text-purple-300 mt-1">
                      🫁 3-9s • 3-20min
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Espace Enfants & Seniors - KIDS et SENIORS + côte à côte */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
            👥 Espace Enfants & Seniors
          </h2>
          <span className="text-sm text-blue-700 italic">adaptés par âge</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ageSpecificSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 cursor-pointer hover:bg-blue-800/50 transition-all duration-200 hover:scale-[1.02] shadow-md"
              >
                <div className="text-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-blue-100">{session.name}</h3>
                  <p className="text-xs text-blue-200 mb-1">{session.time}</p>
                  <p className="text-xs text-blue-300 italic">{session.baseline}</p>
                  {session.id === 'kids' && (
                    <div className="text-xs text-pink-300 mt-1">
                      🫁 Rythme 4/4 • Adapté aux enfants
                    </div>
                  )}
                  {session.id === 'seniors' && (
                    <div className="text-xs text-cyan-300 mt-1">
                      🫁 Rythme 3/4 • Adapté aux seniors
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Voyage Intérieur - NOMS EN CAPITALES */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
            🧘‍♀️ Voyage Intérieur
          </h2>
          <span className="text-sm text-blue-700 italic">sessions guidées</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {innerJourneySessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-blue-900/50 border border-blue-700 rounded-2xl p-4 cursor-pointer hover:bg-blue-800/50 transition-all duration-200 hover:scale-[1.02] shadow-md"
              >
                <div className="text-center">
                  <div className={`w-10 h-10 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 text-blue-100">{session.name}</h3>
                  <p className="text-xs text-blue-200 mb-1">{session.time}</p>
                  <p className="text-xs text-blue-300 italic">{session.baseline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};