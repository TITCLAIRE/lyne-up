import React from 'react';
import { X, Volume2, Mic, Download, Smartphone } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const SidePanel = () => {
  const { 
    menuOpen, 
    toggleMenu, 
    audioSettings,
    updateAudioSettings,
    voiceSettings,
    updateVoiceSettings
  } = useAppStore();

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
    console.log(`🔄 Changement de voix vers: ${gender === 'female' ? 'Claire (premium)' : 'Thierry (premium)'}`);
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

              {/* Statut des voix premium */}
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                <div className="font-semibold mb-1 text-purple-200">🎵 Voix Premium Activées</div>
                <div className="text-xs text-purple-100/80">
                  Fichiers MP3 premium • Latence zéro • Fallback synthèse automatique
                </div>
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
                    <div className="text-lg mb-1">🎵</div>
                    <div className="font-semibold">Claire</div>
                    <div className="text-xs text-white/70 mt-1">Voix Premium</div>
                    <div className="text-xs text-pink-300 mt-1">/female/</div>
                  </button>
                  <button
                    onClick={() => handleVoiceGenderChange('male')}
                    className={`flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                      voiceSettings.gender === 'male'
                        ? 'bg-purple-500/30 border-2 border-purple-500/50'
                        : 'bg-white/10 border-2 border-white/20'
                    }`}
                  >
                    <div className="text-lg mb-1">🎵</div>
                    <div className="font-semibold">Thierry</div>
                    <div className="text-xs text-white/70 mt-1">Voix Premium</div>
                    <div className="text-xs text-blue-300 mt-1">/male/</div>
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

              {/* Structure des fichiers premium */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-2">
                  📁 <strong>Structure des fichiers premium :</strong>
                </p>
                <div className="text-xs text-blue-100/80 space-y-1 font-mono">
                  <div>/audio/sos-stress/female/ → Claire</div>
                  <div>/audio/sos-stress/male/ → Thierry</div>
                  <div className="mt-2 text-yellow-200">
                    ⚡ <strong>9 fichiers MP3 par voix</strong>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-xs text-green-200">
                  🎵 <strong>Voix Premium :</strong> Vos fichiers MP3 premium avec fallback automatique vers synthèse vocale si fichier manquant.
                </p>
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
        </div>
      </div>
    </>
  );
};