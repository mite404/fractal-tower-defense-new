import { useEffect, useRef } from 'react'
import { initApp, render, updateEnemies } from './pixi/renderer'
import { loop, initialGameState } from './gameStateMachine'
import type { Application } from 'pixi.js'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<Application>()
  const gameStateRef = useRef(initialGameState)
  const rafId = useRef<number>()


  useEffect(() => {
    if (!canvasRef.current) return

    let running = true
    let lastTime = performance.now()

    async function setup() {

      const t0 = performance.now();
      const app = await initApp(canvasRef.current!)
      console.log('init', performance.now()-t0);

      render(app, gameStateRef.current)
      console.log('render complete', performance.now()-t0);
      appRef.current = app

      // start manual loop
      const tick = (time: number) => {
        if (!running) return
        const dt = time - lastTime
        lastTime = time

        // update loop
        gameStateRef.current = loop(app, gameStateRef.current)
        updateEnemies(app,gameStateRef.current)


        rafId.current = requestAnimationFrame(tick)
      }
      rafId.current = requestAnimationFrame(tick)
    }

    setup()

    return () => {
      running = false
      if (rafId.current) cancelAnimationFrame(rafId.current)
      appRef.current?.destroy(true)
    }
  }, [])

  return <canvas ref={canvasRef} />
}
