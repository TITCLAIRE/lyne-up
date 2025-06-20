# 🍎 GUIDE MAC : TESTER L'API ELEVENLABS EN LOCAL

## 🎯 **OBJECTIF : Tester votre app avec la voix ElevenLabs sur votre Mac**

### **ÉTAPE 1 : Télécharger le projet depuis GitHub**

1. **Aller sur votre page GitHub** → votre projet `instant-opportun`
2. **Cliquer sur le bouton vert "Code"** 
3. **Cliquer sur "Download ZIP"**
4. **Le fichier se télécharge** dans "Téléchargements"
5. **Double-cliquer sur le ZIP** pour l'extraire
6. **Vous avez un dossier** `instant-opportun-main`

### **ÉTAPE 2 : Ouvrir le Terminal**

1. **Cmd + Espace** (recherche Spotlight)
2. **Taper "Terminal"**
3. **Appuyer sur Entrée**

### **ÉTAPE 3 : Aller dans le dossier**

Dans le Terminal, tapez :
```bash
cd ~/Downloads/instant-opportun-main
```

Puis vérifiez avec :
```bash
ls
```

**Vous devez voir :** package.json, src, index.html, etc.

### **ÉTAPE 4 : Créer le fichier .env avec votre clé API**

```bash
touch .env
open .env
```

**Dans TextEdit qui s'ouvre**, copiez ceci :
```
VITE_ELEVENLABS_API_KEY=sk_votre_vraie_cle_api_ici
```

**Remplacez** `sk_votre_vraie_cle_api_ici` par votre vraie clé ElevenLabs

**Enregistrez** (Cmd + S) et **fermez** TextEdit

### **ÉTAPE 5 : Installer et lancer**

```bash
npm install
```

Attendez 1-2 minutes, puis :

```bash
npm run dev
```

### **ÉTAPE 6 : Ouvrir l'app**

**Dans votre navigateur**, aller à :
```
http://localhost:5173
```

### **ÉTAPE 7 : Tester la voix ElevenLabs**

1. **Ouvrir l'app** → **Menu (☰)** → **Paramètres**
2. **Section "Guidage vocal"**
3. **Vérifier que "ElevenLabs (Premium)" est activé**
4. **Vérifier le statut** : doit afficher "✅ ElevenLabs connecté"
5. **Lancer une session SOS Stress** (1min 30s)
6. **Écouter le guidage vocal premium !**

---

## 🔑 **OBTENIR VOTRE CLÉ ELEVENLABS**

### **Inscription gratuite (2 minutes)**

1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **Cliquer "Sign Up"**
3. **Créer un compte** (email + mot de passe)
4. **Vérifier votre email**

### **Générer la clé API**

1. **Se connecter** sur ElevenLabs
2. **Cliquer sur votre avatar** (en haut à droite)
3. **Sélectionner "Settings"**
4. **Cliquer "API Keys"** (menu de gauche)
5. **Cliquer "Generate API Key"**
6. **Copier la clé** (commence par `sk_`)

### **Format de la clé**
```
sk_1234567890abcdef1234567890abcdef1234567890
```

---

## 🎤 **CE QUE VOUS ALLEZ ENTENDRE**

### **Voix premium disponibles :**
- **Sarah** (féminine) : Voix douce et apaisante
- **Josh** (masculine) : Voix calme et rassurante

### **Guidage vocal SOS Stress :**
- **0s :** "Bienvenue dans votre bulle de calme..."
- **10s :** "Inspirez le calme" (synchronisé avec inspiration)
- **30s :** "Vos pieds touchent le sol..."
- **35s :** "Soufflez doucement"
- **50s :** "Accueillez l'air frais"
- **55s :** "Le stress s'évapore..."
- **65s :** "Relâchez tout"
- **80s :** "Vous retrouvez votre centre..."
- **90s :** "Parfait. Vous avez retrouvé votre calme..."

---

## ✅ **AVANTAGES DU TEST LOCAL**

✅ **Test immédiat** de l'API ElevenLabs  
✅ **Pas de problème de déploiement**  
✅ **Modification facile** de la clé API  
✅ **Debug en temps réel**  
✅ **Validation complète** avant mise en ligne  

---

## 🆘 **AIDE**

**Dites-moi :**
1. **À quelle étape** vous êtes
2. **Si vous avez des erreurs**
3. **Si vous avez besoin d'aide** pour la clé ElevenLabs

---

**🎯 COMMENCEZ PAR TÉLÉCHARGER LE ZIP DEPUIS GITHUB !**

Une fois que ça marche en local, on pourra corriger Netlify facilement.