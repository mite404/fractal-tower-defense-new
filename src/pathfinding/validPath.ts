import type { Cell, Grid } from "../type.ts";
import { createTestGrid, getNeighbors, } from "./helperPath.ts";

export function hasValidPath(grid: Grid, entrance: Cell, exit: Cell): boolean {

	// DEBUGGING
	// console.log("\n Validating: ");
	// printGrid(grid, entrance, exit);

	if (
		entrance.x == null ||
		entrance.y == null ||
		exit.x == null ||
		exit.y == null
	) {
		// DEBUGGING
		//console.error("Entrance or exit has null coordinates.");
		return false;
	}

	if (!grid[entrance.y] || !grid[entrance.y][entrance.x]) {
		//console.error("Entrance out of grid bounds.");
		return false;
	}
	if (!grid[exit.y] || !grid[exit.y][exit.x]) {
		//console.error("Exit out of grid bounds.");
		return false;
	}

	const entranceCell = grid[entrance.y][entrance.x];
	const exitCell = grid[exit.y][exit.x];

	if (entranceCell.type !== "path" || exitCell.type !== "path") {
		//console.log("Entrance or exit is not a path cell.");
		return false;
	}

	const visited = new Set<string>(); //string that can be compared for uniqueness
	const path: Cell[] = []; // track current path for debugging

	function dfs(node: Cell): boolean {
		if (node.x == null || node.y == null) return false;

		// DEBUGGING
		// console.log(
		// 	`Visiting: (${node.x},${node.y}) | Current path: ${path
		// 		.map((c) => `(${c.x},${c.y})`)
		// 		.join(" -> ")}`
		// );

		path.push(node);
		visited.add(`${node.x},${node.y}`);

		// FIXME DEBUGGING Prints logs the first valid path
		if (node.x === exit.x && node.y === exit.y) {
			const validPathGrid = createTestGrid();
			for (const coord of path) {
				if (coord.x == null || coord.y == null) {
					console.warn("skipping invalid coord:", coord);
					continue;
				}
				validPathGrid[coord.y][coord.x] = { ...coord, type: "path" };
			}
			
			// DEBUGGING
			// console.log("exit reached! valid path found:");
			// //console.log(path.map((c) => `(${c.x},${c.y})`).join(" -> "));
			// printGrid(validPathGrid, entrance, exit);

			return true;
		}

		for (const neighbor of getNeighbors(grid, node)) {
			if (
				neighbor.type === "path" &&
				!visited.has(`${neighbor.x},${neighbor.y}`)
			) {
				if (dfs(neighbor)) return true; //recurse through neighbors looking for exit
			}
		}

		path.pop();
		return false;
	}

	return dfs(entranceCell);
}

/*
DFS Pathfinding :

- The grid is treated as a graph where each 'path' cell is a node.
- Edges exist between nodes that are directly adjacent (up/down/left/right).
- The search starts at the entrance cell (root) and aims to reach the exit cell (goal).

Algorithm (Depth-First Search with Backtracking):
1. Start at the entrance and mark the current cell as visited.
2. Recursively explore each unvisited neighboring 'path' cell.
3. If a neighbor is the exit, return success (valid path found).
4. If a dead end is reached (all neighbors visited or not a 'path'), backtrack to the previous cell.
5. If the recursion fully unwinds to the entrance without finding the exit, no valid path exists.

Notes:
- Visited tracking prevents cycles and infinite loops.
- DFS explores one path deeply before checking other branches.
- This setup also naturally supports extension to finding the longest path later via backtracking.
*/
