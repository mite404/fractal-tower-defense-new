import { Assets, Texture } from "pixi.js";

// TODO: test if this actually works idk if this will work.
export let bgTileTexture: Texture
export let enemyDummyTexture: Texture
export let tower01Texture: Texture


export async function loadTextures() {
  enemyDummyTexture = await Assets.load('ENEMY_dummy.png');
  bgTileTexture = await Assets.load('FIELD_tileset.png')
  tower01Texture = await Assets.load('TOWER_01.png')
}