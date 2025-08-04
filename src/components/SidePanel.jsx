import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Volume2, Mic, Download, Smartphone, RotateCcw, CloudLightning, Play, Check, AlertTriangle, User, LogOut } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useVoiceManager } from '../hooks/useVoiceManager';
import { useSupabase } from '../hooks/useSupabase';

export const SidePanel = () => {
  const navigate = useNavigate();
  const { 
    menuOpen, 
    toggleMenu, 
    setAuthenticated,
    isAuthenticated,
    userProfile,
    isSessionActive,
    currentSession,
    audioSettings,
    updateAudioSettings,
    voiceSettings,
    updateVoiceSettings,
    resetOnboarding,
  } = useAppStore();

  // Importer le hook useVoiceManager pour tester les voix
  const { speak } = useVoiceManager();
  const { signOut, user } = useSupabase();
  
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

  // Fonction pour tester la voix de synthèse
  const handleTestSynthesisVoice = () => {
    if (speak) {
      speak("Ceci est un test de la voix de synthèse. Votre application fonctionne correctement.");
    } else {
      console.log('❌ Fonction speak non disponible');
    }
  };
  
  const handleResetOnboarding = () => {
    resetOnboarding();
    toggleMenu();
    navigate('/start');
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        console.log('✅ Déconnexion réussie');
        toggleMenu();
        navigate('/start');
      }
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
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
                <span>Voix Premium</span>
                <div className="text-xs text-green-400 px-2 py-1 bg-green-500/20 rounded-full">Activé</div>
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

              {/* NOUVEAU: Bouton de test vocal immédiat */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    console.log('🎤 TEST VOCAL IMMÉDIAT');
                    if (window.speechSynthesis) {
                      const utterance = new SpeechSynthesisUtterance("Test vocal immédiat. Si vous entendez ceci, la synthèse vocale fonctionne.");
                      utterance.lang = 'fr-FR';
                      utterance.volume = voiceSettings.volume;
                      window.speechSynthesis.speak(utterance);
                    } else {
                      console.log('❌ speechSynthesis non disponible');
                    }
                  }}
                  className="w-full bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-sm hover:bg-green-500/30 transition-colors"
                >
                  🎤 Test vocal immédiat
                </button>
                
                <button
                  onClick={() => {
                    console.log('🔍 DIAGNOSTIC VOCAL COMPLET:');
                    console.log('  - speechSynthesis disponible:', !!window.speechSynthesis);
                    console.log('  - Voix activée:', voiceSettings.enabled);
                    console.log('  - Genre:', voiceSettings.gender);
                    console.log('  - Volume:', voiceSettings.volume);
                    console.log('  - Session active:', isSessionActive);
                    console.log('  - Session actuelle:', currentSession);
                    
                    // Test des autorisations audio
                    navigator.permissions.query({name: 'microphone'}).then(result => {
                      console.log('  - Permission micro:', result.state);
                    }).catch(e => console.log('  - Permission micro: non testable'));
                  }}
                  className="w-full bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-sm hover:bg-yellow-500/30 transition-colors"
                >
                  🔍 Diagnostic vocal complet
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

              {/* Debug du système vocal */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-yellow-200 mb-2">
                  <strong>Debug Vocal :</strong>
                </p>
                <div className="text-xs text-yellow-100/80 space-y-1">
                  <div>Voix activée : {voiceSettings.enabled ? '✅ Oui' : '❌ Non'}</div>
                  <div>Genre : {voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'}</div>
                  <div>Volume : {Math.round(voiceSettings.volume * 100)}%</div>
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm hover:bg-white/15 transition-colors"
                  >
                    Tester la voix
                  </button>
                </div>
                
                {/* NOUVEAU: Bouton de diagnostic vocal */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log('🔍 DIAGNOSTIC VOCAL:');
                      console.log('  - Voix activée:', voiceSettings.enabled);
                      console.log('  - Genre:', voiceSettings.gender);
                      console.log('  - Volume:', voiceSettings.volume);
                      console.log('  - Session active:', isSessionActive);
                      console.log('  - Session actuelle:', currentSession);
                    }}
                    className="w-full bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-sm hover:bg-yellow-500/30 transition-colors"
                  >
                    🔍 Diagnostic vocal
                  </button>
                </div>
              </div>

              <div className="rounded-lg p-3 bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-green-200">
                  <strong>Système vocal :</strong> Fichiers MP3 premium Claire/Thierry + fallback synthèse vocale française.
                </p>
                
                {/* NOUVEAU: État vocal en temps réel */}
                <div className="mt-2 text-xs text-white/70">
                  <div>État: {voiceSettings.enabled ? '✅ Activé' : '❌ Désactivé'}</div>
                  <div>Voix: {voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'}</div>
                  <div>Volume: {Math.round(voiceSettings.volume * 100)}%</div>
                </div>
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
                onClick={() => { 
                  // Activer le mode développement complet
                  setAuthenticated(true, { 
                    id: 'dev', 
                    email: 'dev@instantopportun.com', 
                    name: 'Développeur', 
                    isPremium: true 
                  });
                  toggleMenu(); 
                  navigate('/'); 
                }}
                className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-xl p-3 flex items-center gap-3 hover:from-green-500/30 hover:to-emerald-500/30 transition-all mb-4"
              >
                <Play size={20} />
                <div className="text-left">
                  <div className="font-medium text-sm">Mode Développement</div>
                  <div className="text-xs text-white/70">Accès complet à toutes les sessions</div>
                </div>
              </button>
              
              <button 
                onClick={handleResetOnboarding}
                className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 rounded-xl p-3 flex items-center gap-3 hover:from-orange-500/30 hover:to-red-500/30 transition-all mb-4"
              >
                <RotateCcw size={20} />
                <div className="text-left">
                  <div className="font-medium text-sm">Revoir les pages de lancement</div>
                  <div className="text-xs text-white/70">Réinitialise l'onboarding pour tester</div>
                </div>
              </button>
              
              <button 
                onClick={() => { toggleMenu(); navigate('/'); }}
                className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/40 rounded-xl p-3 flex items-center gap-3 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all"
              >
                <Play size={20} />
                <div className="text-left">
                  <div className="font-medium text-sm">Retour à l'accueil</div>
                  <div className="text-xs text-white/70">Revenir à la page principale</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
        {/* Section Compte utilisateur */}
        {isAuthenticated && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <User size={18} />
              Mon Compte
            </h3>
            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Connecté en tant que :</div>
                <div className="font-medium text-white">{userProfile?.name || user?.email}</div>
                <div className="text-xs text-white/50">{user?.email}</div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                  userProfile?.isPremium 
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-200'
                    : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200'
                }`}>
                  {userProfile?.isPremium ? '👑 Premium' : '🎁 Gratuit'}
                </div>
                
                {/* Affichage de l'essai gratuit si actif */}
                {userProfile?.trialEndsAt && new Date(userProfile.trialEndsAt) > new Date() && (
                  <div className="mt-2 bg-purple-500/20 border border-purple-500/30 rounded-lg p-2">
                    <p className="text-xs text-purple-200">
                      🎁 Essai Premium actif jusqu'au {new Date(userProfile.trialEndsAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleSignOut}
                className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500/40 rounded-xl p-3 flex items-center gap-3 hover:from-red-500/30 hover:to-pink-500/30 transition-all"
              >
                <LogOut size={20} />
                <div className="text-left">
                  <div className="font-medium text-sm">Se déconnecter</div>
                  <div className="text-xs text-white/70">Retour à l'écran de démarrage</div>
                </div>
              </button>
            </div>
          </div>
        )}

    </>
  );
};