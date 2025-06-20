# ⚡ SOLUTION RAPIDE : ELEVENLABS SUR VERCEL

## 🎯 **PROBLÈME**
Les voix premium ne fonctionnent pas car **la clé API ElevenLabs n'est pas configurée** dans Vercel.

## ✅ **SOLUTION EN 3 ÉTAPES**

### **1. Obtenir la clé API**
- Aller sur [elevenlabs.io](https://elevenlabs.io)
- S'inscrire gratuitement
- Settings → API Keys → Generate API Key
- Copier la clé (commence par `sk_`)

### **2. Configurer dans Vercel**
- [vercel.com](https://vercel.com) → Votre projet
- Settings → Environment Variables
- Add New : `VITE_ELEVENLABS_API_KEY` = votre clé
- Save

### **3. Redéployer**
- Deployments → Redeploy
- Attendre 2-3 minutes

## 🎉 **RÉSULTAT**
Voix premium Sarah & Josh disponibles avec guidage vocal synchronisé !

## 🔍 **VÉRIFICATION**
Menu (☰) → Paramètres → "✅ ElevenLabs connecté"