import React from 'react';
import { Menu } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const Header = () => {
  const { toggleMenu } = useAppStore();

  return (
    <header className="flex items-center justify-between p-5 relative z-10">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-blue-900/50 backdrop-blur-sm border border-blue-700 shadow-lg">
          <img 
            src="/logo/ChatGPT Image 21 juin 2025, 18_14_03.png" 
            alt="Instant Opportun Logo" 
            className="w-10 h-10 object-contain"
            onError={(e) => {
              const target = e.target;
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent truncate">
            Instant Opportun
          </h1>
          <div className="flex flex-col">
            <p className="text-sm text-blue-700 truncate">
              Cohérence Cardiaque Intégrative
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={toggleMenu}
        className="w-11 h-11 bg-blue-900/50 border-2 border-blue-700 rounded-xl flex items-center justify-center hover:bg-blue-800/50 transition-colors flex-shrink-0 shadow-lg"
      >
        <Menu size={20} className="text-blue-100" />
      </button>
    </header>
  );
};