import React from 'react';
import { Menu } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const Header: React.FC = () => {
  const { toggleMenu } = useAppStore();

  return (
    <header className="flex items-center justify-between p-5 relative z-10">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
          <img 
            src="/assets/logo.png" 
            alt="Lyne-Up Logo" 
            className="w-10 h-10 object-contain"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<span class="text-2xl">🧘‍♀️</span>';
                parent.classList.add('bg-gradient-to-br', 'from-cyan-400', 'to-purple-500');
              }
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent truncate">
            Lyne-Up
          </h1>
          <div className="flex flex-col">
            <p className="text-xs text-white/70 truncate">
              By L'Instant Opportun
            </p>
            <p className="text-sm text-white/70 truncate">
              Cohérence cardiaque intégrative
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={toggleMenu}
        className="w-11 h-11 bg-white/10 border-2 border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <Menu size={20} />
      </button>
    </header>
  );
};