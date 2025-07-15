import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, UserCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function HomeScreen() {
  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-2 gap-4">
        <Link to="/intro/libre" className="home-card bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={32} className="mb-4 text-pink-400" />
            <h2 className="text-lg font-bold mb-1">Cohérence Cardiaque</h2>
            <span className="text-white/70 text-xs">Stress & performance</span>
          </div>
        </Link>

        <Link to="/intro/guidees" className="home-card bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="relative mb-4">
              <Heart size={32} className="text-blue-400" />
              <UserCircle size={18} className="absolute -bottom-1 -right-1 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold mb-1">Cohérence Guidée</h2>
            <span className="text-white/70 text-xs">Détente & sommeil</span>
          </div>
        </Link>

        <Link to="/intro/voyage" className="home-card bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={32} className="mb-4 text-purple-400" />
            <h2 className="text-lg font-bold mb-1">Méditations</h2>
            <span className="text-white/70 text-xs">Voyage intérieur</span>
          </div>
        </Link>

        <Link to="/intro/blog" className="home-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <BookOpen size={32} className="mb-4 text-green-400" />
            <h2 className="text-lg font-bold mb-1">Le Blog</h2>
            <span className="text-white/70 text-xs">Articles & vidéos</span>
          </div>
        </Link>
      </div>
    </div>
  );
}