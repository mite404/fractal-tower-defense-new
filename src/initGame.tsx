import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';
import type { Cell } from './types/gameBoard.types';

export async function initGame(canvas: HTMLCanvasElement, gameBoard: Cell[][]): Promise<Application> {
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

  // Create and add a container to the stage
  const container = new Container();
  app.stage.addChild(container);

  // Render a grid of 10x10 tiles for our gameBoard
  gameBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const square = new Graphics()
        .rect((rowIndex * 40), (colIndex * 40), 40, 40)
        .fill(0x4C)
        .stroke(0x00ff00)
      container.addChild(square)
    })
  })
  // Load the bunny texture
  // const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  // Create a 10x10 grid of bunnies in the container
  // for (let i = 0; i < 100; i++) {
  //   const bunny = new Sprite(texture);

  //   // Set the x position of the bunny sprite so that each row has 5 bunnies spaced 40 pixels apart.
  //   // (i % 5) gives the column index (0 to 4), and multiplying by 40 spaces them horizontally.
  //   bunny.x = (i % 10) * 40;
  //   bunny.y = Math.floor(i / 10) * 40;
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
