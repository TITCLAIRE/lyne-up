import React, { useState } from 'react';
import { Volume2, AlertTriangle, CheckCircle } from 'lucide-react';

export const VoiceTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runVoiceTest = () => {
    setIsLoading(true);
    setTestResult(null);

    console.log('🔍 DIAGNOSTIC VOCAL COMPLET DÉMARRÉ');
    
    // Test 1: Vérifier si speechSynthesis existe
    if (!window.speechSynthesis) {
      console.log('❌ speechSynthesis non disponible');
      setTestResult({
        success: false,
        error: 'speechSynthesis non disponible dans ce navigateur'
      });
      setIsLoading(false);
      return;
    }

    console.log('✅ speechSynthesis disponible');

    // Test 2: Vérifier les voix disponibles
    const voices = window.speechSynthesis.getVoices();
    console.log('🎤 Voix disponibles:', voices.length);
    
    if (voices.length === 0) {
      // Attendre que les voix se chargent
      window.speechSynthesis.onvoiceschanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        console.log('🎤 Voix chargées:', newVoices.length);
        runActualTest();
      };
    } else {
      runActualTest();
    }

    function runActualTest() {
      try {
        // Test 3: Créer et jouer un utterance
        const utterance = new SpeechSynthesisUtterance("Test vocal. Si vous entendez ceci, la synthèse vocale fonctionne parfaitement.");
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.volume = 0.8;

        utterance.onstart = () => {
          console.log('✅ Synthèse vocale démarrée avec succès');
          setTestResult({
            success: true,
            message: 'Synthèse vocale fonctionnelle !'
          });
          setIsLoading(false);
        };

        utterance.onend = () => {
          console.log('✅ Synthèse vocale terminée avec succès');
        };

        utterance.onerror = (event) => {
          console.log('❌ Erreur synthèse vocale:', event.error);
          setTestResult({
            success: false,
            error: `Erreur synthèse: ${event.error}`
          });
          setIsLoading(false);
        };

        // Lancer la synthèse
        window.speechSynthesis.speak(utterance);
        console.log('🎤 Synthèse vocale lancée');

        // Timeout de sécurité
        setTimeout(() => {
          if (isLoading) {
            setTestResult({
              success: false,
              error: 'Timeout - La synthèse vocale ne répond pas'
            });
            setIsLoading(false);
          }
        }, 5000);

      } catch (error) {
        console.log('❌ Erreur lors du test vocal:', error);
        setTestResult({
          success: false,
          error: `Erreur: ${error.message}`
        });
        setIsLoading(false);
      }
    }
  };

  const testPremiumFiles = async () => {
    console.log('🔍 TEST DES FICHIERS PREMIUM');
    
    const files = [
      'welcome.mp3',
      'breathe-calm.mp3',
      'grounding.mp3',
      'completion.mp3'
    ];

    for (const file of files) {
      try {
        const response = await fetch(`/audio/sos-stress/female/${file}`, { method: 'HEAD' });
        console.log(`${response.ok ? '✅' : '❌'} ${file}: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${file}: Erreur réseau`);
      }
    }
  };

  return (
    <div className="bg-white/10 rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-3">🔍 Diagnostic Vocal</h3>
      
      <div className="space-y-3">
        <button
          onClick={runVoiceTest}
          disabled={isLoading}
          className="w-full bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-sm hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Test en cours...
            </>
          ) : (
            <>
              <Volume2 size={16} />
              Test synthèse vocale
            </>
          )}
        </button>

        <button
          onClick={testPremiumFiles}
          className="w-full bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-sm hover:bg-green-500/30 transition-colors"
        >
          🎵 Test fichiers premium
        </button>
      </div>

      {testResult && (
        <div className={`p-3 rounded-lg border ${
          testResult.success 
            ? 'bg-green-500/20 border-green-500/30' 
            : 'bg-red-500/20 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {testResult.success ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <AlertTriangle size={16} className="text-red-400" />
            )}
            <span className="font-medium">
              {testResult.success ? 'Succès' : 'Erreur'}
            </span>
          </div>
          <p className="text-sm text-white/80">
            {testResult.message || testResult.error}
          </p>
        </div>
      )}

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
        <p className="text-xs text-yellow-200">
          <strong>Instructions :</strong> Cliquez sur "Test synthèse vocale" et dites-moi si vous entendez quelque chose. 
          Vérifiez aussi que le volume de votre ordinateur n'est pas coupé.
        </p>
      </div>
    </div>
  );
};