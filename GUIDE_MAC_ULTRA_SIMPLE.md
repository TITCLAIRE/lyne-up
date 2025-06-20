# 🍎 GUIDE ULTRA-SIMPLE POUR MAC

## 🎯 **OBJECTIF : Tester votre app en local sur votre Mac**

### **ÉTAPE 1 : Télécharger votre projet depuis GitHub**

1. **Aller sur votre page GitHub** (le lien de votre projet)
2. **Chercher le bouton vert "Code"** (en haut à droite)
3. **Cliquer sur "Download ZIP"**
4. **Le fichier se télécharge** dans votre dossier "Téléchargements"
5. **Double-cliquer sur le fichier ZIP** pour l'extraire
6. **Vous avez maintenant un dossier** `instant-opportun-main`

### **ÉTAPE 2 : Ouvrir le Terminal (très simple)**

1. **Appuyer sur Cmd + Espace** (la touche Cmd + barre d'espace)
2. **Taper "Terminal"** dans la recherche
3. **Appuyer sur Entrée**
4. **Une fenêtre noire s'ouvre** = c'est le Terminal !

### **ÉTAPE 3 : Aller dans votre dossier projet**

Dans le Terminal, tapez exactement ceci (puis Entrée) :
```
cd ~/Downloads/instant-opportun-main
```

**Si ça ne marche pas**, essayez :
```
cd ~/Téléchargements/instant-opportun-main
```

### **ÉTAPE 4 : Vérifier qu'on est au bon endroit**

Tapez ceci (puis Entrée) :
```
ls
```

**Vous devez voir** des noms comme :
- package.json
- index.html
- src
- README.md

✅ **Si vous voyez ça = PARFAIT !**
❌ **Si vous ne voyez pas ça = me le dire**

### **ÉTAPE 5 : Créer le fichier .env**

Tapez exactement ceci (puis Entrée) :
```
touch .env
```

Puis tapez ceci (puis Entrée) :
```
open .env
```

**Un fichier vide s'ouvre dans TextEdit**

### **ÉTAPE 6 : Remplir le fichier .env**

Dans TextEdit, copiez-collez exactement ceci :
```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Remplacez** `your_elevenlabs_api_key_here` par votre vraie clé ElevenLabs

**Enregistrez** le fichier (Cmd + S)

**Fermez** TextEdit

### **ÉTAPE 7 : Installer et lancer**

Dans le Terminal, tapez ceci (puis Entrée) :
```
npm install
```

**Attendez** que ça se termine (1-2 minutes)

Puis tapez ceci (puis Entrée) :
```
npm run dev
```

### **ÉTAPE 8 : Ouvrir dans le navigateur**

**Ouvrez Safari ou Chrome**

**Tapez cette adresse** :
```
http://localhost:5173
```

**Appuyez sur Entrée**

🎉 **VOTRE APP DOIT S'OUVRIR !**

---

## 🆘 **SI ÇA NE MARCHE PAS**

**Dites-moi exactement** :
1. À quelle étape ça bloque
2. Quel message d'erreur vous voyez
3. Une capture d'écran si possible

**Je vous aiderai** étape par étape !

---

## 🔑 **POUR OBTENIR VOTRE CLÉ ELEVENLABS**

1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **Créer un compte gratuit**
3. **Aller dans Settings → API Keys**
4. **Cliquer "Generate API Key"**
5. **Copier la clé** (commence par `sk_`)
6. **La mettre dans le fichier .env**

---

**🎯 Commencez par l'ÉTAPE 1 et dites-moi quand c'est fait !**