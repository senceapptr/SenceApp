import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';

import { RaceArena } from './Arena';
import { KesfetTab } from './Kesfet';
import { OlusturTab } from './Olustur';
import { Header } from './shared/Header';
import { TabBar } from './shared/TabBar';
import { LiglerimTab } from './Liglerim';
import { TabType, League } from './types';
import { useHeaderAnimation } from './hooks';
import { LeaguePageSkeleton } from './LeaguePageSkeleton';
import { LeaderboardModal } from './shared/LeaderboardModal';
import { DEFAULT_LEAGUE_ICON_NAME, getLeagueIconColorByName, isLeagueIconName } from './shared/leagueIcons';

const formatLeagueEndDate = (endDateISO?: string | null) => {
  if (!endDateISO) return 'Süresiz';

  const endDate = new Date(endDateISO);
  if (Number.isNaN(endDate.getTime())) return 'Süresiz';

  return endDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  });
};

const extractLeagueCategories = (league: any) => {
  const mappedCategories = Array.isArray(league?.league_categories)
    ? league.league_categories
        .map((item: any) => item?.categories?.name)
        .filter((name: unknown): name is string => typeof name === 'string' && name.trim().length > 0)
    : [];

  if (mappedCategories.length > 0) {
    return [...new Set(mappedCategories)];
  }

  if (league?.categories?.name) {
    return [league.categories.name];
  }

  return [];
};

interface LeaguePageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  onRaceModeChange?: (isActive: boolean) => void;
  handleQuestionDetail: (questionId: string) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
}

