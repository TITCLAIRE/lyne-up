# 🔧 CONFIGURATION ELEVENLABS SUR VERCEL

## ❌ **PROBLÈME IDENTIFIÉ**

Les voix premium ElevenLabs ne fonctionnent pas sur Vercel car **la clé API n'est pas configurée** dans les variables d'environnement.

---

## ✅ **SOLUTION IMMÉDIATE**

### **Étape 1 : Obtenir votre clé API ElevenLabs**

1. **Aller sur** [elevenlabs.io](https://elevenlabs.io)
2. **S'inscrire gratuitement** (si pas encore fait)
3. **Se connecter** → **Settings** → **API Keys**
4. **Generate API Key** → **Copier la clé**

⚠️ **Format de la clé :** `sk_1234567890abcdef...` (commence toujours par `sk_`)

### **Étape 2 : Configurer dans Vercel**

1. **Aller sur** [vercel.com](https://vercel.com)
2. **Sélectionner votre projet** `instant-opportun`
3. **Settings** → **Environment Variables**
4. **Add New** :
   - **Name :** `VITE_ELEVENLABS_API_KEY`
   - **Value :** `sk_votre_vraie_cle_api_ici`
   - **Environments :** Cocher **Production**, **Preview**, **Development**
5. **Save**

### **Étape 3 : Redéployer**

1. **Deployments** → **Redeploy** (bouton avec 3 points)
2. **Ou faire un nouveau commit** :
   ```bash
   git commit --allow-empty -m "🔧 Add ElevenLabs API key"
   git push origin main
   ```

---

## 🎯 **VÉRIFICATION**

### **Après redéploiement :**
1. **Ouvrir votre app** : `https://votre-site.vercel.app`
2. **Menu (☰)** → **Paramètres**
3. **Section "Guidage vocal"**
4. **Vérifier le statut :**
   - ✅ **Connecté** = Configuration réussie
   - ❌ **Non disponible** = Clé manquante/invalide

### **Test vocal :**
1. **Activer "ElevenLabs (Premium)"**
2. **Lancer une session SOS Stress** (1min 30s)
3. **Écouter le guidage vocal premium !**

---

## 🎤 **VOIX PREMIUM DISPONIBLES**

### **Sarah (Féminine)**
- **ID :** `EXAVITQu4vr4xnSDxMaL`
- **Caractère :** Douce et apaisante
- **Parfaite pour :** Relaxation, méditation

### **Josh (Masculine)**
- **ID :** `VR6AewLTigWG4xSOukaG`
- **Caractère :** Calme et rassurante
- **Parfaite pour :** Guidage, concentration

---

## 💰 **PLAN GRATUIT ELEVENLABS**

- **10 000 caractères/mois** gratuits
- **Largement suffisant** pour l'usage normal
- **Toutes les voix premium** disponibles
- **Qualité identique** au plan payant

---

## 🚨 **DÉPANNAGE**

### **Si le statut reste "Non disponible" :**
1. **Vérifier la clé** dans Vercel (pas d'espaces)
2. **Redéployer** le site
3. **Attendre 2-3 minutes** pour la propagation
4. **Rafraîchir** la page de l'app

### **Si erreur "Quota dépassé" :**
- Plan gratuit épuisé pour le mois
- Attendre le renouvellement mensuel
- Ou upgrader vers un plan payant

---

## 🎯 **RÉSULTAT ATTENDU**

Avec cette configuration, votre application aura :

✅ **Guidage vocal premium** avec voix naturelles  
✅ **Synchronisation parfaite** avec la respiration  
✅ **Expérience immersive** optimale  
✅ **Fallback intelligent** vers voix système si problème  

---

## 📱 **INTERFACE DIAGNOSTIC**

L'application affiche maintenant un **diagnostic complet** dans les paramètres :

- 🔄 **Vérification en cours**
- ✅ **ElevenLabs connecté** (avec détails)
- ❌ **Non disponible** (avec solution)

---

**🎉 Votre app de cohérence cardiaque aura maintenant des voix premium !**