import { useEffect, useRef } from 'react'
import { init } from './gameEngine/coordinator'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    init(canvasRef.current) 
  }, [canvasRef])

  return <canvas ref={canvasRef} />
}
