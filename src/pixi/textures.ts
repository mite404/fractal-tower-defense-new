import { Assets } from "pixi.js";
import { render } from "./renderer";
import type { Enemy } from "../type";

// TODO: test if this actually works idk if this will work.
export let enemyDummyTexture: Enemy

export async function loadTextures() {
  enemyDummyTexture = await Assets.load('ENEMY_dummy.png');
}