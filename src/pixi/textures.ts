import { Assets, Texture } from "pixi.js";

// TODO: test if this actually works idk if this will work.
export let enemyDummyTexture: Texture

export async function loadTextures() {
  enemyDummyTexture = await Assets.load('ENEMY_dummy.png');
}