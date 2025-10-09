import { Graphics, Container, Application, type PointData } from "pixi.js";
import type { GameState, Piece } from "../type";
import { setupDragAndDrop } from "./dragAndDrop";
import { addInput } from "../input";

let inventory: Container;
let mousePos: PointData;

const CELL = 60;
const BOARD_CELLS = 10;

export function renderInventory(app: Application, gameState: GameState): void {
	if (!inventory) {
		inventory = new Container();
		inventory.label = "inventory";
		app.stage.addChild(inventory);
		app.stage.addEventListener("globalpointermove", (e) => {
			mousePos = e.global;
		});
	} else {
		inventory.removeChildren();
	}
	renderAllPieces(app, gameState, gameState.player.hand);
}

function renderAllPieces(
	app: Application,
	gameState: GameState,
	pieces: Piece[]
): void {
	let endY = 10; // Start at top padding
	let endX = 750; // Start of sidebar
	let maxX = 0;
	for (const piece of pieces) {
		// TODO: we should be REUSING Container() and Graphics and only create
		// new stuff exactly once! See the approach in renderEnemies, which is great
		const MAX_Y = 720; // 12 * 60 = height of grid
		const pieceContainer = new Container();
		pieceContainer.x = endX;
		pieceContainer.y = endY;
		pieceContainer.eventMode = "static";
		pieceContainer.cursor = "pointer";
		pieceContainer.label = `piece-${piece.id}`;
		const piecePaddingY = 10;
		const piecePaddingX = 10;

		// Count non-empty rows for this piece
		const nonEmptyRows = piece.shape.filter((row) =>
			row.some((cell) => cell.type !== "empty")
		).length;

		const pieceHeight = nonEmptyRows * 60;

		// Check if piece would overflow, move to next column if so
		if (endY + pieceHeight > MAX_Y) {
			endX += maxX + 70; // Move to next column (adjust width as needed)
			endY = 10; // Reset to top
		}
		piece.shape.forEach((row, rowidx) => {
			row.forEach((cell, colIdx) => {
				if (cell.type === "empty") return;

				const cellGraphics = new Graphics();

				let color;
				if (cell.type === "tower") {
					color = 0x4a90e2; // Blue
				} else if (cell.type === "path") {
					color = 0x8b6f47; // Brown
				} else {
					color = 0x666666;
				}

				cellGraphics.rect(colIdx * 60, rowidx * 60, 60, 60);
				cellGraphics.fill(color);
				cellGraphics.stroke({ width: 1, color: 0x333333 });

				//console.log("ADDING CELL to piece:", piece.id, "parent before addChild:", pieceContainer.parent?.label);

				pieceContainer.addChild(cellGraphics);
				maxX = Math.max(maxX, colIdx * 60 + piecePaddingX);
			});
		});

		if (gameState.player.piecePickedUp === piece.id) {
			pieceContainer.alpha = 0.7;
			inventory.addChild(pieceContainer);
			const localPositionOfMouse = app.stage.toLocal(mousePos);
			pieceContainer.position.set(
				localPositionOfMouse.x,
				localPositionOfMouse.y
			);
		} else {
			// Add to inventory
			inventory.addChild(pieceContainer);
		}
		pieceContainer.eventMode = "dynamic";
		pieceContainer.cursor = "pointer";

		pieceContainer.on("pointerdown", (e) => {
			console.log("picked up ", piece);
			addInput({
				inputType: "piecePickedUp",
				pieceId: piece.id,
			});
		});
		endY += nonEmptyRows * 60 + piecePaddingY;
	}
}
