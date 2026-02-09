import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';
import { TabType, League } from './types';
import { mockCurrentUser } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './shared/Header';
import { TabBar } from './shared/TabBar';
import { KesfetTab } from './Kesfet';
import { LiglerimTab } from './Liglerim';
import { OlusturTab } from './Olustur';
import { RaceArena } from './Arena';
import { LeaderboardModal } from './shared/LeaderboardModal';
import { LeaguePageSkeleton } from './LeaguePageSkeleton';

interface LeaguePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: string) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
}

export function LeaguePage({
  onBack,
  handleQuestionDetail,
  handleVote,
  onMenuToggle
}: LeaguePageProps) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [userLeagues, setUserLeagues] = useState<League[]>([]);
  const [showRaceArena, setShowRaceArena] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { headerTranslateY, handleScroll } = useHeaderAnimation();

  // Backend'den lig verilerini yükle
  const loadLeaguesData = async () => {
    if (!user) {
      setLoading(false);
      setShowSkeleton(false);
      return;
    }

    try {
      setLoading(true);
      setShowSkeleton(true);

      // Paralel olarak public ligler ve kullanıcının liglerini yükle
      const [publicLeaguesResult, userLeaguesResult] = await Promise.all([
        leaguesService.getPublicLeagues(),
        leaguesService.getUserLeagues(user.id),
      ]);

      // Public ligler
      if (publicLeaguesResult.data) {
        const mappedPublicLeagues: League[] = publicLeaguesResult.data.map((league: any) => ({
          id: league.id, // UUID string olarak kullan
          name: league.name,
          description: league.description || '',
          category: league.categories?.name || 'Genel',
          categories: [league.categories?.name || 'Genel'],
          icon: league.categories?.icon || '🏆',
          participants: league.current_members || 0,
          maxParticipants: league.max_members || 100,
          prize: `${league.prize_pool || 0} kredi`,
          endDate: league.end_date ? new Date(league.end_date).toLocaleDateString('tr-TR') : 'Süresiz',
          isJoined: false, // Public liglerde isJoined false
          creator: league.creator_id || 'Anonim',
          joinCost: league.entry_fee || 0,
          isFeatured: false,
          status: league.status === 'active' ? 'active' : 'completed',
          isPrivate: league.type !== 'public',
          pointSystem: 'Her doğru tahmin için puan kazanırsın.',
        }));
        setLeagues(mappedPublicLeagues);
      }

      // Kullanıcının ligleri
      if (userLeaguesResult.data) {
        const mappedUserLeagues: League[] = userLeaguesResult.data.map((member: any) => {
          const league = member.leagues;
          return {
            id: league.id, // UUID string olarak kullan
            name: league.name,
            description: league.description || '',
            category: league.categories?.name || 'Genel',
            categories: [league.categories?.name || 'Genel'],
            icon: league.categories?.icon || '🏆',
            participants: league.current_members || 0,
            maxParticipants: league.max_members || 100,
            prize: `${league.prize_pool || 0} kredi`,
            endDate: league.end_date ? new Date(league.end_date).toLocaleDateString('tr-TR') : 'Süresiz',
            isJoined: true,
            position: member.rank || 0,
            creator: league.creator_id || 'Anonim',
            joinCost: league.entry_fee || 0,
            isFeatured: false,
            status: league.status === 'active' ? 'active' : 'completed',
            isPrivate: league.type !== 'public',
            pointSystem: 'Her doğru tahmin için puan kazanırsın.',
          };
        });
        setUserLeagues(mappedUserLeagues);
      }

    } catch (err) {
      console.error('Leagues load error:', err);
      Alert.alert('Hata', 'Ligler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadLeaguesData();
  }, [user]);

  const handleJoinLeague = async (league: League) => {
    if (!user) {
      Alert.alert('Hata', 'Lige katılmak için giriş yapmalısınız');
      return;
    }

    try {
      const result = await leaguesService.joinLeague(league.id);

      if (result.data) {
        // Başarılı katılım
        setLeagues(prev => prev.map(l =>
          l.id === league.id
            ? { ...l, isJoined: true, participants: l.participants + 1, position: Math.floor(Math.random() * 50) + 1 }
            : l
        ));
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
  };

  const handleShowLeaderboard = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
    setSelectedLeague(null);
  };

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
    return (
      <RaceArena
        league={selectedLeague}
        onClose={handleCloseRaceArena}
      />
    );
  }

  // Current user data - backend'den gelen verilerle merge et
  const currentUser = {
    username: profile?.username || user?.email?.split('@')[0] || 'kullanici',
    avatar: profile?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
    joinedLeagues: userLeagues.length,
    maxLeagues: 5, // TODO: Backend'den al
    credits: profile?.credits || 0,
    tickets: 2 // TODO: Backend'den al
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
                currentUser={currentUser}
                onJoinLeague={handleJoinLeague}
                onLeaderboard={handleShowLeaderboard}
              />
            )}

            {activeTab === 'my-leagues' && (
              <LiglerimTab
                leagues={userLeagues}
                currentUser={currentUser}
                onDiscoverTab={handleDiscoverTab}
                onShowRaceArena={handleShowRaceArena}
              />
            )}

            {activeTab === 'create' && (
              <OlusturTab
                currentUser={currentUser}
                onSuccess={handleCreateSuccess}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        visible={showLeaderboard}
        league={selectedLeague}
        onClose={handleCloseLeaderboard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  skeletonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 180,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

