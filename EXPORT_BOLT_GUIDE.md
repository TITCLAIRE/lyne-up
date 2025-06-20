# 📥 EXPORTER DEPUIS BOLT - MÉTHODE RECOMMANDÉE

## 🎯 **POURQUOI EXPORTER DEPUIS BOLT ?**

✅ **Version la plus récente** avec toutes les corrections  
✅ **Fichiers optimisés** et prêts à fonctionner  
✅ **Pas de décalage** avec GitHub  
✅ **Configuration parfaite** pour l'API ElevenLabs  

---

## 📋 **ÉTAPE 1 : Exporter depuis Bolt**

### **Chercher le bouton d'export dans Bolt :**

1. **Regarder en haut de l'interface Bolt**
2. **Chercher un bouton** comme :
   - 📥 **"Download"**
   - 📦 **"Export"** 
   - ⬇️ **"Download ZIP"**
   - 💾 **"Save project"**

3. **Cliquer dessus**
4. **Un fichier ZIP se télécharge**

### **Si vous ne trouvez pas le bouton :**

**Dites-moi** et je vous aide à le localiser selon votre interface Bolt.

---

## 📋 **ÉTAPE 2 : Extraire et préparer**

1. **Aller dans votre dossier "Téléchargements"**
2. **Double-cliquer sur le fichier ZIP** téléchargé depuis Bolt
3. **Un dossier s'extrait** (probablement nommé comme votre projet)
4. **Ouvrir ce dossier**

---

## 📋 **ÉTAPE 3 : Ouvrir le Terminal**

1. **Cmd + Espace** (recherche Spotlight)
2. **Taper "Terminal"**
3. **Appuyer sur Entrée**

---

## 📋 **ÉTAPE 4 : Aller dans le dossier**

Dans le Terminal, tapez :
```bash
cd ~/Downloads/nom-du-dossier-extrait
```

**Remplacez** `nom-du-dossier-extrait` par le vrai nom du dossier.

**Vérifiez** avec :
```bash
ls
```

**Vous devez voir :** package.json, src, index.html, etc.

---

## 📋 **ÉTAPE 5 : Créer le fichier .env**

```bash
touch .env
open .env
```

**Dans TextEdit**, copiez exactement ceci :
```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Enregistrez** (Cmd + S) et **fermez** TextEdit

---

## 📋 **ÉTAPE 6 : Installer et lancer**

```bash
npm install
```

Attendez 1-2 minutes, puis :

```bash
npm run dev
```

---

## 📋 **ÉTAPE 7 : Tester l'app**

**Dans votre navigateur** :
```
http://localhost:5173
```

**L'app s'ouvre** avec toutes mes dernières corrections !

---

## 🔑 **ÉTAPE 8 : Ajouter votre clé ElevenLabs**

1. **Obtenir la clé** sur [elevenlabs.io](https://elevenlabs.io) (gratuit)
2. **Remplacer** `your_elevenlabs_api_key_here` dans le fichier .env
3. **Redémarrer** l'app (Ctrl+C puis `npm run dev`)
4. **Tester le guidage vocal premium !**

---

## 🎯 **AVANTAGES DE CETTE MÉTHODE**

✅ **Version Bolt = version parfaite**  
✅ **Toutes les corrections** incluses  
✅ **Prêt pour l'API ElevenLabs**  
✅ **Test immédiat** sur votre Mac  
✅ **Pas de problème de build**  

---

## 🆘 **AIDE**

**Dites-moi :**
1. **Si vous trouvez le bouton d'export** dans Bolt
2. **Le nom du dossier** une fois extrait
3. **Si vous avez des erreurs** à une étape

---

**🎯 COMMENCEZ PAR CHERCHER LE BOUTON D'EXPORT DANS BOLT !**

C'est la méthode la plus fiable pour avoir la version parfaite.