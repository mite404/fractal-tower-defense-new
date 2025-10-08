import { moveEnemyTowardTarget } from "./enemyMovement";
import { getInputs } from "./input";
import type { CellClick } from "./input";
import type { InputEvent } from "./input";
import { type GameState, createEmptyGrid, initialPlayer, type PathNode } from "./type";

const mockPath: PathNode[] = [
  { id: 'node0', x: 3, y: 0 },
  { id: 'node1', x: 4, y: 3 },
  { id: 'node2', x: 5, y: 3 },
  { id: 'node3', x: 6, y: 3 },
  { id: 'node4', x: 6, y: 4 },
  { id: 'node5', x: 6, y: 5 },
  { id: 'node6', x: 6, y: 6 },
  { id: 'node7', x: 7, y: 6 },
  { id: 'node8', x: 8, y: 6 },
  { id: 'node9', x: 3, y: 9 },
]


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
    speed: 1,
    to: mockPath[1],
    currentPosition: mockPath[0],
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

  // set wave state
  newGameState.wave += 1

  // Safety check before accessing enemy
  if (newGameState.wave % 30 === 0 && newGameState.enemies.length > 0) {
    const enemy = newGameState.enemies[0]
    const enemyCellCol = enemy.currentPosition.x
    const enemyCellRow = enemy.currentPosition.y

    moveEnemyTowardTarget(newGameState.enemies[0], mockPath)
    console.log('Enemy moved to cell:', enemyCellCol, enemyCellRow)
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

function updateGridWithDragNDrop(gamestate: GameState): GameState {
  const newGameState = structuredClone(gamestate)
  newGameState.grid
}
