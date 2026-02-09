import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PageHeader } from './components/PageHeader';
import { TabSwitcher } from './components/TabSwitcher';
import { Podium } from './components/Podium';
import { LeaderboardList } from './components/LeaderboardList';
import { UserRankCard } from './components/UserRankCard';
import { useLeaderboard } from './hooks';
import { LeaderboardPageProps } from './types';

export function LeaderboardPage({ onBack, onMenuToggle }: LeaderboardPageProps) {
    const {
        activeTab,
        loading,
        refreshing,
        topThree,
        restOfList,
        currentUserRank,
        currentTotalUsers,
        userId,
        userCredits,
        userProfileImage,
        username,
        setActiveTab,
        handleRefresh,
    } = useLeaderboard();

    const renderHeader = () => (
        <>
            <Podium users={topThree} currentUserId={userId} />
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>
                    {activeTab === 'global' ? '🌍 Tüm Kullanıcılar' : '👥 Arkadaşların'}
                </Text>
                <View style={styles.dividerLine} />
            </View>
        </>
    );

    const renderEmpty = () => (
        <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>
                {activeTab === 'friends'
                    ? 'Karşılıklı takipleştiğin arkadaşların burada görünecek'
                    : 'Henüz başka kullanıcı yok'}
            </Text>
        </View>
    );

    // Dynamic import for LeaderboardItem to handle circular dependency if any, 
    // or just import at top. We already have LeaderboardList imported, 
    // but we want to use 'LeaderboardItem' directly or modify this page.
    // Let's rely on importing LeaderboardItem at the top of the file (added in next step).
    // For now, assume LeaderboardItem is available. Actually we need to import it.

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

            <View style={styles.backgroundDecorations}>
                <LinearGradient
                    colors={['rgba(255, 215, 0, 0.08)', 'transparent']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.5 }}
                    style={styles.topGlow}
                />
            </View>

            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <PageHeader onBack={onBack} onMenuToggle={onMenuToggle} />
                <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
            </SafeAreaView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFD700" />
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
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    backgroundDecorations: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    topGlow: {
        flex: 1,
    },
    safeArea: {
        zIndex: 10,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#FFD700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#30363D',
    },
    dividerText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8B949E',
    },
    listItemWrapper: {
        marginBottom: -8, // Overlap fix since LeaderboardList adds margin
    },
    listItem: {
        marginTop: -8,
    },
    emptyList: {
        padding: 40,
        alignItems: 'center',
    },
    emptyListText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8B949E',
        textAlign: 'center',
    },
    bottomSpacing: {
        height: 140,
    },
});

export default LeaderboardPage;
