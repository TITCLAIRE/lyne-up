import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

export default function HomeScreen() {
  return (
    <div className="px-5 pb-5">
      <div className="grid gap-6">
        <Link to="/sessions/libre" className="home-card bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={36} className="mb-4 text-pink-400" />
            <h2 className="text-xl font-bold mb-2">🎯 Cohérence Cardiaque Intégrative</h2>
            <span className="text-white/70">Stress & performance</span>
          </div>
        </Link>

        <Link to="/sessions/guidees" className="home-card bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <h2 className="text-xl font-bold mb-2">🌬️ Cohérence Cardiaque Guidée</h2>
            <span className="text-white/70">Détente, concentration, sommeil</span>
          </div>
        </Link>

        <Link to="/sessions/voyage" className="home-card bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Sparkles size={36} className="mb-4 text-purple-400" />
            <h2 className="text-xl font-bold mb-2">🌀 Méditations & Auto-hypnose Guidées</h2>
            <span className="text-white/70">Voyage intérieur</span>
          </div>
        </Link>

        <Link to="/blog" className="home-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <BookOpen size={36} className="mb-4 text-green-400" />
            <h2 className="text-xl font-bold mb-2">📚 Le Blog</h2>
            <span className="text-white/70">Lire, voir, écouter, tester</span>
          </div>
        </Link>
      </div>
    </div>
  );
}