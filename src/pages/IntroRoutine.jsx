import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Target, Shuffle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { getRandomDailySession, getSessionRoute } from '../data/programs';

export default function IntroRoutine() {
  const [todaySession, setTodaySession] = useState(null);
  const navigate = useNavigate();
  const { setCurrentSession, setCurrentMeditation, updateCoherenceSettings, updateFreeSessionSettings } = useAppStore();

  // Générer une session aléatoire pour aujourd'hui
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
    const randomSession = getRandomDailySession();
    setTodaySession(randomSession);
    
    // Sauvegarder la session du jour
    localStorage.setItem('dailyRoutineSession', JSON.stringify({
      session: randomSession,
      date: today
    }));
  }, []);

  const handleStartRoutine = () => {
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

  return (
    <div className="intro-screen">
      <div className="icon animate-pulse-gentle">
        <Target size={64} className="text-orange-400" />
      </div>
      
      <h1>Chaque jour, l'Instant Opportun choisit pour vous une session aléatoire, adaptée à votre équilibre du moment.</h1>
      
      <p>
        Une façon simple et surprenante de découvrir toute la richesse de l'application, 
        sans retomber dans vos habitudes ou toujours refaire les mêmes exercices.
      </p>
      
      <p>
        <strong>Laissez-vous guider... et respirez la nouveauté.</strong>
      </p>

      {/* Aperçu de la session du jour */}
      {todaySession && (
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shuffle size={20} className="text-orange-400" />
            <h3 className="font-semibold text-orange-200">Votre session du jour :</h3>
          </div>
          <div className="text-center">
            <h4 className="text-xl font-bold text-white mb-1">{todaySession.name}</h4>
            <p className="text-white/70 text-sm mb-2">{todaySession.desc}</p>
            <div className="text-orange-300 text-sm">
              Durée : {todaySession.duration}
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={handleStartRoutine}
        disabled={!todaySession}
        className={`btn-primary ${!todaySession ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Play size={20} className="mr-2" />
        Commencer ma routine du jour
      </button>
    </div>
  );
}