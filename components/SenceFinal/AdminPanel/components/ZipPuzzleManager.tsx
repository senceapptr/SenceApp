// =====================================================
// ZIP PUZZLE MANAGER - ADMIN PANEL COMPONENT
// =====================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { zipPuzzleService, ZipPuzzleRecord } from '@/services/zipPuzzle.service';
import { generateValidPuzzle } from '@/components/SenceFinal/GameHubPage/components/ZipGame/generator';

// Preview component for puzzle grid
function PuzzlePreview({
    cells,
    size
}: {
    cells: any[][];
    size: number
}) {
    const cellSize = 28;

    return (
        <View style={[previewStyles.grid, { width: size * cellSize + (size - 1) * 2 }]}>
            {cells.map((row, rowIndex) => (
                <View key={rowIndex} style={previewStyles.row}>
                    {row.map((cell, colIndex) => (
                        <View
                            key={`${rowIndex}-${colIndex}`}
                            style={[
                                previewStyles.cell,
                                { width: cellSize, height: cellSize },
                                cell.type === 'blocked' && previewStyles.blocked,
                                cell.type === 'empty' && previewStyles.empty,
                                cell.type === 'numbered' && previewStyles.numbered,
                            ]}
                        >
                            {cell.number && (
                                <Text style={previewStyles.number}>{cell.number}</Text>
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const previewStyles = StyleSheet.create({
    grid: {
        backgroundColor: '#1a1a2e',
        padding: 4,
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 2,
    },
    cell: {
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blocked: {
        backgroundColor: '#2d2d44',
    },
    empty: {
        backgroundColor: '#3d3d5c',
    },
    numbered: {
        backgroundColor: '#C9F158',
    },
    number: {
        fontSize: 10,
        fontWeight: '900',
        color: '#1a1a2e',
    },
});

export function ZipPuzzleManager() {
    const [puzzles, setPuzzles] = useState<ZipPuzzleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generatedPuzzle, setGeneratedPuzzle] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState('');

    const loadPuzzles = useCallback(async () => {
        setLoading(true);
        const { data, error } = await zipPuzzleService.getAllPuzzles();
        if (!error) {
            setPuzzles(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadPuzzles();
    }, [loadPuzzles]);

    const handleGenerate = async () => {
        setGenerating(true);

        // Generate puzzle (runs in JS, no async needed for algorithm)
        const puzzle = generateValidPuzzle({ size: 6, difficulty: selectedDifficulty });

        if (puzzle) {
            setGeneratedPuzzle(puzzle);
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow.toISOString().split('T')[0]);
        } else {
            Alert.alert('Hata', 'Puzzle oluşturulamadı. Tekrar deneyin.');
        }

        setGenerating(false);
    };

    const handleSave = async () => {
        if (!generatedPuzzle || !selectedDate) {
            Alert.alert('Hata', 'Tarih seçilmedi.');
            return;
        }

        const { error } = await zipPuzzleService.createPuzzle({
            daily_date: selectedDate,
            size: generatedPuzzle.size,
            total_numbers: generatedPuzzle.totalNumbers,
            cells: generatedPuzzle.cells,
            difficulty: selectedDifficulty,
        });

        if (error) {
            Alert.alert('Hata', error.message);
        } else {
            Alert.alert('Başarılı', 'Puzzle kaydedildi.');
            setShowGenerateModal(false);
            setGeneratedPuzzle(null);
            loadPuzzles();
        }
    };

    const handleApprove = async (id: string) => {
        const { error } = await zipPuzzleService.approvePuzzle(id);
        if (error) {
            Alert.alert('Hata', error.message);
        } else {
            loadPuzzles();
        }
    };

    const handleSetLive = async (id: string) => {
        const { error } = await zipPuzzleService.setLive(id);
        if (error) {
            Alert.alert('Hata', error.message);
        } else {
            loadPuzzles();
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Silme Onayı',
            'Bu puzzle silinecek. Emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await zipPuzzleService.deletePuzzle(id);
                        if (!error) loadPuzzles();
                    },
                },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return '#6B7280';
            case 'approved': return '#F59E0B';
            case 'live': return '#10B981';
            default: return '#6B7280';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'draft': return 'Taslak';
            case 'approved': return 'Onaylı';
            case 'live': return 'Canlı';
            default: return status;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#432870" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Zip Bulmacaları</Text>
                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => setShowGenerateModal(true)}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.generateButtonText}>Yeni Oluştur</Text>
                </TouchableOpacity>
            </View>

            {/* Puzzle List */}
            <ScrollView style={styles.list}>
                {puzzles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="game-controller-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyText}>Henüz puzzle yok</Text>
                        <Text style={styles.emptySubtext}>Yeni bir puzzle oluşturun</Text>
                    </View>
                ) : (
                    puzzles.map((puzzle) => (
                        <View key={puzzle.id} style={styles.puzzleCard}>
                            <View style={styles.puzzleHeader}>
                                <View>
                                    <Text style={styles.puzzleDate}>{puzzle.daily_date}</Text>
                                    <View style={styles.metaRow}>
                                        <View style={[styles.badge, { backgroundColor: getStatusColor(puzzle.status) }]}>
                                            <Text style={styles.badgeText}>{getStatusText(puzzle.status)}</Text>
                                        </View>
                                        <Text style={styles.difficulty}>{puzzle.difficulty}</Text>
                                        <Text style={styles.numbers}>{puzzle.total_numbers} numara</Text>
                                    </View>
                                </View>
                                <PuzzlePreview cells={puzzle.cells} size={puzzle.size} />
                            </View>

                            <View style={styles.actions}>
                                {puzzle.status === 'draft' && (
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.approveButton]}
                                        onPress={() => handleApprove(puzzle.id)}
                                    >
                                        <Text style={styles.actionText}>Onayla</Text>
                                    </TouchableOpacity>
                                )}
                                {puzzle.status === 'approved' && (
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.liveButton]}
                                        onPress={() => handleSetLive(puzzle.id)}
                                    >
                                        <Text style={styles.actionText}>Canlıya Al</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => handleDelete(puzzle.id)}
                                >
                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Generate Modal */}
            <Modal visible={showGenerateModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Yeni Puzzle Oluştur</Text>
                            <TouchableOpacity onPress={() => setShowGenerateModal(false)}>
                                <Ionicons name="close" size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {/* Difficulty Selection */}
                        <Text style={styles.label}>Zorluk</Text>
                        <View style={styles.difficultyRow}>
                            {(['easy', 'medium', 'hard'] as const).map((diff) => (
                                <TouchableOpacity
                                    key={diff}
                                    style={[
                                        styles.difficultyButton,
                                        selectedDifficulty === diff && styles.difficultyActive,
                                    ]}
                                    onPress={() => setSelectedDifficulty(diff)}
                                >
                                    <Text
                                        style={[
                                            styles.difficultyText,
                                            selectedDifficulty === diff && styles.difficultyTextActive,
                                        ]}
                                    >
                                        {diff === 'easy' ? 'Kolay' : diff === 'medium' ? 'Orta' : 'Zor'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Generate Button */}
                        <TouchableOpacity
                            style={styles.mainButton}
                            onPress={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.mainButtonText}>Puzzle Oluştur</Text>
                            )}
                        </TouchableOpacity>

                        {/* Preview */}
                        {generatedPuzzle && (
                            <View style={styles.previewSection}>
                                <Text style={styles.label}>Önizleme</Text>
                                <View style={styles.previewContainer}>
                                    <PuzzlePreview
                                        cells={generatedPuzzle.cells}
                                        size={generatedPuzzle.size}
                                    />
                                </View>
                                <Text style={styles.previewInfo}>
                                    {generatedPuzzle.totalNumbers} checkpoint • {generatedPuzzle.size}x{generatedPuzzle.size} grid
                                </Text>
                                <Text style={styles.previewStats}>
                                    {/* Calculate stats from cells */}
                                    {(() => {
                                        let empty = 0;
                                        let blocked = 0;
                                        generatedPuzzle.cells.forEach((row: any[]) => row.forEach(c => {
                                            if (c.type === 'blocked') blocked++;
                                            if (c.type === 'empty') empty++;
                                        }));
                                        const pathLen = empty + generatedPuzzle.totalNumbers;
                                        return `Yol: ~${pathLen} kare • Doluluk: %${Math.round((pathLen / (generatedPuzzle.size * generatedPuzzle.size)) * 100)}`;
                                    })()}
                                </Text>

                                {/* Date Input */}
                                <Text style={styles.label}>Tarih (YYYY-MM-DD)</Text>
                                <TextInput
                                    style={styles.dateInput}
                                    value={selectedDate}
                                    onChangeText={setSelectedDate}
                                    placeholder="2026-02-05"
                                />

                                {/* Save Button */}
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Text style={styles.saveButtonText}>Kaydet</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#432870',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    list: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 4,
    },
    puzzleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    puzzleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    puzzleDate: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    difficulty: {
        fontSize: 12,
        color: '#6B7280',
    },
    numbers: {
        fontSize: 12,
        color: '#6B7280',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    approveButton: {
        backgroundColor: '#FEF3C7',
    },
    liveButton: {
        backgroundColor: '#D1FAE5',
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
        marginLeft: 'auto',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16,
    },
    difficultyRow: {
        flexDirection: 'row',
        gap: 8,
    },
    difficultyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    difficultyActive: {
        backgroundColor: '#432870',
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    difficultyTextActive: {
        color: '#FFFFFF',
    },
    mainButton: {
        backgroundColor: '#432870',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    mainButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    previewSection: {
        marginTop: 20,
    },
    previewContainer: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    previewInfo: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 13,
        marginTop: 8,
    },
    previewStats: {
        textAlign: 'center',
        color: '#4B5563',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
        marginBottom: 12,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
