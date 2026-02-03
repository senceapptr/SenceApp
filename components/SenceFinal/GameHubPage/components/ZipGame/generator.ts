// =====================================================
// ZIP GAME - PUZZLE GENERATOR v2 (Production)
// =====================================================
// Generates guaranteed solvable puzzles with intelligent difficulty scaling
// Strategy: Main Path Carving + Decoy Branches + Checkpoint Density Control

import { ZipPuzzle, ZipCell, Position } from './types';
import { getTodayId } from './utils';

interface GeneratorConfig {
    size: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

interface DifficultySettings {
    minPathLength: number;      // Minimum length of the solution path
    checkpointDensity: number;  // Higher = more checkpoints (easier to see next step)
    decoyDensity: number;       // Higher = more fake paths/branches
    maxBranchLength: number;    // How long fake paths can be
}

const DIFFICULTY_CONFIG: Record<string, DifficultySettings> = {
    easy: {
        minPathLength: 0.5,     // 50% of grid size
        checkpointDensity: 0.35, // High density (checkpoints often)
        decoyDensity: 0.1,      // Few decoys
        maxBranchLength: 1,     // Short decoys
    },
    medium: {
        minPathLength: 0.65,    // 65% of grid size
        checkpointDensity: 0.25, // Medium density
        decoyDensity: 0.25,     // Some decoys
        maxBranchLength: 3,     // Medium decoys
    },
    hard: {
        minPathLength: 0.8,     // 80% of grid size
        checkpointDensity: 0.15, // Low density (checkpoints far apart)
        decoyDensity: 0.4,      // Many decoys
        maxBranchLength: 5,     // Long complex decoys
    },
};

/**
 * Helper to check adjacency
 */
function getValidNeighbors(pos: Position, size: number, visited: Set<string>): Position[] {
    const moves = [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
    ];

    return moves
        .map(m => ({ row: pos.row + m.row, col: pos.col + m.col }))
        .filter(p =>
            p.row >= 0 && p.row < size &&
            p.col >= 0 && p.col < size &&
            !visited.has(`${p.row},${p.col}`)
        );
}

/**
 * Generate Main Solution Path (Backtracking DFS)
 */
function generateMainPath(size: number, minLength: number): Position[] {
    const visited = new Set<string>();
    let longestPath: Position[] = [];

    function dfs(current: Position, path: Position[]) {
        // Optimization: If current path is very long, we might just stop to save time
        // but we want to explore for a good length.

        // Track longest path found so far
        if (path.length > longestPath.length) {
            longestPath = [...path];
        }

        // If we hit a dead end or max depth, return
        if (path.length >= size * size) return;

        visited.add(`${current.row},${current.col}`);

        // Randomize neighbors for variety
        const neighbors = getValidNeighbors(current, size, visited).sort(() => Math.random() - 0.5);

        for (const next of neighbors) {
            if (!visited.has(`${next.row},${next.col}`)) {
                dfs(next, [...path, next]);
                // Heuristic: If we found a path long enough, we can potentially stop early 
                // if we are running slow, but for strict quality we let DFS run a bit.
                // For 6x6, DFS is fast enough.
            }
        }

        visited.delete(`${current.row},${current.col}`); // Backtrack
    }

    // Start from a random position
    const startRow = Math.floor(Math.random() * size);
    const startCol = Math.floor(Math.random() * size);

    // Run DFS with a greedy preference for length
    // Custom iterative backtracking to prevent stack overflow on huge grids (though 6x6 is fine)
    // For production speed, we'll use a Randomized Prim's-like or Walk approach
    // strictly for path generation.

    // SIMPLE APPROACH: Random Self-Avoiding Walk with Retries
    // This is faster and sufficient for 6x6 to get "good enough" long paths
    for (let attempt = 0; attempt < 50; attempt++) {
        const path: Position[] = [];
        const walked = new Set<string>();
        let curr = { row: Math.floor(Math.random() * size), col: Math.floor(Math.random() * size) };

        path.push(curr);
        walked.add(`${curr.row},${curr.col}`);

        let stuck = false;
        while (!stuck) {
            const neighbors = getValidNeighbors(curr, size, walked);
            if (neighbors.length === 0) {
                stuck = true;
            } else {
                curr = neighbors[Math.floor(Math.random() * neighbors.length)];
                path.push(curr);
                walked.add(`${curr.row},${curr.col}`);
            }
        }

        if (path.length >= minLength) {
            return path;
        }
    }

    // Fallback: If random walk fails to find long path, return whatever valid path
    // Ideally we'd use recursive backtracking here but keeping it simple for speed
    return generateRecursivePath(size, minLength);
}

// Fallback robust generator
function generateRecursivePath(size: number, minLength: number): Position[] {
    const start = { row: 0, col: 0 };
    let finalPath: Position[] = [];

    function solve(curr: Position, path: Position[]) {
        if (finalPath.length > 0) return; // Found one

        if (path.length >= minLength) {
            finalPath = path;
            return;
        }

        const neighbors = getValidNeighbors(curr, size, new Set(path.map(p => `${p.row},${p.col}`)));
        if (neighbors.length === 0) return;

        // Pick one random neighbor to continue
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        solve(next, [...path, next]);
    }

    solve(start, [start]);
    return finalPath.length > 0 ? finalPath : [start]; // Should not happen
}

/**
 * Generate Decoy Branches
 */
function addDecoys(
    grid: ZipCell[][],
    size: number,
    mainPathSet: Set<string>,
    density: number,
    maxLength: number
) {
    // Attempt to start branches from empty/path cells
    const potentialStarts: Position[] = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c].type !== 'blocked') {
                potentialStarts.push({ row: r, col: c });
            }
        }
    }

    // Shuffle starts
    potentialStarts.sort(() => Math.random() - 0.5);

    // Try to add branches
    const totalCells = size * size;
    const targetDecoys = Math.floor(totalCells * density);
    let decoysAdded = 0;

    const occupied = new Set(mainPathSet);

    for (const start of potentialStarts) {
        if (decoysAdded >= targetDecoys) break;

        // Random walk for branch
        let curr = start;
        let branchLen = 0;

        while (branchLen < maxLength) {
            const neighbors = getValidNeighbors(curr, size, occupied);
            if (neighbors.length === 0) break;

            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            grid[next.row][next.col] = { type: 'empty' };
            occupied.add(`${next.row},${next.col}`);
            curr = next;
            branchLen++;
            decoysAdded++;
        }
    }
}

