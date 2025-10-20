import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { League, User } from '../types';
import { LeagueProgressCard } from './LeagueProgressCard';
import { ActiveSection } from './ActiveSection';
import { CompletedSection } from './CompletedSection';
import { EmptyState } from './EmptyState';
import { MyLeagueModal } from './MyLeagueModal';
import { ChatModal } from './ChatModal';
import { LeaderboardModal } from '../shared/LeaderboardModal';
import { LeagueInviteModal } from '../LeagueInviteModal';

interface LiglerimTabProps {
  leagues: League[];
  currentUser: User;
  onDiscoverTab: () => void;
  onShowLeagueQuestions: (league: League) => void;
}

export function LiglerimTab({ leagues, currentUser, onDiscoverTab, onShowLeagueQuestions }: LiglerimTabProps) {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const myLeagues = leagues.filter(league => league.isJoined);
  const activeLeagues = myLeagues.filter(league => league.status === 'active');
  const completedLeagues = myLeagues.filter(league => league.status === 'completed');

  const handleCardPress = (league: League) => {
    setSelectedLeague(league);
    setShowDetails(true);
  };

  const handleQuestionsPress = (league: League) => {
    onShowLeagueQuestions(league);
  };

  const handleQuestionsFromModal = () => {
    setShowDetails(false);
    if (selectedLeague) {
      setTimeout(() => {
        onShowLeagueQuestions(selectedLeague);
      }, 300);
    }
  };

  const handleLeaderboardPress = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleLeaderboardFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      setShowLeaderboard(true);
    }, 100);
  };

  const handleChatPress = (league: League) => {
    setSelectedLeague(league);
    setShowChat(true);
  };

  const handleChatFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      setShowChat(true);
    }, 100);
  };

  const handleShareFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      setShowInvite(true);
    }, 100);
  };

  const handleApproveRequest = (userId: string) => {
    console.log('Approved user:', userId);
    // Here you would call your API to approve the request
  };

  const handleRejectRequest = (userId: string) => {
    console.log('Rejected user:', userId);
    // Here you would call your API to reject the request
  };

  // Mock pending requests data
  const mockPendingRequests = [
    {
      userId: '1',
      username: 'ahmet_yilmaz',
      avatar: 'https://i.pravatar.cc/150?img=1',
      requestDate: '2 saat önce',
      predictionCount: 145,
      accuracy: 78,
      bio: 'Spor tahminlerinde uzmanım'
    },
    {
      userId: '2',
      username: 'zeynep_kaya',
      avatar: 'https://i.pravatar.cc/150?img=5',
      requestDate: '5 saat önce',
      predictionCount: 89,
      accuracy: 65,
      bio: 'Teknoloji ve finans takipçisiyim'
    },
    {
      userId: '3',
      username: 'mehmet_demir',
      avatar: 'https://i.pravatar.cc/150?img=3',
      requestDate: '1 gün önce',
      predictionCount: 234,
      accuracy: 82,
    },
  ];

  return (
    <View style={styles.container}>
      <LeagueProgressCard currentUser={currentUser} />

      <ActiveSection
        leagues={activeLeagues}
        onCardPress={handleCardPress}
        onQuestionsPress={handleQuestionsPress}
        onLeaderboardPress={handleLeaderboardPress}
        onChatPress={handleChatPress}
      />

      <CompletedSection
        leagues={completedLeagues}
        onCardPress={handleCardPress}
        onQuestionsPress={handleQuestionsPress}
        onLeaderboardPress={handleLeaderboardPress}
        onChatPress={handleChatPress}
      />

      {myLeagues.length === 0 && (
        <EmptyState onDiscover={onDiscoverTab} />
      )}

      <MyLeagueModal
        visible={showDetails}
        league={selectedLeague}
        onClose={() => setShowDetails(false)}
        onQuestions={handleQuestionsFromModal}
        onLeaderboard={handleLeaderboardFromModal}
        onChat={handleChatFromModal}
        onShare={handleShareFromModal}
      />

      <LeaderboardModal
        visible={showLeaderboard}
        league={selectedLeague}
        onClose={() => setShowLeaderboard(false)}
      />

      <ChatModal
        visible={showChat}
        league={selectedLeague}
        onClose={() => setShowChat(false)}
      />

      <LeagueInviteModal
        visible={showInvite}
        leagueName={selectedLeague?.name || ''}
        leagueId={selectedLeague?.id.toString() || ''}
        leagueDescription={selectedLeague?.description}
        memberCount={selectedLeague?.participants || 0}
        isPrivate={selectedLeague?.isPrivate || false}
        isAdmin={true}
        pendingRequests={mockPendingRequests}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        onClose={() => setShowInvite(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

