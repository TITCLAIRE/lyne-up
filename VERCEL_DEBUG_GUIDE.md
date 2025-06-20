# 🔧 DEBUG ELEVENLABS SUR VERCEL

## 🎯 **PROBLÈME PERSISTANT**

Même avec la clé API configurée, ElevenLabs ne fonctionne pas sur Vercel. Voici le diagnostic complet.

---

## 🔍 **DIAGNOSTIC ÉTAPE PAR ÉTAPE**

### **1. Vérifier la clé API dans Vercel**

1. **Aller sur** [vercel.com](https://vercel.com)
2. **Votre projet** → **Settings** → **Environment Variables**
3. **Vérifier** que `VITE_ELEVENLABS_API_KEY` existe
4. **Format correct** : `sk_1234567890abcdef...` (50+ caractères)

### **2. Vérifier le déploiement**

1. **Deployments** → **Dernière build**
2. **Function Logs** → Chercher les erreurs ElevenLabs
3. **Build Logs** → Vérifier que les variables sont bien injectées

### **3. Test en direct**

1. **Ouvrir votre app** : `https://votre-site.vercel.app`
2. **F12** → **Console** → Chercher les logs ElevenLabs
3. **Menu (☰)** → **Paramètres** → **Vérifier le diagnostic**

---

## 🚨 **CAUSES POSSIBLES**

### **Cause 1 : Variable mal configurée**
- Nom incorrect : doit être exactement `VITE_ELEVENLABS_API_KEY`
- Valeur incorrecte : doit commencer par `sk_`
- Environnements : doit être coché pour Production

### **Cause 2 : Cache Vercel**
- Vercel peut mettre en cache l'ancienne version
- Solution : Force redeploy

### **Cause 3 : Clé API invalide**
- Clé expirée ou révoquée
- Quota dépassé
- Compte ElevenLabs suspendu

### **Cause 4 : CORS/Réseau**
- Vercel bloque les requêtes vers ElevenLabs
- Problème de réseau temporaire

---

## ✅ **SOLUTIONS TESTÉES**

### **Solution 1 : Force Redeploy**
```bash
# Méthode 1 : Commit vide
git commit --allow-empty -m "🔧 Force redeploy for ElevenLabs"
git push origin main

# Méthode 2 : Via Vercel Dashboard
# Deployments → ... → Redeploy
```

### **Solution 2 : Nouvelle clé API**
1. **ElevenLabs** → **Settings** → **API Keys**
2. **Révoquer** l'ancienne clé
3. **Générer** une nouvelle clé
4. **Mettre à jour** dans Vercel
5. **Redéployer**

### **Solution 3 : Test local d'abord**
```bash
# Tester en local avec la même clé
export VITE_ELEVENLABS_API_KEY=sk_votre_cle
npm run dev
# Si ça marche en local, le problème est sur Vercel
```

---

## 🔧 **DIAGNOSTIC AVANCÉ**

### **Logs à vérifier dans la console :**

```javascript
// Ces logs doivent apparaître dans F12 → Console
🔑 Vérification clé ElevenLabs: { keyExists: true, keyStart: "sk_12345...", keyLength: 51 }
🔄 Test API ElevenLabs...
📡 Réponse test ElevenLabs: { status: 200, statusText: "OK" }
✅ ElevenLabs connecté: { subscription: "free", charactersUsed: 1234, charactersLimit: 10000 }
```

### **Si vous voyez :**
- `keyExists: false` → Variable pas configurée
- `keyStart: "your_elevenlabs..."` → Valeur par défaut
- `status: 401` → Clé invalide
- `status: 429` → Quota dépassé
- `status: 403` → Compte suspendu

---

## 🎯 **PLAN D'ACTION**

### **Étape 1 : Vérification immédiate**
1. **Console F12** → Chercher les logs ElevenLabs
2. **Noter** les erreurs exactes
3. **Me dire** ce que vous voyez

### **Étape 2 : Test de la clé**
1. **Tester votre clé** sur [elevenlabs.io](https://elevenlabs.io)
2. **Vérifier le quota** restant
3. **Générer une nouvelle clé** si nécessaire

### **Étape 3 : Reconfiguration**
1. **Supprimer** l'ancienne variable dans Vercel
2. **Ajouter** la nouvelle variable
3. **Force redeploy**

---

## 🆘 **AIDE IMMÉDIATE**

**Dites-moi exactement :**

1. **Ce que vous voyez** dans la console F12
2. **Le statut** dans Menu → Paramètres → Guidage vocal
3. **Si vous avez testé** la clé sur elevenlabs.io
4. **Capture d'écran** des variables Vercel (masquer la clé)

---

## 🔄 **ALTERNATIVE : NETLIFY**

Si Vercel continue de poser problème, on peut basculer sur Netlify qui gère mieux les variables d'environnement.

---

**🎯 Avec ces informations, je pourrai identifier le problème exact !**