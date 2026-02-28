import React, { useEffect, useRef, useState, useMemo } from 'react';

const Stickman = React.forwardRef(({ initialX, initialY, initialZ, isRunning, initialFacingRight, color = 'black', isDead = false, showEyes = false }: any, ref: any) => {
  if (isDead) {
    return (
      <div className="absolute" style={{ transform: `translate3d(${initialX}px, ${-initialY}px, ${initialZ}px) rotateZ(90deg)`, transformOrigin: 'bottom center', width: '50px', height: '100px', left: '-25px', bottom: '0' }}>
         <div className="w-8 h-8 rounded-full border-4 border-black absolute top-0 left-[9px]"></div>
         <div className="w-1 h-12 bg-black absolute top-8 left-[23px]"></div>
         <div className="w-1 h-10 bg-black absolute top-10 left-[23px] origin-top rotate-45"></div>
         <div className="w-1 h-10 bg-black absolute top-10 left-[23px] origin-top -rotate-45"></div>
         <div className="w-1 h-12 bg-black absolute top-20 left-[23px] origin-top rotate-[60deg]"></div>
         <div className="w-1 h-12 bg-black absolute top-20 left-[23px] origin-top -rotate-[60deg]"></div>
         <div className="w-12 h-4 bg-red-700 absolute top-12 left-4 rounded-full blur-sm opacity-90"></div>
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute" style={{ 
      transform: `translate3d(${initialX}px, ${-initialY}px, ${initialZ}px) scaleX(${initialFacingRight ? 1 : -1})`, 
      transformStyle: 'preserve-3d',
      width: '50px', height: '100px',
      left: '-25px', bottom: '0'
    }}>
      {!isDead && <div className="absolute bottom-[-4px] left-[15px] w-[20px] h-[8px] bg-black/40 rounded-full blur-[3px]"></div>}
      <div className={`w-8 h-8 rounded-full border-4 absolute top-0 left-[9px]`} style={{ borderColor: color }}>
        {color === 'red' && (
          <>
            <div className="w-2 h-2 bg-black rounded-full absolute top-2 left-1"></div>
            <div className="w-2 h-2 bg-black rounded-full absolute top-2 right-1"></div>
            <div className="w-4 h-1 bg-black absolute bottom-1 left-1"></div>
          </>
        )}
        {showEyes && color !== 'red' && (
          <>
            <div className="w-2 h-2 bg-red-600 rounded-full absolute top-2 left-1 shadow-[0_0_10px_red]"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full absolute top-2 right-1 shadow-[0_0_10px_red]"></div>
          </>
        )}
      </div>
      <div className={`w-1 h-12 absolute top-8 left-[23px]`} style={{ backgroundColor: color }}></div>
      <div className={`w-1 h-10 absolute top-10 left-[23px] origin-top ${isRunning ? 'animate-arm-f' : 'rotate-12'}`} style={{ backgroundColor: color }}></div>
      <div className={`w-1 h-10 absolute top-10 left-[23px] origin-top ${isRunning ? 'animate-arm-b' : '-rotate-12'}`} style={{ backgroundColor: color }}></div>
      <div className={`w-1 h-12 absolute top-20 left-[23px] origin-top ${isRunning ? 'animate-leg-f' : 'rotate-12'}`} style={{ backgroundColor: color }}></div>
      <div className={`w-1 h-12 absolute top-20 left-[23px] origin-top ${isRunning ? 'animate-leg-b' : '-rotate-12'}`} style={{ backgroundColor: color }}></div>
    </div>
  );
});

