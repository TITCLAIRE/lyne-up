# Guide de déploiement sur Netlify

## Étape 1 : Créer un compte Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "Sign up" et créez un compte (de préférence avec GitHub)

## Étape 2 : Déployer votre application

### Option A : Déploiement direct depuis GitHub

1. Dans Netlify, cliquez sur "New site from Git"
2. Choisissez "GitHub" comme fournisseur Git
3. Autorisez Netlify à accéder à vos repositories GitHub
4. Sélectionnez votre repository `instant-opportun`
5. Dans les paramètres de déploiement :
   - Build command : `npm run build`
   - Publish directory : `dist`
6. Cliquez sur "Deploy site"

### Option B : Déploiement manuel (si vous n'utilisez pas GitHub)

1. Dans votre terminal, exécutez :
   ```bash
   npm run build
   ```
2. Dans Netlify, cliquez sur "Sites" puis "Drag and drop your site folder here"
3. Faites glisser le dossier `dist` généré

## Étape 3 : Configurer les variables d'environnement

1. Une fois le site déployé, allez dans "Site settings"
2. Cliquez sur "Environment variables"
3. Cliquez sur "Add variable"
4. Ajoutez :
   - Key : `VITE_ELEVENLABS_API_KEY`
   - Value : votre clé API ElevenLabs (commençant par `sk_`)
5. Cliquez sur "Save"

## Étape 4 : Redéployer le site

1. Allez dans "Deploys"
2. Cliquez sur "Trigger deploy" puis "Deploy site"

## Étape 5 : Accéder à votre site

1. Netlify vous fournira une URL (par exemple `https://your-site-name.netlify.app`)
2. Ouvrez cette URL dans votre navigateur
3. Votre application devrait maintenant fonctionner avec ElevenLabs !

## Dépannage

Si ElevenLabs ne fonctionne toujours pas :

1. Vérifiez que la variable d'environnement est correctement configurée
2. Assurez-vous que "Text to Speech" est activé dans les paramètres de votre clé API ElevenLabs
3. Vérifiez les logs de déploiement dans Netlify pour détecter d'éventuelles erreurs