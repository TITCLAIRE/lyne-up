# 🍎 GUIDE CONSOLE MAC - DIAGNOSTIC VOCAL

## 🔍 **OUVRIR LA CONSOLE SUR MAC**

### **Méthode 1 : Raccourci clavier**
- **Appuyer sur** : `Cmd + Option + I`
- **Ou** : `Cmd + Shift + C`

### **Méthode 2 : Menu Safari**
1. **Safari** → **Développement** → **Afficher la console web**
2. **Si "Développement" n'apparaît pas** :
   - **Safari** → **Préférences** → **Avancées**
   - **Cocher** "Afficher le menu Développement"

### **Méthode 3 : Menu Chrome**
1. **Chrome** → **Affichage** → **Options pour les développeurs** → **Console JavaScript**
2. **Ou clic droit** → **Inspecter l'élément** → **Onglet Console**

## 🎯 **TEST IMMÉDIAT**

### **1. Ouvrir votre app dans le navigateur**
```
http://localhost:5173
```

### **2. Ouvrir la console (Cmd + Option + I)**

### **3. Lancer une session SOS Stress**
1. **Cliquer sur "SOS Stress"**
2. **Cliquer sur "Commencer"**
3. **Regarder la console** - vous devriez voir :

```
🚨 DÉMARRAGE SOS STRESS - DIAGNOSTIC COMPLET (Claire)
🔍 TEST DES FICHIERS AUDIO SOS STRESS...
✅ /audio/sos-stress/female/welcome.mp3 (200)
✅ /audio/sos-stress/female/breathe-calm.mp3 (200)
❌ /audio/sos-stress/female/grounding.mp3 (404)
```

## 📊 **INTERPRÉTATION DES LOGS**

### **✅ Fichier trouvé :**
```
✅ /audio/sos-stress/female/welcome.mp3 (200)
🎵 TENTATIVE LECTURE AUDIO: /audio/sos-stress/female/welcome.mp3
🔊 LECTURE DÉMARRÉE: /audio/sos-stress/female/welcome.mp3
✅ AUDIO TERMINÉ: /audio/sos-stress/female/welcome.mp3
```

### **❌ Fichier manquant :**
```
❌ /audio/sos-stress/female/grounding.mp3 (404)
🔄 FALLBACK SYNTHÈSE pour: grounding - Raison: Fichier non trouvé
🗣️ SYNTHÈSE VOCALE: "Vos pieds touchent le sol..."
✅ FALLBACK RÉUSSI: grounding
```

## 🎯 **CE QUE VOUS DEVEZ VOIR**

### **Si vos fichiers sont bien placés :**
- ✅ **9 fichiers trouvés** pour Claire ou Thierry
- 🎵 **Lecture audio premium** pour chaque séquence
- ✅ **Aucun fallback** nécessaire

### **Si des fichiers manquent :**
- ❌ **Erreur 404** pour les fichiers manquants
- 🔄 **Fallback automatique** vers synthèse vocale
- 🗣️ **Synthèse vocale** pour les séquences manquantes

## 🔧 **DIAGNOSTIC COMPLET**

La console vous dira exactement :
1. **Quels fichiers** sont trouvés/manquants
2. **Pourquoi** certaines séquences passent en synthèse
3. **Quel chemin** est utilisé pour chaque fichier
4. **Si** la lecture réussit ou échoue

---

**🎯 LANCEZ UNE SESSION SOS STRESS ET DITES-MOI CE QUE VOUS VOYEZ DANS LA CONSOLE !**

Les logs vont nous dire exactement pourquoi les séquences 5-8 ne fonctionnent pas en premium.