import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react'; // Import UserCircle icon

export default function IntroGuidee() {
  return (
    <div className="intro-screen">
      <div className="icon animate-pulse-gentle">
        <UserCircle size={64} className="text-blue-400" /> {/* Using Lucide icon */}
      </div>
      <h1>Laissez-vous guider.</h1>
      <p>Des séances ciblées pour vous détendre, vous recentrer, ou vous régénérer. Il suffit d’appuyer sur play.</p>
      <Link to="/sessions/guidees" className="btn-primary">
        ✨ Choisir une séance guidée
      </Link>
    </div>
  );
}