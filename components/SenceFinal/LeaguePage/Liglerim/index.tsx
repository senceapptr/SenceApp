import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { leaguesService, PendingLeagueRequest } from '@/services/leagues.service';

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
  nowTick: number;
  currentUser: User;
  onDiscoverTab: () => void;
  onShowRaceArena: (league: League) => void;
}

export function LiglerimTab({ leagues, nowTick, currentUser, onDiscoverTab, onShowRaceArena }: LiglerimTabProps) {
  const { user } = useAuth();
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingLeagueRequest[]>([]);

  const myLeagues = leagues.filter(league => league.isJoined);
  const activeLeagues = myLeagues.filter(league => league.status === 'active');
  const completedLeagues = myLeagues.filter(league => league.status === 'completed');

  const handleCardPress = (league: League) => {
    setSelectedLeague(league);
    setShowDetails(true);
  };

  const handleRacePress = (league: League) => {
    onShowRaceArena(league);
  };

  const handleRaceFromModal = () => {
    setShowDetails(false);
    if (selectedLeague) {
      setTimeout(() => {
        onShowRaceArena(selectedLeague);
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

  const loadPendingRequests = async (leagueId: string) => {
    const result = await leaguesService.getPendingLeagueRequests(leagueId);
    setPendingRequests(result.data || []);
  };

  const handleShareFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      if (selectedLeague?.isPrivate) {
        void loadPendingRequests(selectedLeague.id);
      } else {
        setPendingRequests([]);
      }
      setShowInvite(true);
    }, 100);
  };

  const handleApproveRequest = async (userId: string) => {
    if (!selectedLeague) return;

    const result = await leaguesService.approveLeagueRequest(selectedLeague.id, userId);
    if (result.error) return;

    setPendingRequests(prev => prev.filter(request => request.userId !== userId));
    setSelectedLeague(prev => (prev ? { ...prev, participants: prev.participants + 1 } : prev));
  };

  const handleRejectRequest = async (userId: string) => {
    if (!selectedLeague) return;

    const result = await leaguesService.rejectLeagueRequest(selectedLeague.id, userId);
    if (result.error) return;

    setPendingRequests(prev => prev.filter(request => request.userId !== userId));
  };

  return (
    <View style={styles.container}>
      <LeagueProgressCard currentUser={currentUser} />

      <ActiveSection
        leagues={activeLeagues}
        nowTick={nowTick}
        onCardPress={handleCardPress}
        onQuestionsPress={handleRacePress}
        onLeaderboardPress={handleLeaderboardPress}
        onChatPress={handleChatPress}
      />

      <CompletedSection
        leagues={completedLeagues}
        nowTick={nowTick}
        onCardPress={handleCardPress}
        onQuestionsPress={handleRacePress}
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
        onQuestions={handleRaceFromModal}
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
        leagueIconName={selectedLeague?.leagueIconName}
        leagueIconColor={selectedLeague?.leagueIconColor}
        memberCount={selectedLeague?.participants || 0}
        isPrivate={selectedLeague?.isPrivate || false}
        isAdmin={selectedLeague?.creatorId === user?.id}
        pendingRequests={pendingRequests}
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
