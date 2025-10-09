import { startingHand } from "./types/pieces.ts";

export type GameState = {
    player: Player;
    phase: Phase;
    grid: Grid;
    spawn: Cell;
    exit: Cell;
    wave: number;
    enemies: Enemy[];
    towers: Tower[];
    pieces: PlacedPiece[]
    finalPath: Cell[] // this is the path that the enemies are going to take
    selectingFinalPath: boolean; // flag for when player is choosing final path
    validFinalPath: boolean
    winlose: 'Playing' | 'Win' | 'Lose'
}


export type Player = {
    currentHealth: number;
    maxHealth: number;
    armor?: number;
    gold: number;
    library: Piece[] // all pieces in the library
    deck: Piece[]; // all pieces remaining in the deck
    hand: Piece[]; // pieces in the player's hand
}

export type CellType = "empty" | "path" | 'tower' | 'blocked' | 'spawn' |'exit'


export type CellSelectionState = 'selected' | 'highlighted';

export type Cell = {
    x: number | null; //col horizontal
    y: number | null; //row vertical
    // Grid[y][x] refers to the correct cell
    type: CellType;
    selectionState?: CellSelectionState; //used during final path selection to render a path cell's visual changes as highlighted, selected or implicit neither if attribute is not present in the cell
    occupiedBy?: string;
    terrain?: string //potential different effects later
}

export type Grid = Cell[][]

export type Piece = {
    id: string;
    shape: Cell[][];
    isPlaced: boolean;
    rotation: 0 | 90 | 180 | 270;
    flipped: boolean;
    tower: Tower;
}

export type PlacedPiece = {
    id: string;
    pieceId: string; // which initial piece was placed
    position: { x: number; y: number } //top left corner of piece
}

export type Enemy = {
    id: string;
    type: string;
    currentHealth: number;
    maxHealth: number;
    armor?: number;
    speed: number;
    to: Cell | null;  // updated to Cell type to account for pathfinding | updated to null to account for de-spawning enemies 
    currentPosition: { x: number, y: number }
    gold: number;
}

export type PathNode = {
    id: string;
    x: number;
    y: number
}

export type Tower = {
    id: string;
    type: string
    pieceId: string;
    position: { x: number, y: number }
    damage: number
    armorDmg?: number
    range: number
    fireRate: number
    cooldown: number
    targetId?: string
    buy?: number
    sell?: number
}

export type Phase = 'Build' | 'Defense' | 'End' | 'Shop'


export const initialPlayer: Player = {
    currentHealth: 100,
    maxHealth: 100,
    armor: 0,
    gold: 100,
    library: startingHand(),
    deck: startingHand(),
    hand: startingHand()
}

export function createEmptyGrid(): Grid {
    return Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => ({
            x,
            y,
            type: 'empty' as CellType
        }))
    );
}

export function createSpawn(x: number, y: number): Cell {
    const spawn: Cell = {
        x,
        y,
        type: 'spawn',
    }
    return spawn;
}

export function createExit(x: number, y: number): Cell {
    const spawn: Cell = {
        x,
        y,
        type: 'exit',
    }
    return spawn;
}

export const initialGameState: GameState = {
    player: initialPlayer,
    phase: 'Build',
    grid: createEmptyGrid(),
    spawn: createSpawn(0, 0),
    exit: createExit(9, 9),
    wave: 1,
    enemies: [],
    towers: [],
    pieces: [],
    winlose: 'Playing',
    validFinalPath: false,
    finalPath: [],
    selectingFinalPath: false,
}
