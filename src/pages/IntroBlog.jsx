import React from 'react';
import { BookOpen } from 'lucide-react';

export default function IntroBlog() {
  return (
    <div className="intro-screen">
      <div className="icon animate-pulse-gentle">
        <BookOpen size={64} className="text-green-400" />
      </div>
      <h1>En savoir plus, à votre rythme.</h1>
      <p>Articles, tests, vidéos et inspirations pour mieux comprendre la cohérence cardiaque et votre corps.</p>
      <a 
        href="https://www.thierrythomas.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-primary"
      >
        🔗 Lire le blog
      </a>
    </div>
  );
}