import {
	Assets,
	BitmapFont,
	BitmapText,
	Graphics,
	path,
	type Application,
} from "pixi.js";
import type { GameState } from "../type";
import { addInput } from "../input";

let text: BitmapText | null = null;
let pathText: BitmapText | null = null;
export async function initUI(app: Application): Promise<void> {
	await Assets.load(
		"https://pixijs.com/assets/webfont-loader/PixelifySans.ttf"
	);

	BitmapFont.install({
		name: "Custom",
		style: {
			fontFamily: "PixelifySans",
			fontSize: 20,
			fill: "#ffffff",
		},
		chars: [
			["a", "z"],
			["A", "Z"],
			["0", "9"],
		],
		resolution: 2,
		padding: 4,
		textureStyle: {
			scaleMode: "nearest",
		},
	});

	text = new BitmapText({
		text: "Switch Phases",
		style: {
			fontFamily: "Custom",
			fontSize: 20,
			fill: "white",
			align: "center",
		},
		scale: 2,
		position: { x: 50, y: 700 },
	});

	pathText = new BitmapText({
		text: "Has Valid Path",
		style: {
			fontFamily: "Custom",
			fontSize: 20,
			fill: "white",
			align: "center",
		},
		scale: 2,
		position: { x: 50, y: 650 },
	});
	app.stage.addChild(pathText);

	const textRect = new Graphics();

	textRect.rect(text.x, text.y, text.width, text.height);
	textRect.fill("#762222ff");
	textRect.stroke({ width: 2, color: "#FFD600" });
	textRect.eventMode = "static";
	//app.stage.addChild(textRect);
	//app.stage.addChild(text);

	textRect.on("pointertap", (e) => {
		console.log(e, "button clicked");
		addInput({ inputType: "buttonclick" });
	});
}

export function updateUI(gameState: GameState) {
	if (!text || !pathText) return;
	text.text = gameState.phase;
	pathText.visible = gameState.finalPath != null;
}
