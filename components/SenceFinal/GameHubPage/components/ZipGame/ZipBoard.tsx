// =====================================================
// ZIP GAME - BOARD COMPONENT
// =====================================================

import React, { useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { ZipPuzzle, Position } from './types';
import { ZipCellComponent } from './ZipCell';
import { positionsEqual } from './utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ZipBoardProps {
    puzzle: ZipPuzzle;
    path: Position[];
    nextNumber: number;
    onCellTouch: (pos: Position) => boolean;
}

export function ZipBoard({
    puzzle,
    path,
    nextNumber,
    onCellTouch,
}: ZipBoardProps) {
    const boardRef = useRef<View>(null);
    const boardLayoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const pathRef = useRef<Position[]>(path);

    // Keep ref in sync
    pathRef.current = path;

    // Calculate dimensions
    const boardSize = SCREEN_WIDTH * 0.9;
    const padding = 12;
    const gap = 6;
    const cellSize = (boardSize - padding * 2 - (puzzle.size - 1) * gap) / puzzle.size;

    // Convert touch coordinates to grid position
    const touchToGridPosition = useCallback((pageX: number, pageY: number): Position | null => {
        const { x, y, width, height } = boardLayoutRef.current;

        const relativeX = pageX - x - padding;
        const relativeY = pageY - y - padding;

        if (relativeX < 0 || relativeX > width - padding * 2 || relativeY < 0 || relativeY > height - padding * 2) {
            return null;
        }

        const col = Math.floor(relativeX / (cellSize + gap));
        const row = Math.floor(relativeY / (cellSize + gap));

        if (row < 0 || row >= puzzle.size || col < 0 || col >= puzzle.size) {
            return null;
        }

        return { row, col };
    }, [cellSize, gap, puzzle.size, padding]);

    // Handle touch at position
    const handleTouch = useCallback((pageX: number, pageY: number) => {
        const pos = touchToGridPosition(pageX, pageY);
        if (!pos) return;

        // Try to visit this cell - will silently fail if invalid
        onCellTouch(pos);
    }, [touchToGridPosition, onCellTouch]);

    // Pan responder for drag gestures
    const panResponder = useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
            },
            onPanResponderMove: (evt) => {
                handleTouch(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
            },
            onPanResponderRelease: () => { },
        }), [handleTouch]
    );

    // Handle board layout measurement
    const onLayout = useCallback(() => {
        boardRef.current?.measureInWindow((x, y, width, height) => {
            boardLayoutRef.current = { x, y, width, height };
        });
    }, []);

    // Check if a cell is in the current path
    const isInPath = useCallback((pos: Position): boolean => {
        return path.some(p => positionsEqual(p, pos));
    }, [path]);

    // Check if a cell is the next numbered target
    const isNextTarget = useCallback((cell: { type: string; number?: number }): boolean => {
        return cell.type === 'numbered' && cell.number === nextNumber;
    }, [nextNumber]);

    return (
        <View
            ref={boardRef}
            style={[styles.board, { width: boardSize, height: boardSize, padding }]}
            onLayout={onLayout}
            {...panResponder.panHandlers}
        >
            {puzzle.cells.map((row, rowIndex) => (
                <View key={rowIndex} style={[styles.row, { gap }]}>
                    {row.map((cell, colIndex) => {
                        const pos = { row: rowIndex, col: colIndex };
                        const isVisited = isInPath(pos);
                        const isNext = isNextTarget(cell);

                        return (
                            <ZipCellComponent
                                key={`${rowIndex}-${colIndex}`}
                                cell={cell}
                                isVisited={isVisited}
                                isNext={isNext}
                                cellSize={cellSize}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    board: {
        backgroundColor: '#0D1117',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#21262D',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
});
