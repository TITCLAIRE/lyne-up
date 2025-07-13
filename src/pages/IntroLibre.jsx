import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react'; // Import Heart icon

export default function IntroLibre() {
  return (
    <div className="intro-screen">
      <div className="icon">
        <Heart size={64} className="text-pink-400" /> {/* Using Lucide icon */}
      </div>
      <h1>Respirez. C’est vous qui guidez.</h1>
      <p>Prenez le contrôle de votre souffle. Choisissez votre rythme, vos sons, et entrez en cohérence.</p>
      <Link to="/sessions/libre" className="btn-primary">
        ▶️ Commencer ma session libre
      </Link>
    </div>
  );
}