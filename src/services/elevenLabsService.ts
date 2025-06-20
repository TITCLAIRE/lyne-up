interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  voices: {
    female: string;
    male: string;
  };
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private cache: Map<string, string> = new Map();

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      baseUrl: 'https://api.elevenlabs.io/v1',
      voices: {
        // Voix optimisées pour le bien-être et la relaxation
        female: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Voix douce et apaisante
        male: 'VR6AewLTigWG4xSOukaG',   // Josh - Voix calme et rassurante
      }
    };
  }

  /**
   * Vérifie si l'API ElevenLabs est disponible
   */
  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Génère un audio à partir d'un texte
   */
  async generateSpeech(
    text: string, 
    gender: 'male' | 'female' = 'female',
    language: 'fr' | 'en' = 'fr'
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Clé API ElevenLabs manquante');
    }

    // Vérifier le cache
    const cacheKey = `${text}-${gender}-${language}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const voiceId = this.config.voices[gender];
      const voiceSettings: VoiceSettings = {
        stability: 0.8,        // Stabilité élevée pour une voix constante
        similarity_boost: 0.8, // Similarité élevée pour préserver le caractère de la voix
        style: 0.2,           // Style léger pour un ton naturel et relaxant
        use_speaker_boost: true // Amélioration de la clarté
      };

      // Sélectionner le modèle selon la langue
      const modelId = language === 'fr' ? 'eleven_multilingual_v2' : 'eleven_monolingual_v1';

      const response = await fetch(`${this.config.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify({
          text: this.preprocessText(text, language),
          model_id: modelId,
          voice_settings: voiceSettings
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Mettre en cache
      this.cache.set(cacheKey, audioUrl);
      
      // Nettoyer le cache si trop volumineux
      if (this.cache.size > 50) {
        const firstKey = this.cache.keys().next().value;
        const oldUrl = this.cache.get(firstKey);
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        this.cache.delete(firstKey);
      }

      return audioUrl;

    } catch (error) {
      console.error('❌ Erreur ElevenLabs:', error);
      throw error;
    }
  }

  /**
   * Préprocesse le texte pour optimiser la synthèse vocale
   */
  private preprocessText(text: string, language: 'fr' | 'en'): string {
    let processed = text.trim();

    if (language === 'fr') {
      // Optimisations pour le français
      processed = processed
        .replace(/\.\.\./g, '... ') // Pauses pour les points de suspension
        .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Espaces après ponctuation
        .replace(/(\d+)\s*(min|sec|secondes?|minutes?)/gi, '$1 $2') // Espaces pour les unités
        .replace(/([a-z])([A-Z])/g, '$1. $2'); // Points entre phrases collées
    }

    // Ajouter des pauses naturelles pour la relaxation
    processed = processed
      .replace(/\./g, '... ') // Pauses longues après les points
      .replace(/,/g, ', ') // Pauses courtes après les virgules
      .replace(/:/g, ': '); // Pauses après les deux-points

    return processed;
  }

  /**
   * Joue un audio généré
   */
  async playAudio(audioUrl: string, volume: number = 0.8): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.volume = Math.max(0, Math.min(1, volume));
      
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Erreur de lecture audio'));
      
      audio.play().catch(reject);
    });
  }

  /**
   * Nettoie le cache
   */
  clearCache(): void {
    this.cache.forEach(url => URL.revokeObjectURL(url));
    this.cache.clear();
  }

  /**
   * Obtient les informations sur l'utilisation de l'API
   */
  async getUsage(): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('Clé API ElevenLabs manquante');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/user`, {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erreur récupération usage:', error);
      throw error;
    }
  }

  /**
   * Teste la connexion à l'API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getUsage();
      return true;
    } catch {
      return false;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();