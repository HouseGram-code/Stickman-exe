import React, { useEffect } from 'react';

export default function Jumpscare({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio failed", e);
    }

    const timer = setTimeout(() => {
      onRestart();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onRestart]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-red-600 animate-pulse mix-blend-overlay opacity-50 z-10"></div>
      
      <div className="absolute inset-0 pointer-events-none z-20 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, #fff 4px, #fff 8px)' }}></div>

      <div className="text-[15rem] md:text-[25rem] font-bold text-red-600 animate-ping z-30" style={{ textShadow: '0 0 50px red' }}>
        DIE
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
         <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[16px] md:border-[24px] border-red-600 relative bg-black">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-red-600 rounded-full absolute top-12 md:top-16 left-8 md:left-12 animate-bounce"></div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-red-600 rounded-full absolute top-12 md:top-16 right-8 md:right-12 animate-bounce"></div>
            <div className="w-32 h-8 md:w-48 md:h-12 bg-red-600 absolute bottom-12 md:bottom-16 left-12 md:left-20 rounded-full"></div>
            
            <div className="w-4 h-24 md:h-32 bg-red-600 absolute -bottom-8 md:-bottom-12 left-16 md:left-24 rounded-full"></div>
            <div className="w-4 h-16 md:h-24 bg-red-600 absolute -bottom-4 md:-bottom-6 right-20 md:right-32 rounded-full"></div>
         </div>
      </div>
    </div>
  );
}
