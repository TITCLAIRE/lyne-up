# 🔧 CONFIGURATION ELEVENLABS POUR PROJET GITHUB

## 🎯 **VOTRE SITUATION : Projet sur GitHub**

Puisque votre projet est sur GitHub, vous avez **2 options** pour configurer ElevenLabs :

## 📋 **OPTION 1 : Configuration Netlify (RECOMMANDÉE)**

### **Étape 1 : Obtenir votre clé API**
1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **S'inscrire gratuitement** (si pas encore fait)
3. **Se connecter** → **Settings** → **API Keys**
4. **Generate API Key** → **Copier la clé**

### **Étape 2 : Configurer dans Netlify**
1. **Aller sur** [app.netlify.com](https://app.netlify.com)
2. **Sélectionner votre site**
3. **Site settings** → **Environment variables**
4. **Add variable :**
   - **Key :** `VITE_ELEVENLABS_API_KEY`
   - **Value :** `sk_votre_vraie_cle_api_ici`

### **Étape 3 : Redéployer**
1. **Deploys** → **Trigger deploy** → **Deploy site**
2. **Attendre** 2-3 minutes
3. **Tester** l'application

## 📋 **OPTION 2 : Fichier .env local (pour tests)**

### **Si vous voulez tester localement d'abord :**

1. **Cloner votre repository GitHub** sur votre ordinateur :
```bash
git clone https://github.com/votre-username/instant-opportun.git
cd instant-opportun
```

2. **Créer un fichier `.env`** à la racine :
```env
VITE_ELEVENLABS_API_KEY=sk_votre_vraie_cle_api_ici
```

3. **Installer et tester localement :**
```bash
npm install
npm run dev
```

4. **Une fois testé, configurer Netlify** (Option 1)

## 🎤 **AVANTAGES ELEVENLABS**

### **Plan gratuit (10 000 caractères/mois)**
- **Largement suffisant** pour l'usage normal
- **Voix ultra-naturelles** : Sarah (féminine), Josh (masculine)
- **Qualité premium** identique au plan payant
- **Optimisé pour la relaxation**

### **Dans votre application**
- **Guidage vocal synchronisé** avec la respiration
- **Messages de relaxation** naturels et apaisants
- **Fallback automatique** vers voix système si problème

## ✅ **VÉRIFICATION**

### **Après configuration Netlify :**
1. **Ouvrir votre app** : `https://votre-site.netlify.app`
2. **Menu (☰)** → **Paramètres**
3. **Section "Guidage vocal"**
4. **Vérifier le statut :**
   - ✅ **Connecté** = Configuration réussie
   - ❌ **Non disponible** = Clé manquante/invalide

### **Test vocal :**
1. **Activer "ElevenLabs (Premium)"**
2. **Lancer une session SOS Stress** (1min 30s)
3. **Écouter le guidage vocal premium**

## 🚨 **IMPORTANT**

### **Sécurité :**
- **JAMAIS** commiter le fichier `.env` sur GitHub
- **Toujours** utiliser les variables d'environnement Netlify pour la production
- Le fichier `.gitignore` exclut déjà `.env`

### **Format de la clé :**
- Commence toujours par `sk_`
- Environ 50 caractères
- Exemple : `sk_1234567890abcdef1234567890abcdef1234567890`

## 🎯 **RECOMMANDATION**

**Pour votre cas (projet GitHub) :**

1. **Configurer directement dans Netlify** (Option 1)
2. **Pas besoin de fichier .env local**
3. **Tester directement sur le site déployé**

C'est plus simple et plus sécurisé !

## 🔗 **LIENS DIRECTS**

- **ElevenLabs :** [elevenlabs.io](https://elevenlabs.io)
- **Netlify Dashboard :** [app.netlify.com](https://app.netlify.com)
- **Votre app :** `https://votre-site.netlify.app`

---

**🎉 Avec ElevenLabs, votre app aura des voix premium pour une expérience de relaxation optimale !**