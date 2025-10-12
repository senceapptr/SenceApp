import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TabType, League } from './types';
import { mockLeaguesData, mockCurrentUser } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './shared/Header';
import { TabBar } from './shared/TabBar';
import { KesfetTab } from './Kesfet';
import { LiglerimTab } from './Liglerim';
import { OlusturTab } from './Olustur';

interface LeaguePageProps {
  onBack: () => void;
  handleQuestionDetail: (question: any) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
}

export function LeaguePage({ 
  onBack,
  handleQuestionDetail,
  handleVote,
  onMenuToggle
}: LeaguePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [leagues, setLeagues] = useState<League[]>(mockLeaguesData);
  const { headerTranslateY, handleScroll } = useHeaderAnimation();

  const handleJoinLeague = (league: League) => {
    setLeagues(prev => prev.map(l => 
      l.id === league.id 
        ? { ...l, isJoined: true, participants: l.participants + 1, position: Math.floor(Math.random() * 50) + 1 }
        : l
    ));
    setActiveTab('my-leagues');
  };

  const handleCreateSuccess = () => {
    setActiveTab('my-leagues');
  };

  const handleDiscoverTab = () => {
    setActiveTab('discover');
  };

  return (
    <View style={styles.container}>
      {/* Header with Tabs */}
      <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY}>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </Header>

      {/* Tab Content */}
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
              currentUser={mockCurrentUser}
              onJoinLeague={handleJoinLeague}
              onLeaderboard={(league) => {}}
            />
          )}

          {activeTab === 'my-leagues' && (
            <LiglerimTab 
              leagues={leagues}
              currentUser={mockCurrentUser}
              onDiscoverTab={handleDiscoverTab}
            />
          )}

          {activeTab === 'create' && (
            <OlusturTab 
              currentUser={mockCurrentUser}
              onSuccess={handleCreateSuccess}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
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
});

