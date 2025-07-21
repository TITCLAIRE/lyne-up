# 📁 GUIDE SUPABASE - LOCALISATION DES FICHIERS SQL

## 🎯 **VOS FICHIERS SQL SONT ICI :**

```
votre-projet/
├── supabase/
│   └── migrations/
│       ├── 20250721114124_shy_queen.sql      ← Table users
│       ├── 20250721114133_odd_spark.sql      ← Table subscriptions  
│       ├── 20250721114140_crimson_ocean.sql  ← Table usage_stats
│       └── 20250721114148_delicate_poetry.sql ← Table user_preferences
```

## 🚀 **COMMENT LES UTILISER DANS SUPABASE**

### **Méthode 1 : SQL Editor (RECOMMANDÉE)**

1. **Aller sur** [supabase.com](https://supabase.com)
2. **Ouvrir votre projet**
3. **Cliquer sur "SQL Editor"** dans le menu de gauche
4. **Pour chaque fichier**, faire ceci :

#### **Fichier 1 : Table users**
1. **Ouvrir** `supabase/migrations/20250721114124_shy_queen.sql`
2. **Copier tout le contenu** du fichier
3. **Coller** dans SQL Editor
4. **Cliquer "Run"** (bouton bleu)
5. **Vérifier** qu'il n'y a pas d'erreur

#### **Fichier 2 : Table subscriptions**
1. **Ouvrir** `supabase/migrations/20250721114133_odd_spark.sql`
2. **Copier tout le contenu**
3. **Coller** dans SQL Editor
4. **Cliquer "Run"**

#### **Fichier 3 : Table usage_stats**
1. **Ouvrir** `supabase/migrations/20250721114140_crimson_ocean.sql`
2. **Copier tout le contenu**
3. **Coller** dans SQL Editor
4. **Cliquer "Run"**

#### **Fichier 4 : Table user_preferences**
1. **Ouvrir** `supabase/migrations/20250721114148_delicate_poetry.sql`
2. **Copier tout le contenu**
3. **Coller** dans SQL Editor
4. **Cliquer "Run"**

### **Méthode 2 : Via l'explorateur de fichiers**

**Sur Windows :**
1. **Ouvrir l'Explorateur**
2. **Naviguer** vers votre dossier de projet
3. **Aller dans** `supabase` → `migrations`
4. **Double-cliquer** sur chaque fichier `.sql`

**Sur Mac :**
1. **Ouvrir Finder**
2. **Naviguer** vers votre dossier de projet
3. **Aller dans** `supabase` → `migrations`
4. **Double-cliquer** sur chaque fichier `.sql`

## ✅ **VÉRIFICATION APRÈS EXÉCUTION**

Après avoir exécuté tous les fichiers SQL :

1. **Aller dans "Table Editor"** (menu Supabase)
2. **Vous devez voir 4 tables :**
   - ✅ `users`
   - ✅ `subscriptions`
   - ✅ `usage_stats`
   - ✅ `user_preferences`

## 🔍 **CONTENU DES FICHIERS**

### **20250721114124_shy_queen.sql**
- Crée la table `users`
- Configure l'authentification
- Active la sécurité RLS
- Trigger automatique pour nouveaux utilisateurs

### **20250721114133_odd_spark.sql**
- Crée la table `subscriptions`
- Gestion des abonnements Stripe
- Statuts et dates de facturation

### **20250721114140_crimson_ocean.sql**
- Crée la table `usage_stats`
- Suivi des sessions utilisateur
- Limitation pour comptes gratuits

### **20250721114148_delicate_poetry.sql**
- Crée la table `user_preferences`
- Paramètres audio/vocaux
- Préférences personnalisées

## 🆘 **SI VOUS NE TROUVEZ PAS LES FICHIERS**

Les fichiers sont automatiquement créés dans votre projet. Si vous ne les voyez pas :

1. **Actualiser** votre explorateur de fichiers
2. **Vérifier** que vous êtes dans le bon dossier de projet
3. **Chercher** le dossier `supabase`

## 🎯 **PROCHAINE ÉTAPE**

Une fois les 4 fichiers SQL exécutés dans Supabase :
1. **Récupérer** votre Project URL et clé API
2. **Configurer** le fichier `.env`
3. **Tester** la connexion

**Dites-moi quand vous avez exécuté les fichiers SQL !**