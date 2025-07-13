import { useEffect } from 'react';

export default function BlogRedirect() {
  useEffect(() => {
    window.location.href = 'https://tonlien.systeme.io';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-center">
        <h2 className="text-2xl font-bold mb-4">Redirection vers le blog...</h2>
        <p className="text-white/70">Vous allez être redirigé vers notre blog dans un instant.</p>
      </div>
    </div>
  );
}