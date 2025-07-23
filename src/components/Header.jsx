import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const Header = () => {
  const { toggleMenu } = useAppStore();

  return (
    <header className="flex items-center justify-between p-5 relative z-10">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link to="/" className="flex items-center gap-3 flex-1 min-w-0">
          <img 
            src="/logo/Logo Respir.io web.png" 
            alt="Respir.io Logo" 
            className="h-8 object-contain"
            onError={(e) => {
              const target = e.target;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<span class="text-white text-xl font-bold">Respir.io</span>';
              }
            }}
          />
        </Link>
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