export function LeaguePage({
  handleQuestionDetail: _handleQuestionDetail,
  handleVote: _handleVote,
  onBack: _onBack,
  onMenuToggle,
  onRaceModeChange,
}: LeaguePageProps) {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [userLeagues, setUserLeagues] = useState<League[]>([]);
  const [showRaceArena, setShowRaceArena] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());
  const scrollViewRef = useRef<ScrollView>(null);
  const { handleScroll, headerTranslateY, resetHeaderState } = useHeaderAnimation();

  useEffect(() => {
    const intervalId = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Backend'den lig verilerini yükle
  const loadLeaguesData = useCallback(async () => {
    if (!user) {
      setShowSkeleton(false);
      return;
    }

    try {
      setShowSkeleton(true);

      // Paralel olarak public ligler ve kullanıcının liglerini yükle
      const [publicLeaguesResult, userLeaguesResult, joinedLeagueIdsResult] = await Promise.all([
        leaguesService.getPublicLeagues(),
        leaguesService.getUserLeagues(user.id),
        leaguesService.getUserJoinedLeagueIds(user.id),
      ]);

      const joinedLeagueIds = new Set(
        (
          (joinedLeagueIdsResult.data && joinedLeagueIdsResult.data.length > 0
            ? joinedLeagueIdsResult.data
            : (userLeaguesResult.data || []).map((member: any) => member?.leagues?.id) || []) as (string | undefined)[]
        ).filter((leagueId: unknown): leagueId is string => typeof leagueId === 'string'),
      );

      // Public ligler
      if (publicLeaguesResult.data) {
        const mappedPublicLeagues: League[] = publicLeaguesResult.data.map((league: any) => {
          const leagueCategories = extractLeagueCategories(league);
          const leagueIconName = isLeagueIconName(league.icon_name) ? league.icon_name : DEFAULT_LEAGUE_ICON_NAME;
          const prizePool = typeof league.prize_pool === 'number' ? league.prize_pool : null;

          return {
            categories: leagueCategories,
            category: leagueCategories[0] || '',
            creator: league.creator_profile?.username || 'Anonim',
            creatorId: league.creator_id || undefined,
            description: league.description || '',
            endDate: formatLeagueEndDate(league.end_date),
            endDateISO: league.end_date || null,
            icon: league.categories?.icon || '🏆',
            id: league.id,
            isFeatured: league.is_featured === true,
            isJoined: joinedLeagueIds.has(league.id),
            isPrivate: league.type !== 'public',
            joinCost: league.entry_fee || 0,
            leagueIconColor: league.icon_color || getLeagueIconColorByName(leagueIconName),
            leagueIconName,
            maxParticipants: league.max_members || 100,
            name: league.name,
            participants: league.current_members || 0,
            pointSystem: 'Her doğru tahmin için puan kazanırsın.',
            prize: prizePool === null ? '—' : `${prizePool} kredi`,
            status: league.status === 'active' ? 'active' : 'completed',
          };
        });
        setLeagues(mappedPublicLeagues);
      }

      // Kullanıcının ligleri
      if (userLeaguesResult.data) {
        const mappedUserLeagues: League[] = userLeaguesResult.data.map((member: any) => {
          const league = member.leagues;
          const leagueCategories = extractLeagueCategories(league);
          const leagueIconName = isLeagueIconName(league.icon_name) ? league.icon_name : DEFAULT_LEAGUE_ICON_NAME;
          const prizePool = typeof league.prize_pool === 'number' ? league.prize_pool : null;

          return {
            categories: leagueCategories,
            category: leagueCategories[0] || '',
            creator: league.creator_profile?.username || 'Anonim',
            creatorId: league.creator_id || undefined,
            description: league.description || '',
            endDate: formatLeagueEndDate(league.end_date),
            endDateISO: league.end_date || null,
            icon: league.categories?.icon || '🏆',
            id: league.id,
            isFeatured: league.is_featured === true,
            isJoined: true,
            isPrivate: league.type !== 'public',
            joinCost: league.entry_fee || 0,
            leagueIconColor: league.icon_color || getLeagueIconColorByName(leagueIconName),
            leagueIconName,
            maxParticipants: league.max_members || 100,
            name: league.name,
            participants: league.current_members || 0,
            pointSystem: 'Her doğru tahmin için puan kazanırsın.',
            position: member.rank ?? null,
            prize: prizePool === null ? '—' : `${prizePool} kredi`,
            status: league.status === 'active' ? 'active' : 'completed',
          };
        });
        setUserLeagues(mappedUserLeagues);
      }
    } catch (err) {
      console.error('Leagues load error:', err);
      Alert.alert('Hata', 'Ligler yüklenirken bir hata oluştu');
    } finally {
      setShowSkeleton(false);
    }
  }, [user]);

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadLeaguesData();
  }, [loadLeaguesData]);

  const handleJoinLeague = async (league: League) => {
    if (!user) {
      Alert.alert('Hata', 'Lige katılmak için giriş yapmalısınız');
      return;
    }

    try {
      const result = await leaguesService.joinLeague(league.id);

      if (result.data) {
        await loadLeaguesData();
        setActiveTab('my-leagues');
        Alert.alert('Başarılı', 'Lige başarıyla katıldınız!');
      }
    } catch (err) {
      console.error('Join league error:', err);
      Alert.alert('Hata', 'Lige katılırken bir hata oluştu');
    }
  };

  const handleCreateSuccess = () => {
    setActiveTab('my-leagues');
    // Verileri yenile
    loadLeaguesData();
  };

  const handleDiscoverTab = () => {
    setActiveTab('discover');
  };

  const handleShowRaceArena = (league: League) => {
    setSelectedLeague(league);
    setShowRaceArena(true);
  };

  const handleCloseRaceArena = () => {
    setShowRaceArena(false);
    setSelectedLeague(null);

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ animated: false, y: 0 });
      resetHeaderState();
    });
  };

  const handleShowLeaderboard = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
    setSelectedLeague(null);
  };

  useEffect(() => {
    if (!showRaceArena) {
      resetHeaderState();
    }
  }, [resetHeaderState, showRaceArena]);

  useEffect(() => {
    onRaceModeChange?.(showRaceArena);

    return () => {
      onRaceModeChange?.(false);
    };
  }, [onRaceModeChange, showRaceArena]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ animated: false, y: 0 });
    resetHeaderState();
  }, [activeTab, resetHeaderState]);

  // Giriş yapılmamış
  if (!user) {
    return (
      <View style={styles.container}>
        <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY}>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </Header>
        <View style={styles.loadingContent}>
          <Text style={styles.errorText}>Ligleri görüntülemek için giriş yapmalısınız</Text>
        </View>
      </View>
    );
  }

  // Show Race Arena
  if (showRaceArena && selectedLeague) {
    return <RaceArena league={selectedLeague} onClose={handleCloseRaceArena} />;
  }

  // Current user data - backend'den gelen verilerle merge et
  const currentUser = {
    avatar:
      profile?.profile_image ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
    credits: profile?.credits || 0,
    joinedLeagues: userLeagues.length,
    maxLeagues: profile?.league_quota ?? 5,
    tickets: profile?.tickets ?? 2,
    username: profile?.username || user?.email?.split('@')[0] || 'kullanici',
  };

  return (
    <View style={styles.container}>
      {/* Header with Tabs */}
      <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY}>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </Header>

      {/* Skeleton Loading */}
      {showSkeleton ? (
        <View style={styles.skeletonContainer} pointerEvents="none">
          <LeaguePageSkeleton />
        </View>
      ) : (
        /* Tab Content */
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.tabContent}>
            {activeTab === 'discover' && (
              <KesfetTab
                leagues={leagues}
                nowTick={nowTick}
                currentUser={currentUser}
                onJoinLeague={handleJoinLeague}
                onLeaderboard={handleShowLeaderboard}
              />
            )}

            {activeTab === 'my-leagues' && (
              <LiglerimTab
                leagues={userLeagues}
                nowTick={nowTick}
                currentUser={currentUser}
                onDiscoverTab={handleDiscoverTab}
                onShowRaceArena={handleShowRaceArena}
              />
            )}

            {activeTab === 'create' && <OlusturTab currentUser={currentUser} onSuccess={handleCreateSuccess} />}
          </View>
        </ScrollView>
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal visible={showLeaderboard} league={selectedLeague} onClose={handleCloseLeaderboard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 32,
    textAlign: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 180,
  },
  skeletonContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 100,
  },
  tabContent: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
