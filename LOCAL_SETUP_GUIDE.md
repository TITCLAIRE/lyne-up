# 🏠 GUIDE COMPLET : Test en local sur votre ordinateur

## 📥 **ÉTAPE 1 : Télécharger le projet depuis GitHub**

### **Méthode A : Téléchargement ZIP (SIMPLE)**
1. **Aller sur votre repository GitHub**
2. **Cliquer sur le bouton vert "Code"**
3. **Sélectionner "Download ZIP"**
4. **Extraire le fichier ZIP** sur votre ordinateur
5. **Ouvrir le dossier** `instant-opportun-main`

### **Méthode B : Git clone (si vous avez Git)**
```bash
git clone https://github.com/votre-username/instant-opportun.git
cd instant-opportun
```

## 📝 **ÉTAPE 2 : Créer le fichier .env**

### **Dans le dossier du projet :**
1. **Créer un nouveau fichier** nommé exactement `.env` (avec le point au début)
2. **Copier ce contenu** dans le fichier :

```env
# ElevenLabs API Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Instructions:
# 1. Remplacez 'your_elevenlabs_api_key_here' par votre vraie clé API ElevenLabs
# 2. Obtenez votre clé API sur: https://elevenlabs.io/app/settings/api-keys
# 3. La clé commence par 'sk_' et fait environ 50 caractères
# 
# Exemple de format :
# VITE_ELEVENLABS_API_KEY=sk_1234567890abcdef1234567890abcdef1234567890
```

3. **Remplacer** `your_elevenlabs_api_key_here` par votre vraie clé ElevenLabs
4. **Enregistrer le fichier**

### **⚠️ IMPORTANT : Format du fichier .env**
- **Nom exact :** `.env` (avec le point au début)
- **Pas d'extension** (.txt, .env.txt, etc.)
- **À la racine** du projet (même niveau que package.json)

## 🔑 **ÉTAPE 3 : Obtenir votre clé ElevenLabs**

### **Si vous n'avez pas encore de clé :**
1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **S'inscrire gratuitement**
3. **Se connecter** → **Settings** → **API Keys**
4. **Generate API Key** → **Copier la clé**
5. **Coller dans le fichier .env**

### **Format de la clé :**
```env
VITE_ELEVENLABS_API_KEY=sk_1234567890abcdef1234567890abcdef1234567890
```

## 💻 **ÉTAPE 4 : Installer Node.js (si pas déjà fait)**

### **Vérifier si Node.js est installé :**
```bash
node --version
npm --version
```

### **Si pas installé :**
1. **Télécharger Node.js** sur [nodejs.org](https://nodejs.org)
2. **Installer la version LTS** (recommandée)
3. **Redémarrer** votre terminal/invite de commande

## 🚀 **ÉTAPE 5 : Lancer l'application en local**

### **Dans le terminal/invite de commande :**
```bash
# Naviguer vers le dossier du projet
cd chemin/vers/instant-opportun

# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

### **L'application sera accessible à :**
```
http://localhost:5173
```

## ✅ **ÉTAPE 6 : Tester l'application**

### **Tests à effectuer :**
1. **Ouvrir** http://localhost:5173 dans votre navigateur
2. **Vérifier** que l'application se charge
3. **Menu (☰)** → **Paramètres** → **Vérifier le statut ElevenLabs**
4. **Lancer une session SOS Stress** (1min 30s)
5. **Écouter le guidage vocal** (si ElevenLabs configuré)
6. **Tester les sons binauraux** avec des écouteurs

## 🔧 **DÉPANNAGE**

### **Si erreur "Module not found" :**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Si le port 5173 est occupé :**
L'application utilisera automatiquement un autre port (5174, 5175, etc.)

### **Si ElevenLabs ne fonctionne pas :**
- Vérifier que la clé commence par `sk_`
- Pas d'espaces avant/après la clé
- Redémarrer l'application après modification du .env

### **Si pas de son :**
- Autoriser l'audio dans le navigateur
- Utiliser des écouteurs pour les sons binauraux
- Vérifier les volumes dans les paramètres

## 📁 **STRUCTURE ATTENDUE**

```
instant-opportun/
├── .env                    ← Votre fichier avec la clé API
├── package.json
├── index.html
├── src/
├── public/
└── ...
```

## 🎯 **APRÈS LES TESTS LOCAUX**

Une fois que tout fonctionne en local :

1. **NE PAS** commiter le fichier .env sur GitHub
2. **Configurer la clé** dans Netlify (variables d'environnement)
3. **Déployer** sur Netlify

## 🚨 **SÉCURITÉ**

- **JAMAIS** partager votre clé API
- **JAMAIS** commiter le .env sur GitHub
- **Utiliser** les variables d'environnement pour la production

---

## 🎉 **RÉSULTAT ATTENDU**

Avec cette configuration locale, vous pourrez :

✅ **Tester toutes les fonctionnalités** avant déploiement  
✅ **Vérifier le guidage vocal** ElevenLabs  
✅ **Valider les timings** SOS Stress  
✅ **Tester l'interface** complète  

**Une fois validé en local, le déploiement Netlify sera garanti !**