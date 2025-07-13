import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Target, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function Recentrage() {
  const navigate = useNavigate();
  const { setCurrentSession } = useAppStore();

  const sessions = [
    { 
      id: 'switch', 
      name: 'SWITCH', 
      icon: Target, 
      time: '1min 45s', 
      desc: 'Sérénité express',
      color: 'from-red-500 to-orange-500' 
    },
    { 
      id: 'reset', 
      icon: RotateCcw, 
      name: 'RESET', 
      time: '3min', 
      desc: 'Crise de calme & Insomnie',
      color: 'from-indigo-500 to-purple-500' 
    },
  ];

  const handleSessionClick = (sessionId) => {
    setCurrentSession(sessionId);
    navigate(`/sessions/run/guided/${sessionId}`);
  };

  const handleGoBack = () => {
    navigate('/sessions/guidees');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Recentrage</h1>
        <p className="text-white/70">Sessions d'urgence et réalignement</p>
      </div>

      <div className="grid gap-4 mb-8">
        {sessions.map((session) => {
          const Icon = session.icon;
          return (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className="bg-white/8 border border-white/15 rounded-xl p-4 cursor-pointer hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{session.name}</h3>
                  <p className="text-white/70 text-sm">{session.time} • {session.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGoBack}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour
        </button>
      </div>
    </div>
  );
}