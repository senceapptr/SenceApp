import React from 'react';
import { View, Text } from 'react-native';
import { AppState } from '../hooks/useAppState';
import { ClassicHomePage } from './ClassicHomePage';
import { SearchPage } from './SearchPage';
import { MyBetsPage } from './MyBetsPage';
import { LeaguePage } from './LeaguePage';
import { ProfilePage } from './ProfilePage';
import { MarketPage } from './MarketPage';
import { WriteQuestionPage } from './WriteQuestionPage';
import { EditProfilePage } from './EditProfilePage';
import { SettingsPage } from './SettingsPage';
import { TriviaPage } from './TriviaPage';
import { PredictPage } from './PredictPage';
import { featuredQuestions, questions } from '../constants/questions';

// Placeholder components
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F3F5' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#432870' }}>{title}</Text>
    <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>Yakında eklenecek...</Text>
  </View>
);

interface PageRendererProps {
  appState: AppState;
  handleQuestionDetail: (questionId: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  handleFollowersClick: (tab: 'followers' | 'following' | 'activity') => void;
  handleNavigateHome: () => void;
  showProfileDropdown: boolean;
  onToggleProfileDropdown: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onMarketClick: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onWriteQuestionClick: () => void;
}

export function PageRenderer({
  appState,
  handleQuestionDetail,
  handleVote,
  handleFollowersClick,
  handleNavigateHome,
  showProfileDropdown,
  onToggleProfileDropdown,
  onProfileClick,
  onNotificationsClick,
  onMarketClick,
  onEditProfileClick,
  onSettingsClick,
  onLogoutClick,
  onWriteQuestionClick
}: PageRendererProps) {

  // Handle special pages first
  if (appState.currentPage === 'trivia') {
    return (
      <TriviaPage
        onBack={() => appState.setCurrentPage('home')}
        gameCredits={appState.gameCredits}
        setProfileDrawerOpen={appState.setProfileDrawerOpen}
        hasNotifications={appState.hasNotifications}
      />
    );
  }

  if (appState.currentPage === 'predict') {
    return (
      <PredictPage
        onBack={() => appState.setCurrentPage('home')}
        gameCredits={appState.gameCredits}
        setProfileDrawerOpen={appState.setProfileDrawerOpen}
        hasNotifications={appState.hasNotifications}
      />
    );
  }



  if (appState.currentPage === 'profile') {
    return (
      <ProfilePage
        onBack={() => appState.setCurrentPage('home')}
        onNotifications={() => appState.setNotificationsOpen(true)}
        onEditProfile={() => appState.setCurrentPage('edit-profile')}
        onFollowersClick={handleFollowersClick}
      />
    );
  }

  if (appState.currentPage === 'edit-profile') {
    return (
      <EditProfilePage
        onBack={() => appState.setCurrentPage('profile')}
      />
    );
  }

  if (appState.currentPage === 'settings') {
    return (
      <SettingsPage
        onBack={() => appState.setCurrentPage('home')}
      />
    );
  }

  if (appState.currentPage === 'market') {
    return (
      <MarketPage
        onBack={() => appState.setCurrentPage('home')}
        gameCredits={appState.gameCredits}
        setProfileDrawerOpen={appState.setProfileDrawerOpen}
        hasNotifications={appState.hasNotifications}
      />
    );
  }

  if (appState.currentPage === 'write-question') {
    return (
      <WriteQuestionPage
        onBack={() => appState.setCurrentPage('home')}
      />
    );
  }

  // Main pages
  switch (appState.currentPage) {
    case 'home':
      return (
        <ClassicHomePage
          selectedCategory={appState.selectedCategory}
          setSelectedCategory={appState.setSelectedCategory}
          setCurrentPage={appState.setCurrentPage}
          handleQuestionDetail={handleQuestionDetail}
          handleVote={handleVote}
          gameCredits={appState.gameCredits}
          setProfileDrawerOpen={appState.setProfileDrawerOpen}
          hasNotifications={appState.hasNotifications}
        />
      );

    case 'search':
      return (
        <SearchPage 
          questions={[...featuredQuestions, ...questions]} 
          onQuestionClick={handleQuestionDetail} 
          onVote={handleVote} 
          showHeader={true}
          gameCredits={appState.gameCredits}
          setProfileDrawerOpen={appState.setProfileDrawerOpen}
          hasNotifications={appState.hasNotifications}
        />
      );

    case 'predict':
      return <PlaceholderScreen title="Tahmin Modu" />;

    case 'league':
      return (
        <LeaguePage 
          showHeader={true} 
          onNavigate={appState.setCurrentPage}
          gameCredits={appState.gameCredits}
          setProfileDrawerOpen={appState.setProfileDrawerOpen}
          hasNotifications={appState.hasNotifications}
        />
      );

    case 'my-bets':
      return (
        <MyBetsPage 
          showHeader={true}
          gameCredits={appState.gameCredits}
          setProfileDrawerOpen={appState.setProfileDrawerOpen}
          hasNotifications={appState.hasNotifications}
        />
      );

    default:
      // Default to home
      return (
        <ClassicHomePage
          selectedCategory={appState.selectedCategory}
          setSelectedCategory={appState.setSelectedCategory}
          setCurrentPage={appState.setCurrentPage}
          handleQuestionDetail={handleQuestionDetail}
          handleVote={handleVote}
          gameCredits={appState.gameCredits}
          setProfileDrawerOpen={appState.setProfileDrawerOpen}
          hasNotifications={appState.hasNotifications}
        />
      );
  }
} 