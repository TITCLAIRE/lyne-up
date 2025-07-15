import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, UserCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function HomeScreen() {
  return (
    <div className="px-5 pb-5">
      <div className="grid gap-6">
        <Link to="/intro/libre" className="home-card bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={36} className="mb-4 text-pink-400" />
            <h2 className="text-xl font-bold mb-2">Cohérence Cardiaque Intégrative</h2>
            <span className="text-white/70">Stress & performance</span>
          </div>
        </Link>

        <Link to="/intro/guidees" className="home-card bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="relative mb-4">
              <Heart size={36} className="text-blue-400" />
              <UserCircle size={20} className="absolute -bottom-1 -right-1 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Cohérence Cardiaque Guidée</h2>
            <span className="text-white/70">Détente, concentration, sommeil</span>
          </div>
        </Link>

        <Link to="/intro/voyage" className="home-card bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Sparkles size={36} className="mb-4 text-purple-400" />
            <h2 className="text-xl font-bold mb-2">Méditations & Auto-hypnose Guidées</h2>
            <span className="text-white/70">Voyage intérieur</span>
          </div>
        </Link>

        <Link to="/intro/blog" className="home-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <BookOpen size={36} className="mb-4 text-green-400" />
            <h2 className="text-xl font-bold mb-2">Le Blog</h2>
            <span className="text-white/70">Lire, voir, écouter, tester</span>
          </div>
        </Link>
      </div>

      {/* Blog Card */}
      <div className="mt-6">
        <a 
          href="https://www.thierrythomas.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/8 border border-white/15 rounded-2xl p-4 block hover:bg-white/12 transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">LE BLOG</h3>
              <p className="text-xs text-white/60">Articles, vidéos et inspirations</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}