// =====================================================
// ZIP GAME - UTILITY FUNCTIONS
// =====================================================

import { Position, ZipPuzzle, ZipCell, MoveValidation } from './types';

/**
 * Check if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
    return a.row === b.row && a.col === b.col;
}

/**
 * Check if two positions are adjacent (up/down/left/right only, no diagonals)
 */
export function isAdjacent(a: Position, b: Position): boolean {
    const rowDiff = Math.abs(a.row - b.row);
    const colDiff = Math.abs(a.col - b.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Check if a position is within the grid bounds
 */
export function isInBounds(pos: Position, size: number): boolean {
    return pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size;
}

/**
 * Get cell at position
 */
export function getCell(puzzle: ZipPuzzle, pos: Position): ZipCell | null {
    if (!isInBounds(pos, puzzle.size)) return null;
    return puzzle.cells[pos.row][pos.col];
}

/**
 * Check if a cell is passable (empty or numbered)
 */
export function isPassable(cell: ZipCell | null): boolean {
    if (!cell) return false;
    return cell.type === 'empty' || cell.type === 'numbered';
}

/**
 * Validate if a move to the next position is valid
 * Rules:
 * - Must be adjacent to last position in path
 * - Cannot revisit cells
 * - Cannot enter blocked cells
 * - If the cell is numbered, it must be the next expected number
 */
export function validateMove(
    puzzle: ZipPuzzle,
    path: Position[],
    nextNumber: number, // The next numbered cell we need to reach
    nextPos: Position
): MoveValidation {
    // Check bounds
    if (!isInBounds(nextPos, puzzle.size)) {
        return { valid: false, reason: 'out_of_bounds' };
    }

    // Get the cell at next position
    const cell = getCell(puzzle, nextPos);

    // Check if cell is blocked
    if (!cell || cell.type === 'blocked') {
        return { valid: false, reason: 'blocked' };
    }

    // Check if already visited
    if (path.some(p => positionsEqual(p, nextPos))) {
        return { valid: false, reason: 'already_visited' };
    }

    // Check adjacency (if path is not empty)
    if (path.length > 0) {
        const lastPos = path[path.length - 1];
        if (!isAdjacent(lastPos, nextPos)) {
            return { valid: false, reason: 'not_adjacent' };
        }
    }

    // If cell is numbered, check if it's the correct number
    if (cell.type === 'numbered' && cell.number !== nextNumber) {
        return { valid: false, reason: 'wrong_sequence' };
    }

    return { valid: true };
}

/**
 * Find position of a number in the puzzle
 */
export function findNumberPosition(puzzle: ZipPuzzle, num: number): Position | null {
    for (let row = 0; row < puzzle.size; row++) {
        for (let col = 0; col < puzzle.size; col++) {
            if (puzzle.cells[row][col].number === num) {
                return { row, col };
            }
        }
    }
    return null;
}

/**
 * Check if the puzzle is solved
 */
export function isPuzzleSolved(puzzle: ZipPuzzle, currentNumber: number): boolean {
    return currentNumber > puzzle.totalNumbers;
}

/**
 * Format time in seconds to mm:ss
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayId(): string {
    const now = new Date();
    // Use local time components to match user's day
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
