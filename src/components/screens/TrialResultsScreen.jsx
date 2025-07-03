import React, { useEffect } from 'react';
import { Heart, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const TrialResultsScreen = () => {
  const { completeTrialSession, biometricData } = useAppStore();

  // Redirection automatique vers la page de connexion après 8 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🎯 Redirection automatique vers la page de connexion');
      completeTrialSession();
    }, 8000);

    return () => clearTimeout(timer);
  }, [completeTrialSession]);

  const handleContinue = () => {
    completeTrialSession();
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center max-w-md mx-auto">
        {/* Animation de succès */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse-gentle">
              <Heart size={40} className="text-white" />
            </div>
            {/* Particules de succès */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Félicitations !
        </h1>
        <p className="text-white/80 mb-8 text-lg">
          Vous avez terminé votre première session de cohérence cardiaque
        </p>

        {/* Résultats de la session d'essai */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {biometricData.coherence}%
            </div>
            <div className="text-sm text-white/70">Cohérence atteinte</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-4">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              5:00
            </div>
            <div className="text-sm text-white/70">Session complétée</div>
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Sparkles size={24} className="text-purple-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-purple-200 mb-2">Excellent début !</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Vous venez de découvrir les bienfaits de la cohérence cardiaque. Cette technique, 
                pratiquée régulièrement, peut considérablement améliorer votre bien-être, 
                réduire votre stress et augmenter votre énergie.
              </p>
            </div>
          </div>
        </div>

        {/* Invitation à continuer */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Gift size={24} className="text-cyan-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">Continuez votre voyage</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Créez votre compte gratuit pour accéder à des sessions de cohérence cardiaque 
                illimitées et découvrir toutes nos fonctionnalités premium.
              </p>
              <div className="bg-cyan-500/10 rounded-lg p-3">
                <p className="text-xs text-cyan-100/90">
                  🎁 <strong>Offre spéciale :</strong> Abonnement premium à vie pour seulement 9,99€ 
                  avec toutes les mises à jour incluses !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de continuation */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 mb-4"
        >
          Créer Mon Compte Gratuit
          <ArrowRight size={20} />
        </button>

        {/* Redirection automatique */}
        <p className="text-xs text-white/50">
          Redirection automatique dans quelques secondes...
        </p>
      </div>
    </div>
  );
};