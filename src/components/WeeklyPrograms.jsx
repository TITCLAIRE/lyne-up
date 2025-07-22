import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Play, CheckCircle, Lock, Shield, Moon, Zap, Heart } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { weeklyPrograms, getCurrentProgramDay } from '../data/programs';

export default function WeeklyPrograms() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const navigate = useNavigate();
  const { setCurrentSession, setCurrentMeditation, updateCoherenceSettings, isAuthenticated } = useAppStore();

  // Icônes pour les programmes
  const programIcons = {
    Shield,
    Moon,
    Zap,
    Heart
  };

  const handleProgramSelect = (programId) => {
    if (!isAuthenticated) {
      // Rediriger vers l'authentification si pas connecté
      navigate('/auth');
      return;
    }
    
    setSelectedProgram(selectedProgram === programId ? null : programId);
  };

  const handleStartProgram = (programId) => {
    if (!isAuthenticated) {
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

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar size={18} />
          Programmes 7 jours
        </h2>
      </div>
      
      <div className="grid gap-3">
        {Object.values(weeklyPrograms).map((program) => {
          const IconComponent = programIcons[program.icon] || Shield;
          const isSelected = selectedProgram === program.id;
          
          return (
            <div key={program.id} className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
              {/* En-tête du programme */}
              <div
                onClick={() => handleProgramSelect(program.id)}
                className={`bg-gradient-to-r ${program.color} border ${program.borderColor} p-4 cursor-pointer hover:bg-opacity-80 transition-all duration-200`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{program.name}</h3>
                      {!isAuthenticated && (
                        <Lock size={16} className="text-white/60" />
                      )}
                    </div>
                    <p className="text-white/70 text-sm">{program.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{program.duration} jours</div>
                    <div className="text-xs text-white/60">
                      {isSelected ? 'Masquer' : 'Voir détails'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Détails du programme (affiché si sélectionné) */}
              {isSelected && (
                <div className="p-4 bg-white/5">
                  <div className="space-y-3 mb-4">
                    {program.sessions.map((session, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {session.day}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{session.title}</div>
                          <div className="text-xs text-white/60">{session.duration}</div>
                        </div>
                        <CheckCircle size={16} className="text-white/40" />
                      </div>
                    ))}
                  </div>
                  
                  {isAuthenticated ? (
                    <button
                      onClick={() => handleStartProgram(program.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                    >
                      <Play size={18} />
                      Commencer le programme
                    </button>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => navigate('/auth')}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      >
                        <Lock size={18} />
                        Se connecter pour commencer
                      </button>
                      <p className="text-xs text-white/60 mt-2">
                        Créez un compte gratuit pour accéder aux programmes
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {!isAuthenticated && (
        <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-200 font-medium mb-1">Programmes Premium :</p>
              <p className="text-xs text-white/70">
                Les programmes thématiques sur 7 jours sont disponibles avec un compte gratuit. 
                Créez votre compte pour débloquer ces parcours guidés.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}