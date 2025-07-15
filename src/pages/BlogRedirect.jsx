import { useEffect } from 'react';

export default function BlogRedirect() {
  useEffect(() => {
    // Redirection vers le blog externe
    window.location.href = 'https://www.thierrythomas.com/';
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