import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { spiritualMeditations } from '../../data/meditations';

export default function Spiritualite() {
  const navigate = useNavigate();
  const { setCurrentMeditation, setCurrentSession } = useAppStore();

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
        {Object.entries(spiritualMeditations).map(([id, meditation]) => {
          const IconComponent = Star; // Utiliser Star comme icône par défaut
          return (
            <div
              key={id}
              onClick={() => handleMeditationSelect(id)}
              className={`bg-gradient-to-r from-violet-700/20 to-purple-700/20 border border-violet-700/30 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl">
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{meditation.name}</h3>
                  <p className="text-white/70 text-sm">{meditation.duration}min • {meditation.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-violet-700/10 to-purple-700/10 border border-violet-700/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Star size={20} className="text-violet-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-violet-200 font-medium mb-1">À propos de la spiritualité :</p>
            <p className="text-xs text-white/70">
              Ces méditations vous connectent aux énergies supérieures et aux guides spirituels.
              Elles vous aident à élever votre conscience et à accéder à des dimensions plus subtiles de l'existence.
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