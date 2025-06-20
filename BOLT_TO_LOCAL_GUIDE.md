# 🔄 COMMENT PASSER DE BOLT À LOCAL

## 🎯 **VOTRE SITUATION : Projet sur Bolt**

Vous avez le projet sur Bolt et voulez le tester en local. Voici les **3 méthodes** :

## 📋 **MÉTHODE 1 : Export depuis Bolt (RECOMMANDÉE)**

### **Étape 1 : Exporter le projet**
1. **Dans Bolt** → Cliquer sur **"Download"** ou **"Export"** (bouton en haut)
2. **Télécharger le fichier ZIP** sur votre ordinateur
3. **Extraire le ZIP** dans un dossier de votre choix

### **Étape 2 : Ajouter le fichier .env**
1. **Ouvrir le dossier** extrait
2. **Créer un fichier** nommé `.env` (avec le point)
3. **Copier ce contenu** :

```env
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

4. **Remplacer** `your_elevenlabs_api_key_here` par votre vraie clé ElevenLabs

### **Étape 3 : Lancer en local**
```bash
cd dossier-du-projet
npm install
npm run dev
```

## 📋 **MÉTHODE 2 : Copier-coller manuel**

### **Si pas de bouton Export dans Bolt :**

1. **Créer un nouveau dossier** sur votre ordinateur
2. **Copier chaque fichier** depuis Bolt vers votre dossier local
3. **Respecter la structure** :

```
instant-opportun/
├── package.json          ← Copier depuis Bolt
├── index.html           ← Copier depuis Bolt
├── vite.config.ts       ← Copier depuis Bolt
├── .env                 ← CRÉER avec votre clé API
├── src/
│   ├── App.tsx          ← Copier depuis Bolt
│   ├── main.tsx         ← Copier depuis Bolt
│   └── ...              ← Tous les autres fichiers
└── public/
    └── ...
```

## 📋 **MÉTHODE 3 : Push vers GitHub puis clone**

### **Étape 1 : Pousser depuis Bolt vers GitHub**
1. **Dans Bolt** → Utiliser l'intégration GitHub
2. **Créer/mettre à jour** votre repository
3. **Pousser tous les fichiers**

### **Étape 2 : Cloner en local**
```bash
git clone https://github.com/votre-username/instant-opportun.git
cd instant-opportun
```

### **Étape 3 : Ajouter le .env**
```env
VITE_ELEVENLABS_API_KEY=sk_votre_vraie_cle_api_ici
```

## 🔑 **OBTENIR VOTRE CLÉ ELEVENLABS**

### **Inscription gratuite :**
1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **Sign Up** → Créer un compte gratuit
3. **Se connecter** → **Settings** → **API Keys**
4. **Generate API Key** → **Copier la clé**

### **Format de la clé :**
```
sk_1234567890abcdef1234567890abcdef1234567890
```

## 🚀 **LANCEMENT EN LOCAL**

### **Une fois le projet sur votre ordinateur :**

```bash
# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

### **Accéder à l'application :**
```
http://localhost:5173
```

## ✅ **TESTS À EFFECTUER**

1. **Chargement** de l'application
2. **Menu (☰)** → **Paramètres** → **Vérifier statut ElevenLabs**
3. **Session SOS Stress** (1min 30s) avec timings corrigés
4. **Guidage vocal** premium (si clé configurée)
5. **Sons binauraux** avec écouteurs

## 🎯 **AVANTAGES DU TEST LOCAL**

✅ **Validation complète** avant déploiement  
✅ **Test du guidage vocal** ElevenLabs  
✅ **Vérification des timings** SOS Stress  
✅ **Debug facile** si problème  
✅ **Confiance totale** pour le déploiement Netlify  

## 🔄 **APRÈS LES TESTS LOCAUX**

Une fois que tout fonctionne parfaitement en local :

1. **Configurer ElevenLabs** dans Netlify (variables d'environnement)
2. **Déployer** sur Netlify avec confiance
3. **L'application fonctionnera** parfaitement en ligne

---

## 🚨 **IMPORTANT**

- **NE JAMAIS** commiter le fichier `.env` sur GitHub
- **Utiliser** les variables d'environnement Netlify pour la production
- **Tester avec des écouteurs** pour les sons binauraux

**🎉 Avec cette méthode, vous pourrez valider l'application avant le déploiement !**