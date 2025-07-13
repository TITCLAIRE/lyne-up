import { useEffect } from 'react';
import { BookOpen } from 'lucide-react'; // Import BookOpen icon

export default function IntroBlog() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://tonlien.systeme.io";
    }, 2000); // Redirection après 2 secondes
  }, []);

  return (
    <div className="intro-screen">
      <div className="icon animate-pulse-gentle">
        <BookOpen size={64} className="text-green-400" /> {/* Using Lucide icon */}
      </div>
      <h1>Redirection vers le blog...</h1>
      <p>Articles, tests, vidéos et inspirations pour nourrir votre pratique.</p>
    </div>
  );
}