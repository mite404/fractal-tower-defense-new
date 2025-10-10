// finalPathLogic.ts
import type { GameState, Grid, Cell } from "../type.ts";
import { getNeighbors } from "./helperPath.ts";
import { hasPathToExit } from "./validPath.ts";

// Important functions to outside systems:
// startFinalPathSelection(state: GameState): GameState | null

// finalPathCellClick(state: GameState, cell: Cell): GameState | null

// submitFinalPath(state: GameState): GameState | null

// FLOW
// [startFinalPathSelection]
//      ↓
//  Player clicks highlighted cell
//      ↓
// [finalPathCellClick] → [selectCellFinalPath]
//      ↓
//  Auto-advance or highlight next options
//      ↓
//  Player backtracks?
//      ↓
// [finalPathCellClick] → [deselectCellFinalPath]
//      ↓
//  Continue until exit reached
//      ↓
// [submitFinalPath]
//      ↓
//  Final path locked and grid cleaned

// cloning helpers
function cloneCell(c: Cell): Cell {
	return structuredClone(c);
}
function cloneGrid(grid: Grid): Grid {
	return grid.map((row) => row.map(cloneCell));
}
function coordKey(c: Cell) {
	return `${c.x},${c.y}`;
}

function updateHighlights(state: GameState): GameState {
	const newGrid = cloneGrid(state.grid);
	const newState: GameState = { ...state, grid: newGrid };

	// clear highlights (but not selected)
	for (const row of newGrid) {
		for (const c of row) {
			if (c.selectionState && c.selectionState !== "selected") {
				delete c.selectionState;
			}
		}
	}

	const last = newState.finalPath.at(-1);
	if (!last) return newState;
	const lastCell = newGrid[last.y!][last.x!];
	const selectedSet = new Set(newState.finalPath.map(coordKey));

	const neighbors = getNeighbors(newGrid, lastCell).filter(
		(n) =>
			(n.type === "path" || n.type === "exit") &&
			!selectedSet.has(coordKey(n))
	);

	for (const n of neighbors) {
		if (hasPathToExit(newGrid, n, newState.exit)) {
			n.selectionState = "highlighted";
		}
	}

	return newState;
}

// Initializes path-selection mode and highlights the spawn’s valid neighbors.
export function startFinalPathSelection(state: GameState): GameState | null {
	if (state.selectingFinalPath) return null;

	const newGrid = cloneGrid(state.grid);
	const newState: GameState = {
		...state,
		grid: newGrid,
		finalPath: [],
		selectingFinalPath: true,
		validFinalPath: false,
	};

	const spawn = newState.spawn;
	if (spawn.x == null || spawn.y == null) return null;
	const spawnCell = newGrid[spawn.y][spawn.x];
	if (!(spawnCell.type === "spawn" || spawnCell.type === "path")) return null;

	spawnCell.selectionState = "selected";
	newState.finalPath = [{ ...spawnCell }];

	return updateHighlights(newState);
}

export function selectCellFinalPath(
	state: GameState,
	cell: Cell
): GameState | null {
	if (!state.selectingFinalPath) return null;
	if (cell.selectionState !== "highlighted") return null;

	const grid = cloneGrid(state.grid);
	const newState: GameState = {
		...state,
		grid,
		finalPath: [...state.finalPath],
	};

	const target = grid[cell.y!][cell.x!];
	target.selectionState = "selected";
	newState.finalPath.push({ ...target });

	// auto recurse while exactly one neighbor remains valid
	while (true) {
		const last = newState.finalPath.at(-1);
		if (!last) break;
		const lastCell = grid[last.y!][last.x!];

		if (lastCell.x === newState.exit.x && lastCell.y === newState.exit.y) {
			newState.validFinalPath = true;
			break;
		}

		const selectedSet = new Set(newState.finalPath.map(coordKey));
		const possible = getNeighbors(grid, lastCell)
			.filter(
				(n) =>
					(n.type === "path" || n.type === "exit") &&
					!selectedSet.has(coordKey(n))
			)
			.filter((n) => hasPathToExit(grid, n, newState.exit));

		if (possible.length === 0) {
			break; // dead end — let player backtrack
		} else if (possible.length === 1) {
			// auto-continue along a single valid branch
			const next = possible[0];
			next.selectionState = "selected";
			newState.finalPath.push({ ...next });
			continue;
		} else {
			break; // multiple choices — highlight and stop
		}
	}

	const after = updateHighlights(newState);
	const last = after.finalPath.at(-1);
	after.validFinalPath =
		!!last && last.x === after.exit.x && last.y === after.exit.y;

	return after;
}

export function deselectCellFinalPath(
	state: GameState,
	cell: Cell
): GameState | null {
	if (!state.selectingFinalPath) return null;
	if (cell.selectionState !== "selected") return null;

	const grid = cloneGrid(state.grid);
	const newState: GameState = {
		...state,
		grid,
		finalPath: [...state.finalPath],
		validFinalPath: false,
	};

	const key = coordKey(cell);
	const idx = newState.finalPath.findIndex((n) => coordKey(n) === key);
	if (idx === -1) return null;

	const last = newState.finalPath.at(-1);
	if (!last) return null;
	//const lastCell = grid[last.y!][last.x!];

	// check if current cell is part of a single-path segment
	const selectedSet = new Set(newState.finalPath.map(coordKey));
	const neighbors = getNeighbors(grid, cell)
		.filter((n) => n.type === "path" || n.type === "exit")
		.filter(
			(n) =>
				!selectedSet.has(coordKey(n)) &&
				hasPathToExit(grid, n, newState.exit)
		);

	// if there was no branching (only one valid neighbor), do nothing
	if (neighbors.length === 1 && idx === 0) {
		console.log("Cannot deselect — only one continuous path exists.");
		return null;
	}

	// otherwise remove from deselected cell onward
	const removed = newState.finalPath.splice(idx);
	for (const r of removed) {
		if (r.x == null || r.y == null) continue;
		const g = grid[r.y][r.x];
		if (g) delete g.selectionState;
	}

	return updateHighlights(newState);
}

export function finalPathCellClick(
	state: GameState,
	cell: Cell
): GameState | null {
	if (!state.selectingFinalPath) return null;

	if (cell.selectionState === "highlighted") {
		return selectCellFinalPath(state, cell);
	}
	if (cell.selectionState === "selected") {
		return deselectCellFinalPath(state, cell);
	}

	console.log("Clicked non-actionable cell", cell);
	return null;
}

export function submitFinalPath(state: GameState): GameState | null {
	if (!state.validFinalPath || !state.selectingFinalPath) return null;

	const grid = cloneGrid(state.grid);
	const kept = new Set(state.finalPath.map(coordKey));

	for (const row of grid) {
		for (const c of row) {
			const key = coordKey(c);
			if ((c.type === "path" || c.type === "spawn") && !kept.has(key)) {
				c.type = "empty";
				delete c.selectionState;
			} else {
				delete c.selectionState;
			}
		}
	}

	return {
		...state,
		grid,
		selectingFinalPath: false,
		phase: "Defense",
		validFinalPath: true,
	};
}
