// =====================================================
// ZIP PUZZLE SERVICE
// =====================================================
// CRUD operations for Zip puzzles with Supabase

import { supabase } from '@/lib/supabase';
import { ZipPuzzle, ZipCell } from '@/components/SenceFinal/GameHubPage/components/ZipGame/types';

export interface ZipPuzzleRecord {
    id: string;
    daily_date: string;
    size: number;
    total_numbers: number;
    cells: ZipCell[][];
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'draft' | 'approved' | 'live';
    created_at: string;
    approved_at: string | null;
    approved_by: string | null;
}

export const zipPuzzleService = {
    mapPuzzleRecord(record: any): ZipPuzzleRecord {
        return {
            approved_at: record?.approved_at ?? null,
            approved_by: record?.approved_by ?? null,
            cells: (record?.cells as ZipCell[][]) ?? [],
            created_at: record?.created_at ?? new Date().toISOString(),
            daily_date: record?.daily_date ?? '',
            difficulty: (record?.difficulty as ZipPuzzleRecord['difficulty']) ?? 'easy',
            id: record?.id ?? '',
            size: record?.size ?? 0,
            status: (record?.status as ZipPuzzleRecord['status']) ?? 'draft',
            total_numbers: record?.total_numbers ?? 0,
        };
    },

    /**
     * Get puzzle for a specific date (live puzzles only for users)
     */
    async getPuzzleByDate(date: string): Promise<{ data: ZipPuzzleRecord | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('zip_puzzles')
                .select('*')
                .eq('daily_date', date)
                .eq('status', 'live')
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
                throw error;
            }

            return { data: data ? this.mapPuzzleRecord(data) : null, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    },

    /**
     * Get all puzzles (admin only)
     */
    async getAllPuzzles(): Promise<{ data: ZipPuzzleRecord[]; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('zip_puzzles')
                .select('*')
                .order('daily_date', { ascending: false });

            if (error) throw error;

            return { data: (data || []).map(row => this.mapPuzzleRecord(row)), error: null };
        } catch (error) {
            return { data: [], error: error as Error };
        }
    },

    /**
     * Create a new puzzle
     */
    async createPuzzle(puzzle: {
        daily_date: string;
        size: number;
        total_numbers: number;
        cells: ZipCell[][];
        difficulty: 'easy' | 'medium' | 'hard';
    }): Promise<{ data: ZipPuzzleRecord | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('zip_puzzles')
                .insert({
                    daily_date: puzzle.daily_date,
                    size: puzzle.size,
                    total_numbers: puzzle.total_numbers,
                    cells: puzzle.cells as any,
                    difficulty: puzzle.difficulty,
                    status: 'draft',
                })
                .select()
                .single();

            if (error) throw error;

            return { data: data ? this.mapPuzzleRecord(data) : null, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    },

    /**
     * Update puzzle status to approved
     */
    async approvePuzzle(id: string): Promise<{ error: Error | null }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('zip_puzzles')
                .update({
                    status: 'approved',
                    approved_at: new Date().toISOString(),
                    approved_by: user?.id,
                })
                .eq('id', id);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    /**
     * Set puzzle live
     */
    async setLive(id: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase
                .from('zip_puzzles')
                .update({ status: 'live' })
                .eq('id', id);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    /**
     * Update puzzle date
     */
    async updateDate(id: string, date: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase
                .from('zip_puzzles')
                .update({ daily_date: date })
                .eq('id', id);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    /**
     * Delete puzzle
     */
    async deletePuzzle(id: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase
                .from('zip_puzzles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    /**
     * Convert database record to game puzzle format
     */
    toGamePuzzle(record: ZipPuzzleRecord): ZipPuzzle {
        return {
            daily_id: record.daily_date,
            size: record.size,
            totalNumbers: record.total_numbers,
            cells: record.cells,
        };
    },
};
