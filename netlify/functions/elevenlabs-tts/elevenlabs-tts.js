// Netlify Function pour ElevenLabs Text-to-Speech
// Cette fonction sécurise votre clé API ElevenLabs

const fetch = require('node-fetch');

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

exports.handler = async function(event, context) {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
  }

  try {
    // Récupérer les paramètres de la requête
    const { text, voice = 'female' } = JSON.parse(event.body);
    
    // Vérifier que le texte est fourni
    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Le texte est requis' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Récupérer l'ID de la voix
    const voiceId = VOICE_IDS[voice] || VOICE_IDS.female;
    
    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Clé API ElevenLabs non configurée' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Préparer la requête à l'API ElevenLabs
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
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
      console.error('Erreur ElevenLabs:', response.status, errorData);
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Erreur lors de la génération audio', 
          details: errorData 
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Récupérer le contenu audio
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // Retourner l'audio encodé en base64
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        audio: base64Audio,
        format: 'audio/mpeg',
        voice: voice,
        success: true
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Erreur fonction:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur interne du serveur', details: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};