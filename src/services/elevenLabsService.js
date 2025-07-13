/**
 * Service pour interagir avec l'API ElevenLabs via Netlify Functions
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Mapping des voix ElevenLabs
const VOICE_IDS = {
  female: 'EXAVITQu4vr4xnSDxMaL', // Sarah (voix féminine)
  male: 'VR6AewLTigWG4xSOukaG'    // Josh (voix masculine)
};

// Paramètres optimaux pour les voix
const VOICE_SETTINGS = {
  stability: 0.85,
  similarity_boost: 0.8,
  style: 0.15,
  use_speaker_boost: true
};

/**
 * Génère un fichier audio à partir de texte en utilisant ElevenLabs via Netlify Function
 * @param {string} text - Le texte à convertir en audio
 * @param {string} voice - Le genre de voix ('female' pour Claire, 'male' pour Thierry)
 * @returns {Promise<{success: boolean, audio?: string, error?: string}>}
 */
export const generateSpeech = async (text, voice = 'female') => {
  try {
    console.log(`🎤 ElevenLabs Service DIRECT: Génération audio pour "${text.substring(0, 30)}..." (${voice})`);

    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || import.meta.env.VITE_AUDIO_SERVICE_TOKEN;
    
    if (!apiKey) {
      console.error('❌ Clé API ElevenLabs non configurée');
      return {
        success: false,
        error: 'Clé API ElevenLabs non configurée'
      };
    }

    // Récupérer l'ID de la voix
    const voiceId = VOICE_IDS[voice] || VOICE_IDS.female;
    
    // Appel direct à l'API ElevenLabs (sans passer par Netlify Functions)
    const url = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: VOICE_SETTINGS
      })
    });

    // Vérifier si la requête a réussi
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erreur ElevenLabs Service DIRECT:', response.status, errorData);
      return {
        success: false,
        error: `Erreur ${response.status}: ${errorData.detail?.message || JSON.stringify(errorData)}`
      };
    }

    // Récupérer le contenu audio
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(audioBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    console.log('✅ Audio ElevenLabs généré avec succès (appel direct)');
    
    // Retourner les données audio
    return {
      success: true,
      audio: base64Audio,
      format: 'audio/mpeg'
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
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || import.meta.env.VITE_AUDIO_SERVICE_TOKEN;
    
    if (!apiKey) {
      console.error('❌ Clé API ElevenLabs non configurée');
      return { success: false, error: 'Clé API non configurée' };
    }
    
    // Tester la connexion à l'API
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': apiKey
      }
    });
    
    const success = response.ok;
    console.log(`✅ Test ElevenLabs DIRECT: ${success ? 'Réussi' : 'Échoué'} (${response.status})`);
    
    if (success) {
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: `Erreur ${response.status}: ${errorData.detail?.message || JSON.stringify(errorData)}`
      };
    }
  } catch (error) {
    console.error('❌ Test ElevenLabs échoué:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour vérifier le quota restant
export const checkElevenLabsQuota = async () => {
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || import.meta.env.VITE_AUDIO_SERVICE_TOKEN;
    
    if (!apiKey) {
      return { success: false, error: 'Clé API non configurée' };
    }
    
    const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
      headers: {
        'xi-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: `Erreur ${response.status}: ${errorData.detail?.message || JSON.stringify(errorData)}`
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      quota: {
        charactersUsed: data.character_count,
        charactersLimit: data.character_limit,
        remaining: Math.max(0, data.character_limit - data.character_count),
        tier: data.tier
      }
    };
  } catch (error) {
    console.error('❌ Erreur vérification quota ElevenLabs:', error);
    return { 
      success: false, 
      error: `Erreur vérification quota: ${error.message}`
    };
  }
};