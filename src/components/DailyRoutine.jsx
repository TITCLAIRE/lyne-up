import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Shuffle, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { getRandomDailySession, getSessionRoute } from '../data/programs';

export default function DailyRoutine() {
  const [todaySession, setTodaySession] = useState(null);
  const navigate = useNavigate();
  const { setCurrentSession, setCurrentMeditation, updateCoherenceSettings, updateFreeSessionSettings } = useAppStore();

  // Générer une nouvelle session aléatoire
  const generateNewSession = () => {
    const randomSession = getRandomDailySession();
    setTodaySession(randomSession);
    
    // Sauvegarder la session du jour dans le localStorage avec la date
    const today = new Date().toDateString();
    localStorage.setItem('dailyRoutineSession', JSON.stringify({
      session: randomSession,
      date: today
    }));
  };

  // Charger la session du jour au montage du composant
  useEffect(() => {
    const today = new Date().toDateString();
    const savedRoutine = localStorage.getItem('dailyRoutineSession');
    
    if (savedRoutine) {
      const { session, date } = JSON.parse(savedRoutine);
      
      // Si c'est le même jour, utiliser la session sauvegardée
      if (date === today) {
        setTodaySession(session);
        return;
      }
    }
    
    // Sinon, générer une nouvelle session pour aujourd'hui
    generateNewSession();
  }, []);

  const handleStartSession = () => {
    if (!todaySession) return;

    // Configurer le store selon le type de session
    switch (todaySession.type) {
      case 'guided':
        setCurrentSession(todaySession.id);
        navigate(`/sessions/run/guided/${todaySession.id}`);
        break;
        
      case 'coherence':
        // Configurer les paramètres de cohérence cardiaque
        const duration = todaySession.id === 'coherence-5' ? 5 : 15;
        updateCoherenceSettings({
          duration: duration,
          rhythm: todaySession.rhythm,
          gongEnabled: true,
          silentMode: false
        });
        setCurrentSession('coherence');
        navigate('/sessions/run/coherence');
        break;
        
      case 'meditation':
        setCurrentMeditation(todaySession.subtype);
        setCurrentSession('meditation');
        navigate('/sessions/run/guided/meditation');
        break;
        
      case 'hypnosis':
        setCurrentSession(todaySession.subtype);
        navigate(`/sessions/run/hypnosis/${todaySession.subtype}`);
        break;
        
      default:
        navigate('/');
    }
  };

  if (!todaySession) {
    return (
      <div className="bg-white/8 border border-white/15 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="ml-3 text-white/70">Préparation de votre routine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Shuffle size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-200">🎯 Ma routine du jour</h3>
            <button
              onClick={generateNewSession}
              className="text-xs bg-green-500/20 text-green-200 px-3 py-1 rounded-full border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center gap-1"
            >
              <Shuffle size={12} />
              Changer
            </button>
          </div>
          
          <p className="text-white/70 text-sm mb-4">
            Laissez l'application choisir pour vous. Respirez. C'est le bon moment.
          </p>
          
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white">{todaySession.name}</h4>
              <div className="flex items-center gap-1 text-xs text-white/60">
                <Clock size={12} />
                {todaySession.duration}
              </div>
            </div>
            <p className="text-sm text-white/70">{todaySession.desc}</p>
          </div>
          
          <button
            onClick={handleStartSession}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
          >
            <Play size={18} />
            Commencer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}