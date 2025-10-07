import type { Grid, CellType } from "../type.ts";
import { printGrid } from "./helperPath.ts";


export function hasValidPath(grid : Grid) {
	console.log("Validating Path In:")
	printGrid(grid);
}