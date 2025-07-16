import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { spiritualMeditations } from '../../data/meditations';

export default function Spiritualite() {
  const navigate = useNavigate();
  const { setCurrentMeditation, setCurrentSession, setCurrentScreen } = useAppStore();

  const spiritualMeditationsList = [
    { 
      id: 'metatron', 
      name: 'Invocation de l\'Archange Métatron', 
      icon: Star, 
      duration: 5, 
      desc: 'Connexion à l\'Archange Métatron',
      color: 'from-violet-700/20 to-purple-700/20',
      borderColor: 'border-violet-700/30'
    }
  ];

  const handleMeditationSelect = (meditationId) => {
    setCurrentMeditation(meditationId);
    setCurrentSession('meditation');
    navigate(`/sessions/run/guided/meditation`);
  };

  const handleGoBack = () => {
    navigate('/sessions/voyage');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Spiritualité</h1>
        <p className="text-white/70">Connexion à l'univers et aux énergies supérieures</p>
      </div>

      <div className="grid gap-3 mb-8">
        {spiritualMeditationsList.map((meditation) => {
          const IconComponent = meditation.icon;
          return (
            <div
              key={meditation.id}
              onClick={() => handleMeditationSelect(meditation.id)}
              className={`bg-gradient-to-r ${meditation.color} border ${meditation.borderColor} rounded-xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl">
                  <IconComponent size={24} className="text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{meditation.name}</h3>
                  <p className="text-white/70 text-sm">{meditation.duration}min • {meditation.desc}</p>
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