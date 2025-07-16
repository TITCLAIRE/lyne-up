import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Sparkles, Moon, Star } from 'lucide-react';

export default function SessionVoyage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Méditations & Auto-hypnose</h1>
        <p className="text-white/70">Choisissez votre voyage intérieur</p>
      </div>

      <div className="grid gap-4 mb-8">
        <Link to="/sessions/voyage/meditations" className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <Sparkles size={32} className="text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">✨ Méditations thématiques</h3>
              <p className="text-white/70">Gratitude, Abondance, Amour, Confiance, Sommeil</p>
              <p className="text-white/50 text-sm mt-1">5-10 minutes • Guidage vocal premium</p>
            </div>
          </div>
        </Link>

        <Link to="/sessions/voyage/spiritualite" className="bg-gradient-to-r from-violet-700/20 to-purple-700/20 border border-violet-700/30 rounded-xl p-6 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <Star size={32} className="text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">🌟 Spiritualité</h3>
              <p className="text-white/70">Invocation de l'Archange Métatron</p>
              <p className="text-white/50 text-sm mt-1">5 minutes • Connexion spirituelle</p>
            </div>
          </div>
        </Link>

        <Link to="/sessions/voyage/hypnose" className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <Moon size={32} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-1">🌀 Auto-hypnoses guidées</h3>
              <p className="text-white/70">Émotions, Addiction, Stress, Douleur, Sommeil</p>
              <p className="text-white/50 text-sm mt-1">10 minutes • Transformation profonde</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGoHome}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}