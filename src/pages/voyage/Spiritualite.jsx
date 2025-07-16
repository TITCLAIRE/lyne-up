import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function Spiritualite() {
  const navigate = useNavigate();
  const { setCurrentMeditation, setCurrentSession } = useAppStore();

  const handleMeditationSelect = () => {
    setCurrentMeditation('metatron');
    setCurrentSession('meditation');
    navigate('/sessions/run/guided/meditation');
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

      {/* Message de maintenance */}
      <div className="grid gap-3 mb-8">
        <div
          onClick={handleMeditationSelect}
          className="bg-gradient-to-r from-violet-700/20 to-purple-700/20 border border-violet-700/30 rounded-xl p-6 hover:scale-[1.02] transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <Star size={32} className="text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">🌟 Invocation de l'Archange Métatron</h3>
              <p className="text-white/70">Connexion à l'Archange des Archives Akashiques</p>
              <p className="text-white/50 text-sm mt-1">5 minutes • Synthèse vocale</p>
            </div>
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