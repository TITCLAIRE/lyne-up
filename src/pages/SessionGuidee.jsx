import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Target, RotateCcw, TrendingUp, Baby, Users, Brain, Moon } from 'lucide-react';

export default function SessionGuidee() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Cohérence Cardiaque Guidée</h1>
        <p className="text-white/70">Choisissez votre type de session</p>
      </div>

      <div className="grid gap-4 mb-8">
        <Link to="/sessions/guidees/recentrage" className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">🌿 Recentrage</h3>
              <p className="text-white/70 text-sm">SWITCH, RESET - Urgence & Réalignement</p>
            </div>
          </div>
        </Link>

        <Link to="/sessions/guidees/evolution" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">🧠 Évolution</h3>
              <p className="text-white/70 text-sm">TRAINING, SESSION LIBRE - Progression respiratoire</p>
            </div>
          </div>
        </Link>

        <Link to="/sessions/guidees/famille" className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-4 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Baby size={24} className="text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">👨‍👩‍👧 Famille</h3>
              <p className="text-white/70 text-sm">KIDS, SENIORS+ - Adapté à tous les âges</p>
            </div>
          </div>
        </Link>

        <Link to="/sessions/guidees/scan" className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-4 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Brain size={24} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">🧘 Body Scan</h3>
              <p className="text-white/70 text-sm">SCAN CORPOREL - Relaxation profonde guidée</p>
            </div>
          </div>
        </Link>

        <Link to="/sessions/guidees/sommeil" className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-4 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Moon size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">😴 Sommeil Profond</h3>
              <p className="text-white/70 text-sm">SLEEP - Préparation au sommeil réparateur</p>
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