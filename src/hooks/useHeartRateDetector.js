// Hook simplifié - Plus de détection caméra
import { useAppStore } from '../store/appStore';

export const useHeartRateDetector = () => {
  const { updateBiometricData } = useAppStore();

  // Fonction vide - Plus de détection
  const startDetection = async () => {
    console.log('📸 Détection caméra supprimée - Mode simplifié');
  };

  const stopDetection = () => {
    console.log('📸 Système caméra désactivé');
  };

  return {
    startDetection,
    stopDetection,
    isDetecting: false,
  };
};