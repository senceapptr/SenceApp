// =====================================================
// ZIP GAME - CELL COMPONENT
// =====================================================

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ZipCell as ZipCellType } from './types';

interface ZipCellProps {
    cell: ZipCellType;
    isVisited: boolean;
    isNext: boolean; // Is this the next numbered cell to find?
    cellSize: number;
}

export function ZipCellComponent({
    cell,
    isVisited,
    isNext,
    cellSize,
}: ZipCellProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const wasVisitedRef = useRef(isVisited);

    // Animate when cell becomes visited
    useEffect(() => {
        if (isVisited && !wasVisitedRef.current) {
            scaleAnim.setValue(0.7);
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 200,
                friction: 8,
                useNativeDriver: true,
            }).start();
        }
        wasVisitedRef.current = isVisited;
    }, [isVisited]);

    // Pulse animation for next target
    useEffect(() => {
        if (isNext && !isVisited) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [isNext, isVisited]);

    // Determine cell style based on type and state
    const getCellStyle = () => {
        if (cell.type === 'blocked') {
            return styles.blockedCell;
        }
        if (isVisited) {
            return styles.visitedCell;
        }
        if (cell.type === 'empty') {
            return styles.emptyCell;
        }
        // Numbered cell
        if (cell.number === 1) {
            return styles.startCell;
        }
        if (isNext) {
            return styles.nextCell;
        }
        return styles.numberedCell;
    };

    // Calculate font size based on cell size
    const numberFontSize = Math.max(cellSize * 0.4, 14);

    return (
        <Animated.View
            style={[
                styles.cell,
                { width: cellSize, height: cellSize },
                getCellStyle(),
                {
                    transform: [{ scale: isNext ? pulseAnim : scaleAnim }],
                },
            ]}
        >
            {/* Show number only on numbered cells */}
            {cell.type === 'numbered' && cell.number && (
                <Text
                    style={[
                        styles.number,
                        { fontSize: numberFontSize },
                        isVisited && styles.visitedNumber,
                        cell.number === 1 && !isVisited && styles.startNumber,
                        isNext && !isVisited && styles.nextNumber,
                    ]}
                >
                    {cell.number}
                </Text>
            )}

            {/* Blocked cell indicator */}
            {cell.type === 'blocked' && (
                <View style={styles.blockedIcon}>
                    <Text style={styles.blockedX}>✕</Text>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cell: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#30363D',
    },
    // Empty passable cell
    emptyCell: {
        backgroundColor: 'rgba(48, 54, 61, 0.3)',
        borderColor: '#30363D',
    },
    // Numbered cell (not visited, not next)
    numberedCell: {
        backgroundColor: 'rgba(48, 54, 61, 0.5)',
        borderColor: '#484F58',
    },
    // Blocked cell (cannot enter) - More visible
    blockedCell: {
        backgroundColor: '#21262D',
        borderColor: '#21262D',
        borderWidth: 0,
    },
    // Visited cell
    visitedCell: {
        backgroundColor: '#C9F158',
        borderColor: '#A8D948',
    },
    // Start cell (number 1)
    startCell: {
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: '#10B981',
        borderWidth: 3,
    },
    // Next target cell
    nextCell: {
        backgroundColor: 'rgba(251, 191, 36, 0.25)',
        borderColor: '#FBBF24',
        borderWidth: 3,
    },
    number: {
        fontWeight: '900',
        color: '#8B949E',
    },
    visitedNumber: {
        color: '#0D1117',
    },
    startNumber: {
        color: '#10B981',
    },
    nextNumber: {
        color: '#FBBF24',
    },
    blockedIcon: {
        opacity: 0.3,
    },
    blockedX: {
        fontSize: 18,
        color: '#484F58',
        fontWeight: '900',
    },
});
