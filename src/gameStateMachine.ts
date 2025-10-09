import type { Application } from "pixi.js";
import { moveEnemyTowardTarget } from "./enemyMovement";
import { getInputs } from "./input";
import type { CellClick, InputEvent } from "./input";
import { renderBoard } from "./pixi/renderer";
import {
  type GameState,
  createEmptyGrid,
  initialPlayer,
  type Cell,
} from "./type";
import { defaultTower } from "./types/pieces";

// export type Cell = {
//   x: number | null; //col horizontal
//   y: number | null; //row vertical
//   // Grid[y][x] refers to the correct cell
//   type: CellType;
//   selectionState?: CellSelectionState; //used during final path selection
//   occupiedBy?: string;
//   terrain?: string //potential different effects later
// }

// this will need to be translated somehow to work w/ path logic of Type Cell
const mockPath: Cell[] = [
  { type: "path", x: 3, y: 0 },
  { type: "path", x: 4, y: 3 },
  { type: "path", x: 5, y: 3 },
  { type: "path", x: 6, y: 4 },
  { type: "path", x: 6, y: 5 },
  { type: "path", x: 6, y: 3 },
  { type: "path", x: 6, y: 6 },
  { type: "path", x: 7, y: 6 },
  { type: "path", x: 8, y: 6 },
  { type: "path", x: 3, y: 9 },
];

export const initialGameState: GameState = {
  player: initialPlayer,
  phase: "Build",
  grid: createEmptyGrid(),
  wave: 0,
  enemies: [
    {
      id: "enemy-1",
      type: "basic",
      currentHealth: 100,
      maxHealth: 100,
      speed: , // cells per second
      to: mockPath[1],
      currentPosition: mockPath[0],
      gold: 20,
    },
  ],
  towers: [],
  pieces: [],
  longestPath: [],
  validPath: false,
  winlose: "Playing",
  time: 0,
};

export function loop(app: Application, gameState: GameState): GameState {
  //console.log('loop - input gameState.enemies:', gameState.enemies)
  const inputs = getInputs()

  if (inputs.length > 0) {
    console.log("got inputs!", inputs)
  }
 
  updateGridWithClicks(app, inputs, gameState)
  //console.log('loop - after updateGridWithClicks, enemies:', newGameState.enemies)

  // set wave state
  gameState.wave += 1

  // Safety check before accessing enemy
  if (gameState.wave % 30 === 0 && gameState.enemies.length > 0) {
    const enemy = gameState.enemies[0]
    const enemyCellCol = enemy.currentPosition.x
    const enemyCellRow = enemy.currentPosition.y

    moveEnemyTowardTarget(gameState.enemies[0], mockPath)
    //console.log('Enemy moved to cell:', enemyCellCol, enemyCellRow)
  }

  return gameState
}

function updateGridWithClicks(app,inputs: InputEvent[], gameState: GameState):void  {
  for (const event of inputs) {
    if (event.inputType === 'cellClick') {
      const cellClickEvent = event as CellClick
      if (gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type == 'path') {gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type = 'tower'
      const newTower = defaultTower(`test-${Math.random()*1000}`)
      newTower.position = {x:cellClickEvent.cellX, y:cellClickEvent.cellY}
      gameState.towers.push(newTower)
        console.log('create tower')
      } else
      if (gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type == 'empty') {gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type = 'path'
      console.log('create path')
      } else 
      if (gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type == 'tower') {gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type = 'empty'
      console.log('reset to empty')
      }
    }
  }
  renderBoard(app,gameState)
}