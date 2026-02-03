import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { League, User } from '../types';
import { SearchBar } from './SearchBar';
import { FeaturedSection } from './FeaturedSection';
import { CommunitySection } from './CommunitySection';
import { DiscoverLeagueModal } from './DiscoverLeagueModal';
import { JoinConfirmModal } from './JoinConfirmModal';
import { JoinSuccessAnimation } from './JoinSuccessAnimation';
import { ScoringModal } from './ScoringModal';
import { LeaderboardModal } from '../shared/LeaderboardModal';

interface KesfetTabProps {
  leagues: League[];
  currentUser: User;
  onJoinLeague: (league: League) => void;
  onLeaderboard: (league: League) => void;
}

export function KesfetTab({ leagues, currentUser, onJoinLeague, onLeaderboard }: KesfetTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const filteredLeagues = leagues.filter(league => {
    if (!searchQuery) return true;
    return (
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const featuredLeagues = filteredLeagues.filter(league => league.isFeatured);
  const communityLeagues = filteredLeagues.filter(league => !league.isFeatured);

  const handleCardPress = (league: League) => {
    setSelectedLeague(league);
    setShowDetails(true);
  };

  const handleJoinPress = (league: League) => {
    setSelectedLeague(league);
    setShowJoinConfirm(true);
  };

  const handleJoinFromModal = () => {
    setShowDetails(false);
    if (selectedLeague) {
      handleJoinPress(selectedLeague);
    }
  };

  const handleConfirmJoin = () => {
    if (selectedLeague) {
      setShowJoinConfirm(false);
      setShowJoinSuccess(true);
      
      setTimeout(() => {
        setShowJoinSuccess(false);
        onJoinLeague(selectedLeague);
      }, 2500);
    }
  };

  const handleLeaderboardFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      if (selectedLeague) {
        setShowLeaderboard(true);
      }
    }, 100);
  };

  const handleScoringFromModal = () => {
    setShowDetails(false);
    setTimeout(() => {
      setShowScoring(true);
    }, 100);
  };

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FeaturedSection 
        leagues={featuredLeagues} 
        onCardPress={handleCardPress}
        onJoinPress={handleJoinPress}
      />
      <CommunitySection 
        leagues={communityLeagues} 
        onCardPress={handleCardPress}
        onJoinPress={handleJoinPress}
      />

      <DiscoverLeagueModal
        visible={showDetails}
        league={selectedLeague}
        onClose={() => setShowDetails(false)}
        onJoin={handleJoinFromModal}
        onLeaderboard={handleLeaderboardFromModal}
        onScoring={handleScoringFromModal}
      />

      <JoinConfirmModal
        visible={showJoinConfirm}
        league={selectedLeague}
        currentUser={currentUser}
        onClose={() => setShowJoinConfirm(false)}
        onConfirm={handleConfirmJoin}
      />

      <JoinSuccessAnimation visible={showJoinSuccess} />

      <ScoringModal
        visible={showScoring}
        league={selectedLeague}
        onClose={() => setShowScoring(false)}
      />

      <LeaderboardModal
        visible={showLeaderboard}
        league={selectedLeague}
        onClose={() => setShowLeaderboard(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

