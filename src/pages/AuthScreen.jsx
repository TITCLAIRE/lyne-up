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
  
  const navigate = useNavigate();
  const { setAuthenticated } = useAppStore();
  const { signUp, signIn } = useSupabase();

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
    
    console.log('🔐 Tentative d\'authentification:', { isLogin, email: formData.email });
    
    try {
      let result;
      
      if (isLogin) {
        // Connexion
        result = await signIn(formData.email, formData.password);
      } else {
        // Inscription
        result = await signUp(formData.email, formData.password, formData.name);
      }
      
      if (result.success) {
        console.log('✅ Authentification réussie');
        // L'authentification est gérée automatiquement par useSupabase
        navigate('/');
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('❌ Erreur authentification:', error);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
    setError('');
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
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-200 text-sm text-center">{error}</p>
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
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isLogin ? 'Connexion...' : 'Création...'}
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
            {isLogin ? 'Créer un compte gratuit' : 'Se connecter'}
          </button>
        </div>

        {/* Offre premium */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Crown size={24} className="text-purple-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-purple-200 mb-2">
                🎁 Offre de lancement
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Accédez à toutes les fonctionnalités premium : sessions express, 
                méditations thématiques, voix premium et bien plus !
              </p>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <p className="text-sm font-semibold text-purple-200">
                  Premium à vie : <span className="text-2xl">9,99€</span>
                </p>
                <p className="text-xs text-purple-100/80">
                  Toutes les mises à jour incluses • Aucun abonnement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note de développement */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-xs text-yellow-200 text-center">
            <strong>Note de développement :</strong> Cette page d'authentification est un placeholder. 
            Dans la Phase 2, nous intégrerons Supabase pour une authentification réelle.
          </p>
        </div>
      </div>
    </div>
  );
}