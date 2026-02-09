// =====================================================
// FILTER TABS - Dark Style
// =====================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NotificationCategory } from '../types';
import { FILTER_TABS } from '../utils';

interface FilterTabsProps {
    activeFilter: NotificationCategory;
    onFilterChange: (filter: NotificationCategory) => void;
    unreadCounts?: Record<NotificationCategory, number>;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    activeFilter,
    onFilterChange,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {FILTER_TABS.map((tab) => {
                    const isActive = activeFilter === tab.key;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tab,
                                isActive && styles.tabActive,
                            ]}
                            onPress={() => onFilterChange(tab.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tabText,
                                isActive && styles.tabTextActive,
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        backgroundColor: '#09090B',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)', // Dark gray tab bg
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tabActive: {
        backgroundColor: '#432870',
        borderColor: '#5B3AA8',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8B949E', // Gray text
    },
    tabTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
