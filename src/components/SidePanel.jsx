import React from 'react';
import { X, Volume2, Mic, Download, Smartphone, RotateCcw, CloudLightning, Play, Check, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useVoiceManager } from '../hooks/useVoiceManager';
import { checkElevenLabsService, checkElevenLabsQuota } from '../services/elevenLabsService';

export const SidePanel = () => {
  const { 
    menuOpen, 
    toggleMenu, 
    audioSettings,
    updateAudioSettings,
    voiceSettings,
    updateVoiceSettings,
    resetOnboarding
  } = useAppStore();

  // Importer le hook useVoiceManager pour tester les voix
  const { speak, speakWithElevenLabs, speakWithSystemVoice } = useVoiceManager();
  
  // États pour le statut ElevenLabs
  const [elevenLabsStatus, setElevenLabsStatus] = React.useState('unknown');
  const [elevenLabsQuota, setElevenLabsQuota] = React.useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);

  const handleAudioToggle = () => {
    updateAudioSettings({ enabled: !audioSettings.enabled });
  };

  const handleGongToggle = () => {
    updateAudioSettings({ gongEnabled: !audioSettings.gongEnabled });
  };

  const handleVoiceToggle = () => {
    updateVoiceSettings({ enabled: !voiceSettings.enabled });
  };

  const handleVolumeChange = (type, value) => {
    const volume = value / 100;
    if (type === 'music') {
      updateAudioSettings({ volume });
    } else if (type === 'gong') {
      updateAudioSettings({ gongVolume: volume });
    } else if (type === 'voice') {
      updateVoiceSettings({ volume });
    }
  };

  const handleFrequencyChange = (frequency) => {
    updateAudioSettings({ frequency });
  };

  const handleVoiceGenderChange = (gender) => {
    updateVoiceSettings({ gender });
  };

  const handleElevenLabsToggle = () => {
    updateVoiceSettings({ useElevenLabs: !voiceSettings.useElevenLabs });
  };

  // Fonction pour tester la voix de synthèse
  const handleTestSynthesisVoice = () => {
    speak("Ceci est un test de la voix de synthèse. Votre application fonctionne correctement.");
  };
  
  // Fonction pour tester la voix ElevenLabs
  const handleTestElevenLabsVoice = () => {
    speakWithElevenLabs("Ceci est un test de la voix premium ElevenLabs. Votre API est correctement configurée.");
  };
  
  // Vérifier le statut d'ElevenLabs
  const checkElevenLabsStatusAndQuota = async () => {
    setIsCheckingStatus(true);
    setElevenLabsStatus('checking');
    try {
      const result = await checkElevenLabsService();
      setElevenLabsStatus(result.success ? 'available' : 'unavailable');
      
      if (result.success) {
        const quotaResult = await checkElevenLabsQuota();
        if (quotaResult.success) {
          setElevenLabsQuota(quotaResult.quota);
        } else {
          console.error('Erreur quota:', quotaResult.error);
        }
      } else {
        console.error('Erreur statut:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut ElevenLabs:', error);
      setElevenLabsStatus('error');
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  // Vérifier le statut au chargement du panneau
  React.useEffect(() => {
    if (menuOpen && voiceSettings.useElevenLabs) {
      checkElevenLabsStatusAndQuota();
    }
  }, [menuOpen, voiceSettings.useElevenLabs]);
  
  const handleResetOnboarding = () => {
    resetOnboarding();
    toggleMenu();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-all duration-300 z-40 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 transition-transform duration-300 z-50 overflow-y-auto ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Paramètres</h2>
            <button
              onClick={toggleMenu}
              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Audio */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Volume2 size={18} />
              Sons thérapeutiques
            </h3>
            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span>Sons binauraux</span>
                <button
                  onClick={handleAudioToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    audioSettings.enabled ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    audioSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Gong respiratoire</span>
                <button
                  onClick={handleGongToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    audioSettings.gongEnabled ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    audioSettings.gongEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span>ElevenLabs (Premium)</span>
                <button
                  onClick={handleElevenLabsToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    voiceSettings.useElevenLabs ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    voiceSettings.useElevenLabs ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Volume sons binauraux <span className="text-xs text-white/50">(recommandé: 20-30%)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioSettings.volume * 100}
                  onChange={(e) => handleVolumeChange('music', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-white/60 mt-1">
                  Actuel: {Math.round(audioSettings.volume * 100)}% 
                  {audioSettings.volume >= 0.2 && audioSettings.volume <= 0.3 && 
                    <span className="text-green-400 ml-1">✓ Optimal</span>
                  }
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Volume gong <span className="text-xs text-white/50">(recommandé: 10-20%)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioSettings.gongVolume * 100}
                  onChange={(e) => handleVolumeChange('gong', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-white/60 mt-1">
                  Actuel: {Math.round(audioSettings.gongVolume * 100)}%
                  {audioSettings.gongVolume >= 0.1 && audioSettings.gongVolume <= 0.2 && 
                    <span className="text-green-400 ml-1">✓ Optimal</span>
                  }
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Fréquence manuelle</label>
                <select
                  value={audioSettings.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  <option value="coherence">0.1 Hz - Cohérence</option>
                  <option value="396hz">396 Hz - Libération</option>
                  <option value="432hz">432 Hz - Harmonie Naturelle</option>
                  <option value="528hz">528 Hz - Amour & Guérison</option>
                  <option value="639hz">639 Hz - Relations</option>
                  <option value="741hz">741 Hz - Éveil de l'Intuition</option>
                  <option value="852hz">852 Hz - Retour à l'Ordre Spirituel</option>
                  <option value="174hz">174 Hz - Fréquence de la Terre</option>
                  <option value="285hz">285 Hz - Régénération Cellulaire</option>
                  <option value="theta">Ondes Theta (4.5Hz)</option>
                  <option value="theta6">Ondes Theta (6Hz)</option>
                  <option value="theta783">Ondes Theta (7.83Hz)</option>
                  <option value="alpha">Ondes Alpha (10Hz)</option>
                  <option value="beta">Ondes Beta (14Hz)</option>
                  <option value="delta">Ondes Delta (2Hz)</option>
                  <option value="gamma">Ondes Gamma (30-100Hz)</option>
                </select>
                <p className="text-xs text-white/50 mt-1">
                  Note: Chaque session utilise sa fréquence optimale par défaut
                </p>
              </div>
            </div>
          </div>

          {/* Voix Premium */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Mic size={18} />
              Voix Premium
            </h3>
            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span>Guidage vocal</span>
                <button
                  onClick={handleVoiceToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    voiceSettings.enabled ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    voiceSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Choix de la voix premium</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoiceGenderChange('female')}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                      voiceSettings.gender === 'female'
                        ? 'bg-purple-500/30 border-2 border-purple-500/50'
                        : 'bg-white/10 border-2 border-white/20'
                    }`}
                  >
                    <div className="font-semibold">Claire</div>
                    <div className="text-xs text-white/70 mt-1">Voix Premium</div>
                  </button>
                  <button
                    onClick={() => handleVoiceGenderChange('male')}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                      voiceSettings.gender === 'male'
                        ? 'bg-purple-500/30 border-2 border-purple-500/50'
                        : 'bg-white/10 border-2 border-white/20'
                    }`}
                  >
                    <div className="font-semibold">Thierry</div>
                    <div className="text-xs text-white/70 mt-1">Voix Premium</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Volume voix <span className="text-xs text-white/50">(recommandé: 60-70%)</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceSettings.volume * 100}
                  onChange={(e) => handleVolumeChange('voice', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-white/60 mt-1">
                  Actuel: {Math.round(voiceSettings.volume * 100)}%
                  {voiceSettings.volume >= 0.6 && voiceSettings.volume <= 0.7 && 
                    <span className="text-green-400 ml-1">✓ Optimal</span>
                  }
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleTestSynthesisVoice}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-sm hover:bg-white/15 transition-colors"
                  >
                    Tester la voix de synthèse
                  </button>
                  <button
                    onClick={handleTestElevenLabsVoice}
                    disabled={!voiceSettings.useElevenLabs}
                    className={`flex-1 rounded-lg p-3 text-sm ${
                      voiceSettings.useElevenLabs 
                        ? 'bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 transition-colors' 
                        : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    Tester la voix ElevenLabs
                  </button>
                </div>
              </div>

              <div className={`rounded-lg p-3 ${
                voiceSettings.useElevenLabs 
                  ? elevenLabsStatus === 'available' 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : elevenLabsStatus === 'unavailable' 
                      ? 'bg-red-500/10 border border-red-500/30'
                      : 'bg-purple-500/10 border border-purple-500/30'
                  : 'bg-green-500/10 border border-green-500/30'
              }`}>
                {voiceSettings.useElevenLabs ? (
                  <>
                    <div className="flex items-start gap-2 mb-2">
                      {isCheckingStatus ? (
                        <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full mt-0.5 flex-shrink-0"></div>
                      ) : elevenLabsStatus === 'available' ? (
                        <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      ) : elevenLabsStatus === 'unavailable' ? (
                        <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CloudLightning size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-xs text-purple-200">
                        <strong>ElevenLabs {
                          isCheckingStatus ? 'vérification...' : 
                          elevenLabsStatus === 'available' ? 'connecté' : 
                          elevenLabsStatus === 'unavailable' ? 'non disponible' : 
                          'statut inconnu'
                        }</strong>
                      </p>
                    </div>
                    
                    {elevenLabsStatus === 'available' && elevenLabsQuota && (
                      <div className="text-xs text-green-200 pl-6">
                        <p>Quota: {elevenLabsQuota.charactersUsed}/{elevenLabsQuota.charactersLimit} caractères</p>
                        <p>Restant: {elevenLabsQuota.remaining} caractères</p>
                      </div>
                    )}
                    
                    {elevenLabsStatus === 'unavailable' && (
                      <div className="text-xs text-red-200 pl-6">
                        <p>Vérifiez votre clé API dans le fichier .env.</p>
                        <p>Format: VITE_ELEVENLABS_API_KEY=sk_votre_clé.</p>
                        <p>Assurez-vous que "Text to Speech" est activé dans les paramètres de votre clé API.</p>
                      </div>
                    )}
                    
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={checkElevenLabsStatusAndQuota}
                        className="text-xs bg-white/10 hover:bg-white/20 transition-colors px-2 py-1 rounded"
                        disabled={isCheckingStatus}
                        title="Vérifier la connexion à ElevenLabs"
                      >
                        {isCheckingStatus ? 'Vérification...' : 'Vérifier le statut'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-green-200">
                    <strong>Voix locales :</strong> Fichiers MP3 premium avec fallback automatique vers synthèse vocale si fichier manquant.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Installation */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Smartphone size={18} />
              Installation
            </h3>
            <div className="bg-white/5 rounded-xl p-4">
              <button className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-xl p-3 flex items-center gap-3 hover:from-green-500/30 hover:to-emerald-500/30 transition-all">
                <Download size={20} />
                <div className="text-left">
                  <div className="font-medium text-sm">Installer l'app</div>
                  <div className="text-xs text-white/70">Accès rapide depuis l'écran d'accueil</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section Debug/Test */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <RotateCcw size={18} />
              Test & Debug
            </h3>
            <div className="bg-white/5 rounded-xl p-4">
              <button 
                onClick={handleResetOnboarding}
                className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 rounded-xl p-3 flex items-center gap-3 hover:from-orange-500/30 hover:to-red-500/30 transition-all"
              >
                <RotateCcw size={20} />
                <div className="text-left">
                  <div className="font-medium text-sm">Revoir les pages de lancement</div>
                  <div className="text-xs text-white/70">Réinitialise l'onboarding pour tester</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};