// =====================================================
// ZIP GAME - CUSTOM HOOK
// =====================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { ZipPuzzle, Position } from './types';
import { validateMove, isPuzzleSolved, getTodayId, getCell } from './utils';
import { fetchDailyPuzzle, getDailyPuzzle } from './puzzles';

export interface UseZipGameReturn {
    // State
    puzzle: ZipPuzzle | null;
    path: Position[]; // Full path including empty cells
    nextNumber: number; // Next numbered cell to reach (starts at 1)
    timer: number;
    attempts: number;
    isPlaying: boolean;
    isCompleted: boolean;
    loading: boolean;

    // Actions
    tryVisitCell: (pos: Position) => boolean;
    resetGame: () => void;
}

export function useZipGame(): UseZipGameReturn {
    // Game state
    const [puzzle, setPuzzle] = useState<ZipPuzzle | null>(null);
    const [loading, setLoading] = useState(true);

    const [path, setPath] = useState<Position[]>([]);
    const [nextNumber, setNextNumber] = useState(1); // Start looking for number 1
    const [timer, setTimer] = useState(0);
    const [attempts, setAttempts] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Refs to avoid stale closure issues
    const pathRef = useRef<Position[]>(path);
    const nextNumberRef = useRef(nextNumber);
    const isPlayingRef = useRef(isPlaying);
    const isCompletedRef = useRef(isCompleted);
    const puzzleRef = useRef<ZipPuzzle | null>(null);

    // Keep refs in sync
    useEffect(() => { pathRef.current = path; }, [path]);
    useEffect(() => { nextNumberRef.current = nextNumber; }, [nextNumber]);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
    useEffect(() => { isCompletedRef.current = isCompleted; }, [isCompleted]);
    useEffect(() => { puzzleRef.current = puzzle; }, [puzzle]);

    // Fetch puzzle on mount
    useEffect(() => {
        const loadPuzzle = async () => {
            setLoading(true);
            try {
                // Try async fetch first
                const dailyPuzzle = await fetchDailyPuzzle();
                setPuzzle(dailyPuzzle);
            } catch (error) {
                // Fallback to synchronous getter
                console.error("Error loading puzzle:", error);
                setPuzzle(getDailyPuzzle(getTodayId()));
            } finally {
                setLoading(false);
            }
        };

        loadPuzzle();
    }, []);

    // Timer interval ref
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Start the timer
    useEffect(() => {
        if (isPlaying && !isCompleted) {
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPlaying, isCompleted]);

    // Try to visit a cell - returns true if successful, false otherwise (silent fail)
    const tryVisitCell = useCallback((pos: Position): boolean => {
        const currentPuzzle = puzzleRef.current;
        if (!currentPuzzle) return false;

        const currentPath = pathRef.current;
        const currentNextNumber = nextNumberRef.current;
        const completed = isCompletedRef.current;

        // If already completed, ignore
        if (completed) return false;

        // Validate the move
        const validation = validateMove(currentPuzzle, currentPath, currentNextNumber, pos);

        if (!validation.valid) {
            // Silent fail - don't do anything
            return false;
        }

        // Valid move! Add to path
        const newPath = [...currentPath, pos];
        setPath(newPath);
        pathRef.current = newPath;

        // Start timer on first move
        if (!isPlayingRef.current) {
            setIsPlaying(true);
            isPlayingRef.current = true;
        }

        // Check if we landed on a numbered cell
        const cell = getCell(currentPuzzle, pos);
        if (cell?.type === 'numbered' && cell.number === currentNextNumber) {
            const newNextNumber = currentNextNumber + 1;
            setNextNumber(newNextNumber);
            nextNumberRef.current = newNextNumber;

            // Check for win
            if (isPuzzleSolved(currentPuzzle, newNextNumber)) {
                setIsCompleted(true);
                isCompletedRef.current = true;
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            }
        }

        return true;
    }, []);

    // Reset the game manually
    const resetGame = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setPath([]);
        pathRef.current = [];
        setNextNumber(1);
        nextNumberRef.current = 1;
        setTimer(0);
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsCompleted(false);
        isCompletedRef.current = false;
        setAttempts(a => a + 1);
    }, []);

    return {
        puzzle,
        path,
        nextNumber,
        timer,
        attempts,
        isPlaying,
        isCompleted,
        loading,
        tryVisitCell,
        resetGame,
    };
}
