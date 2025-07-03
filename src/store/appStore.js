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
      hasOnboarded: false, // Nouvelle variable pour le parcours de lancement
      
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
        gender: 'female', // Claire par défaut
        volume: 0.7, // Volume voix recommandé 70%
        useElevenLabs: false, // Désactivé - on utilise les voix premium françaises
      },
      
      coherenceSettings: {
        duration: null,
        rhythm: null,
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
      setHasOnboarded: (onboarded) => {
        console.log('🎯 STORE: Onboarding terminé:', onboarded);
        set({ hasOnboarded: onboarded });
      },
      
      // Nouvelle action pour réinitialiser l'onboarding (utile pour les tests)
      resetOnboarding: () => {
        console.log('🔄 STORE: Réinitialisation de l\'onboarding');
        set({ hasOnboarded: false });
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

      // Action pour mettre à jour les paramètres de session libre
      updateFreeSessionSettings: (settings) =>
        set((state) => ({
          freeSessionSettings: { ...state.freeSessionSettings, ...settings }
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
        hasOnboarded: state.hasOnboarded, // Persister l'état d'onboarding
      }),
    }
  )
);