import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react'; // Import Sparkles icon

export default function IntroVoyage() {
  return (
    <div className="intro-screen">
      <div className="icon">
        <Sparkles size={64} className="text-purple-400" /> {/* Using Lucide icon */}
      </div>
      <h1>Un voyage intérieur commence ici.</h1>
      <p>Fermez les yeux. Laissez la voix vous emmener vers plus de confiance, de calme ou de clarté.</p>
      <Link to="/sessions/voyage" className="btn-primary">
        🎧 Explorer les guidances
      </Link>
    </div>
  );
}