import { loop } from "../gameStateMachine";
import { consumeInputs } from "../input";
import { initApp, render } from "../pixi/renderer";
import { initialGameState, type GameState } from "../type";
import { testFinalPathGameStates } from "../pathfinding/testFinalPathsRendering";

let gameState: GameState = initialGameState;
//For hardcoded testing
//gameState = structuredClone(testFinalPathGameStates[4]);

export async function init(canvas: HTMLCanvasElement) {
	console.log("setting up my game in Phase", gameState.phase);
	// init renderer
	initApp(canvas);
	// setup loop
	
	setInterval(() => {
		// 60 times per second (every 16 ms):
		// 1. collect inputs
		const inputs = consumeInputs();
		// 2. update game state
		gameState = loop(inputs, gameState);
		// 3. render game state
		render(gameState);
	}, 16);
}
