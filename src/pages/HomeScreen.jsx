import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, HandHeart } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import DailyRoutine from '../components/DailyRoutine';
import WeeklyPrograms from '../components/WeeklyPrograms';

export default function HomeScreen() {
  return (
    <div className="px-5 pb-5">
      {/* Routine Quotidienne */}
      <DailyRoutine />
      
      {/* Programmes Thématiques */}
      <WeeklyPrograms />
      
      {/* Sessions principales */}
      <div className="grid grid-cols-2 gap-4 auto-rows-fr">
        <Link to="/intro/libre" className="home-card bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={32} className="mb-4 text-pink-400" />
            <h2 className="text-lg font-bold mb-1">Cohérence Cardiaque Intégrative</h2>
            <span className="text-white/70 text-xs">Stress & performance</span>
          </div>
        </Link>

        <Link to="/intro/guidees" className="home-card bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <HandHeart size={32} className="mb-4 text-blue-400" />
            <h2 className="text-lg font-bold mb-1">Cohérence Cardiaque Intégrative Guidée</h2>
            <span className="text-white/70 text-xs">Détente & sommeil</span>
          </div>
        </Link>

        <Link to="/intro/voyage" className="home-card bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={32} className="mb-4 text-purple-400" />
            <h2 className="text-lg font-bold mb-1">Méditation & Auto-hypnose</h2>
            <span className="text-white/70 text-xs">Voyage intérieur</span>
          </div>
        </Link>

        <Link to="/intro/blog" className="home-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <BookOpen size={32} className="mb-4 text-green-400" />
            <h2 className="text-lg font-bold mb-1">Le Blog</h2>
            <span className="text-white/70 text-xs">Lire, écouter, voir & comprendre</span>
          </div>
        </Link>
      </div>
    </div>
  );
}