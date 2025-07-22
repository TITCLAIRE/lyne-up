import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Shield, Moon, Zap, Heart, Lock, Crown } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { weeklyPrograms } from '../data/programs';

export default function IntroPrograms() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const navigate = useNavigate();
  const { setCurrentSession, setCurrentMeditation, updateCoherenceSettings, isAuthenticated, userProfile } = useAppStore();

  // Vérifier si l'utilisateur est Premium
  const isPremium = userProfile?.isPremium || false;

  // Icônes pour les programmes
  const programIcons = {
    antiStress: Shield,
    sommeil: Moon,
    energie: Zap,
    equilibre: Heart
  };

  // Sélectionner automatiquement un programme aléatoire au chargement
  useEffect(() => {
    const today = new Date().toDateString();
    const savedProgram = localStorage.getItem('selectedProgram');
    
    if (savedProgram) {
      const { programId, date } = JSON.parse(savedProgram);
      if (date === today) {
        setSelectedProgram(programId);
        return;
      }
    }
    
    // Générer un programme aléatoire pour aujourd'hui
    const programIds = Object.keys(weeklyPrograms);
    const randomProgramId = programIds[Math.floor(Math.random() * programIds.length)];
    setSelectedProgram(randomProgramId);
    
    localStorage.setItem('selectedProgram', JSON.stringify({
      programId: randomProgramId,
      date: today
    }));
  }, []);

  const handleStartProgram = (programId) => {
    if (!isAuthenticated || !isPremium) {
      navigate('/auth');
      return;
    }
    
    // Sauvegarder le programme sélectionné et la date de début
    const startDate = new Date().toISOString();
    localStorage.setItem('activeProgram', JSON.stringify({
      programId,
      startDate,
      currentDay: 1
    }));
    
    // Démarrer la première session du programme
    const program = weeklyPrograms[programId];
    const firstSession = program.sessions[0];
    startProgramSession(firstSession);
  };

  const startProgramSession = (sessionData) => {
    switch (sessionData.session) {
      case 'switch':
      case 'reset':
      case 'progressive':
      case 'kids':
      case 'seniors':
      case 'scan':
        setCurrentSession(sessionData.session);
        navigate(`/sessions/run/guided/${sessionData.session}`);
        break;
        
      case 'coherence':
        updateCoherenceSettings({
          duration: parseInt(sessionData.duration.replace('min', '')),
          rhythm: sessionData.rhythm || '5-5',
          gongEnabled: true,
          silentMode: false
        });
        setCurrentSession('coherence');
        navigate('/sessions/run/coherence');
        break;
        
      case 'meditation':
        setCurrentMeditation(sessionData.subtype);
        setCurrentSession('meditation');
        navigate('/sessions/run/guided/meditation');
        break;
        
      case 'hypnosis':
        setCurrentSession(sessionData.subtype);
        navigate(`/sessions/run/hypnosis/${sessionData.subtype}`);
        break;
        
      case 'free':
        navigate('/sessions/libre');
        break;
        
      default:
        navigate('/');
    }
  };

  const selectedProgramData = selectedProgram ? weeklyPrograms[selectedProgram] : null;
  const IconComponent = selectedProgramData ? programIcons[selectedProgram] : Calendar;

  return (
    <div className="intro-screen">
      <div className="icon animate-pulse-gentle">
        <Calendar size={64} className="text-purple-400" />
      </div>
      
      <h1>Programmes Thématiques sur 7 Jours</h1>
      
      <p>
        Suivez un parcours structuré et progressif pour atteindre vos objectifs bien-être. 
        Chaque programme combine différentes techniques pour une transformation en profondeur.
      </p>

      {/* Programme du jour */}
      {selectedProgramData && (
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <IconComponent size={32} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedProgramData.name}</h3>
              <p className="text-white/70 text-sm">{selectedProgramData.description}</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-white mb-3">Programme de 7 jours :</h4>
            <div className="grid gap-2">
              {selectedProgramData.sessions.slice(0, 3).map((session, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center text-xs font-bold">
                    {session.day}
                  </div>
                  <span className="text-white/80">{session.title}</span>
                  <span className="text-white/50 text-xs ml-auto">{session.duration}</span>
                </div>
              ))}
              <div className="text-center text-white/60 text-xs mt-2">
                ... et 4 autres sessions
              </div>
            </div>
          </div>

          {isAuthenticated && isPremium ? (
            <button
              onClick={() => handleStartProgram(selectedProgram)}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
            >
              <Play size={20} />
              Commencer le programme
            </button>
          ) : !isAuthenticated ? (
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
            >
              <Lock size={20} />
              Se connecter pour commencer
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
            >
              <Crown size={20} />
              Passer Premium pour débloquer
            </button>
          )}
        </div>
      )}

      {/* Message pour utilisateurs non Premium */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-200 mb-3">Autres programmes disponibles :</h4>
          <div className="grid gap-2 text-xs text-blue-100/80">
            {Object.values(weeklyPrograms)
              .filter(program => program.id !== selectedProgram)
              .map((program, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  {program.name}
                </div>
              ))}
          </div>
          <p className="text-xs text-blue-100/60 mt-3">
            Un nouveau programme vous sera proposé demain !
          </p>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Crown size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-200 font-medium mb-1">
                {!isAuthenticated ? 'Fonctionnalité Premium :' : 'Passez Premium :'}
              </p>
              <p className="text-xs text-white/70">
                {!isAuthenticated 
                  ? 'Les programmes thématiques sur 7 jours nécessitent un compte Premium. Créez votre compte et passez Premium pour débloquer ces parcours guidés.'
                  : 'Les programmes thématiques sur 7 jours sont réservés aux membres Premium. Passez Premium pour débloquer tous les parcours guidés et fonctionnalités avancées.'
                }
              </p>
              {isPremium === false && isAuthenticated && (
                <div className="mt-3 bg-amber-500/10 rounded-lg p-3">
                  <p className="text-xs text-amber-100/90">
                    💎 <strong>Premium à vie :</strong> 9,99€ • Accès à tous les programmes, méditations premium, voix enregistrées et bien plus !
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}