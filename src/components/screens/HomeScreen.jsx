import React from 'react';
import { Heart, Target, Zap, Waves, Brain, Sparkles, Baby, RotateCcw, TrendingUp, Settings, Users, Wind, Moon } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

// Sessions d'urgence et réalignement
const urgencyAndRealignmentSessions = [
  { id: 'switch', icon: Target, name: 'SWITCH', time: '1min 45s', color: 'from-red-500 to-orange-500' },
  { id: 'reset', icon: RotateCcw, name: 'RESET', time: '3min', color: 'from-indigo-500 to-purple-500' },
];

// Sessions d'initiation et perfectionnement
const initiationAndPerfectionSessions = [
  { id: 'progressive', icon: TrendingUp, name: 'TRAINING', time: '3min', color: 'from-green-500 to-emerald-500' },
  { id: 'freeSessionSelection', icon: Settings, name: 'SESSION LIBRE', time: '3-20min', color: 'from-purple-500 to-pink-500' },
];

// Sessions pour enfants et seniors
const ageSpecificSessions = [
  { id: 'kids', icon: Baby, name: 'KIDS', time: '2min', color: 'from-pink-400 to-purple-400' },
  { id: 'seniors', icon: Users, name: 'SENIORS +', time: '5min', color: 'from-blue-400 to-cyan-400' },
];

// Sessions de voyage intérieur
const innerJourneySessions = [
  { id: 'scan', icon: Brain, name: 'SCAN CORPOREL', time: '10min', color: 'from-indigo-500 to-purple-500' },
  { id: 'meditation', icon: Sparkles, name: 'MÉDITATIONS', time: '5-10min', color: 'from-pink-500 to-rose-500' }
];

// Sessions d'auto-hypnose
const hypnosisSessions = [
  { id: 'hypnosis', icon: Moon, name: 'AUTO-HYPNOSE', time: '10min', color: 'from-indigo-400 to-purple-600' },
];

export const HomeScreen = () => {
  const { setCurrentScreen, setCurrentSession } = useAppStore();

  const handleSessionClick = (sessionId) => {
    console.log('Session sélectionnée:', sessionId);
    if (sessionId === 'meditation') {
      setCurrentScreen('meditationSelection');
    } else if (sessionId === 'hypnosis') {
      setCurrentScreen('hypnosisSelection');
    } else if (sessionId === 'freeSessionSelection') {
      setCurrentScreen('freeSessionSelection');
    } else {
      setCurrentSession(sessionId);
      setCurrentScreen('session');
    }
  };

  const handleCoherenceClick = () => {
    console.log('Cohérence Cardiaque Intégrative sélectionnée');
    setCurrentScreen('coherenceSelection');
  };

  return (
    <div className="px-5 pb-5">
      {/* Module Cohérence Cardiaque Intégrative principal */}
      <div 
        onClick={handleCoherenceClick}
        className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 rounded-2xl p-6 mb-6 cursor-pointer hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">COHÉRENCE CARDIAQUE INTÉGRATIVE</h2>
          <p className="text-white/70">3 min - 5 min - 15 min</p>
        </div>
      </div>

      {/* Section Recentrage - SWITCH et RESET côte à côte */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap size={18} />
            Recentrage
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {urgencyAndRealignmentSessions.map((session) => {
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
                  <p className="text-xs text-white/60">{session.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Évolution - TRAINING et SESSION LIBRE côte à côte */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp size={18} />
            Évolution
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {initiationAndPerfectionSessions.map((session) => {
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
                  <p className="text-xs text-white/60">{session.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Famille - KIDS et SENIORS + côte à côte */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={18} />
            Famille
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ageSpecificSessions.map((session) => {
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
                  <p className="text-xs text-white/60">{session.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Auto-Hypnose */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Moon size={18} />
            Auto-Hypnose
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {hypnosisSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-white/8 border border-white/15 rounded-2xl p-4 cursor-pointer hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">{session.name}</h3>
                    <p className="text-xs text-white/60">{session.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Présence */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Heart size={18} />
            Présence
          </h2>
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
                  <p className="text-xs text-white/60">{session.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};