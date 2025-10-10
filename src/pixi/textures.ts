import { Assets, Texture } from "pixi.js";

// TODO: test if this actually works idk if this will work.
export let bgTileTexture: Texture
export let enemyDummyTexture: Texture
export let tileTexture: Texture
export let towerTexture: Texture
export let pathTexture: Texture


export async function loadTextures() {
  enemyDummyTexture = await Assets.load('ENEMY_dummy.png');
  bgTileTexture = await Assets.load('FIELD_tileset.png')
  tileTexture = await Assets.load('./images/dune.png')
  towerTexture = await Assets.load('./images/Tower_Blue.png')
  pathTexture = await Assets.load('./images/path.png')
}