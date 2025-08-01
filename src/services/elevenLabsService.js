// Service désactivé - Utilisation des fichiers locaux uniquement
// Ce fichier est maintenu pour éviter les erreurs d'importation

export const generateSpeech = async () => {
  console.log('🔇 Service ElevenLabs désactivé - Utilisation des fichiers locaux uniquement');
  return {
    success: false,
    error: 'Service ElevenLabs désactivé'
  };
};

export const checkElevenLabsService = async () => {
  console.log('🔇 Vérification ElevenLabs désactivée');
  return { 
    success: false, 
    error: 'Service ElevenLabs désactivé' 
  };
};

export const checkElevenLabsQuota = async () => {
  console.log('🔇 Vérification quota ElevenLabs désactivée');
  return { 
    success: false, 
    error: 'Service ElevenLabs désactivé' 
  };
};

// Fonction de test locale uniquement
export const testLocalVoice = () => {
  console.log('🎤 Test voix locale');
  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance("Test de la voix locale");
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
};