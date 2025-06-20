import React from 'react';
import { Heart, Target, Zap, Waves, Brain, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const sessions = [
  { id: 'sos', icon: Zap, name: 'SOS Stress', time: '1min 30s', color: 'from-red-500 to-orange-500' },
  { id: 'focus', icon: Target, name: 'Focus', time: '3min', color: 'from-blue-500 to-cyan-500' },
  { id: 'recovery', icon: Heart, name: 'Récup', time: '5min', color: 'from-green-500 to-emerald-500' },
  { id: 'transition', icon: Waves, name: 'Transition', time: '3min', color: 'from-purple-500 to-pink-500' },
  { id: 'scan', icon: Brain, name: 'Scan Corporel', time: '10min', color: 'from-indigo-500 to-purple-500' },
  { id: 'meditation', icon: Sparkles, name: 'Méditations', time: '5-10min', color: 'from-pink-500 to-rose-500' },
];

export const HomeScreen: React.FC = () => {
  const { setCurrentScreen, setCurrentSession, setCurrentMeditation } = useAppStore();

  const handleSessionClick = (sessionId: string) => {
    if (sessionId === 'meditation') {
      setCurrentScreen('meditationSelection');
    } else {
      setCurrentSession(sessionId as any);
      setCurrentScreen('session');
    }
  };

  const handleCoherenceClick = () => {
    setCurrentScreen('coherenceSelection');
  };

  return (
    <div className="px-5 pb-5">
      {/* Module Cohérence Cardiaque principal */}
      <div 
        onClick={handleCoherenceClick}
        className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 rounded-2xl p-6 mb-8 cursor-pointer hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cohérence Cardiaque</h2>
          <p className="text-white/70">3 min - 5 min - 15 min<br />Pour recentrer le système nerveux</p>
        </div>
      </div>

      {/* Sessions guidées */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🎯 Sessions guidées
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {sessions.map((session) => {
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