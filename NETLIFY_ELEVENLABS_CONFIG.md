# 🔧 CONFIGURATION ELEVENLABS SUR NETLIFY

## 🎯 **ÉTAPES PRÉCISES POUR NETLIFY**

### **1. Obtenir votre clé API ElevenLabs**

1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **S'inscrire gratuitement** (si pas encore fait)
3. **Se connecter** → **Settings** → **API Keys**
4. **Generate API Key** → **Copier la clé**

⚠️ **Format de la clé :** `sk_1234567890abcdef...` (commence toujours par `sk_`)

### **2. Configurer dans Netlify**

#### **Accéder aux variables d'environnement**
1. **Aller sur** [app.netlify.com](https://app.netlify.com)
2. **Sélectionner votre site** `instant-opportunapp`
3. **Site settings** (dans le menu)
4. **Environment variables** (dans la sidebar gauche)

#### **Ajouter la variable**
1. **Cliquer sur "Add variable"**
2. **Key :** `VITE_ELEVENLABS_API_KEY`
3. **Value :** `sk_votre_vraie_cle_api_ici`
4. **Cliquer "Save"**

### **3. Redéployer le site**

#### **Méthode A : Trigger deploy**
1. **Aller dans "Deploys"**
2. **"Trigger deploy"** → **"Deploy site"**

#### **Méthode B : Commit vide (si bouton introuvable)**
```bash
git commit --allow-empty -m "🔧 Add ElevenLabs API key"
git push origin main
```

## 📱 **LOCALISATION PRÉCISE DU MENU NETLIFY**

### **Interface Desktop**
```
[Votre Site] → Site settings → Environment variables
```

### **Interface Mobile**
```
☰ Menu → Site settings → Environment variables
```

### **Chemin complet**
```
app.netlify.com → [Votre Site] → Site settings → Build & deploy → Environment variables
```

## ✅ **VÉRIFICATION DE LA CONFIGURATION**

### **Après redéploiement**
1. **Ouvrir votre site** : `https://votre-site.netlify.app`
2. **Menu (☰)** → **Paramètres**
3. **Section "Guidage vocal"**
4. **Vérifier le statut :**
   - ✅ **Connecté** = Configuration réussie
   - ❌ **Non disponible** = Problème de clé

### **Test vocal**
1. **Activer "ElevenLabs (Premium)"**
2. **Lancer une session SOS Stress**
3. **Écouter le guidage vocal premium**

## 🎤 **AVANTAGES AVEC ELEVENLABS**

### **Voix premium disponibles**
- **Sarah** (féminine) : Voix douce et apaisante
- **Josh** (masculine) : Voix calme et rassurante

### **Qualité audio**
- **22kHz** de qualité
- **Intonations naturelles**
- **Synchronisation parfaite** avec la respiration
- **Optimisé pour la relaxation**

## 🔄 **FALLBACK AUTOMATIQUE**

Si ElevenLabs n'est pas disponible :
- **Utilisation automatique** des voix système
- **Pas d'interruption** de l'expérience
- **Message informatif** dans les paramètres

## 💰 **PLAN GRATUIT ELEVENLABS**

- **10 000 caractères/mois** gratuits
- **Largement suffisant** pour l'usage normal
- **Toutes les voix premium** disponibles
- **Qualité identique** au plan payant

## 🚨 **DÉPANNAGE RAPIDE**

### **Si le statut reste "Non disponible"**
1. **Vérifier la clé** dans Netlify (pas d'espaces)
2. **Redéployer** le site
3. **Attendre 2-3 minutes** pour la propagation
4. **Rafraîchir** la page de l'app

### **Si pas de son**
- **Autoriser l'audio** dans le navigateur
- **Utiliser HTTPS** (requis pour les APIs audio)
- **Vérifier le volume** dans les paramètres

## 📋 **CHECKLIST FINALE**

- [ ] Clé API ElevenLabs obtenue
- [ ] Variable `VITE_ELEVENLABS_API_KEY` ajoutée dans Netlify
- [ ] Site redéployé
- [ ] Statut "Connecté" vérifié
- [ ] Test vocal réussi

---

## 🎯 **RÉSULTAT ATTENDU**

Avec cette configuration, votre application aura :

✅ **Guidage vocal premium** avec voix naturelles  
✅ **Synchronisation parfaite** avec la respiration  
✅ **Expérience immersive** optimale  
✅ **Fallback intelligent** si problème  

**Votre app de cohérence cardiaque sera maintenant au niveau professionnel !**