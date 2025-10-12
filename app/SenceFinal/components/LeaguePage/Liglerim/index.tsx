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
import { LeagueQuestionsPage } from './LeagueQuestionsPage';

interface LiglerimTabProps {
  leagues: League[];
  currentUser: User;
  onDiscoverTab: () => void;
}

export function LiglerimTab({ leagues, currentUser, onDiscoverTab }: LiglerimTabProps) {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const myLeagues = leagues.filter(league => league.isJoined);
  const activeLeagues = myLeagues.filter(league => league.status === 'active');
  const completedLeagues = myLeagues.filter(league => league.status === 'completed');

  const handleCardPress = (league: League) => {
    setSelectedLeague(league);
    setShowDetails(true);
  };

  const handleQuestionsPress = (league: League) => {
    setSelectedLeague(league);
    setShowQuestions(true);
  };

  const handleQuestionsFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      setShowQuestions(true);
    }, 100);
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

  // Show questions page
  if (showQuestions && selectedLeague) {
    return (
      <LeagueQuestionsPage
        onBack={() => {
          setShowQuestions(false);
          setSelectedLeague(null);
        }}
        leagueName={selectedLeague.name}
        leagueCategories={selectedLeague.categories}
      />
    );
  }

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

