# 🍎 GUIDE MAC - DOSSIER "PROJECT" SUR LE BUREAU

## ✅ **PARFAIT ! Dossier "project" sur le Bureau**

Maintenant on va tester l'API ElevenLabs en local sur votre Mac.

---

## 📋 **ÉTAPE 1 : Aller dans le dossier "project"**

Dans votre Terminal, tapez exactement ceci (puis Entrée) :
```bash
cd ~/Desktop/project
```

**Si votre Mac est en français**, essayez :
```bash
cd ~/Bureau/project
```

---

## 📋 **ÉTAPE 2 : Vérifier le contenu**

Tapez ceci (puis Entrée) :
```bash
ls
```

**Vous devez voir** des fichiers comme :
- package.json
- index.html
- src
- README.md
- etc.

✅ **Si vous voyez ça = PARFAIT !**

---

## 📋 **ÉTAPE 3 : Créer le fichier .env**

Tapez exactement ceci (puis Entrée) :
```bash
touch .env
```

Puis tapez ceci (puis Entrée) :
```bash
open .env
```

**Un fichier vide s'ouvre dans TextEdit**

---

## 📋 **ÉTAPE 4 : Remplir le fichier .env**

Dans TextEdit qui vient de s'ouvrir, copiez-collez exactement ceci :
```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Pour l'instant, laissez** `your_elevenlabs_api_key_here` tel quel.

**Enregistrez** le fichier (Cmd + S)
**Fermez** TextEdit

---

## 📋 **ÉTAPE 5 : Installer les dépendances**

Dans le Terminal, tapez ceci (puis Entrée) :
```bash
npm install
```

**Attendez** que ça se termine (1-2 minutes). Vous verrez plein de texte défiler.

---

## 📋 **ÉTAPE 6 : Lancer l'application**

Une fois l'installation terminée, tapez ceci (puis Entrée) :
```bash
npm run dev
```

**Vous devez voir** quelque chose comme :
```
Local:   http://localhost:5173/
```

---

## 📋 **ÉTAPE 7 : Ouvrir dans le navigateur**

**Ouvrez Safari ou Chrome**

**Tapez cette adresse** :
```
http://localhost:5173
```

**Appuyez sur Entrée**

🎉 **VOTRE APP DOIT S'OUVRIR !**

---

## 🔑 **ÉTAPE 8 : Obtenir votre clé ElevenLabs (optionnel)**

Si vous voulez tester le guidage vocal premium :

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

### **Ajouter la clé dans votre app**
1. **Retourner dans TextEdit** (ou rouvrir le fichier .env)
2. **Remplacer** `your_elevenlabs_api_key_here` par votre vraie clé
3. **Enregistrer** le fichier
4. **Dans le Terminal**, arrêter l'app (Ctrl+C)
5. **Relancer** avec `npm run dev`

---

## 🎤 **TESTER LA VOIX ELEVENLABS**

Une fois votre clé ajoutée :

1. **Ouvrir l'app** → **Menu (☰)** → **Paramètres**
2. **Section "Guidage vocal"**
3. **Vérifier que "ElevenLabs (Premium)" est activé**
4. **Vérifier le statut** : doit afficher "✅ ElevenLabs connecté"
5. **Lancer une session SOS Stress** (1min 30s)
6. **Écouter le guidage vocal premium !**

---

## 🎯 **CE QUE VOUS ALLEZ ENTENDRE**

### **Guidage vocal SOS Stress avec timings parfaits :**
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

## 🆘 **AIDE**

**Dites-moi :**
1. **À quelle étape** vous êtes
2. **Si vous voyez des erreurs**
3. **Si l'app s'ouvre** correctement

---

**🎯 COMMENCEZ PAR L'ÉTAPE 1 : `cd ~/Desktop/project`**

Une fois que ça marche en local, on pourra corriger Netlify facilement !