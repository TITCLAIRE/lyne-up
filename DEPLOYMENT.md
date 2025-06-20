# Guide de Déploiement - Instant Opportun

## 🚀 Déploiement sur GitHub + Netlify

### Étape 1 : Créer le repository GitHub

1. **Aller sur GitHub** : [github.com](https://github.com)
2. **Nouveau repository** : Cliquer sur "New repository"
3. **Nom** : `instant-opportun` (ou le nom de votre choix)
4. **Description** : "Application de cohérence cardiaque avec guidage vocal premium"
5. **Public/Private** : Choisir selon vos préférences
6. **Créer le repository**

### Étape 2 : Pousser le code

```bash
# Dans le terminal de votre projet
git init
git add .
git commit -m "Initial commit - Instant Opportun"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/instant-opportun.git
git push -u origin main
```

### Étape 3 : Déployer sur Netlify

1. **Aller sur Netlify** : [netlify.com](https://netlify.com)
2. **Se connecter** avec GitHub
3. **New site from Git** → **GitHub**
4. **Sélectionner** votre repository `instant-opportun`
5. **Configuration** :
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

### Étape 4 : Configurer les variables d'environnement

Dans Netlify :
1. **Site settings** → **Environment variables**
2. **Add variable** :
   - Key: `VITE_ELEVENLABS_API_KEY`
   - Value: Votre clé API ElevenLabs

### Étape 5 : Obtenir la clé API ElevenLabs

1. **Créer un compte** : [elevenlabs.io](https://elevenlabs.io)
2. **Aller dans Settings** → **API Keys**
3. **Generate API Key**
4. **Copier la clé** et l'ajouter dans Netlify

## 🔧 Configuration avancée

### Domaine personnalisé (optionnel)

1. Dans Netlify : **Domain settings**
2. **Add custom domain**
3. Suivre les instructions DNS

### HTTPS automatique

Netlify active automatiquement HTTPS avec Let's Encrypt.

### Déploiement automatique

Chaque push sur la branche `main` déclenche un nouveau déploiement.

## 📱 Test de l'application

Une fois déployée, testez :
- ✅ Chargement de l'application
- ✅ Sessions de cohérence cardiaque
- ✅ Guidage vocal (si API configurée)
- ✅ Sons binauraux
- ✅ Mode PWA (installation)

## 🐛 Dépannage

### Erreur de build
- Vérifier les logs dans Netlify
- S'assurer que `npm run build` fonctionne localement

### API ElevenLabs ne fonctionne pas
- Vérifier la clé API dans les variables d'environnement
- Tester la clé sur [elevenlabs.io](https://elevenlabs.io)

### Sons ne fonctionnent pas
- Vérifier les autorisations du navigateur
- Tester sur HTTPS (requis pour les APIs audio)

## 📊 Monitoring

### Analytics Netlify
- Trafic et performance automatiquement trackés
- Disponible dans le dashboard Netlify

### Logs d'erreur
- Consultables dans Netlify Functions (si utilisées)
- Console du navigateur pour le debug client

---

**Votre application sera accessible à l'adresse :**
`https://VOTRE-SITE.netlify.app`

🎉 **Félicitations ! Votre app de cohérence cardiaque est maintenant en ligne !**