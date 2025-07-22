import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Heart, Sparkles, Gift, Crown } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useSupabase } from '../hooks/useSupabase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const navigate = useNavigate();
  const { setAuthenticated } = useAppStore();
  const { signUp, signIn, resendConfirmation } = useSupabase();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('🔐 AuthScreen: Tentative d\'authentification:', { isLogin, email: formData.email });
    
    try {
      let result;
      
      if (isLogin) {
        // Connexion
        console.log('🔐 AuthScreen: Tentative de connexion...');
        result = await signIn(formData.email, formData.password);
      } else {
        // Inscription
        console.log('🔐 AuthScreen: Tentative d\'inscription...');
        result = await signUp(formData.email, formData.password, formData.name);
      }
      
      if (result.success) {
        console.log('✅ AuthScreen: Authentification réussie, attente de la redirection automatique...');
        // L'authentification est gérée automatiquement par useSupabase
        // La redirection sera gérée par AppLayout une fois l'état synchronisé
      } else {
        console.log('❌ AuthScreen: Échec de l\'authentification:', result.error);
        setError(result.error || 'Une erreur est survenue');
        
        // Afficher l'option de renvoi d'email si l'email n'est pas confirmé
        if (result.errorCode === 'email_not_confirmed') {
          setShowResendOption(true);
          setResendEmail(result.email);
        }
      }
    } catch (error) {
      console.error('❌ AuthScreen: Erreur authentification:', error);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
    setError('');
    setShowResendOption(false);
    setResendEmail('');
  };

  const handleResendConfirmation = async () => {
    setLoading(true);
    const result = await resendConfirmation(resendEmail);
    
    if (result.success) {
      setError('');
      setShowResendOption(false);
      // Afficher un message de succès
      setError('✅ Email de confirmation renvoyé ! Vérifiez votre boîte mail.');
    } else {
      setError(result.error || 'Erreur lors du renvoi de l\'email');
    }
    setLoading(false);
  };


  // Fonction pour gérer l'achat Premium
  const handlePremiumPurchase = async (planType) => {
    setProcessingPayment(true);
    
    try {
      // IDs des prix Stripe - À remplacer par vos vrais IDs de prix
      const priceIds = {
        yearly: 'price_VOTRE_ID_ANNUEL', // Remplacez par votre ID de prix annuel
        lifetime: 'price_VOTRE_ID_VIE'   // Remplacez par votre ID de prix à vie
      };
      
      const priceId = priceIds[planType];
      
      if (!priceId) {
        throw new Error('ID de prix non configuré');
      }
      
      console.log('🛒 Création session Stripe pour:', planType, priceId);
      
      // Appeler la fonction Netlify pour créer la session de paiement
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerEmail: formData.email || undefined,
          customerName: formData.name || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }
      
      console.log('✅ Session Stripe créée:', data.sessionId);
      
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('❌ Erreur achat Premium:', error);
      setError(`Erreur lors du paiement : ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-white flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #003366, #004488, #0055AA, #003366)'
      }}
    >
      {/* Image de fond directe pour l'authentification */}
      <img 
        src="/Fond app.png" 
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: 0.06,
          filter: 'hue-rotate(200deg) brightness(1.1) contrast(0.8)',
          mixBlendMode: 'overlay'
        }}
      />
      
      <div className="max-w-md mx-auto w-full px-5 py-8 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 backdrop-blur-sm">
              <Heart size={32} className="text-cyan-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {isLogin ? 'Bon retour !' : 'Créez votre compte'}
          </h1>
          <p className="text-white text-lg">
            {isLogin 
              ? 'Reconnectez-vous à votre espace bien-être' 
              : 'Commencez votre voyage vers le bien-être'
            }
          </p>
        </div>

        {/* Avantages du compte gratuit */}
        {!isLogin && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Gift size={24} className="text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-200 mb-2">Compte gratuit inclus :</h3>
                <ul className="text-sm text-white space-y-1">
                  <li className="flex items-center"><span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">✓</span> Sessions de cohérence cardiaque illimitées</li>
                  <li className="flex items-center"><span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">✓</span> Scan Corporel guidé (10 min)</li>
                  <li className="flex items-center"><span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">✓</span> Sons binauraux thérapeutiques</li>
                  <li className="flex items-center"><span className="bg-green-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">✓</span> Tous les rythmes respiratoires</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        {error && (
          <div className={`border rounded-xl p-4 mb-6 ${
            error.startsWith('✅') 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            <p className={`text-sm text-center ${
              error.startsWith('✅') ? 'text-green-200' : 'text-red-200'
            }`}>
              {error}
            </p>
            
            {/* Option pour renvoyer l'email de confirmation */}
            {showResendOption && (
              <div className="mt-4 pt-4 border-t border-red-500/20">
                <p className="text-red-100 text-xs text-center mb-3">
                  Vous n'avez pas reçu l'email ? Vérifiez vos spams ou :
                </p>
                <button
                  onClick={handleResendConfirmation}
                  disabled={loading}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 py-2 px-4 rounded-lg text-sm transition-colors border border-red-500/30"
                >
                  {loading ? 'Envoi...' : 'Renvoyer l\'email de confirmation'}
                </button>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-white mt-2">
                Minimum 6 caractères
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || processingPayment}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
          >
            {loading || processingPayment ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {processingPayment ? 'Redirection...' : isLogin ? 'Connexion...' : 'Création...'}
              </>
            ) : (
              <>
                {isLogin ? 'Se connecter' : 'Créer mon compte gratuit'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Basculer entre connexion et inscription */}
        <div className="text-center mb-8">
          <p className="text-white mb-4">
            {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          </p>
          <button
            onClick={toggleMode}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30"
          >
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </button>
        </div>

        {/* Options Premium */}
        {!isLogin && (
          <div className="space-y-4 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Ou passez directement Premium
              </h3>
              <p className="text-white/80 text-sm">
                Accès immédiat à toutes les fonctionnalités avancées
              </p>
            </div>

            {/* Achat annuel */}
            <button
              onClick={() => handlePremiumPurchase('yearly')}
              disabled={loading || processingPayment}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-between hover:from-purple-700 hover:to-purple-800 transition-all duration-200 border border-purple-500/30"
            >
              <div className="flex items-center gap-3">
                <Crown size={24} className="text-purple-200" />
                <div className="text-left">
                  <div className="font-bold">Premium Annuel</div>
                  <div className="text-sm text-purple-200">Renouvelable chaque année</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">14,99€</div>
                <div className="text-sm text-purple-200">/an</div>
              </div>
            </button>

            {/* Achat à vie */}
            <button
              onClick={() => handlePremiumPurchase('lifetime')}
              disabled={loading || processingPayment}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-between hover:from-amber-600 hover:to-orange-600 transition-all duration-200 border-2 border-amber-400/50 relative overflow-hidden"
            >
              {/* Badge "POPULAIRE" */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
              
              <div className="flex items-center gap-3">
                <Sparkles size={24} className="text-amber-200" />
                <div className="text-left">
                  <div className="font-bold">Premium à Vie</div>
                  <div className="text-sm text-amber-200">Paiement unique, accès permanent</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">49€</div>
                <div className="text-sm text-amber-200">à vie</div>
              </div>
            </button>
          </div>
        )}

        {/* Avantages Premium */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-8">
          <h4 className="text-sm font-semibold text-green-200 mb-3">✨ Fonctionnalités Premium :</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-100/90">
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Méditations thématiques</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Auto-hypnose guidée</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Voix premium Claire & Thierry</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Sessions illimitées</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Statistiques avancées</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Support prioritaire</div>
          </div>
        </div>
        
        {/* Avantages Premium */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-8">
          <h4 className="text-sm font-semibold text-green-200 mb-3">✨ Fonctionnalités Premium :</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-100/90">
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Méditations thématiques</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Auto-hypnose guidée</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Voix premium Claire & Thierry</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Sessions illimitées</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Statistiques avancées</div>
            <div className="flex items-center"><span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>Support prioritaire</div>
          </div>
        </div>

        {/* Note de développement */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-xs text-green-200 text-center">
            <strong>✅ Authentification Supabase active :</strong> Créez votre compte pour accéder à toutes les fonctionnalités 
            et bénéficier de 7 jours d'essai gratuit Premium !
          </p>
        </div>
      </div>
    </div>
  );
}