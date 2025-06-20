# 🔧 SOLUTION ERREUR RÉSEAU MAC - npm E503

## ❌ **PROBLÈME IDENTIFIÉ**

L'erreur `npm ERR! code E503` indique un problème de **réseau/registre npm**. Le serveur npm est temporairement indisponible.

---

## ✅ **SOLUTION IMMÉDIATE**

### **ÉTAPE 1 : Changer de registre npm**

Dans votre Terminal, tapez exactement ceci :
```bash
npm config set registry https://registry.npmjs.org/
```

### **ÉTAPE 2 : Nettoyer le cache**

```bash
npm cache clean --force
```

### **ÉTAPE 3 : Vérifier la connexion**

```bash
npm ping
```

**Si ça répond "Ping success" = c'est bon !**

### **ÉTAPE 4 : Réessayer l'installation**

```bash
npm install
```

---

## 🔄 **MÉTHODE ALTERNATIVE : Registre Yarn**

Si npm continue de poser problème :

### **Utiliser le registre Yarn :**
```bash
npm config set registry https://registry.yarnpkg.com/
npm install
```

---

## 🌐 **MÉTHODE ALTERNATIVE : Registre Chinois (très rapide)**

Si les registres officiels sont lents :

```bash
npm config set registry https://registry.npmmirror.com/
npm install
```

---

## 🎯 **SOLUTION GARANTIE : Installation manuelle**

Si rien ne marche, on va installer les dépendances une par une :

```bash
npm install react react-dom --save
npm install vite @vitejs/plugin-react --save-dev
npm install tailwindcss postcss autoprefixer --save-dev
npm install lucide-react zustand --save
npm install typescript @types/react @types/react-dom --save-dev
```

---

## 📋 **ORDRE D'ESSAI**

1. **Essayez d'abord :** Changer le registre + nettoyer cache
2. **Si ça ne marche pas :** Registre Yarn
3. **Si ça ne marche toujours pas :** Registre miroir
4. **En dernier recours :** Installation manuelle

---

## 🆘 **DIAGNOSTIC RÉSEAU**

Pour vérifier votre connexion :

```bash
curl -I https://registry.npmjs.org/
```

**Si ça répond avec "200 OK" = connexion OK**

---

**🎯 COMMENCEZ PAR CHANGER LE REGISTRE ET DITES-MOI LE RÉSULTAT !**

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install
```