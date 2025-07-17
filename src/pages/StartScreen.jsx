import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Headphones, Lock } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function StartScreen() {
  const navigate = useNavigate();
  const { startFreeSession } = useAppStore();

  const handleDiscoverFreeSession = () => {
    // Mettre à jour le store pour indiquer le mode "séance gratuite"
    // Proposer deux options: focus ou scan
    const sessionType = Math.random() > 0.5 ? 'focus' : 'scan';
    startFreeSession(sessionType);
    navigate('/free-session');
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Contenu principal */}
      <div className="flex-1 px-5 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo et titre */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Container du logo principal */}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/20 backdrop-blur-sm animate-float">
                <img 
                  src="/logo/ChatGPT Image 21 juin 2025, 18_14_03.png" 
                  alt="L'Instant Opportun Logo" 
                  className="w-24 h-24 object-contain animate-glow"
                  onError={(e) => {
                    const target = e.target;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-5xl animate-bounce">🧘‍♀️</span>';
                    }
                  }}
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              L'Instant Opportun
            </h1>
            <p className="text-white/80 text-xl">
              Respirez. Vivez mieux.
            </p>
          </div>
          
          {/* Boutons d'action */}
          <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <button
              onClick={handleDiscoverFreeSession}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
            >
              <Headphones size={24} />
              Découvrir une séance gratuite
            </button>
            
            <button
              onClick={handleAuth}
              className="w-full bg-white/10 border-2 border-white/30 text-white py-5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-200"
            >
              <Lock size={24} />
              Se connecter ou créer un compte
            </button>
          </div>
          
          {/* Texte d'information */}
          <div className="mt-12 text-center text-white/60 text-sm animate-fade-in" style={{animationDelay: '0.6s'}}>
            <p>Cohérence cardiaque intégrative</p>
            <p>Guidage vocal premium • Sons binauraux thérapeutiques</p>
          </div>
        </div>
      </div>
    </div>
  );
}