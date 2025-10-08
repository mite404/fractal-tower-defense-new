import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import { createEmptyGrid, type Cell, type GameState, type Grid } from '../type';
import { addInput } from '../input';
import { enemyDummyTexture } from './textures';
import { loadTextures } from "./textures.ts"
import { renderInventory } from './inventoryRender.tsx';


let displayGrid: Graphics[][]
let displayEnemy: Container
let enemySprites = new Map<string, Sprite>()

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
  displayEnemy = new Container()

  app.stage.addChild(boardContainer);
  app.stage.addChild(displayEnemy)


  displayGrid = createEmptyGrid().map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const square = new Graphics()
        .rect((colIndex * 60), (rowIndex * 60), 60, 60)
        .fill(0xAAAAAA)
        .stroke(0x00ff00)
      square.eventMode = 'static';

      square.on('pointerdown', (event) => {
        // do we want to standarize this to the 2D array defaults?? e.g. 
        // cellX: colIndex  // column = x
        // cellY: rowIndex  // row = y
        addInput({ inputType: "cellClick", cellX: rowIndex, cellY: colIndex })
        console.log("adding to input queue")
      });
      boardContainer.addChild(square)
      return square
    })
  })

  return app
}

// TODO: I am suspicious of initializing the application on every render.
// PROBABLY I should have some initialization which occurs separately from every render.
export function render(app: Application, gameState: GameState) {
  // render the board
  renderBoard(app, gameState)

  renderInventory(app, gameState)
  // TODO render piece sidebar

  // render enemies
  renderEnemies(app, gameState)

  // render projectiles

  return app
};

function renderBoard(app: Application, gameState: GameState): Application {
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

function renderEnemies(app: Application, gameState: GameState) {
  //console.log('renderEnemies called, enemies:', gameState.enemies)
  //console.log('enemySprites Map size:', enemySprites.size)

  gameState.enemies.forEach(enemy => {
    //console.log('Processing enemy:', enemy.id)

    if (!enemySprites.has(enemy.id)) {
      //console.log('Creating new sprite for:', enemy.id)
      const sprite = new Sprite(enemyDummyTexture)
      enemySprites.set(enemy.id, sprite)
      displayEnemy.addChild(sprite)
    }

    const sprite = enemySprites.get(enemy.id)!
    //console.log('Setting sprite position:', enemy.currentPosition)
    sprite.x = enemy.currentPosition.x * 60
    sprite.y = enemy.currentPosition.y * 60
  })

  return app
}