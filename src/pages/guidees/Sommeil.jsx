import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Moon } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function Sommeil() {
  const navigate = useNavigate();
  const { setCurrentSession, setCurrentMeditation } = useAppStore();

  const sessions = [
    { 
      id: 'sleep', 
      name: 'SOMMEIL PROFOND', 
      icon: Moon, 
      time: '10min', 
      desc: 'Préparation au sommeil réparateur',
      color: 'from-indigo-500 to-purple-500',
      type: 'hypnosis'
    },
    { 
      id: 'sleep', 
      name: 'MÉDITATION SOMMEIL', 
      icon: Moon, 
      time: '10min', 
      desc: 'Préparez-vous au repos',
      color: 'from-blue-500 to-indigo-500',
      type: 'meditation'
    },
  ];

  const handleSessionClick = (session) => {
    if (session.type === 'hypnosis') {
      setCurrentSession(session.id);
      navigate(`/sessions/run/hypnosis/${session.id}`);
    } else if (session.type === 'meditation') {
      setCurrentMeditation(session.id);
      setCurrentSession('meditation');
      navigate(`/sessions/run/guided/meditation`);
    }
  };

  const handleGoBack = () => {
    navigate('/sessions/guidees');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Sommeil Profond</h1>
        <p className="text-white/70">Préparation au sommeil réparateur</p>
      </div>

      <div className="grid gap-4 mb-8">
        {sessions.map((session, index) => {
          const Icon = session.icon;
          return (
            <div
              key={index}
              onClick={() => handleSessionClick(session)}
              className="bg-white/8 border border-white/15 rounded-xl p-4 cursor-pointer hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{session.name}</h3>
                  <p className="text-white/70 text-sm">{session.time} • {session.desc}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {session.type === 'hypnosis' ? 'Auto-hypnose guidée' : 'Méditation thématique'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Moon size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-200 font-medium mb-1">Conseils pour un meilleur sommeil :</p>
            <p className="text-xs text-white/70">
              Pour des résultats optimaux, utilisez ces sessions 15-30 minutes avant de vous coucher, 
              dans un environnement calme et tamisé. Évitez les écrans bleus après la session et 
              laissez-vous naturellement glisser vers le sommeil.
            </p>
          </div>
        </div>
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