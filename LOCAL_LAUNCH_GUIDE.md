# 🚀 LANCER L'APPLICATION EN LOCAL

## 📋 **ÉTAPES PRÉCISES**

### **1. Télécharger le projet**

Depuis votre capture d'écran, je vois que vous avez le projet. Assurez-vous d'avoir tous les fichiers dans un dossier.

### **2. Ouvrir le terminal/invite de commande**

**Windows :**
- Appuyer sur `Windows + R`
- Taper `cmd` et appuyer sur Entrée
- Ou utiliser PowerShell

**Mac :**
- Appuyer sur `Cmd + Espace`
- Taper `Terminal` et appuyer sur Entrée

**Linux :**
- `Ctrl + Alt + T`

### **3. Naviguer vers le dossier du projet**

```bash
# Remplacer "chemin/vers/votre/dossier" par le vrai chemin
cd chemin/vers/instant-opportun
```

**Exemple Windows :**
```bash
cd C:\Users\VotreNom\Desktop\instant-opportun
```

**Exemple Mac :**
```bash
cd /Users/VotreNom/Desktop/instant-opportun
```

### **4. Vérifier que vous êtes dans le bon dossier**

```bash
# Lister les fichiers - vous devez voir package.json
ls        # Mac/Linux
dir       # Windows
```

Vous devez voir des fichiers comme :
- `package.json`
- `index.html`
- `src/`
- etc.

### **5. Installer les dépendances**

```bash
npm install
```

⏳ **Attendre** que l'installation se termine (1-2 minutes)

### **6. Créer le fichier .env (IMPORTANT)**

**Créer un fichier** nommé exactement `.env` dans le dossier racine avec ce contenu :

```env
# ElevenLabs API Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Instructions:
# 1. Remplacez 'your_elevenlabs_api_key_here' par votre vraie clé API ElevenLabs
# 2. Obtenez votre clé API sur: https://elevenlabs.io/app/settings/api-keys
# 
# Exemple de format :
# VITE_ELEVENLABS_API_KEY=sk_1234567890abcdef1234567890abcdef1234567890
```

### **7. Lancer l'application**

```bash
npm run dev
```

### **8. Ouvrir dans le navigateur**

L'application sera accessible à :
```
http://localhost:5173
```

**Copier cette adresse** dans votre navigateur.

## 🔑 **OBTENIR VOTRE CLÉ ELEVENLABS (OPTIONNEL)**

### **Pour le guidage vocal premium :**

1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **S'inscrire gratuitement**
3. **Se connecter** → **Settings** → **API Keys**
4. **Generate API Key** → **Copier la clé**
5. **Remplacer** dans le fichier `.env`

### **Format de la clé :**
```env
VITE_ELEVENLABS_API_KEY=sk_1234567890abcdef1234567890abcdef1234567890
```

## ✅ **TESTS À EFFECTUER**

1. **Ouvrir** http://localhost:5173
2. **Vérifier** que l'application se charge
3. **Menu (☰)** → **Paramètres** → **Vérifier statut ElevenLabs**
4. **Lancer une session SOS Stress** (1min 30s)
5. **Tester avec des écouteurs** pour les sons binauraux

## 🔧 **DÉPANNAGE**

### **Si erreur "npm not found" :**
- **Installer Node.js** depuis [nodejs.org](https://nodejs.org)
- **Redémarrer** le terminal

### **Si erreur "Module not found" :**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Si le port 5173 est occupé :**
L'application utilisera automatiquement un autre port (5174, 5175, etc.)

## 🎯 **RÉSULTAT ATTENDU**

✅ **Application fonctionnelle** en local  
✅ **Timings SOS Stress corrigés** (1min 30s)  
✅ **Interface premium** avec logo  
✅ **Guidage vocal** (si ElevenLabs configuré)  
✅ **Sons binauraux** avec écouteurs  

---

**🎉 Une fois validé en local, le déploiement Netlify sera garanti !**