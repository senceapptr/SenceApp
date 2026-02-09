import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LeaderboardListProps, LeaderboardUser } from '../types';
import { LeaderboardItem } from './LeaderboardItem';

export function LeaderboardList({
    users,
    currentUserId,
    loading,
    onRefresh,
    refreshing = false,
    ListHeaderComponent,
    ListEmptyComponent,
}: LeaderboardListProps) {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: LeaderboardUser }) => (
        <LeaderboardItem
            user={item}
            isCurrentUser={item.id === currentUserId}
        />
    );

    const keyExtractor = (item: LeaderboardUser) => item.id;

    return (
        <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#10B981"
                        colors={['#10B981']}
                    />
                ) : undefined
            }
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 120,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B949E',
        marginLeft: 20,
        marginBottom: 12,
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#8B949E',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F0F6FC',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8B949E',
    },
});
