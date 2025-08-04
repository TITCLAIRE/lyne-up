import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // Initial state
      currentScreen: 'home',
      menuOpen: false,
      currentSession: null,
      currentMeditation: null,
      isSessionActive: false,
      isFreeSessionMode: false, // Mode session gratuite/découverte
      freeSessionType: 'coherence', // Toujours 'coherence' pour la séance découverte
      
      // NOUVEAU : États pour le parcours utilisateur
      showLaunchScreen: true, // Afficher l'écran de lancement au premier démarrage
      isTrialMode: false, // Mode session d'essai
      isAuthenticated: false, // État d'authentification géré par Supabase
      userProfile: null, // Profil utilisateur
      
      sessionSettings: {
        duration: 180,
        breathingMode: 'intermediate',
        adaptiveMode: false,
      },
      
      audioSettings: {
        enabled: true,
        volume: 0.25, // Volume recommandé 25%
        frequency: 'coherence',
        gongEnabled: true,
        gongVolume: 0.15, // Volume gong recommandé 15%
      },
      
      voiceSettings: {
        enabled: true,
       gender: 'female',
        volume: 0.7, // Volume voix recommandé 70%
      },
      
      coherenceSettings: {
        duration: null,
        rhythm: null,
        gongEnabled: true,
        transitionEnabled: true,
        silentMode: false,
      },

      // NOUVEAU : Paramètres pour la session d'essai
      trialCoherenceSettings: {
        duration: 5, // 5 minutes fixe
        rhythm: '5-5', // Par défaut 5/5
        gongEnabled: true,
        transitionEnabled: true,
        silentMode: false,
      },

      // Paramètres pour la session libre avec fréquence
      freeSessionSettings: {
        inhaleTime: 5,    // Temps d'inspiration par défaut (5 secondes)
        exhaleTime: 5,    // Temps d'expiration par défaut (5 secondes)
        duration: 5,      // Durée par défaut (5 minutes)
        frequency: 'coherence', // Fréquence par défaut
        gongEnabled: true,
        silentMode: false,
      },
      
      // Données biométriques simplifiées (sans caméra)
      biometricData: {
        heartRate: 0,
        hrv: 0,
        coherence: 85, // Valeur par défaut positive
        breathingRate: 6.0,
      },
      
      // Actions
      setCurrentScreen: (screen) => {
        console.log('🔄 STORE: Changement d\'écran vers:', screen);
        set({ currentScreen: screen });
      },
      toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
      setCurrentSession: (session) => {
        console.log('🎯 STORE: Changement de session vers:', session);
        set({ currentSession: session });
      },
      setCurrentMeditation: (meditation) => set({ currentMeditation: meditation }),
      setSessionActive: (active) => {
        console.log('▶️ STORE: Session active:', active);
        set({ isSessionActive: active });
      },
      
      // NOUVELLES ACTIONS pour le parcours utilisateur
      completeLaunchScreen: () => {
        console.log('🎯 STORE: Écran de lancement terminé');
        set({ 
          showLaunchScreen: false,
          isTrialMode: false, // Désactiver le mode essai pour rester en mode développement
          isAuthenticated: true // Considérer l'utilisateur comme authentifié
        });
      },
      
      startFreeSession: (sessionType) => {
        console.log('🎯 STORE: Démarrage session gratuite:', sessionType);
        set({
          isFreeSessionMode: true, // Activer le mode session gratuite
          freeSessionType: sessionType || 'coherence',
          currentSession: sessionType || 'coherence'
        });
      },
      
      endFreeSession: () => {
        console.log('🎯 STORE: Fin de la session gratuite');
        set({ 
          isFreeSessionMode: false, 
          freeSessionType: null 
        });
      },
      
      startTrialMode: () => {
        console.log('🎯 STORE: Démarrage mode essai');
        set({ isTrialMode: true, currentScreen: 'trialCoherenceSelection' });
      },
      
      completeTrialSession: () => {
        console.log('🎯 STORE: Session d\'essai terminée');
        set({ 
          isTrialMode: false, 
          isAuthenticated: true, // Considérer l'utilisateur comme authentifié
          currentScreen: 'home' // Rediriger vers l'accueil au lieu de l'authentification
        });
      },
      
      setAuthenticated: (authenticated, userProfile = null) => {
        set((state) => {
          // Éviter les mises à jour inutiles
          if (state.isAuthenticated === authenticated && state.userProfile === userProfile) {
            return state; // Pas de changement
          }
          
          console.log('🔐 STORE: setAuthenticated:', authenticated, userProfile ? 'avec profil' : 'sans profil');
          return { 
            isAuthenticated: authenticated, 
            userProfile,
          };
        });
      },
      
      // Action pour réinitialiser complètement l'application (utile pour les tests)
      resetApp: () => {
        console.log('🔄 STORE: Réinitialisation complète de l\'application');
        set({ 
          showLaunchScreen: true,
          isTrialMode: false,
          isAuthenticated: false,
          userProfile: null,
          currentScreen: 'home',
          isFreeSessionMode: false,
          freeSessionType: null
        });
      },
      
      // Action pour réinitialiser l'onboarding (pour les tests)
      resetOnboarding: () => {
        console.log('🔄 STORE: Réinitialisation de l\'onboarding');
        set({ 
          showLaunchScreen: true,
          isTrialMode: false,
          isAuthenticated: false,
          userProfile: null,
          currentScreen: 'home'
        });
      },
      
      updateSessionSettings: (settings) => 
        set((state) => ({
          sessionSettings: { ...state.sessionSettings, ...settings }
        })),
      
      updateAudioSettings: (settings) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...settings }
        })),
      
      updateVoiceSettings: (settings) =>
        set((state) => ({
          voiceSettings: { ...state.voiceSettings, ...settings }
        })),
      
      updateCoherenceSettings: (settings) =>
        set((state) => ({
          coherenceSettings: { ...state.coherenceSettings, ...settings }
        })),

      // NOUVELLE ACTION pour les paramètres de session d'essai
      updateTrialCoherenceSettings: (settings) =>
        set((state) => ({
          trialCoherenceSettings: { ...state.trialCoherenceSettings, ...settings }
        })),

      // Action pour mettre à jour les paramètres de session libre
      updateFreeSessionSettings: (settings) =>
        set((state) => ({
          freeSessionSettings: { ...state.freeSessionSettings, ...settings },
          // Si on est en mode session gratuite, mettre à jour aussi les paramètres de cohérence
          coherenceSettings: state.isFreeSessionMode ? 
            { ...state.coherenceSettings, 
              rhythm: settings.inhaleTime && settings.exhaleTime ? 
                `${settings.inhaleTime}-${settings.exhaleTime}` : 
                state.coherenceSettings.rhythm,
              duration: settings.duration || state.coherenceSettings.duration,
              gongEnabled: settings.gongEnabled !== undefined ? 
                settings.gongEnabled : 
                state.coherenceSettings.gongEnabled,
              silentMode: settings.silentMode !== undefined ? 
                settings.silentMode : 
                state.coherenceSettings.silentMode
            } : 
            state.coherenceSettings
        })),
      
      updateBiometricData: (data) =>
        set((state) => ({
          biometricData: { ...state.biometricData, ...data }
        })),
    }),
    {
      name: 'coherence-app-storage',
      partialize: (state) => ({
        audioSettings: state.audioSettings,
        voiceSettings: state.voiceSettings,
        sessionSettings: state.sessionSettings,
        freeSessionSettings: state.freeSessionSettings,
        trialCoherenceSettings: state.trialCoherenceSettings,
        showLaunchScreen: state.showLaunchScreen,
        // IMPORTANT: Persister l'état de l'écran de lancement pour qu'il ne s'affiche qu'une fois
      }),
    }
  )
);