import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import { createEmptyGrid, type Cell, type GameState, type Grid } from '../type';
import type { Enemy } from '../type';
import { addInput } from '../input';



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

  dummyTexture = await Assets.load('ENEMY_dummy.png');


  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Create and add a container to the stage
  const container = new Container();
  app.stage.addChild(container);
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
      container.addChild(square)
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
  // render hand
  // render pieces
  // render towers
  // render enemies
  // render projectiles
  // 


  // const enemySheet: Enemy = {}
  // const enemy = new Graphics().rect(0, 0, 60, 60).fill(0xFF0000)
  // enemy.x = col * 60
  // enemy.y = row * 60
  // container.addChild(enemy)


  // container.addChild(enemyDummy)
  // Load an individual asset in the background
  // Assets.backgroundLoad({ alias: 'enemyDummy', src: 'assets/ENEMY_dummy.png' });


  // app.loader.add("enemyDummy", "assets/ENEMY_dummy.png")

  // Load the bunny texture
  // const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  // Create a 10x10 grid of bunnies in the container
  // for (let i = 0; i < 100; i++) {
  //   const bunny = new Sprite(texture);

  //   // Set the x position of the bunny sprite so that each row has 5 bunnies spaced 60 pixels apart.
  //   // (i % 5) gives the column index (0 to 4), and multiplying by 60 spaces them horizontally.
  //   bunny.x = (i % 10) * 60;
  //   bunny.y = Math.floor(i / 10) * 60;
  //   container.addChild(bunny);
  // }





  // // Move the container to the center
  // container.x = app.screen.width / 2;
  // container.y = app.screen.height / 2;

  // // Center the bunny sprites in local container coordinates
  // container.pivot.x = container.width / 2;
  // container.pivot.y = container.height / 2;

  // // Listen for animate update
  // app.ticker.add((time) => {
  //   // Continuously rotate the container!
  //   // * use delta to create frame-independent transform *
  //   container.rotation -= 0.01 * time.deltaTime;
  // });

  // Return the app instance to React can clean it up later
  return app
};


export function renderBoard(app: Application, gameState: GameState): Application {
  gameState.grid.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const square = displayGrid[rowIdx][colIdx]
      if (cell.type === 'path') {
        console.log("coloring as a path ", cell)
        square.tint = 0xFF0000
      }
    })
  })
  return app
}