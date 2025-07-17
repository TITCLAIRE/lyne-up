import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Heart, Sparkles, Gift, Crown } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();
  const { setAuthenticated } = useAppStore();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔐 Tentative d\'authentification:', { isLogin, email: formData.email });
    
    // Simulation d'authentification réussie
    // Dans la vraie implémentation, ici on appellerait Supabase
    const mockUser = {
      id: '1',
      email: formData.email,
      name: formData.name || 'Utilisateur',
      isPremium: false,
      createdAt: new Date().toISOString()
    };
    
    setAuthenticated(true, mockUser);
    navigate('/');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <div className="px-5 pb-5 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400/30 to-purple-500/30 border border-cyan-400/50 backdrop-blur-sm">
              <Heart size={32} className="text-cyan-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {isLogin ? 'Bon retour !' : 'Créez votre compte'}
          </h1>
          <p className="text-white/80 text-lg">
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
                <h3 className="text-lg font-semibold text-green-100 mb-2">Compte gratuit inclus :</h3>
                <ul className="text-sm text-white/90 space-y-1">
                  <li>✅ Sessions de cohérence cardiaque illimitées</li>
                  <li>✅ Rythmes 5/5 et 4/6 disponibles</li>
                  <li>✅ Sons binauraux thérapeutiques</li>
                  <li>✅ Suivi de vos progrès</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70"
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-white/70 mt-2">
                Minimum 6 caractères
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            {isLogin ? 'Se connecter' : 'Créer mon compte gratuit'}
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Basculer entre connexion et inscription */}
        <div className="text-center mb-8">
          <p className="text-white/80 mb-4">
            {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          </p>
          <button
            onClick={toggleMode}
            className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
          >
            {isLogin ? 'Créer un compte gratuit' : 'Se connecter'}
          </button>
        </div>

        {/* Offre premium */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
          <div className="flex items-start gap-3">
            <Crown size={24} className="text-purple-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-purple-100 mb-2">
                🎁 Offre de lancement
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-3">
                Accédez à toutes les fonctionnalités premium : sessions express, 
                méditations thématiques, voix premium et bien plus !
              </p>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-purple-100">
                  Premium à vie : <span className="text-2xl">9,99€</span>
                </p>
                <p className="text-xs text-white/90">
                  Toutes les mises à jour incluses • Aucun abonnement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note de développement */}
        <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
          <p className="text-xs text-yellow-100 text-center">
            <strong>Note de développement :</strong> Cette page d'authentification est un placeholder. 
            Dans la Phase 2, nous intégrerons Supabase pour une authentification réelle.
          </p>
        </div>
      </div>
    </div>
  );
}