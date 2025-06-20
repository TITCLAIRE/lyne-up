# 🧘‍♀️ Instant Opportun - Cohérence Cardiaque

Application web de cohérence cardiaque intégrative avec guidage vocal premium et sons binauraux thérapeutiques.

## ✨ Fonctionnalités

### 🎯 Sessions Guidées
- **SOS Stress** (1min 30s) - Ancrage d'urgence avec timings parfaits
- **Boost Focus** (3min) - Concentration laser optimisée
- **Récup Express** (5min) - Régénération profonde
- **Transition Fluide** (3min) - Navigation des changements
- **Scan Corporel** (10min) - Relaxation profonde guidée

### 💖 Cohérence Cardiaque
- Sessions de **3, 5 ou 15 minutes**
- Rythmes **5/5** et **4/6** respiratoires
- Synchronisation parfaite avec guidage vocal
- Fréquence **0.1Hz** optimale pour la cohérence

### 🧘 Méditations Thématiques
- **Gratitude** - Cultivez la reconnaissance
- **Abondance** - Attirez la prospérité
- **Amour Universel** - Ouvrez votre cœur
- **Loi d'Attraction** - Manifestez vos désirs
- **Confiance en Soi** - Renforcez votre pouvoir
- **Sommeil Profond** - Préparez-vous au repos

### 🎤 Guidage Vocal Premium
- **ElevenLabs** : Voix ultra-naturelles (Sarah & Josh)
- **Voix système** : Fallback automatique
- **Synchronisation parfaite** avec la respiration
- **Messages personnalisés** selon la session

### 🎵 Sons Thérapeutiques
- **Sons binauraux** avec écouteurs stéréo
- **Fréquences spécifiques** : 0.1Hz, 528Hz, 432Hz, etc.
- **Gong respiratoire** synchronisé
- **Volumes optimisés** : Sons 20-30%, Voix 60-70%, Gong 10-20%

### 📱 Interface Premium
- **Design moderne** et intuitif
- **PWA** installable comme app native
- **Responsive** mobile et desktop
- **Mode caméra** pour détection cardiaque (optionnel)

## 🚀 Déploiement

### Prérequis
- Node.js 18+ et npm 9+
- Compte [ElevenLabs](https://elevenlabs.io) (optionnel pour voix premium)

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/instant-opportun.git
cd instant-opportun

# Installer les dépendances
npm install

# Configurer ElevenLabs (optionnel)
cp .env.example .env
# Éditer .env avec votre clé API ElevenLabs

# Lancer en développement
npm run dev
```

### Configuration ElevenLabs

1. **Créer un compte** sur [elevenlabs.io](https://elevenlabs.io) (gratuit)
2. **Obtenir la clé API** : Settings → API Keys → Generate API Key
3. **Ajouter dans .env** :
   ```env
   VITE_ELEVENLABS_API_KEY=sk_votre_cle_api_ici
   ```
4. **Redémarrer** l'application

### Déploiement Netlify

1. **Fork** ce repository sur GitHub
2. **Connecter à Netlify** :
   - Aller sur [netlify.com](https://netlify.com)
   - "New site from Git" → Sélectionner votre fork
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Variables d'environnement Netlify** :
   - Site settings → Environment variables
   - Ajouter : `VITE_ELEVENLABS_API_KEY` = votre clé API

4. **Déployer** : Trigger deploy → Deploy site

## 🎯 Utilisation

### Sessions Rapides
- **SOS Stress** : Ancrage immédiat en 90 secondes
- **Focus** : Concentration optimale en 3 minutes
- **Récup** : Recharge énergétique en 5 minutes

### Cohérence Cardiaque
- Choisir durée (3/5/15 min) et rythme (5/5 ou 4/6)
- Suivre le guide respiratoire visuel
- Écouter le guidage vocal synchronisé

### Méditations
- Sélectionner un thème selon vos besoins
- Sessions de 5 à 10 minutes
- Guidage vocal adapté au thème

### Paramètres Audio
- **Sons binauraux** : Utiliser des écouteurs stéréo
- **Volumes recommandés** : Sons 20-30%, Voix 60-70%
- **Fréquences** : Automatiques selon la session

## 🔧 Technologies

- **React 18** + TypeScript
- **Tailwind CSS** pour le design
- **Zustand** pour la gestion d'état
- **ElevenLabs API** pour la synthèse vocale premium
- **Web Audio API** pour les sons binauraux
- **MediaDevices API** pour la détection cardiaque

## 📊 Fonctionnalités Avancées

### Détection Biométrique
- **Mode caméra** : Détection réelle du rythme cardiaque
- **Mode simulation** : Affichage fixe pour démonstration
- **Métriques** : FC, HRV, Cohérence, Rythme respiratoire

### PWA (Progressive Web App)
- **Installation** sur écran d'accueil
- **Mode hors-ligne** partiel
- **Notifications** (futures versions)

### Optimisations
- **Timings parfaits** pour SOS Stress
- **Synchronisation** voix/respiration
- **Fallback automatique** si problème API
- **Cache intelligent** des audios générés

## 🎵 Fréquences Thérapeutiques

- **0.1 Hz** : Cohérence cardiaque optimale
- **528 Hz** : Fréquence de l'amour et de la guérison
- **432 Hz** : Harmonie naturelle
- **396 Hz** : Libération des peurs
- **639 Hz** : Relations harmonieuses
- **Ondes Theta/Alpha/Beta/Delta** : États de conscience

## 🔒 Sécurité

- **Variables d'environnement** pour les clés API
- **HTTPS** requis pour les APIs audio
- **Pas de données personnelles** stockées
- **Respect de la vie privée**

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Mobiles** : iOS 12+, Android 8+
- **Écouteurs** : Obligatoires pour sons binauraux
- **Caméra** : Optionnelle pour détection cardiaque

## 🆘 Support

### Problèmes Courants
- **Pas de son** : Vérifier autorisations navigateur
- **ElevenLabs** : Vérifier clé API et quota
- **Caméra** : Autoriser accès et utiliser lampe torche

### Contact
- **Issues** : [GitHub Issues](https://github.com/votre-username/instant-opportun/issues)
- **Documentation** : [ElevenLabs Docs](https://docs.elevenlabs.io/)

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

**🧘‍♀️ Instant Opportun** - Transformez votre bien-être avec la cohérence cardiaque intégrative ✨