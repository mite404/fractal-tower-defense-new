import { useEffect, useRef } from 'react';
import { initGame } from './initGame';
import { useGameStore, gameBoard } from './stores/gameStore';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameBoard = useGameStore((state) => state.gameBoard);

  useEffect(() => {
    if (canvasRef.current) {
      initGame(canvasRef.current, gameBoard)
    }
  }, [gameBoard]);

  return <canvas ref={canvasRef} />
}