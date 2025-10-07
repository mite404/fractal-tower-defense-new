import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import { createEmptyGrid, type Cell, type GameState, type Grid } from '../type';
import { addInput } from '../input';
import { enemyDummyTexture } from './textures';
import { loadTextures } from "./textures.ts"


let dummyTexture
let displayGrid: Graphics[][]

export async function initApp(canvas: HTMLCanvasElement): Promise<Application> {
  // TODO: pull out any init stuff from the render function and put it in here.

  // also: call this function over in the GameCanvas whenever it mounts (via useEffect)
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: '#4C4C4C',
    canvas,
    resizeTo: window
  });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  await loadTextures()

  // Create and add a container to the stage
  const boardContainer = new Container();

  app.stage.addChild(boardContainer);
  displayGrid = createEmptyGrid().map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const square = new Graphics()
        .rect((colIndex * 60), (rowIndex * 60), 60, 60)
        .fill(0xAAAAAA)
        .stroke(0x00ff00)
      square.eventMode = 'static';

      square.on('pointerdown', (event) => {
        addInput({ inputType: "cellClick", cellX: rowIndex, cellY: colIndex })
        console.log("adding to input queue")
      });
      boardContainer.addChild(square)
      return square
    })
  })

  app.stage.addChild(boardContainer)
  console.log('enemyDummyTexture:', enemyDummyTexture)
  const testEnemy = new Sprite(enemyDummyTexture)
  testEnemy.x = 60 * 3
  testEnemy.y = 60 * 3
  const enemyContainer = new Container
  enemyContainer.addChild(testEnemy)
  app.stage.addChild(enemyContainer)

  return app
}

// TODO: I am suspicious of initializing the application on every render.
// PROBABLY I should have some initialization which occurs separately from every render.
export function render(app: Application, gameState: GameState) {

  // render the board
  renderBoard(app, gameState)
  // TODO render piece sidebar

  // render enemies
  // render projectiles
  // 


  return app
};


export function renderBoard(app: Application, gameState: GameState): Application {
  gameState.grid.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const square = displayGrid[rowIdx][colIdx]
      if (cell.type === 'path') {
        square.tint = 0xFF0000
      }
    })
  })
  return app
}