const Tree = React.memo(({ x, z, phase }: any) => {
  const isBurning = phase === 4;
  return (
    <div className="absolute" style={{ 
      transform: `translate3d(${x}px, 0px, ${z}px)`, 
      transformStyle: 'preserve-3d',
      width: '100px', height: '200px',
      left: '-50px', bottom: '0'
    }}>
      <div className="absolute bottom-[-5px] left-[30px] w-[40px] h-[10px] bg-black/50 rounded-full blur-[4px]"></div>
      <div className={`w-4 h-32 absolute bottom-0 left-[48px] ${phase === 0 ? 'bg-amber-900' : isBurning ? 'bg-orange-900' : 'bg-gray-900'}`}></div>
      <div className={`w-24 h-24 rounded-full absolute top-10 left-[4px] transition-colors duration-1000 ${phase === 0 ? 'bg-green-700' : isBurning ? 'bg-red-600 animate-pulse' : phase === 1 || phase === 2 ? 'bg-gray-800' : 'bg-red-950'}`}></div>
      <div className={`w-20 h-20 rounded-full absolute top-0 left-[20px] transition-colors duration-1000 ${phase === 0 ? 'bg-green-600' : isBurning ? 'bg-orange-500 animate-pulse' : phase === 1 || phase === 2 ? 'bg-gray-700' : 'bg-red-900'}`}></div>
    </div>
  );
});

const Ring = ({ x, z }: any) => (
  <div className="absolute animate-pulse" style={{
    transform: `translate3d(${x}px, -100px, ${z}px)`,
    width: '120px', height: '120px',
    borderRadius: '50%',
    border: '16px solid #ffd700',
    boxShadow: '0 0 30px #ffaa00, inset 0 0 30px #ffaa00',
    left: '-60px', bottom: '50px'
  }}>
    <div className="absolute bottom-[-50px] left-[20px] w-[80px] h-[15px] bg-black/60 rounded-full blur-[6px]"></div>
  </div>
);

