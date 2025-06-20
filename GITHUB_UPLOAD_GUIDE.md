# 📋 Guide d'ajout des fichiers sur GitHub

## 🎯 Structure finale attendue

```
instant-opportun/
├── assets/           ← (déjà présent - à conserver)
├── icons/            ← (déjà présent - à conserver)
├── src/
│   ├── components/
│   │   └── screens/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   └── data/
├── package.json
├── index.html
└── ...
```

## 📁 **ÉTAPE 1 : Fichiers de configuration racine**

### 1. package.json
```json
{
  "name": "coherence-cardiaque-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### 2. index.html
```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Instant Opportun">
    <meta name="theme-color" content="#1e3a8a">
    <title>Instant Opportun - Cohérence Cardiaque</title>
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3. vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### 4. tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### 5. tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### 6. tsconfig.node.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### 7. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 8. postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 9. eslint.config.js
```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

## 📁 **ÉTAPE 2 : Créer la structure des dossiers**

Avant d'ajouter les fichiers, créez ces dossiers dans GitHub :
- `src/`
- `src/components/`
- `src/components/screens/`
- `src/hooks/`
- `src/store/`
- `src/services/`
- `src/data/`

## 📁 **ÉTAPE 3 : Fichiers principaux src/**

### 10. src/main.tsx
### 11. src/App.tsx
### 12. src/index.css
### 13. src/vite-env.d.ts

## 📁 **ÉTAPE 4 : Store et hooks**

### 14. src/store/appStore.ts
### 15. src/hooks/useSessionTimer.ts
### 16. src/hooks/useBreathingAnimation.ts
### 17. src/hooks/useAudioManager.ts
### 18. src/hooks/useVoiceManager.ts
### 19. src/hooks/useHeartRateDetector.ts

## 📁 **ÉTAPE 5 : Services et données**

### 20. src/services/elevenLabsService.ts
### 21. src/data/sessions.ts
### 22. src/data/meditations.ts

## 📁 **ÉTAPE 6 : Composants**

### 23. src/components/Header.tsx
### 24. src/components/BreathingGuide.tsx
### 25. src/components/BiometricDisplay.tsx
### 26. src/components/SidePanel.tsx

## 📁 **ÉTAPE 7 : Écrans**

### 27. src/components/screens/HomeScreen.tsx
### 28. src/components/screens/SessionScreen.tsx
### 29. src/components/screens/ResultsScreen.tsx
### 30. src/components/screens/MeditationSelectionScreen.tsx
### 31. src/components/screens/CoherenceSelectionScreen.tsx
### 32. src/components/screens/CoherenceSessionScreen.tsx

## 📁 **ÉTAPE 8 : Fichiers documentation**

### 33. README.md
### 34. LICENSE
### 35. .env.example
### 36. netlify.toml
### 37. DEPLOYMENT.md

## ✅ **Vérification finale**

Une fois tous les fichiers ajoutés, votre structure devrait ressembler à :

```
instant-opportun/
├── assets/           ← (conservé)
├── icons/            ← (conservé)
├── src/
│   ├── components/
│   │   ├── screens/
│   │   ├── Header.tsx
│   │   ├── BreathingGuide.tsx
│   │   ├── BiometricDisplay.tsx
│   │   └── SidePanel.tsx
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── data/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── README.md
├── LICENSE
├── .env.example
├── netlify.toml
└── DEPLOYMENT.md
```

## 🚀 **Après l'ajout**

1. Commitez tous les changements
2. L'app sera prête pour le déploiement sur Netlify
3. Testez localement avec `npm install` puis `npm run dev`