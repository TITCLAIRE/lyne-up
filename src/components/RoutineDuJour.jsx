import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Simule une sélection aléatoire parmi toutes les séances disponibles
const allSessions = [
  { name: 'Reset', path: '/sessions/guidees/recentrage#reset', duration: '4 min' },
  { name: 'Gratitude', path: '/sessions/voyage/meditations#gratitude', duration: '5 min' },
  { name: 'Switch', path: '/sessions/guidees/recentrage#switch', duration: '3 min' },
  { name: 'Scan Corporel', path: '/sessions/guidees/scan#scan', duration: '10 min' },
  { name: 'Sieste Relaxante', path: '/sessions/voyage/hypnose#sieste', duration: '8 min' },
  { name: 'Training', path: '/sessions/guidees/evolution#training', duration: '6 min' },
  { name: 'SOS', path: '/sessions/guidees/recentrage#sos', duration: '2 min' },
  { name: 'Sommeil Profond', path: '/sessions/guidees/sommeil#sleep', duration: '10 min' }
  // Tu peux en ajouter d'autres…
];

export default function RoutineDuJour() {
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    const pick = allSessions[Math.floor(Math.random() * allSessions.length)];
    setRoutine(pick);
  }, []);

  return (
    <div className="routine-card">
      <h2>🎯 Ma routine du jour</h2>
      <p>Laissez l'application choisir pour vous. Respirez. C'est le bon moment.</p>
      {routine && (
        <div className="routine-session">
          <h3>👉 {routine.name}</h3>
          <p>Durée : {routine.duration}</p>
          <Link to={routine.path} className="btn-primary">
            Commencer maintenant
          </Link>
        </div>
      )}
    </div>
  );
}