/**
 * Main Generator Function
 */
export function generateValidPuzzle(config: GeneratorConfig): ZipPuzzle {
    const { size, difficulty } = config;
    const settings = DIFFICULTY_CONFIG[difficulty];

    // 1. Init Grid (All Blocked)
    const grid: ZipCell[][] = Array(size).fill(null).map(() =>
        Array(size).fill(null).map(() => ({ type: 'blocked' }))
    );

    // 2. Generate Main Solution Path
    const minPathLen = Math.floor(size * size * settings.minPathLength);
    const mainPath = generateMainPath(size, minPathLen);
    const mainPathSet = new Set(mainPath.map(p => `${p.row},${p.col}`));

    // 3. Mark Main Path as Empty initially
    for (const p of mainPath) {
        grid[p.row][p.col] = { type: 'empty' };
    }

    // 4. Place Checkpoints (Numbers)
    // Strategy: Ensure adequate spacing based on difficulty
    const checkpoints: number[] = [0]; // Always include start (index 0)

    // Calculate intermediate checkpoints
    const pathLen = mainPath.length;

    if (difficulty === 'easy') {
        // Place checkpoint every ~3-4 cells
        for (let i = 3; i < pathLen - 1; i += 3 + Math.floor(Math.random() * 2)) {
            checkpoints.push(i);
        }
    } else if (difficulty === 'medium') {
        // Place checkpoint every ~5-7 cells
        for (let i = 5; i < pathLen - 1; i += 5 + Math.floor(Math.random() * 3)) {
            checkpoints.push(i);
        }
    } else { // hard
        // Place checkpoint every ~8-12 cells (long blind segments)
        for (let i = 8; i < pathLen - 1; i += 8 + Math.floor(Math.random() * 5)) {
            checkpoints.push(i);
        }
    }

    // Always include end
    if (checkpoints[checkpoints.length - 1] !== pathLen - 1) {
        checkpoints.push(pathLen - 1);
    }

    // Apply numbers to grid
    checkpoints.forEach((pathIndex, i) => {
        const pos = mainPath[pathIndex];
        grid[pos.row][pos.col] = { type: 'numbered', number: i + 1 };
    });

    const totalNumbers = checkpoints.length;

    // 5. Add Decoy Branches (Fake paths)
    // Only for medium/hard to add confusion
    if (difficulty !== 'easy') {
        addDecoys(grid, size, mainPathSet, settings.decoyDensity, settings.maxBranchLength);
    }

    return {
        daily_id: getTodayId(),
        size,
        totalNumbers,
        cells: grid,
    };
}
