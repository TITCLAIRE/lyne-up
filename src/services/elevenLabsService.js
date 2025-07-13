// Service fictif pour la compatibilité
// Ce fichier est maintenu pour éviter les erreurs d'importation mais n'utilise plus l'API ElevenLabs

export const generateSpeech = async () => {
  console.log('🔇 Service ElevenLabs désactivé - Utilisation des fichiers locaux uniquement');
  return {
    success: false,
    error: 'Service ElevenLabs désactivé'
  };
};

export const checkElevenLabsService = async () => {
  return { 
    success: false, 
    error: 'Service ElevenLabs désactivé' 
  };
};

export const checkElevenLabsQuota = async () => {
  return { 
    success: false, 
    error: 'Service ElevenLabs désactivé' 
  };
};