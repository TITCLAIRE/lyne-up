# 🎵 PLAN D'INTÉGRATION AUDIOS SOS STRESS

## 🎯 **STRATÉGIE HYBRIDE**

### **SOS Stress (1min 30s)**
- ✅ **Fichiers audio locaux** enregistrés avec ElevenLabs
- ✅ **Pas de dépendance API** en temps réel
- ✅ **Qualité constante** et **latence zéro**
- ✅ **Fallback automatique** vers voix système si fichier manquant

### **Autres sessions**
- 🔄 **API ElevenLabs** en temps réel (optionnel)
- 🔄 **Voix système** en fallback

## 📁 **STRUCTURE DES FICHIERS**

```
public/audio/sos-stress/
├── welcome.mp3           # 0s - "Bienvenue dans votre bulle de calme..."
├── breathe-calm.mp3      # 10s - "Inspirez le calme"
├── grounding.mp3         # 30s - "Vos pieds touchent le sol..."
├── breathe-softly.mp3    # 35s - "Soufflez doucement"
├── breathe-fresh.mp3     # 50s - "Accueillez l'air frais"
├── stress-release.mp3    # 55s - "Le stress s'évapore..."
├── breathe-release.mp3   # 65s - "Relâchez tout"
├── center-peace.mp3      # 80s - "Vous retrouvez votre centre..."
└── completion.mp3        # 90s - "Parfait. Vous avez retrouvé..."
```

## 🔧 **MODIFICATIONS APPORTÉES**

### **1. Nouveau hook `useVoiceManagerLocal`**
- ✅ Système hybride fichiers locaux + API
- ✅ Fallback automatique si fichier manquant
- ✅ Timings parfaits pour SOS Stress
- ✅ Compatible avec l'existant

### **2. Avantages immédiats**
- ✅ **Pas de quota** ElevenLabs pour SOS Stress
- ✅ **Latence zéro** - Lecture instantanée
- ✅ **Qualité constante** - Même voix à chaque fois
- ✅ **Fonctionne hors-ligne** - Mode PWA complet

### **3. Économies**
- ✅ **Coût unique** - ~400 caractères pour tous les audios SOS
- ✅ **Utilisation illimitée** - Pas de quota mensuel
- ✅ **Autres sessions** - Gardent l'API pour la flexibilité

## 📋 **ÉTAPES SUIVANTES**

### **Option A : Vous enregistrez les audios**
1. **Utiliser votre clé ElevenLabs** gratuite
2. **Enregistrer** les 9 audios selon le guide
3. **Les placer** dans `public/audio/sos-stress/`
4. **Tester** la nouvelle version

### **Option B : Je simule avec des fichiers temporaires**
1. **Créer des fichiers audio vides** pour tester
2. **Valider** la logique de fallback
3. **Vous enregistrez** les vrais audios plus tard

### **Option C : Version mixte**
1. **Commencer** avec quelques audios clés
2. **Tester** le système hybride
3. **Compléter** progressivement

## 🎯 **RECOMMANDATION**

**Commençons par l'Option B** pour valider le système, puis vous pourrez enregistrer les audios à votre rythme.

## 💡 **ÉVOLUTION FUTURE**

Une fois que SOS Stress fonctionne parfaitement avec les fichiers locaux, on peut :

1. **Étendre** aux autres sessions courtes (Focus 3min, Transition 3min)
2. **Garder l'API** pour les méditations longues (flexibilité)
3. **Créer un système** de cache intelligent

---

**🎤 Voulez-vous que je crée des fichiers audio temporaires pour tester le système, ou préférez-vous enregistrer directement avec ElevenLabs ?**