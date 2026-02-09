import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { leagueVotesService, LeagueVote } from '@/services/league-votes.service';
import { League } from '../types';

interface RaceStatsProps {
    visible: boolean;
    league: League;
    onClose: () => void;
}

type TabType = 'pending' | 'resolved';

export function RaceStats({ visible, league, onClose }: RaceStatsProps) {
    const { user } = useAuth();
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [votes, setVotes] = useState<LeagueVote[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalVotes: 0,
        wins: 0,
        losses: 0,
        pending: 0,
        totalPoints: 0,
        accuracy: 0,
    });

    useEffect(() => {
        if (visible && user && league) {
            loadData();
        }
    }, [visible, user, league, activeTab]);

    const loadData = async () => {
        if (!user || !league) return;

        try {
            setLoading(true);

            // Load votes based on tab
            const status = activeTab === 'pending' ? 'pending' : undefined;
            const votesResult = await leagueVotesService.getUserVotes(league.id, user.id, status);

            if (votesResult.data) {
                const filteredVotes = activeTab === 'resolved'
                    ? votesResult.data.filter(v => v.status !== 'pending' && v.status !== 'skipped')
                    : votesResult.data.filter(v => v.status === 'pending');
                setVotes(filteredVotes);
            }

            // Load stats
            const statsResult = await leagueVotesService.getUserLeagueStats(league.id, user.id);
            if (statsResult.data) {
                setStats(statsResult.data);
            }
        } catch (err) {
            console.error('Load stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (vote: LeagueVote) => {
        switch (vote.status) {
            case 'won':
                return <Ionicons name="checkmark-circle" size={24} color="#10B981" />;
            case 'lost':
                return <Ionicons name="close-circle" size={24} color="#EF4444" />;
            case 'pending':
                return <Ionicons name="time" size={24} color="#F59E0B" />;
            default:
                return <Ionicons name="remove-circle" size={24} color="#6B7280" />;
        }
    };

    const getVoteLabel = (vote: 'yes' | 'no' | 'skip') => {
        switch (vote) {
            case 'yes':
                return { text: 'EVET', color: '#10B981' };
            case 'no':
                return { text: 'HAYIR', color: '#EF4444' };
            default:
                return { text: 'PAS', color: '#6B7280' };
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            transparent={false}
            presentationStyle="fullScreen"
        >
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={{ paddingTop: Math.max(insets.top, 20) }}>
                        <LinearGradient
                            colors={['#1a1a2e', '#16213e']}
                            style={styles.header}
                        >
                            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                                <Ionicons name="close" size={24} color="#FFFFFF" />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>📊 İstatistikler</Text>
                            <Text style={styles.headerSubtitle}>{league.name}</Text>

                            {/* Stats Overview */}
                            <View style={styles.statsOverview}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.totalVotes}</Text>
                                    <Text style={styles.statLabel}>Tahmin</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.wins}</Text>
                                    <Text style={styles.statLabel}>Kazandı</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: '#EF4444' }]}>{stats.losses}</Text>
                                    <Text style={styles.statLabel}>Kaybetti</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.accuracy}%</Text>
                                    <Text style={styles.statLabel}>Başarı</Text>
                                </View>
                            </View>

                            {/* Total Points */}
                            <View style={styles.totalPoints}>
                                <Text style={styles.totalPointsLabel}>TOPLAM PUAN</Text>
                                <Text style={styles.totalPointsValue}>{stats.totalPoints}</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
                            onPress={() => setActiveTab('pending')}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="time"
                                size={18}
                                color={activeTab === 'pending' ? '#F59E0B' : '#6B7280'}
                            />
                            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
                                Bekleyen
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'resolved' && styles.tabActive]}
                            onPress={() => setActiveTab('resolved')}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="checkmark-done"
                                size={18}
                                color={activeTab === 'resolved' ? '#10B981' : '#6B7280'}
                            />
                            <Text style={[styles.tabText, activeTab === 'resolved' && styles.tabTextActive]}>
                                Sonuçlanan
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Vote List */}
                    <ScrollView style={styles.voteList} showsVerticalScrollIndicator={false}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#10B981" />
                            </View>
                        ) : votes.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>
                                    {activeTab === 'pending' ? '⏳' : '📋'}
                                </Text>
                                <Text style={styles.emptyText}>
                                    {activeTab === 'pending'
                                        ? 'Bekleyen tahminin yok'
                                        : 'Henüz sonuçlanan tahmin yok'}
                                </Text>
                            </View>
                        ) : (
                            votes.map((vote) => {
                                const voteLabel = getVoteLabel(vote.vote);
                                return (
                                    <View key={vote.id} style={styles.voteItem}>
                                        <View style={styles.voteStatus}>
                                            {getStatusIcon(vote)}
                                        </View>

                                        <View style={styles.voteInfo}>
                                            <Text style={styles.voteQuestion} numberOfLines={2}>
                                                {vote.questions?.title || 'Soru yükleniyor...'}
                                            </Text>
                                            <View style={styles.voteDetails}>
                                                <View style={[styles.voteBadge, { backgroundColor: voteLabel.color + '20' }]}>
                                                    <Text style={[styles.voteBadgeText, { color: voteLabel.color }]}>
                                                        {voteLabel.text}
                                                    </Text>
                                                </View>
                                                <Text style={styles.voteOdds}>{vote.odds_at_vote}x</Text>
                                            </View>
                                        </View>

                                        {vote.status !== 'pending' && (
                                            <View style={styles.votePoints}>
                                                <Text style={[
                                                    styles.pointsValue,
                                                    { color: vote.points_earned >= 0 ? '#10B981' : '#EF4444' }
                                                ]}>
                                                    {vote.points_earned >= 0 ? '+' : ''}{vote.points_earned}
                                                </Text>
                                                <Text style={styles.pointsLabel}>puan</Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
    },
    header: {
        padding: 20,
        paddingTop: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 20,
    },
    statsOverview: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    totalPoints: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    totalPointsLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#10B981',
    },
    totalPointsValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#10B981',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        gap: 8,
    },
    tabActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    voteList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
    },
    voteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    voteStatus: {
        marginRight: 14,
    },
    voteInfo: {
        flex: 1,
    },
    voteQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
        lineHeight: 20,
    },
    voteDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    voteBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    voteBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    voteOdds: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
    },
    votePoints: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    pointsValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    pointsLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
});
