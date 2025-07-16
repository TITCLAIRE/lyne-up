import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Info } from 'lucide-react';

export default function Spiritualite() {
  const navigate = useNavigate();

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
      <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Info size={24} className="text-amber-400 mt-1 flex-shrink-0" />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-amber-200 mb-2">Méditations en préparation</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-3">
              Nos méditations spirituelles sont actuellement en cours de préparation pour vous offrir 
              une expérience optimale. Elles seront disponibles très prochainement.
            </p>
            <div className="bg-amber-500/10 rounded-lg p-3">
              <p className="text-xs text-amber-100/90">
                ✨ <strong>À venir :</strong> Invocation de l'Archange Métatron, Connexion aux Guides Spirituels, 
                Méditation des Chakras, et bien plus encore.
              </p>
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