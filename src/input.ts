export type InputEvent = PiecePickedUp | CellClick | MouseUp;

export type PiecePickedUp = { inputType: "piecePickedUp"; pieceId: string };
export type CellClick = {
	inputType: "cellClick";
	cellX: number;
	cellY: number;
};
export type MouseUp = {
	inputType: "mouseup";
	gridCoordinates: { x: number; y: number } | null;
};

let inputQueue: InputEvent[] = [];
export function addInput(input: InputEvent) {
	inputQueue.push(input);
}

export function consumeInputs(): InputEvent[] {
	const result = [...inputQueue];
	inputQueue = [];
	return result;
}
