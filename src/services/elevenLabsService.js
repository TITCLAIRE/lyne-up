/**
 * Service pour interagir avec l'API ElevenLabs via Netlify Functions
 */

// URL de base pour les fonctions Netlify
const FUNCTION_BASE_URL = '/.netlify/functions/elevenlabs-tts';

/**
 * Génère un fichier audio à partir de texte en utilisant ElevenLabs via Netlify Function
 * @param {string} text - Le texte à convertir en audio
 * @param {string} voice - Le genre de voix ('female' pour Claire, 'male' pour Thierry)
 * @returns {Promise<{success: boolean, audio?: string, error?: string}>}
 */
export const generateSpeech = async (text, voice = 'female') => {
  try {
    console.log(`🎤 ElevenLabs Service: Génération audio pour "${text.substring(0, 30)}..." (${voice})`);
    
    // Appeler la Netlify Function
    const response = await fetch(FUNCTION_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice
      })
    });

    // Vérifier si la requête a réussi
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erreur ElevenLabs Service:', response.status, errorData);
      return {
        success: false,
        error: errorData.error || `Erreur ${response.status}`
      };
    }

    // Récupérer les données
    const data = await response.json();
    
    if (!data.success || !data.audio) {
      console.error('❌ Réponse ElevenLabs invalide:', data);
      return {
        success: false,
        error: data.error || 'Données audio manquantes'
      };
    }

    console.log('✅ Audio ElevenLabs généré avec succès');
    
    // Retourner les données audio
    return {
      success: true,
      audio: data.audio,
      format: data.format || 'audio/mpeg'
    };
  } catch (error) {
    console.error('❌ Exception ElevenLabs Service:', error);
    return {
      success: false,
      error: error.message || 'Erreur inconnue'
    };
  }
};

/**
 * Vérifie si le service ElevenLabs est disponible
 * @returns {Promise<boolean>}
 */
export const checkElevenLabsService = async () => {
  try {
    // Test simple avec un court texte
    const testResult = await generateSpeech('Test de connexion', 'female');
    return testResult.success;
  } catch (error) {
    console.error('❌ Test ElevenLabs échoué:', error);
    return false;
  }
};