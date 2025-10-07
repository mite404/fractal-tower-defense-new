import { startingHand } from "./types/pieces";

export type GameState = {
    player: Player;
    phase: Phase;
    grid: Grid;
    wave: number;
    enemies: Enemy[];
    towers: Tower[];
    pieces: PlacedPiece[]
    longestPath: PathNode[] // this is the path that the enemies are going to take
    validPath: boolean
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

export type Cell = {
    x: number | null;
    y: number | null;
    type: CellType;
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
    to: PathNode;
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

export const initialGameState: GameState = {
    player: initialPlayer,
    phase: 'Build',
    grid: createEmptyGrid(),
    wave: 1,
    enemies: [],
    towers: [],
    pieces: [],
    winlose: 'Playing',
    validPath: false,
    longestPath: []
}
