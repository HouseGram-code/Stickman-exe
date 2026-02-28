import React, { useEffect, useState } from 'react';
import { CharStatus } from './App';

export default function CharacterSelect({ status, onSelect, onBackToMenu }: { status: CharStatus, onSelect: () => void, onBackToMenu: () => void }) {
  const [noise, setNoise] = useState(false);

  useEffect(() => {
    if (status !== 'idle') {
      const t = setTimeout(onBackToMenu, 4000);
      return () => clearTimeout(t);
    }
  }, [status, onBackToMenu]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNoise(Math.random() > 0.8);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center relative">
      {noise && <div className="absolute inset-0 bg-noise mix-blend-screen opacity-30 z-0 pointer-events-none"></div>}
      
      <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-12 z-10 tracking-widest text-center" style={{ textShadow: '2px 2px 0 #300' }}>
        {status === 'idle' ? 'SELECT YOUR CHARACTER' : status === 'survived' ? 'YOU SURVIVED... FOR NOW' : 'YOU ARE DEAD'}
      </h1>
      
      <div className="flex gap-8 z-10 flex-wrap justify-center">
        {/* Character 1: Stickman */}
        <div 
          onClick={() => status === 'idle' && onSelect()}
          className={`w-48 h-64 border-4 flex flex-col items-center justify-center relative transition-all ${status === 'idle' ? 'border-red-700 hover:border-red-400 hover:scale-105 cursor-pointer bg-black' : status === 'survived' ? 'border-green-600 bg-black' : 'border-red-900 bg-red-950'}`}
          style={{ boxShadow: status === 'idle' ? 'inset 0 0 20px rgba(255,0,0,0.2)' : 'none' }}
        >
          <div className="relative w-24 h-40 flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full border-4 ${status === 'dead' ? 'border-black bg-red-900' : 'border-white'} relative flex items-center justify-center`}>
              {status === 'survived' && (
                <div className="absolute bottom-2 w-10 h-4 border-b-4 border-white rounded-full"></div>
              )}
              {status === 'dead' && (
                <>
                  <div className="w-3 h-3 bg-black rounded-full absolute top-4 left-3 shadow-[0_0_5px_black]"></div>
                  <div className="w-3 h-3 bg-black rounded-full absolute top-4 right-3 shadow-[0_0_5px_black]"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full absolute top-5 left-4"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full absolute top-5 right-4"></div>
                  <div className="w-8 h-6 bg-black absolute bottom-2 rounded-full"></div>
                </>
              )}
            </div>
            <div className={`w-1 h-16 ${status === 'dead' ? 'bg-black' : 'bg-white'} mt-1`}></div>
            <div className={`w-1 h-12 ${status === 'dead' ? 'bg-black' : 'bg-white'} absolute top-20 rotate-45 origin-top`}></div>
            <div className={`w-1 h-12 ${status === 'dead' ? 'bg-black' : 'bg-white'} absolute top-20 -rotate-45 origin-top`}></div>
          </div>
          
          {status === 'dead' && <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-50"></div>}
        </div>

        {/* Character 2: Locked */}
        <div className="w-48 h-64 border-4 border-gray-800 bg-gray-900 flex flex-col items-center justify-center relative opacity-50">
          <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20"></div>
          <div className="w-12 h-16 border-4 border-gray-600 rounded-t-full relative">
            <div className="w-16 h-12 bg-gray-600 absolute -bottom-2 -left-3 rounded"></div>
          </div>
          <div className="mt-6 text-gray-500 font-bold tracking-widest">LOCKED</div>
        </div>

        {/* Character 3: Locked */}
        <div className="w-48 h-64 border-4 border-gray-800 bg-gray-900 flex flex-col items-center justify-center relative opacity-50 hidden md:flex">
          <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20"></div>
          <div className="w-12 h-16 border-4 border-gray-600 rounded-t-full relative">
            <div className="w-16 h-12 bg-gray-600 absolute -bottom-2 -left-3 rounded"></div>
          </div>
          <div className="mt-6 text-gray-500 font-bold tracking-widest">LOCKED</div>
        </div>
      </div>
      
      {status !== 'idle' && (
        <div className="absolute bottom-10 text-gray-500 animate-pulse font-mono">
          Returning to menu...
        </div>
      )}
    </div>
  );
}