export default function Game({ onGameOver, onWin }: { onGameOver: () => void, onWin: () => void }) {
  const [isMoving, setIsMoving] = useState(false);
  const [phase, setPhase] = useState(0);
  const [staticOpacity, setStaticOpacity] = useState(0);
  const [showEyes, setShowEyes] = useState(false);
  const [foundYou, setFoundYou] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showRun, setShowRun] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const keys = useRef({ left: false, right: false, up: false });
  const requestRef = useRef<number>();
  
  const playerXRef = useRef(0);
  const playerYRef = useRef(0);
  const cameraXRef = useRef(0);
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const enemyXRef = useRef(-1000);
  const phaseRef = useRef(0);
  const foundYouRef = useRef(false);
  const showEyesRef = useRef(false);
  const isMovingRef = useRef(false);
  const facingRightRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const groundPatternRef = useRef<HTMLDivElement>(null);

  const trees = useMemo(() => Array.from({ length: 300 }).map((_, i) => ({
    id: i,
    x: Math.random() * 40000 - 15000,
    z: Math.random() * -1500 - 100
  })), []);

  const deadBodies = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: 5500 + Math.random() * 9000,
    z: Math.random() * -600 - 50
  })), []);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const startChaseAudio = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      setInterval(() => {
        if (ctx.state === 'closed') return;
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.2);
      }, 400);
      gain.gain.value = 0.1;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
    } catch (e) {}
  };

  const stopAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(e => console.error("Audio close error", e));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keys.current.up = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keys.current.up = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopAudio();
    };
  }, []);

  const update = () => {
    if (foundYouRef.current) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    let moved = false;
    const speed = phaseRef.current === 4 ? 8 : 6;
    
    if (keys.current.right) {
      playerXRef.current += speed;
      facingRightRef.current = true;
      moved = true;
    }
    if (keys.current.left) {
      playerXRef.current -= speed;
      facingRightRef.current = false;
      moved = true;
    }
    
    if (keys.current.up && isGrounded.current) {
      velocityY.current = 18;
      isGrounded.current = false;
    }
    
    playerYRef.current += velocityY.current;
    if (playerYRef.current > 0) {
      velocityY.current -= 0.8;
    } else {
      playerYRef.current = 0;
      velocityY.current = 0;
      isGrounded.current = true;
    }

    if (moved !== isMovingRef.current) {
      isMovingRef.current = moved;
      setIsMoving(moved);
    }
    
    cameraXRef.current += (playerXRef.current - cameraXRef.current) * 0.1;

    // Direct DOM updates for performance (no React re-renders)
    if (playerRef.current) {
      playerRef.current.style.transform = `translate3d(${playerXRef.current}px, ${-playerYRef.current}px, 0) scaleX(${facingRightRef.current ? 1 : -1})`;
    }
    if (cameraRef.current) {
      cameraRef.current.style.transform = `translate3d(${-cameraXRef.current}px, 150px, 0)`;
    }
    if (groundRef.current) {
      groundRef.current.style.transform = `translate3d(${cameraXRef.current}px, 0, 0) rotateX(90deg)`;
    }
    if (groundPatternRef.current) {
      groundPatternRef.current.style.backgroundPosition = `${-cameraXRef.current}px 0px`;
    }

    // UI State updates
    if (showTutorial && playerXRef.current > 1000) setShowTutorial(false);

    if (phaseRef.current === 0 && playerXRef.current > 5000) {
      phaseRef.current = 1; setPhase(1);
    } else if (phaseRef.current === 1 && playerXRef.current > 12000) {
      phaseRef.current = 2; setPhase(2);
    }

    if (phaseRef.current === 2) {
      const dist = 15000 - playerXRef.current;
      if (dist < 1500 && dist > 0) {
        setStaticOpacity(1 - dist / 1500);
      }
      if (dist < 300 && !showEyesRef.current) {
        showEyesRef.current = true; setShowEyes(true);
      }
      if (dist < 50 && !foundYouRef.current) {
        foundYouRef.current = true;
        setFoundYou(true);
        setStaticOpacity(0);
        setTimeout(() => {
          setFoundYou(false);
          foundYouRef.current = false;
          phaseRef.current = 4;
          setPhase(4);
          playerXRef.current = 0;
          enemyXRef.current = -800;
          startChaseAudio();
        }, 3000);
      }
    }

    if (phaseRef.current === 4) {
      enemyXRef.current += speed * 1.04;
      
      if (enemyRef.current) {
        enemyRef.current.style.transform = `translate3d(${enemyXRef.current}px, 0px, 0) scaleX(1)`;
      }

      if (!showRun && playerXRef.current < 2000) setShowRun(true);
      if (showRun && playerXRef.current >= 2000) setShowRun(false);
      if (!showJump && playerXRef.current > 7000 && playerXRef.current < 8000) setShowJump(true);
      if (showJump && (playerXRef.current <= 7000 || playerXRef.current >= 8000)) setShowJump(false);
      
      if (enemyXRef.current >= playerXRef.current - 30) {
        stopAudio();
        onGameOver();
        return;
      }

      if (playerXRef.current > 7950 && playerXRef.current < 8150) {
        if (playerYRef.current > 50) {
          stopAudio();
          onWin();
          return;
        }
      }
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className={`w-full h-full overflow-hidden relative transition-colors duration-[3000ms] touch-none ${phase === 0 ? 'bg-sky-400' : phase === 4 ? 'fire-bg' : phase === 1 || phase === 2 ? 'bg-gray-800' : 'bg-red-950'}`} style={{ perspective: '800px' }}>
      
      {foundYou && (
        <div className="absolute inset-0 bg-black z-[100] flex items-center justify-center">
          <div className="text-red-600 text-6xl md:text-8xl font-bold glitch-text" style={{ textShadow: '0 0 20px red' }}>
            Я ТЕБЯ НАШЕЛ
          </div>
        </div>
      )}

      {staticOpacity > 0 && (
        <div className="absolute inset-0 z-[90] bg-noise mix-blend-screen" style={{ opacity: staticOpacity }}></div>
      )}

      {phase === 4 && (
        <div className="absolute inset-0 pointer-events-none z-50 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
      )}

      {showTutorial && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/70 font-mono text-xl z-50 animate-pulse text-center w-full px-4">
          {isTouch ? "Use on-screen buttons to move and jump." : "Use Arrow Keys or WASD to move. Space to jump."}
        </div>
      )}
      {showRun && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-red-500 font-bold text-4xl z-50 glitch-text">
          RUN
        </div>
      )}
      {showJump && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-yellow-400 font-bold text-4xl z-50 animate-bounce" style={{ textShadow: '0 0 10px yellow' }}>
          JUMP INTO THE RING!
        </div>
      )}

      <div ref={cameraRef} className="absolute top-1/2 left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d', transform: `translate3d(0px, 150px, 0)` }}>
        
        <div ref={groundRef} className="absolute transition-colors duration-[3000ms]" style={{ 
          width: '8000px', height: '4000px', 
          left: '-4000px', top: '0',
          background: phase === 0 ? '#2d5a27' : phase === 4 ? '#3a0000' : '#1a1a1a',
          transform: 'rotateX(90deg) translateZ(0px)',
          transformOrigin: 'top center'
        }}>
           <div ref={groundPatternRef} className="w-full h-full transition-opacity duration-[3000ms]" style={{ 
             backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', 
             backgroundSize: '200px 200px', 
             opacity: phase === 0 ? 0.1 : phase === 4 ? 0.3 : 0.05 
           }}></div>
        </div>

        {trees.map(tree => (
          <Tree key={tree.id} x={tree.x} z={tree.z} phase={phase} />
        ))}

        {phase >= 1 && phase < 4 && deadBodies.map(body => (
          <Stickman key={`dead-${body.id}`} initialX={body.x} initialY={0} initialZ={body.z} isRunning={false} initialFacingRight={true} isDead={true} />
        ))}

        {phase === 2 && (
          <Stickman initialX={15000} initialY={0} initialZ={0} isRunning={false} initialFacingRight={false} color="black" showEyes={showEyes} />
        )}

        {phase === 4 && (
          <Ring x={8000} z={0} />
        )}

        <Stickman ref={playerRef} initialX={0} initialY={0} initialZ={0} isRunning={isMoving} initialFacingRight={true} color={phase === 4 ? '#ddd' : 'black'} />

        {phase === 4 && (
          <Stickman ref={enemyRef} initialX={-800} initialY={0} initialZ={0} isRunning={true} initialFacingRight={true} color="red" />
        )}

      </div>

      {isTouch && (
        <div className="absolute bottom-12 left-0 right-0 px-8 flex justify-between z-[100] pointer-events-none select-none">
          <div className="flex gap-4 md:gap-8 pointer-events-auto">
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full border-2 border-white/30 flex items-center justify-center active:bg-white/40 backdrop-blur-sm"
              onTouchStart={() => { keys.current.left = true; }}
              onTouchEnd={() => { keys.current.left = false; }}
              onTouchCancel={() => { keys.current.left = false; }}
            >
              <span className="text-white/70 text-3xl md:text-4xl font-bold">←</span>
            </button>
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full border-2 border-white/30 flex items-center justify-center active:bg-white/40 backdrop-blur-sm"
              onTouchStart={() => { keys.current.right = true; }}
              onTouchEnd={() => { keys.current.right = false; }}
              onTouchCancel={() => { keys.current.right = false; }}
            >
              <span className="text-white/70 text-3xl md:text-4xl font-bold">→</span>
            </button>
          </div>
          <div className="pointer-events-auto">
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full border-2 border-white/30 flex items-center justify-center active:bg-white/40 backdrop-blur-sm"
              onTouchStart={() => { keys.current.up = true; }}
              onTouchEnd={() => { keys.current.up = false; }}
              onTouchCancel={() => { keys.current.up = false; }}
            >
              <span className="text-white/70 text-3xl md:text-4xl font-bold">↑</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
