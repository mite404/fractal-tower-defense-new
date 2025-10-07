import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import type { Cell, GameState, Grid } from '../type';
import type { Enemy } from '../type';





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

  return app
}


// TODO: I am suspicious of initializing the application on every render.
// PROBABLY I should have some initialization which occurs separately from every render.
export async function render(app: Application, gameState: GameState): Promise<Application> {

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

  const grid = gameState.grid
  // Create and add a container to the stage
  const container = new Container();
  app.stage.addChild(container);
  // Render a grid of 10x10 tiles for our grid
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const square = new Graphics()
        .rect((rowIndex * 60), (colIndex * 60), 60, 60)
        .fill(0x4C)
        .stroke(0x00ff00)
      container.addChild(square)
    })
  })

  const row = 3
  const col = 5

  // Load the enemy texture
  // TODO: load the texture outside
  const texture = await Assets.load('ENEMY_dummy.png');
  const enemyDummy = new Sprite(texture)
  enemyDummy.x = col * 60
  enemyDummy.y = row * 60
  container.addChild(enemyDummy)

  return app

}