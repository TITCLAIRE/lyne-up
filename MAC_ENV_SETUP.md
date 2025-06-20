# 🔧 CRÉER LE FICHIER .env SUR MAC

## 📋 **ÉTAPE SUIVANTE : Créer le fichier .env**

Dans votre Terminal, tapez exactement ceci (puis Entrée) :

```bash
touch .env
```

Puis tapez ceci (puis Entrée) :

```bash
open .env
```

**Un fichier vide s'ouvre dans TextEdit**

## 📝 **REMPLIR LE FICHIER .env**

Dans TextEdit qui vient de s'ouvrir, copiez-collez exactement ceci :

```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Pour l'instant, laissez** `your_elevenlabs_api_key_here` tel quel.

**Enregistrez** le fichier (Cmd + S)
**Fermez** TextEdit

## 🚀 **LANCER L'APPLICATION**

Une fois le fichier .env créé, tapez ceci dans le Terminal :

```bash
npm run dev
```

**Vous devez voir** quelque chose comme :
```
  Local:   http://localhost:5173/
  Network: http://192.168.1.xxx:5173/
```

## 🌐 **OUVRIR DANS LE NAVIGATEUR**

**Ouvrez Safari ou Chrome**

**Tapez cette adresse** :
```
http://localhost:5173
```

**Appuyez sur Entrée**

🎉 **VOTRE APP DOIT S'OUVRIR !**

---

**🎯 COMMENCEZ PAR : `touch .env`**