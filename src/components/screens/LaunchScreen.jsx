import React, { useState } from 'react';
import { ChevronRight, Heart, Headphones, Mic, Sparkles, Play, Settings, Users, Brain } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const LaunchScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setHasOnboarded, setCurrentScreen, updateVoiceSettings } = useAppStore();

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStart = () => {
    setHasOnboarded(true);
    setCurrentScreen('home');
  };

  const handleVoiceSelection = (gender) => {
    updateVoiceSettings({ gender });
  };

  const steps = [
    {
      title: "Bienvenue dans L'Instant Opportun",
      subtitle: "Votre compagnon de bien-être pour la cohérence cardiaque",
      content: (
        <div className="text-center space-y-6">
          {/* Logo animé */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Cercles d'animation de respiration */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 animate-pulse-slow"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-500/30 animate-pulse-medium"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-400/40 to-purple-500/40 animate-pulse-fast"></div>
            
            {/* Container du logo principal */}
            <div className="absolute inset-6 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/20 backdrop-blur-sm animate-float">
              <img 
                src="/logo/ChatGPT Image 21 juin 2025, 18_14_03.png" 
                alt="L'Instant Opportun Logo" 
                className="w-16 h-16 object-contain animate-glow"
                onError={(e) => {
                  const target = e.target;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-4xl animate-bounce">🧘‍♀️</span>';
                  }
                }}
              />
            </div>
            
            {/* Particules flottantes */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-cyan-400 rounded-full animate-float-particle-1"></div>
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-particle-2"></div>
            <div className="absolute -bottom-2 -left-3 w-1 h-1 bg-pink-400 rounded-full animate-float-particle-3"></div>
            <div className="absolute -bottom-1 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-float-particle-4"></div>
          </div>
          
          <div className="space-y-4 animate-fade-in-up">
            <p className="text-lg text-white/80 leading-relaxed">
              Découvrez une approche intégrative du bien-être qui combine cohérence cardiaque, 
              méditations guidées et sons thérapeutiques.
            </p>
            
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-4 animate-slide-in">
              <p className="text-sm text-cyan-200 font-medium mb-2">✨ Votre transformation commence ici</p>
              <p className="text-xs text-white/70">
                Quelques minutes par jour suffisent pour retrouver calme, clarté et équilibre intérieur.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Vos Outils de Bien-être",
      subtitle: "Une gamme complète pour tous vos besoins",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {/* Cohérence Cardiaque */}
            <div className="bg-white/8 border border-white/15 rounded-xl p-4 flex items-start gap-4 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-gentle">
                <Heart size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Cohérence Cardiaque</h3>
                <p className="text-sm text-white/70">Harmonisez votre rythme cardiaque avec des sessions de 3, 5 ou 15 minutes</p>
              </div>
            </div>

            {/* Sessions Guidées */}
            <div className="bg-white/8 border border-white/15 rounded-xl p-4 flex items-start gap-4 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-gentle">
                <Play size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Sessions Express</h3>
                <p className="text-sm text-white/70">SWITCH, RESET, TRAINING - Solutions rapides pour tous les moments</p>
              </div>
            </div>

            {/* Méditations */}
            <div className="bg-white/8 border border-white/15 rounded-xl p-4 flex items-start gap-4 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-gentle">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Méditations Thématiques</h3>
                <p className="text-sm text-white/70">Gratitude, Abondance, Amour - Transformez votre état intérieur</p>
              </div>
            </div>

            {/* Voix Premium */}
            <div className="bg-white/8 border border-white/15 rounded-xl p-4 flex items-start gap-4 animate-slide-in-left" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-gentle">
                <Mic size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Voix Premium</h3>
                <p className="text-sm text-white/70">Claire & Thierry vous accompagnent avec des voix enregistrées</p>
              </div>
            </div>

            {/* Sons Binauraux */}
            <div className="bg-white/8 border border-white/15 rounded-xl p-4 flex items-start gap-4 animate-slide-in-left" style={{animationDelay: '0.5s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-gentle">
                <Headphones size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Sons Thérapeutiques</h3>
                <p className="text-sm text-white/70">Fréquences binaurales et sons de guérison pour une immersion totale</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Personnalisez Votre Expérience",
      subtitle: "Choisissez votre voix de guidage préférée",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-white/80 mb-4">
              Sélectionnez la voix qui vous accompagnera dans vos sessions de bien-être :
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleVoiceSelection('female')}
              className="bg-white/8 border-2 border-purple-500/30 rounded-xl p-6 text-left hover:bg-white/12 hover:border-purple-500/50 transition-all duration-200 group animate-slide-in-up"
              style={{animationDelay: '0.1s'}}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center animate-pulse-gentle">
                  <Users size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Claire</h3>
                  <p className="text-white/70 mb-2">Voix féminine douce et apaisante</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">Premium</span>
                    <span className="text-xs text-white/50">Parfaite pour la relaxation</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleVoiceSelection('male')}
              className="bg-white/8 border-2 border-blue-500/30 rounded-xl p-6 text-left hover:bg-white/12 hover:border-blue-500/50 transition-all duration-200 group animate-slide-in-up"
              style={{animationDelay: '0.2s'}}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center animate-pulse-gentle">
                  <Users size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Thierry</h3>
                  <p className="text-white/70 mb-2">Voix masculine calme et rassurante</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full">Premium</span>
                    <span className="text-xs text-white/50">Idéale pour la concentration</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </button>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 mt-6 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-start gap-3">
              <Headphones size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-200 font-medium mb-1">Conseil d'utilisation :</p>
                <p className="text-xs text-white/70">
                  Pour une expérience optimale, utilisez des écouteurs stéréo. 
                  Vous pourrez modifier ce choix à tout moment dans les paramètres.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Header avec progression */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  step <= currentStep ? 'bg-cyan-400 animate-pulse-gentle' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-white/60">
            {currentStep + 1} / 3
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 px-5 pb-5">
        <div className="max-w-md mx-auto">
          {/* Titre et sous-titre */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {steps[currentStep].title}
            </h1>
            <p className="text-white/70 text-lg">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Contenu de l'étape */}
          <div className="mb-8">
            {steps[currentStep].content}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5">
        <div className="max-w-md mx-auto animate-slide-in-up">
          {currentStep < 2 ? (
            <div className="flex gap-3">
              <button
                onClick={handleStart}
                className="flex-1 bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200"
              >
                Passer
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
              >
                Suivant
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
            >
              <Play size={20} />
              Commencer Mon Voyage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};