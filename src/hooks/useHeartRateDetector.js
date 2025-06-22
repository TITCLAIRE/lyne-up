import { useAppStore } from '../store/appStore';

export const useHeartRateDetector = () => {
  const { updateBiometricData } = useAppStore();

  // Hook simplifié - Pas de détection caméra
  const startDetection = async () => {
    console.log('📊 Système de détection désactivé - Mode simplifié');
    return Promise.resolve();
  };

  const stopDetection = () => {
    console.log('📊 Système de détection arrêté');
  };

  return {
    startDetection,
    stopDetection,
    isDetecting: false,
  };
};