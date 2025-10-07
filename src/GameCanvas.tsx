import { useEffect, useRef, useState } from 'react';
import { initApp, initGame, render } from './pixi/renderer'
import { initialGameState } from './type';
import type { Application } from 'pixi.js';
import { loop } from './gameStateMachine';

let setup = false
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application>(null)
  const [gameState, setGameState] = useState(initialGameState)

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

  useEffect(() => {
    if (setup) {
      return
    }
    setup = true
    console.log("setting up game loop")
    setInterval(() => {
      setGameState((prev) => {
        const updated = loop(prev)
        return updated
      })
    }, 16)
  }, [])

  // RE-RENDERS the app, whenever state changes
  useEffect(() => {
    if (canvasRef.current && appRef.current) {
      render(appRef.current, gameState)
    }
  }, [gameState]);

  return <canvas ref={canvasRef} />
}