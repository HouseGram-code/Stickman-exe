import React, { useEffect } from 'react';

export default function WinScreen({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRestart();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onRestart]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-4xl md:text-6xl font-bold text-green-500 animate-pulse" style={{ textShadow: '0 0 20px green' }}>
        YOU ESCAPED
      </div>
      <div className="mt-8 text-gray-500 font-mono">
        Returning to menu...
      </div>
    </div>
  );
}
