import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomeScreen from './pages/HomeScreen';
import SessionLibre from './pages/SessionLibre';
import SessionGuidee from './pages/SessionGuidee';
import SessionVoyage from './pages/SessionVoyage';
import BlogRedirect from './pages/BlogRedirect';

// Sous-pages guidées
import Recentrage from './pages/guidees/Recentrage';
import Evolution from './pages/guidees/Evolution';
import Famille from './pages/guidees/Famille';
import Scan from './pages/guidees/Scan';
import Sommeil from './pages/guidees/Sommeil';

// Sous-pages voyage intérieur
import Meditations from './pages/voyage/Meditations';
import Spiritualite from './pages/voyage/Spiritualite';
import Hypnoses from './pages/voyage/Hypnoses';

// Pages de session
import IntroLibre from './pages/IntroLibre';
import IntroGuidee from './pages/IntroGuidee';
import IntroVoyage from './pages/IntroVoyage';
import IntroBlog from './pages/IntroBlog';
import GuidedSessionRunner from './pages/sessions/GuidedSessionRunner';
import CoherenceSessionRunner from './pages/sessions/CoherenceSessionRunner';
import FreeSessionRunner from './pages/sessions/FreeSessionRunner';
import HypnosisSessionRunner from './pages/sessions/HypnosisSessionRunner';
import ResultsScreen from './pages/ResultsScreen';

// Pages d'authentification et d'onboarding
import StartScreen from './pages/StartScreen';
import AuthScreen from './pages/AuthScreen';
// Nouvelle page pour la session gratuite
import FreeSessionScreen from './pages/FreeSessionScreen';
import DiscoverySessionScreen from './pages/DiscoverySessionScreen';
import DiscoverySessionRunner from './pages/sessions/DiscoverySessionRunner';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages d'onboarding et d'authentification */}
        <Route path="/start" element={<StartScreen />} />
        <Route path="/launch" element={<StartScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/free-session" element={<FreeSessionScreen />} />
        <Route path="/discovery-session" element={<DiscoverySessionScreen />} />
        
        {/* Routes principales avec layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="/intro/libre" element={<IntroLibre />} />
          <Route path="/intro/guidees" element={<IntroGuidee />} />
          <Route path="/intro/voyage" element={<IntroVoyage />} />
          <Route path="/intro/blog" element={<IntroBlog />} />
          
          {/* Section libre */}
          <Route path="sessions/libre" element={<SessionLibre />} />
          <Route path="sessions/libre/run" element={<FreeSessionRunner />} />
          
          {/* Section guidée */}
          <Route path="sessions/guidees" element={<SessionGuidee />} />
          <Route path="sessions/guidees/recentrage" element={<Recentrage />} />
          <Route path="sessions/guidees/evolution" element={<Evolution />} />
          <Route path="sessions/guidees/famille" element={<Famille />} />
          <Route path="sessions/guidees/scan" element={<Scan />} />
          <Route path="sessions/guidees/sommeil" element={<Sommeil />} />
          
          {/* Voyage intérieur */}
          <Route path="sessions/voyage" element={<SessionVoyage />} />
          <Route path="sessions/voyage/meditations" element={<Meditations />} />
          <Route path="sessions/voyage/spiritualite" element={<Spiritualite />} />
          <Route path="sessions/voyage/hypnose" element={<Hypnoses />} />
          
          {/* Runners de session */}
          <Route path="sessions/run/guided/:sessionId" element={<GuidedSessionRunner />} />
          <Route path="sessions/run/coherence" element={<CoherenceSessionRunner />} /> {/* Gardé pour compatibilité */}
          <Route path="sessions/run/hypnosis/:sessionId" element={<HypnosisSessionRunner />} />
          <Route path="sessions/run/discovery" element={<DiscoverySessionRunner />} />
          
          {/* Résultats */}
          <Route path="results" element={<ResultsScreen />} />
          
          {/* Route pour les utilisateurs non authentifiés */}
          <Route path="*" element={<HomeScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}