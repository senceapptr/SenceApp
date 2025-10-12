import React from 'react';
import { ClassicHomePage } from './ClassicHomePage';
import { SearchPage } from './SearchPage';
import { MyBetsPage } from './MyBetsPage';
import { ProfilePage } from './ProfilePage';
import { EditProfilePage } from './EditProfilePage';
import { SettingsPage } from './SettingsPage';
import { TriviaPage } from './TriviaPage';
import { PredictPage } from './PredictPage';
import { LeaguePage } from './LeaguePage';
import { MarketPage } from './MarketPage';

interface PageRendererProps {
  appState: any;
  handleQuestionDetail: (question: any) => void;
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
  onTasksClick: () => void;
  onImmersiveViewClick: () => void;
  onFeedViewClick: () => void;
  onAlternativeViewClick: () => void;
  onAlternativeSearchClick: () => void;
  onAlternativeCouponsClick?: () => void;
  onAlternativeLeagueClick?: () => void;
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
  onWriteQuestionClick,
  onTasksClick,
  onImmersiveViewClick,
  onFeedViewClick,
  onAlternativeViewClick,
  onAlternativeSearchClick,
  onAlternativeCouponsClick,
  onAlternativeLeagueClick
}: PageRendererProps) {
  
  if (appState.currentPage === 'home') {
    return (
      <ClassicHomePage
        onQuestionDetail={handleQuestionDetail}
        onVote={handleVote}
        onFollowersClick={handleFollowersClick}
        onNavigateHome={handleNavigateHome}
        showProfileDropdown={showProfileDropdown}
        onToggleProfileDropdown={onToggleProfileDropdown}
        onProfileClick={onProfileClick}
        onNotificationsClick={onNotificationsClick}
        onMarketClick={onMarketClick}
        onEditProfileClick={onEditProfileClick}
        onSettingsClick={onSettingsClick}
        onLogoutClick={onLogoutClick}
        onWriteQuestionClick={onWriteQuestionClick}
        onTasksClick={onTasksClick}
        onImmersiveViewClick={onImmersiveViewClick}
        onFeedViewClick={onFeedViewClick}
        onAlternativeViewClick={onAlternativeViewClick}
        onAlternativeSearchClick={onAlternativeSearchClick}
      />
    );
  }

  if (appState.currentPage === 'search') {
    return (
      <SearchPage
        onQuestionDetail={handleQuestionDetail}
        onVote={handleVote}
        onAlternativeSearchClick={onAlternativeSearchClick}
      />
    );
  }

  if (appState.currentPage === 'predict') {
    return (
      <MyBetsPage
        onQuestionDetail={handleQuestionDetail}
        onVote={handleVote}
        onNavigateToAlternativeCoupons={onAlternativeCouponsClick}
      />
    );
  }

  if (appState.currentPage === 'league') {
    return (
      <LeaguePage
        onNavigateToAlternative={onAlternativeLeagueClick}
      />
    );
  }

  if (appState.currentPage === 'profile') {
    return (
      <ProfilePage
        onEditProfile={onEditProfileClick}
        onFollowersClick={handleFollowersClick}
        onSettingsClick={onSettingsClick}
        onLogoutClick={onLogoutClick}
      />
    );
  }

  if (appState.currentPage === 'editProfile') {
    return (
      <EditProfilePage
        onBack={() => appState.setCurrentPage('profile')}
      />
    );
  }

  if (appState.currentPage === 'settings') {
    return (
      <SettingsPage
        onBack={() => appState.setCurrentPage('profile')}
      />
    );
  }

  if (appState.currentPage === 'trivia') {
    return (
      <TriviaPage
        onBack={() => appState.setCurrentPage('home')}
        onQuestionDetail={handleQuestionDetail}
        onVote={handleVote}
      />
    );
  }

  if (appState.currentPage === 'market') {
    return (
      <MarketPage
        onBack={() => appState.setCurrentPage('home')}
      />
    );
  }

  // Default fallback
  return (
    <ClassicHomePage
      onQuestionDetail={handleQuestionDetail}
      onVote={handleVote}
      onFollowersClick={handleFollowersClick}
      onNavigateHome={handleNavigateHome}
      showProfileDropdown={showProfileDropdown}
      onToggleProfileDropdown={onToggleProfileDropdown}
      onProfileClick={onProfileClick}
      onNotificationsClick={onNotificationsClick}
      onMarketClick={onMarketClick}
      onEditProfileClick={onEditProfileClick}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
      onWriteQuestionClick={onWriteQuestionClick}
      onTasksClick={onTasksClick}
      onImmersiveViewClick={onImmersiveViewClick}
      onFeedViewClick={onFeedViewClick}
      onAlternativeViewClick={onAlternativeViewClick}
      onAlternativeSearchClick={onAlternativeSearchClick}
    />
  );
}