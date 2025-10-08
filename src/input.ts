
export type InputEvent = Spacebar | CellClick

export type Spacebar = {}


export type CellClick = {
  inputType: 'cellClick'
  cellX: number,
  cellY: number,
}
let inputQueue: InputEvent[] = []
export function addInput(input: InputEvent) {
  inputQueue.push(input)
}

export function getInputs(): InputEvent[] {
  const result = [...inputQueue]
  inputQueue = []
  return result
}