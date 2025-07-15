import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react'; // Import BookOpen icon

export default function IntroBlog() {
  return (
    <div className="intro-screen">
      <div className="icon animate-pulse-gentle">
        <BookOpen size={64} className="text-green-400" /> {/* Using Lucide icon */}
      </div>
      <h1>En savoir plus, à votre rythme.</h1>
      <p>Articles, tests, vidéos et inspirations pour mieux comprendre la cohérence cardiaque et votre corps.</p>
      <Link to="/blog" className="btn-primary">
        🔗 Lire le blog
      </Link>
    </div>
  );
}