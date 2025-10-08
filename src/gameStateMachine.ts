import { getInputs } from "./input";
import { type GameState, type Player, type Enemy, createEmptyGrid, initialPlayer } from "./type";
import type { CellClick } from "./input";
import type { InputEvent } from "./input";

export const initialGameState: GameState = {
  player: initialPlayer,
  phase: 'Build',
  grid: createEmptyGrid(),
  wave: 0,
  enemies: [{
    id: 'enemy-1',
    type: 'basic',
    currentHealth: 100,
    maxHealth: 100,
    speed: .2,
    to: { id: 'node1', x: 9, y: 9 },
    currentPosition: { x: 3, y: 3 },
    gold: 20,
  }],
  towers: [],
  pieces: [],
  longestPath: [],
  validPath: false,
  winlose: 'Playing'
}

export function loop(gameState: GameState): GameState {
  //console.log('loop - input gameState.enemies:', gameState.enemies)
  const inputs = getInputs()
  if (inputs.length > 0) {
    console.log("got inputs!", inputs)
  }
  const newGameState = updateGridWithClicks(inputs, gameState)
  //console.log('loop - after updateGridWithClicks, enemies:', newGameState.enemies)

  newGameState.wave += 1

  // Safety check before accessing enemy
  if (newGameState.enemies.length > 0) {
    newGameState.enemies[0].currentPosition.x += 1
  }

  return newGameState
}

function updateGridWithClicks(inputs: InputEvent[], gameState: GameState): GameState {
  const newGameState = structuredClone(gameState)
  for (const event of inputs) {
    if (event.inputType === 'cellClick') {
      const cellClickEvent = event as CellClick
      newGameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type = 'path'
    }
  }

  return newGameState
}

function updateGridWithDragNDrop ( gamestate:GameState):GameState {
  const newGameState = structuredClone(gamestate)
  newGameState.grid
}