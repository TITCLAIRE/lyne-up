import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, HandHeart, Target, Calendar } from 'lucide-react';
import { getRandomDailySession } from '../data/programs';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [dailySession, setDailySession] = useState(null);
  const [weeklyProgram, setWeeklyProgram] = useState(null);

  // Générer une session aléatoire pour la routine quotidienne
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('dailyRoutineSession');
    
    if (savedDaily) {
      const { session, date } = JSON.parse(savedDaily);
      if (date === today) {
        setDailySession(session);
        return;
      }
    }
    
    // Générer nouvelle session pour aujourd'hui
    const randomSession = getRandomDailySession();
    setDailySession(randomSession);
    localStorage.setItem('dailyRoutineSession', JSON.stringify({
      session: randomSession,
      date: today
    }));
  }, []);

  // Générer un programme aléatoire pour la semaine
  useEffect(() => {
    const weeklyPrograms = [
      { name: '7 jours Anti-Stress', path: '/sessions/guidees/recentrage', session: 'switch' },
      { name: 'Retrouver le Sommeil', path: '/sessions/guidees/sommeil', session: 'sleep' },
      { name: 'Boost d\'Énergie', path: '/sessions/voyage/meditations', session: 'confidence' },
      { name: 'Équilibre Émotionnel', path: '/sessions/voyage/meditations', session: 'love' }
    ];
    
    const today = new Date().toDateString();
    const savedWeekly = localStorage.getItem('weeklyProgramSession');
    
    if (savedWeekly) {
      const { program, date } = JSON.parse(savedWeekly);
      if (date === today) {
        setWeeklyProgram(program);
        return;
      }
    }
    
    // Générer nouveau programme pour aujourd'hui
    const randomProgram = weeklyPrograms[Math.floor(Math.random() * weeklyPrograms.length)];
    setWeeklyProgram(randomProgram);
    localStorage.setItem('weeklyProgramSession', JSON.stringify({
      program: randomProgram,
      date: today
    }));
  }, []);

  return (
    <div className="px-5 pb-5">
      {/* Grille principale 2x3 */}
      <div className="grid grid-cols-2 gap-4 auto-rows-fr mb-6">
        {/* Ligne 1 : Cohérence Cardiaque */}

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

        {/* Ligne 2 : Méditation et Routine Quotidienne */}
        <Link to="/intro/voyage" className="home-card bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-2 border-violet-500/30">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Heart size={32} className="mb-4 text-violet-400" />
            <h2 className="text-lg font-bold mb-1">Méditation & Auto-hypnose</h2>
            <span className="text-white/70 text-xs">Voyage intérieur</span>
          </div>
        </Link>

        {/* Routine Quotidienne */}
        <Link 
          to="/intro/routine"
          className="home-card bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/30"
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Target size={32} className="mb-4 text-orange-400" />
            <h2 className="text-lg font-bold mb-1">Routine Quotidienne</h2>
            <span className="text-white/70 text-xs">Laissez-vous surprendre</span>
          </div>
        </Link>

        {/* Ligne 3 : Programmes 7 jours et Le Blog */}
        {/* Programmes 7 jours */}
        <Link 
          to="/intro/programs"
          className="home-card bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30"
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Calendar size={32} className="mb-4 text-purple-400" />
            <h2 className="text-lg font-bold mb-1">Programmes 7 jours</h2>
            <span className="text-white/70 text-xs">Parcours thématiques guidés</span>
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