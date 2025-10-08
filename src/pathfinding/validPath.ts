import type { Cell, Grid } from "../type.ts";
import { createTestGrid, getNeighbors,  } from "./helperPath.ts";

/**
 * Shared recursive DFS helper used by both hasValidPath and hasPathToExit.
 */
function dfsReachable(
	grid: Grid,
	current: Cell,
	target: Cell,
	visited: Set<string>,
	path: Cell[] = []
): boolean {
	if (current.x == null || current.y == null) return false;

	// --- DEBUGGING ---
	// console.log(
	// 	`Visiting: (${current.x},${current.y}) | Path so far: ${path
	// 		.map((c) => `(${c.x},${c.y})`)
	// 		.join(" -> ")}`
	// );

	visited.add(`${current.x},${current.y}`);
	path.push(current);

	if (current.x === target.x && current.y === target.y) {
		// Found a path — optional: visualize it
		const validPathGrid = createTestGrid();
		for (const coord of path) {
			if (coord.x == null || coord.y == null) continue;
			validPathGrid[coord.y][coord.x] = { ...coord, type: "path" };
		}

		//--- DEBUGGING ---
		// console.log("Reached target! Path found:");
		// printGrid(validPathGrid, path[0], target);

		return true;
	}

	for (const neighbor of getNeighbors(grid, current)) {
		if (neighbor.type !== "path") continue;
		const key = `${neighbor.x},${neighbor.y}`;
		if (visited.has(key)) continue;

		if (dfsReachable(grid, neighbor, target, visited, path)) return true;
	}

	path.pop();
	return false;
}

/**
 * Used to check if there's a complete valid path
 * from entrance to exit — used for entering final path selection.
 */
export function hasValidPath(grid: Grid, entrance: Cell, exit: Cell): boolean {
	if (!entrance || !exit) return false;

	// --- DEBUGGING ---
	// console.log("\nChecking hasValidPath():");
	// printGrid(grid, entrance, exit);

	const visited = new Set<string>();
	return dfsReachable(grid, entrance, exit, visited);
}

/**
 * Used for dynamic checks, e.g., while editing or deselecting cells,
 * to see if a given cell can still reach the exit.
 */
export function hasPathToExit(grid: Grid, start: Cell, exit: Cell): boolean {
	if (!start || !exit) return false;

	// --- DEBUGGING ---
	// console.log("\nChecking hasPathToExit():");
	// printGrid(grid, start, exit);

	const visited = new Set<string>();
	return dfsReachable(grid, start, exit, visited);
}
