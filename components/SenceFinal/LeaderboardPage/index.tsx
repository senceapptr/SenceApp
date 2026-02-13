import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text } from 'react-native';

import { useLeaderboard } from './hooks';
import { Podium } from './components/Podium';
import { LeaderboardPageProps } from './types';
import { PageHeader } from './components/PageHeader';
import { TabSwitcher } from './components/TabSwitcher';
import { ACCENT_DARK } from '../LeaguePage/shared/theme';
import { UserRankCard } from './components/UserRankCard';
import { LeaderboardList } from './components/LeaderboardList';

export function LeaderboardPage({ onBack, onMenuToggle }: LeaderboardPageProps) {
  const {
    activeTab,
    currentTotalUsers,
    currentUserRank,
    handleRefresh,
    loading,
    refreshing,
    restOfList,
    setActiveTab,
    topThree,
    userCredits,
    userId,
    username,
    userProfileImage,
  } = useLeaderboard();

  const segmentTitle = activeTab === 'global' ? 'Genel Sıralama' : 'Arkadaş Sıralaması';

  const renderHeader = () => (
    <>
      <Podium users={topThree} currentUserId={userId} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{segmentTitle}</Text>
        <View style={styles.dividerLine} />
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyTitle}>Görüntülenecek kullanıcı bulunamadı</Text>
      <Text style={styles.emptyListText}>
        {activeTab === 'friends'
          ? 'Karşılıklı takipleştiğin kullanıcılar burada listelenecek.'
          : 'Sıralama verisi oluştuğunda bu alan güncellenecek.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070D17" />

      <View style={styles.backgroundDecorations} pointerEvents="none">
        <LinearGradient
          colors={['rgba(47, 79, 140, 0.24)', 'rgba(47, 79, 140, 0.08)', 'transparent']}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.5, y: 0 }}
          style={styles.topGlow}
        />
        <LinearGradient
          colors={['rgba(37, 110, 255, 0.16)', 'transparent']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.leftGlow}
        />
        <LinearGradient
          colors={['rgba(148, 163, 184, 0.06)', 'transparent']}
          end={{ x: 0, y: 1 }}
          start={{ x: 1, y: 0 }}
          style={styles.rightGlow}
        />
      </View>

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <PageHeader onBack={onBack} onMenuToggle={onMenuToggle} />
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      </SafeAreaView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT_DARK} />
          <Text style={styles.loadingText}>Sıralama yükleniyor...</Text>
        </View>
      ) : (
        <LeaderboardList
          users={restOfList}
          currentUserId={userId}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={renderEmpty()}
        />
      )}

      {!loading && currentUserRank > 0 && (
        <UserRankCard
          rank={currentUserRank}
          totalUsers={currentTotalUsers}
          credits={userCredits}
          profileImage={userProfileImage}
          username={username}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundDecorations: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#070D17',
    flex: 1,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dividerLine: {
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: '#8DA1BE',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  emptyList: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  emptyListText: {
    color: '#7F8EA4',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#D4DFEE',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  leftGlow: {
    height: 240,
    left: -40,
    position: 'absolute',
    top: 70,
    width: 220,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9DB2D3',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14,
  },
  rightGlow: {
    height: 200,
    position: 'absolute',
    right: -60,
    top: 180,
    width: 240,
  },
  safeArea: {
    backgroundColor: 'rgba(7, 13, 23, 0.96)',
    zIndex: 20,
  },
  topGlow: {
    height: 320,
  },
});

export default LeaderboardPage;
