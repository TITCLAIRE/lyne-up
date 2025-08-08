// src/utils/audioUnlock.ts
let unlocked = false;

export async function ensureAudioUnlocked() {
  if (unlocked) return;
  try {
    // Web Audio (si vous utilisez AudioContext quelque part)
    // @ts-ignore
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      if (ctx.state === 'suspended') await ctx.resume();
      // micro-noise pour "débloquer"
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      o.connect(g).connect(ctx.destination);
      o.start(0);
      o.stop(ctx.currentTime + 0.01);
    }

    // HTMLAudioElement "warm-up"
    const a = new Audio();
    a.muted = true;
    a.src = 'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA'; // silence
    await a.play().catch(() => {});
    a.pause();
    unlocked = true;
  } catch {
    // on ignore, on réessaiera après le tap
  }
}
