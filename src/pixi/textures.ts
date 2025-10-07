import { Assets } from "pixi.js";
import { render } from "./renderer";

// TODO: test if this actually works idk if this will work.
export const enemyDummy = await Assets.load('ENEMY_dummy.png');

function loadTextures() {
  await Assets.load('ENEMY_dummy.png');
  render()
}