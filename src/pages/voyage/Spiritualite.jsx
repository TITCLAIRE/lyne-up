import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function Spiritualite() {
  const navigate = useNavigate();
  const { setCurrentMeditation, setCurrentSession } = useAppStore();

  const spiritualMeditations = [
    { 
      id: 'metatron', 
      name: 'Invocation de l\'Archange Métatron', 
      icon: Star, 
      duration: 5, 
      desc: 'Connexion spirituelle avec l\'Archange Métatron', 
      color: 'from-violet-500/20 to-purple-500/20',
      borderColor: 'border-violet-500/30',
      frequency: '741 Hz - Éveil de l\'intuition',
      rhythm: '4/6 - Relaxation profonde'
    },
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
        {spiritualMeditations.map((meditation) => {
          const IconComponent = meditation.icon;
          return (
            <div
              key={meditation.id}
              onClick={() => handleMeditationSelect(meditation.id)}
              className={`bg-gradient-to-r ${meditation.color} border ${meditation.borderColor} rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl">
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{meditation.name}</h3>
                  <p className="text-white/70 text-sm">{meditation.duration}min • {meditation.desc}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-violet-500/20 text-violet-200 px-2 py-1 rounded-full">
                      {meditation.frequency}
                    </span>
                    <span className="text-xs bg-violet-500/20 text-violet-200 px-2 py-1 rounded-full">
                      {meditation.rhythm}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Star size={20} className="text-violet-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-violet-200 font-medium mb-1">À propos de cette méditation :</p>
            <p className="text-xs text-white/70 mb-2">
              L'Archange Métatron est considéré comme le scribe divin et le gardien des archives akashiques. 
              Cette invocation vous connecte à sa sagesse et à son énergie de transformation.
            </p>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• Guidance audio complète de 5 minutes</li>
              <li>• Rythme respiratoire 4/6 pour la relaxation profonde</li>
              <li>• Fréquence 741 Hz pour l'éveil de l'intuition</li>
              <li>• Connexion spirituelle et élévation de conscience</li>
            </ul>
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