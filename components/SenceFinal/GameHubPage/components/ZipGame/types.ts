// =====================================================
// ZIP GAME - TYPE DEFINITIONS
// =====================================================

/**
 * Cell types in the Zip puzzle grid
 */
export type CellType = 'numbered' | 'empty' | 'blocked';

/**
 * Movement directions (no diagonals allowed)
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Grid position
 */
export interface Position {
    row: number;
    col: number;
}

/**
 * Single cell in the puzzle grid
 */
export interface ZipCell {
    type: CellType;
    number?: number; // The sequence number (only for 'numbered' type)
}

/**
 * Puzzle definition (can be loaded from JSON)
 */
export interface ZipPuzzle {
    daily_id: string;
    size: number;
    cells: ZipCell[][];
    totalNumbers: number; // Total numbered cells to visit
}

/**
 * Move validation result
 */
export interface MoveValidation {
    valid: boolean;
    reason?: 'not_adjacent' | 'already_visited' | 'blocked' | 'wrong_sequence' | 'out_of_bounds';
}
