import { useEffect, useRef } from 'react';
import { initApp, initGame, render } from './pixi/renderer'
import { initialGameState } from './type';
import type { Application } from 'pixi.js';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application>(null)
  // const gameBoard = useGameStore((state) => state.gameBoard);

  const gameState = initialGameState

  async function setupPixi(canvas: HTMLCanvasElement) {
    if (!appRef.current) {
      const app = await initApp(canvas)
      appRef.current = app
    }
  }

  // SETUP the app
  useEffect(() => {
    if (canvasRef.current) {
      setupPixi(canvasRef.current)
    }

  }, [canvasRef])

  // RE-RENDERS the app, whenever state changes
  useEffect(() => {
    if (canvasRef.current && appRef.current) {
      render(appRef.current, gameState)
    }
  }, [gameState]);

  return <canvas ref={canvasRef} />
}