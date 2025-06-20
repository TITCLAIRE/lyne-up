import React from 'react';
import { Home } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const meditations = [
  { id: 'gratitude', name: 'Gratitude', icon: '🙏', duration: 5, desc: 'Cultivez la reconnaissance', color: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'abundance', name: 'Abondance', icon: '💰', duration: 10, desc: 'Attirez la prospérité', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'love', name: 'Amour Universel', icon: '💗', duration: 8, desc: 'Ouvrez votre cœur', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'attraction', name: 'Loi d\'Attraction', icon: '🧲', duration: 7, desc: 'Manifestez vos désirs', color: 'from-purple-500/20 to-indigo-500/20' },
  { id: 'confidence', name: 'Confiance en Soi', icon: '💪', duration: 6, desc: 'Renforcez votre pouvoir', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'sleep', name: 'Sommeil Profond', icon: '😴', duration: 10, desc: 'Préparez-vous au repos', color: 'from-indigo-500/20 to-purple-500/20' },
];

export const MeditationSelectionScreen = () => {
  const { setCurrentScreen, setCurrentMeditation, setCurrentSession } = useAppStore();

  const handleMeditationSelect = (meditationId) => {
    setCurrentMeditation(meditationId);
    setCurrentSession('meditation');
    setCurrentScreen('session');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="px-5 pb-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Méditations Thématiques</h1>
        <p className="text-white/70">Choisissez votre thème de méditation</p>
      </div>

      <div className="grid gap-3 mb-8">
        {meditations.map((meditation) => (
          <div
            key={meditation.id}
            onClick={() => handleMeditationSelect(meditation.id)}
            className={`bg-gradient-to-r ${meditation.color} border border-white/20 rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{meditation.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{meditation.name}</h3>
                <p className="text-white/70 text-sm">{meditation.duration}min • {meditation.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGoHome}
          className="bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-2xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-200"
        >
          <Home size={20} />
          Retour
        </button>
      </div>
    </div>
  );
};