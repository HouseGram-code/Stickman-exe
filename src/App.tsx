import React, { useState } from 'react';
import Menu from './Menu';
import Game from './Game';
import Jumpscare from './Jumpscare';
import WinScreen from './WinScreen';
import InfoScreen from './InfoScreen';
import CharacterSelect from './CharacterSelect';

export type CharStatus = 'idle' | 'survived' | 'dead';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'info' | 'charSelect' | 'playing' | 'jumpscare' | 'win'>('menu');
  const [charStatus, setCharStatus] = useState<CharStatus>('idle');

  return (
    <div className="w-full h-screen bg-black overflow-hidden text-white font-sans select-none touch-none">
      {gameState === 'menu' && <Menu onPlay={() => setGameState('charSelect')} onInfo={() => setGameState('info')} />}
      {gameState === 'info' && <InfoScreen onBack={() => setGameState('menu')} />}
      {gameState === 'charSelect' && (
        <CharacterSelect 
          status={charStatus} 
          onSelect={() => setGameState('playing')} 
          onBackToMenu={() => { setCharStatus('idle'); setGameState('menu'); }} 
        />
      )}
      {gameState === 'playing' && (
        <Game 
          onGameOver={() => { setCharStatus('dead'); setGameState('jumpscare'); }} 
          onWin={() => { setCharStatus('survived'); setGameState('win'); }} 
        />
      )}
      {gameState === 'jumpscare' && <Jumpscare onRestart={() => setGameState('charSelect')} />}
      {gameState === 'win' && <WinScreen onRestart={() => setGameState('charSelect')} />}
    </div>
  );
}
