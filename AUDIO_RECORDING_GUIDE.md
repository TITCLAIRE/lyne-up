# 🎤 GUIDE ENREGISTREMENT SOS STRESS - ELEVENLABS

## 🎯 **OBJECTIF**
Enregistrer tous les audios SOS Stress avec ElevenLabs pour les intégrer directement dans l'application.

## 📝 **LISTE DES AUDIOS À ENREGISTRER**

### **1. Message d'accueil (0s)**
**Fichier :** `welcome.mp3`
**Texte :** 
```
Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.
```

### **2. Guidages respiratoires**

#### **Fichier :** `breathe-calm.mp3` (10s)
```
Inspirez le calme
```

#### **Fichier :** `breathe-softly.mp3` (35s)
```
Soufflez doucement
```

#### **Fichier :** `breathe-fresh.mp3` (50s)
```
Accueillez l'air frais
```

#### **Fichier :** `breathe-release.mp3` (65s)
```
Relâchez tout
```

### **3. Messages de phases**

#### **Fichier :** `grounding.mp3` (30s)
```
Vos pieds touchent le sol. Vous êtes ancré, solide, stable.
```

#### **Fichier :** `stress-release.mp3` (55s)
```
Le stress s'évapore à chaque souffle. Votre corps se détend profondément.
```

#### **Fichier :** `center-peace.mp3` (80s)
```
Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.
```

### **4. Message de fin (90s)**
**Fichier :** `completion.mp3`
**Texte :**
```
Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.
```

## 🎤 **PARAMÈTRES ELEVENLABS RECOMMANDÉS**

### **Voix recommandée :**
- **Sarah (Féminine)** : `EXAVITQu4vr4xnSDxMaL`
- **Josh (Masculine)** : `VR6AewLTigWG4xSOukaG`

### **Paramètres optimaux :**
```json
{
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.85,
    "similarity_boost": 0.8,
    "style": 0.15,
    "use_speaker_boost": true
  }
}
```

## 📋 **ÉTAPES D'ENREGISTREMENT**

### **1. Aller sur ElevenLabs**
- [elevenlabs.io](https://elevenlabs.io) → Speech Synthesis
- Sélectionner la voix **Sarah** ou **Josh**

### **2. Pour chaque texte :**
1. **Coller le texte** dans l'interface
2. **Ajuster les paramètres** (stabilité 0.85, style 0.15)
3. **Générer l'audio**
4. **Télécharger le MP3**
5. **Renommer** selon le nom de fichier indiqué

### **3. Organisation des fichiers :**
```
public/audio/sos-stress/
├── welcome.mp3           # 0s - Message d'accueil
├── breathe-calm.mp3      # 10s - "Inspirez le calme"
├── grounding.mp3         # 30s - "Vos pieds touchent le sol..."
├── breathe-softly.mp3    # 35s - "Soufflez doucement"
├── breathe-fresh.mp3     # 50s - "Accueillez l'air frais"
├── stress-release.mp3    # 55s - "Le stress s'évapore..."
├── breathe-release.mp3   # 65s - "Relâchez tout"
├── center-peace.mp3      # 80s - "Vous retrouvez votre centre..."
└── completion.mp3        # 90s - "Parfait. Vous avez retrouvé..."
```

## 💰 **COÛT ESTIMÉ**

### **Calcul des caractères :**
- **Total :** ~400 caractères pour tous les audios
- **Plan gratuit :** 10 000 caractères/mois
- **Coût :** Gratuit (4% du quota)

## 🎯 **AVANTAGES**

✅ **Coût unique** - Enregistrement une seule fois  
✅ **Pas de quota** - Utilisation illimitée  
✅ **Pas de latence** - Lecture instantanée  
✅ **Fonctionne hors-ligne** - Mode PWA complet  
✅ **Qualité constante** - Toujours la même voix  
✅ **Pas de dépendance API** - Aucun risque de panne  

## 🔄 **PROCHAINES ÉTAPES**

1. **Enregistrer** tous les audios avec ElevenLabs
2. **Les placer** dans `public/audio/sos-stress/`
3. **Modifier le code** pour utiliser les fichiers locaux
4. **Supprimer** la logique API ElevenLabs pour SOS Stress
5. **Tester** la synchronisation parfaite

---

**🎤 Voulez-vous que je vous aide à enregistrer ces audios ou préférez-vous que je modifie directement le code pour utiliser des fichiers locaux ?**