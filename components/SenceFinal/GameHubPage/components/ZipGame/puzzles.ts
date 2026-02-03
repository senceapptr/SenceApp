// =====================================================
// ZIP GAME - DAILY PUZZLES
// =====================================================

import { ZipPuzzle, ZipCell } from './types';
import { zipPuzzleService } from '@/services/zipPuzzle.service';
import { getTodayId } from './utils';

// Helper to create cells for fallback puzzle
const B: ZipCell = { type: 'blocked' };
const E: ZipCell = { type: 'empty' };
const N = (num: number): ZipCell => ({ type: 'numbered', number: num });

/**
 * Fallback 6x6 puzzle if database is unavailable
 */
const FALLBACK_PUZZLE: ZipPuzzle = {
    daily_id: 'fallback',
    size: 6,
    totalNumbers: 8,
    cells: [
        [N(1), E, E, E, E, N(2)],
        [B, B, B, B, B, E],
        [B, B, B, B, N(4), N(3)],
        [N(6), E, E, E, N(5), B],
        [E, B, B, B, B, B],
        [N(7), E, E, E, E, N(8)],
    ],
};

// Cache for daily puzzle
let cachedPuzzle: ZipPuzzle | null = null;
let cachedDate: string | null = null;

/**
 * Get the daily puzzle - fetches from Supabase, falls back to hardcoded
 */
export async function fetchDailyPuzzle(): Promise<ZipPuzzle> {
    const today = getTodayId(); // Use shared robust date helper

    // Return cached if same day
    if (cachedPuzzle && cachedDate === today) {
        return cachedPuzzle;
    }

    try {
        console.log('Fetching puzzle for date:', today);
        const { data, error } = await zipPuzzleService.getPuzzleByDate(today);
        console.log('Fetch result:', { data: data ? 'found' : 'null', error });

        if (!error && data) {
            cachedPuzzle = zipPuzzleService.toGamePuzzle(data);
            cachedDate = today;
            return cachedPuzzle;
        }
    } catch (e) {
        console.log('Failed to fetch daily puzzle, using fallback');
    }

    // Fallback
    return { ...FALLBACK_PUZZLE, daily_id: today };
}

/**
 * Synchronous getter for when async isn't possible
 * Returns cache or fallback
 */
export function getDailyPuzzle(dateId?: string): ZipPuzzle {
    if (cachedPuzzle && cachedDate === dateId) {
        return cachedPuzzle;
    }
    return { ...FALLBACK_PUZZLE, daily_id: dateId || 'fallback' };
}

/**
 * Pre-fetch puzzle (call on app start or game hub mount)
 */
export async function prefetchDailyPuzzle(): Promise<void> {
    await fetchDailyPuzzle();
}
