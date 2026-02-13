import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

import { LeaderboardItem } from './LeaderboardItem';
import { LeaderboardListProps, LeaderboardUser } from '../types';

export function LeaderboardList({
  currentUserId,
  ListEmptyComponent,
  ListHeaderComponent,
  loading,
  onRefresh,
  refreshing = false,
  users,
}: LeaderboardListProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F4F8C" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: LeaderboardUser }) => (
    <LeaderboardItem user={item} isCurrentUser={item.id === currentUserId} />
  );

  const keyExtractor = (item: LeaderboardUser) => item.id;

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={users}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2F4F8C" colors={['#2F4F8C']} />
        ) : undefined
      }
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 170,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
});
