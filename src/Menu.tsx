import React, { useEffect, useState } from 'react';

export default function Menu({ onPlay, onInfo }: { onPlay: () => void, onInfo: () => void }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 200);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-black">
      <div className={`text-6xl md:text-8xl font-bold text-red-700 tracking-widest ${glitch ? 'translate-x-2 -translate-y-1 skew-x-12 opacity-80' : ''}`} style={{ textShadow: '4px 4px 0px #300' }}>
        STICKMAN.EXE
      </div>
      
      <div className="mt-16 flex flex-col gap-6 z-10 items-center">
        <button 
          onClick={onPlay}
          className="text-4xl font-bold text-white hover:text-red-500 hover:scale-110 transition-all duration-200 cursor-pointer tracking-widest"
          style={{ textShadow: '2px 2px 0px #500' }}
        >
          PLAY
        </button>
        <button 
          onClick={onInfo}
          className="text-2xl font-bold text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer tracking-widest"
        >
          INFORMATION
        </button>
        <a 
          href="https://github.com/HouseGram-code/Stickman-exe?tab=readme-ov-file#russian"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-bold text-gray-600 hover:text-red-500 hover:scale-110 transition-all duration-200 cursor-pointer tracking-widest mt-2"
        >
          GITHUB
        </a>
      </div>
      
      {glitch && (
        <div className="absolute inset-0 pointer-events-none z-50 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
      )}
      
      <div className="absolute bottom-4 left-4 text-gray-600 text-sm font-mono">
        Version 0.1 Beta
      </div>
      <div className="absolute bottom-4 right-4 text-gray-800 text-sm font-mono">
        © 666
      </div>
    </div>
  );
}
