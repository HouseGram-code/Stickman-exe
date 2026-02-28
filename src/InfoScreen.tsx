import React from 'react';

export default function InfoScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-black p-8">
      <div className="max-w-2xl w-full border-2 border-red-900 bg-red-950/20 p-8 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.2)] z-10">
        <h1 className="text-4xl font-bold text-red-600 mb-6 text-center border-b border-red-900 pb-4 tracking-widest">INFORMATION</h1>
        
        <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
          <p>
            <strong className="text-white">Stickman.exe</strong> is a 2.5D psychological horror game inspired by classic creepypastas like Sonic.exe.
          </p>
          <p>
            You play as a simple stickman wandering through a seemingly peaceful world. But the further you go, the more the world corrupts. Something is watching you. Something is following you.
          </p>
          
          <h2 className="text-2xl font-bold text-red-500 mt-8 mb-2">CONTROLS</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">A / D</strong> or <strong className="text-white">Left / Right Arrows</strong> - Move</li>
            <li><strong className="text-white">W</strong> or <strong className="text-white">Up Arrow</strong> or <strong className="text-white">Space</strong> - Jump</li>
          </ul>
          
          <p className="text-red-400 italic mt-6 text-center text-xl">
            Don't look back. Just run.
          </p>
        </div>
        
        <div className="mt-10 flex justify-center">
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-red-900 hover:bg-red-700 text-white font-bold rounded transition-colors cursor-pointer tracking-widest"
          >
            BACK TO MENU
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-10 pointer-events-none"></div>
    </div>
  );
}
