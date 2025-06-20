# 🎤 GUIDE COMPLET : Nouvelle Clé API ElevenLabs

## 🚀 **ÉTAPE 1 : Créer un compte ElevenLabs**

### **Inscription gratuite**
1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **Cliquer sur "Sign Up"** en haut à droite
3. **Choisir une méthode d'inscription :**
   - Email + mot de passe
   - Google Account
   - GitHub Account

### **Vérification email**
- Vérifier votre boîte email
- Cliquer sur le lien de confirmation
- Compléter votre profil

## 🔑 **ÉTAPE 2 : Générer votre clé API**

### **Accéder aux paramètres**
1. **Se connecter** sur [elevenlabs.io](https://elevenlabs.io)
2. **Cliquer sur votre avatar** en haut à droite
3. **Sélectionner "Settings"** dans le menu

### **Générer la clé API**
1. **Dans le menu de gauche** → **"API Keys"**
2. **Cliquer sur "Generate API Key"**
3. **Donner un nom** à votre clé (ex: "Instant Opportun")
4. **Copier immédiatement** la clé générée

⚠️ **IMPORTANT :** La clé ne sera affichée qu'une seule fois !

## 📋 **ÉTAPE 3 : Configuration dans votre projet**

### **Créer le fichier .env**
Dans votre projet, créer un fichier `.env` à la racine :

```env
# ElevenLabs API Configuration
VITE_ELEVENLABS_API_KEY=sk_votre_vraie_cle_api_ici

# Exemple de format :
# VITE_ELEVENLABS_API_KEY=sk_1234567890abcdef1234567890abcdef
```

### **Redémarrer l'application**
```bash
# Arrêter l'application (Ctrl+C)
# Puis redémarrer
npm run dev
```

## 🎯 **ÉTAPE 4 : Vérification de la configuration**

### **Test dans l'application**
1. **Ouvrir l'application** dans le navigateur
2. **Aller dans le menu** (☰) → **Paramètres**
3. **Section "Guidage vocal"**
4. **Vérifier le statut ElevenLabs :**
   - ✅ **Connecté** = Configuration réussie
   - ❌ **Non disponible** = Problème de clé

### **Test vocal rapide**
1. **Activer "ElevenLabs (Premium)"**
2. **Lancer une session SOS Stress**
3. **Écouter le guidage vocal**

## 💰 **PLAN GRATUIT ELEVENLABS**

### **Limites du plan gratuit**
- **10 000 caractères/mois** (environ 15-20 minutes d'audio)
- **3 voix personnalisées**
- **Toutes les voix de base** disponibles
- **Qualité premium** identique

### **Optimisation pour le plan gratuit**
- Les sessions courtes (SOS Stress 1min30) consomment peu
- Guidage vocal intelligent et ciblé
- Fallback automatique vers voix système

## 🔧 **ÉTAPE 5 : Configuration Netlify**

### **Variables d'environnement Netlify**
1. **Aller sur** [app.netlify.com](https://app.netlify.com)
2. **Sélectionner votre site**
3. **Site settings** → **Environment variables**
4. **Add variable :**
   - **Key :** `VITE_ELEVENLABS_API_KEY`
   - **Value :** votre clé API complète

### **Redéployer le site**
1. **Deploys** → **Trigger deploy** → **Deploy site**
2. **Attendre** la fin du build (2-3 minutes)
3. **Tester** l'application déployée

## 🎤 **VOIX OPTIMISÉES DISPONIBLES**

### **Voix féminine : Sarah**
- **ID :** `EXAVITQu4vr4xnSDxMaL`
- **Caractère :** Douce et apaisante
- **Parfaite pour :** Relaxation, méditation

### **Voix masculine : Josh**
- **ID :** `VR6AewLTigWG4xSOukaG`
- **Caractère :** Calme et rassurante
- **Parfaite pour :** Guidage, concentration

## 🛠️ **DÉPANNAGE**

### **Erreur "API Key invalide"**
- Vérifier que la clé commence par `sk_`
- Pas d'espaces avant/après la clé
- Clé copiée entièrement

### **Erreur "Quota dépassé"**
- Plan gratuit épuisé pour le mois
- Attendre le renouvellement mensuel
- Ou upgrader vers un plan payant

### **Pas de son**
- Vérifier les autorisations audio du navigateur
- Tester sur HTTPS (requis pour les APIs audio)
- Vérifier le volume dans les paramètres

## 📊 **MONITORING DE L'USAGE**

### **Vérifier votre consommation**
1. **Dashboard ElevenLabs** → **Usage**
2. **Voir les caractères utilisés/restants**
3. **Historique des générations**

### **Optimisation automatique**
L'application optimise automatiquement :
- **Préprocessing intelligent** du texte
- **Cache des audios** générés
- **Fallback vers voix système** si quota épuisé

## ✅ **CHECKLIST FINALE**

- [ ] Compte ElevenLabs créé
- [ ] Clé API générée et copiée
- [ ] Fichier `.env` créé avec la clé
- [ ] Application redémarrée localement
- [ ] Test vocal réussi
- [ ] Variable Netlify configurée
- [ ] Site redéployé
- [ ] Test sur le site en ligne

## 🎉 **RÉSULTAT ATTENDU**

Avec ElevenLabs configuré, vous obtiendrez :

✅ **Voix ultra-naturelles** et expressives  
✅ **Guidage synchronisé** parfaitement avec la respiration  
✅ **Qualité audio premium** (22kHz)  
✅ **Expérience immersive** optimale  
✅ **Fallback automatique** si problème  

---

## 🔗 **LIENS UTILES**

- **ElevenLabs :** [elevenlabs.io](https://elevenlabs.io)
- **Documentation API :** [docs.elevenlabs.io](https://docs.elevenlabs.io)
- **Dashboard :** [elevenlabs.io/app](https://elevenlabs.io/app)
- **Support :** [help.elevenlabs.io](https://help.elevenlabs.io)

---

**🎯 Votre application de cohérence cardiaque aura maintenant des voix premium !**