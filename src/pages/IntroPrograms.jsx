import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Shield, Moon, Zap, Heart, Lock, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { weeklyPrograms } from '../data/programs';

export default function IntroPrograms() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [expandedProgram, setExpandedProgram] = useState(null);
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

  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

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

      {/* Liste des programmes disponibles */}
      <div className="w-full max-w-md space-y-4 mb-8">
        {Object.values(weeklyPrograms).map((program) => {
          const IconComponent = programIcons[program.id] || Shield;
          const isExpanded = expandedProgram === program.id;
          const isSelected = selectedProgram === program.id;
          
          return (
            <div key={program.id} className="bg-white/8 border border-white/15 rounded-2xl overflow-hidden">
              {/* En-tête du programme */}
              <div
                onClick={() => handleProgramSelect(program.id)}
                className={`bg-gradient-to-r ${program.color} border ${program.borderColor} p-4 cursor-pointer hover:bg-opacity-80 transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-purple-400/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{program.name}</h3>
                    <p className="text-white/70 text-sm">{program.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">{program.duration} jours</div>
                      <div className="text-xs text-white/60">
                        {isExpanded ? 'Masquer' : 'Voir détails'}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>
              
              {/* Détails du programme (affiché si développé) */}
              {isExpanded && (
                <div className="p-4 bg-white/5">
                  <h4 className="font-semibold text-white mb-3">Programme de 7 jours :</h4>
                  <div className="space-y-2 mb-4">
                    {program.sessions.map((session, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium">
                          {session.day}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{session.title}</div>
                        </div>
                        <div className="text-xs text-white/60">{session.duration}</div>
                      </div>
                    ))}
                  </div>
                  
                  {isAuthenticated && isPremium ? (
                    <button
                      onClick={() => handleStartProgram(program.id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
                    >
                      <Play size={18} />
                      Commencer ce programme
                    </button>
                  ) : !isAuthenticated ? (
                    <button
                      onClick={() => navigate('/auth')}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
                    >
                      <Lock size={18} />
                      Se connecter pour commencer
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/auth')}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                    >
                      <Crown size={18} />
                      Passer Premium pour débloquer
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message pour utilisateurs non Premium */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 w-full max-w-md">
          <div className="flex items-start gap-3">
            <Crown size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-200 font-medium mb-1">
                {!isAuthenticated ? 'Fonctionnalité Premium :' : 'Passez Premium :'}
              </p>
              <p className="text-xs text-white/70 mb-3">
                {!isAuthenticated 
                  ? 'Les programmes thématiques sur 7 jours nécessitent un compte Premium. Créez votre compte et passez Premium pour débloquer ces parcours guidés.'
                  : 'Les programmes thématiques sur 7 jours sont réservés aux membres Premium. Passez Premium pour débloquer tous les parcours guidés et fonctionnalités avancées.'
                }
              </p>
              {isPremium === false && isAuthenticated && (
                <div className="bg-amber-500/10 rounded-lg p-3">
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