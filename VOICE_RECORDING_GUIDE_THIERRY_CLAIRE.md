# 🎤 GUIDE ENREGISTREMENT SOS STRESS - VOIX PREMIUM THIERRY ET CLAIRE

## 🎯 **VOIX PREMIUM INTÉGRÉES**

L'application utilise maintenant vos voix premium **Thierry** (masculine) et **Claire** (féminine) pour la session SOS Stress avec un système mixte optimisé.

## 📁 **STRUCTURE DES FICHIERS**

```
public/audio/sos-stress/
├── female/                    # Voix Claire (Premium)
│   ├── welcome.mp3            # Session 1
│   ├── breathe-calm.mp3       # Session 2
│   ├── grounding.mp3          # Session 3
│   ├── breathe-softly.mp3     # Session 4
│   └── completion.mp3         # Session 9 (avancée)
└── male/                      # Voix Thierry (Premium)
    ├── welcome.mp3            # Session 1
    ├── breathe-calm.mp3       # Session 2
    ├── grounding.mp3          # Session 3
    ├── breathe-softly.mp3     # Session 4
    └── completion.mp3         # Session 9 (avancée)
```

## 🎤 **FICHIERS À ENREGISTRER - CLAIRE (FÉMININE)**

### **1. welcome.mp3** (0.5s) - Session 1
```
Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.
```

### **2. breathe-calm.mp3** (12s) - Session 2
```
Inspirez le calme
```

### **3. grounding.mp3** (28s) - Session 3
```
Vos pieds touchent le sol. Vous êtes ancré, solide, stable.
```

### **4. breathe-softly.mp3** (37s) - Session 4
```
Soufflez doucement
```

### **5. completion.mp3** (84s) - Session 9 (AVANCÉE D'1 SECONDE)
```
Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.
```

## 🎤 **FICHIERS À ENREGISTRER - THIERRY (MASCULINE)**

**Mêmes 5 fichiers que Claire**, mais enregistrés avec la voix masculine de Thierry.

## 🗣️ **SESSIONS EN SYNTHÈSE VOCALE (5-8)**

Ces sessions utilisent la synthèse vocale système et **ne nécessitent PAS d'enregistrement** :

- **Session 5** (48s) : "Accueillez l'air frais"
- **Session 6** (58s) : "Le stress s'évapore à chaque souffle. Votre corps se détend profondément."
- **Session 7** (67s) : "Relâchez tout"
- **Session 8** (78s) : "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité."

## ⏰ **TIMINGS CORRIGÉS**

### **Fichiers premium (Claire/Thierry) :**
- **0.5s** : welcome.mp3 (message d'accueil)
- **12s** : breathe-calm.mp3 (sur inspiration)
- **28s** : grounding.mp3 (ancrage)
- **37s** : breathe-softly.mp3 (sur expiration)
- **84s** : completion.mp3 (message de fin - **AVANCÉ D'1 SECONDE**)

### **Synthèse vocale système :**
- **48s** : "Accueillez l'air frais" (sur inspiration)
- **58s** : "Le stress s'évapore..." (libération)
- **67s** : "Relâchez tout" (sur expiration)
- **78s** : "Vous retrouvez votre centre..." (recentrage)

## 🎯 **PARAMÈTRES D'ENREGISTREMENT RECOMMANDÉS**

### **Qualité audio :**
- **Format :** MP3
- **Qualité :** 128 kbps minimum (192 kbps recommandé)
- **Fréquence :** 44.1 kHz
- **Mono ou Stéréo :** Mono suffisant

### **Style vocal :**
- **Débit :** Lent et apaisant
- **Ton :** Doux et rassurant
- **Pauses :** Naturelles entre les phrases
- **Volume :** Constant et bien audible

### **Ambiance :**
- **Environnement :** Calme, sans bruit de fond
- **Émotion :** Bienveillante et sécurisante
- **Rythme :** Synchronisé avec la respiration

## 🔄 **SYSTÈME MIXTE OPTIMISÉ**

### **Avantages du système mixte :**
- ✅ **Sessions clés** (1-4, 9) avec vos voix premium uniques
- ✅ **Sessions intermédiaires** (5-8) en synthèse pour flexibilité
- ✅ **Moins d'enregistrements** requis (5 au lieu de 9)
- ✅ **Fallback intelligent** si fichier manquant
- ✅ **Session 9 avancée** pour finir avant la fin de session

### **Pourquoi ce choix :**
- **Sessions 1-4** : Messages d'accueil et guidages respiratoires principaux
- **Sessions 5-8** : Guidages intermédiaires en synthèse vocale
- **Session 9** : Message de fin important avec votre voix premium

## ✅ **AVANTAGES DES VOIX PREMIUM**

### **Thierry & Claire :**
- ✅ **Latence zéro** - Lecture instantanée
- ✅ **Qualité constante** - Même voix à chaque session
- ✅ **Pas de quota** - Utilisation illimitée
- ✅ **Fonctionne hors-ligne** - Mode PWA complet
- ✅ **Personnalisation** - Vos voix uniques pour les moments clés

### **Expérience utilisateur :**
- ✅ **Cohérence** - Votre voix pour l'accueil et la fin
- ✅ **Fiabilité** - Pas de dépendance réseau pour les moments clés
- ✅ **Performance** - Chargement instantané
- ✅ **Professionnalisme** - Qualité studio pour l'identité de marque

## 🎯 **UTILISATION DANS L'APPLICATION**

### **Sélection de voix :**
1. **Menu (☰)** → **Paramètres**
2. **Section "Voix Premium"**
3. **Choisir** entre **Claire** (féminine) et **Thierry** (masculine)
4. **L'application** utilisera automatiquement les bons fichiers

### **Test des voix :**
1. **Lancer une session SOS Stress**
2. **Écouter** le guidage vocal mixte
3. **Vérifier** la synchronisation avec la respiration

## 📊 **MONITORING**

L'application affiche dans la console :
- `🎵 Lecture audio premium: /audio/sos-stress/female/welcome.mp3 (Claire)`
- `🗣️ Synthèse directe: "Accueillez l'air frais"`
- `✅ Audio premium terminé: welcome.mp3`
- `🔄 Fallback synthèse pour: welcome` (si fichier manquant)

## 🚀 **DÉPLOIEMENT**

Une fois vos 5 fichiers enregistrés par voix :
1. **Placer** les 10 fichiers MP3 dans les bons dossiers
2. **Tester** en local
3. **Déployer** sur votre plateforme
4. **Votre app** aura des voix premium pour les moments clés !

## 🎵 **RÉCAPITULATIF**

### **À enregistrer (10 fichiers total) :**
- **Claire** : 5 fichiers MP3 (welcome, breathe-calm, grounding, breathe-softly, completion)
- **Thierry** : 5 fichiers MP3 (mêmes noms, voix masculine)

### **Automatique (synthèse vocale) :**
- **Sessions 5-8** : Gérées automatiquement par l'application

### **Timing spécial :**
- **Session 9** : Avancée à 84s (au lieu de 85s) pour finir avant la fin de session

---

**🎵 Vos voix Thierry et Claire donneront une identité unique aux moments clés de votre application !**