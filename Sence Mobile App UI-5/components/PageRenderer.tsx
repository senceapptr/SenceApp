import { AppState } from '../hooks/useAppState';
import { ClassicHomePage } from './ClassicHomePage';
import { ElegantHomePage } from './ElegantHomePage';
import { NeoHomePage } from './NeoHomePage';
import { DarkHomePage } from './DarkHomePage';
import { PredictPage } from './PredictPage';
import { NeoPredictPage } from './NeoPredictPage';
import { ElegantPredictPage } from './ElegantPredictPage';
import { SearchPage } from './SearchPage';
import { SearchPage2 } from './SearchPage2';
import { NeoSearchPage } from './NeoSearchPage';
import { ElegantSearchPage } from './ElegantSearchPage';
import { LeaguePage } from './LeaguePage';
import { MyBetsPage } from './MyBetsPage';
import { TriviaPage } from './TriviaPage';
import { ProfilePage } from './ProfilePage';
import { EditProfilePage } from './EditProfilePage';
import { SettingsPage } from './SettingsPage';
import { NotificationsPage } from './NotificationsPage';
import { MarketPage } from './MarketPage';
import { AppHeader } from './AppHeader';
import { featuredQuestions, questions, allPredictQuestions } from '../constants/questions';

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
  onTasksClick: () => void;
  onImmersiveViewClick: () => void;
  onFeedViewClick: () => void;
  onAlternativeViewClick: () => void;
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
  onAlternativeViewClick
}: PageRendererProps) {
  const renderPageHeader = (title: string, isHomePage: boolean = false) => (
    <AppHeader
      title={title}
      isHomePage={isHomePage}
      showProfileDropdown={showProfileDropdown}
      onToggleProfileDropdown={onToggleProfileDropdown}
      gameCredits={appState.gameCredits}
      hasNotifications={appState.hasNotifications}
      onProfileClick={onProfileClick}
      onNotificationsClick={onNotificationsClick}
      onMarketClick={onMarketClick}
      onEditProfileClick={onEditProfileClick}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
      onWriteQuestionClick={onWriteQuestionClick}
      onTasksClick={onTasksClick}
    />
  );

  if (appState.currentPage === 'trivia') {
    return <TriviaPage onBack={() => appState.setCurrentPage('home')} />;
  }

  if (appState.currentPage === 'market') {
    return <MarketPage onBack={() => appState.setCurrentPage('home')} userCredits={appState.gameCredits} />;
  }

  // SearchPage2 - Available from all modes
  if (appState.currentPage === 'search2') {
    return (
      <>
        {renderPageHeader('Keşfet 2.0')}
        <SearchPage2 
          questions={[...featuredQuestions, ...questions]} 
          onQuestionClick={handleQuestionDetail} 
          onVote={handleVote} 
          showHeader={false}
          onImmersiveViewClick={onImmersiveViewClick}
          onFeedViewClick={onFeedViewClick}
        />
      </>
    );
  }

  // Elegant Mode Pages
  if (appState.designMode === 'elegant') {
    switch (appState.currentPage) {
      case 'elegant-home':
        return (
          <ElegantHomePage
            onNavigate={appState.setCurrentPage}
            onQuestionClick={handleQuestionDetail}
            userCoins={appState.gameCredits || 0}
            userLevel={1}
            userStreak={appState.dailyStreak || 0}
          />
        );
      case 'elegant-predict':
        return (
          <PredictPage 
            questions={allPredictQuestions} 
            onVote={handleVote} 
            showHeader={false}
            maxSelections={5}
            showBoostedOdds={true}
            onNavigateHome={handleNavigateHome}
          />
        );
      case 'elegant-search':
        return (
          <>
            {renderPageHeader('Keşfet')}
            <SearchPage2 
              questions={[...featuredQuestions, ...questions]} 
              onQuestionClick={handleQuestionDetail} 
              onVote={handleVote} 
              showHeader={false}
              onImmersiveViewClick={onImmersiveViewClick}
              onFeedViewClick={onFeedViewClick}
            />
          </>
        );
      case 'elegant-league':
        return (
          <>
            {renderPageHeader('Ligler')}
            <LeaguePage showHeader={false} />
          </>
        );  
      case 'elegant-my-bets':
        return (
          <>
            {renderPageHeader('Kuponlarım')}
            <MyBetsPage showHeader={false} />
          </>
        );
      case 'elegant-profile':
        return <EditProfilePage onBack={() => appState.setCurrentPage('elegant-home')} />;
      default:
        return (
          <ElegantHomePage
            onNavigate={appState.setCurrentPage}
            onQuestionClick={handleQuestionDetail}
            userCoins={appState.gameCredits || 0}
            userLevel={1}
            userStreak={appState.dailyStreak || 0}
          />
        );
    }
  }

  // Neo Mode Pages
  if (appState.designMode === 'neo') {
    switch (appState.currentPage) {
      case 'neo-home':
        return (
          <NeoHomePage
            onNavigate={appState.setCurrentPage}
            onQuestionClick={handleQuestionDetail}
            userCoins={appState.gameCredits || 0}
            userLevel={1}
            userStreak={appState.dailyStreak || 0}
          />
        );
      case 'neo-predict':
        return (
          <NeoPredictPage 
            questions={allPredictQuestions} 
            onVote={handleVote} 
            showHeader={false}
            maxSelections={5}
            showBoostedOdds={true}
          />
        );
      case 'neo-search':
        return (
          <>
            {renderPageHeader('Keşfet')}
            <SearchPage2 
              questions={[...featuredQuestions, ...questions]} 
              onQuestionClick={handleQuestionDetail} 
              onVote={handleVote} 
              showHeader={false}
              onImmersiveViewClick={onImmersiveViewClick}
              onFeedViewClick={onFeedViewClick}
            />
          </>
        );
      case 'neo-league':
        return (
          <>
            {renderPageHeader('Ligler')}
            <LeaguePage showHeader={false} />
          </>
        );
      case 'neo-my-bets':
        return (
          <>
            {renderPageHeader('Kuponlarım')}
            <MyBetsPage showHeader={false} />
          </>
        );
      case 'neo-profile':
        return <EditProfilePage onBack={() => appState.setCurrentPage('neo-home')} />;
      default:
        return (
          <NeoHomePage
            onNavigate={appState.setCurrentPage}
            onQuestionClick={handleQuestionDetail}
            userCoins={appState.gameCredits || 0}
            userLevel={1}
            userStreak={appState.dailyStreak || 0}
          />
        );
    }
  }

  // Classic Mode Pages
  switch (appState.currentPage) {
    case 'dark-home':
      return (
        <DarkHomePage
          onNavigate={appState.setCurrentPage}
          onQuestionClick={handleQuestionDetail}
          userCoins={appState.gameCredits || 0}
          dailyPredictions={appState.dailyPredictions || 0}
          yesterdayResults={appState.yesterdayResults || []}
        />
      );
    case 'predict':
      return (
        <PredictPage 
          questions={allPredictQuestions} 
          onVote={handleVote} 
          showHeader={false}
          maxSelections={5}
          showBoostedOdds={true}
          onNavigateHome={handleNavigateHome}
        />
      );
    case 'search':
      return (
        <>
          {renderPageHeader('Keşfet')}
          <SearchPage2 
            questions={[...featuredQuestions, ...questions]} 
            onQuestionClick={handleQuestionDetail} 
            onVote={handleVote} 
            showHeader={false}
            onImmersiveViewClick={onImmersiveViewClick}
            onFeedViewClick={onFeedViewClick}
          />
        </>
      );
    case 'my-bets':
      return (
        <>
          {renderPageHeader('Kuponlarım')}
          <MyBetsPage showHeader={false} />
        </>
      );
    case 'league':
      return (
        <>
          {renderPageHeader('Ligler')}
          <LeaguePage showHeader={false} />
        </>
      );
    case 'profile':
      return <ProfilePage onBack={() => appState.setCurrentPage('home')} onFollowersClick={handleFollowersClick} />;
    case 'followers':
      return <ProfilePage onBack={() => appState.setCurrentPage('profile')} onFollowersClick={handleFollowersClick} />;
    case 'edit-profile':
      return <EditProfilePage onBack={() => appState.setCurrentPage('home')} />;
    case 'settings':
      return <SettingsPage onBack={() => appState.setCurrentPage('home')} />;
    case 'notifications':
      return <NotificationsPage onBack={() => appState.setCurrentPage('home')} />;
    default:
      return (
        <ClassicHomePage
          selectedCategory={appState.selectedCategory}
          setSelectedCategory={appState.setSelectedCategory}
          setCurrentPage={appState.setCurrentPage}
          handleQuestionDetail={handleQuestionDetail}
          handleVote={handleVote}
          scrollY={appState.scrollY}
          gameCredits={appState.gameCredits}
          setProfileDrawerOpen={appState.setProfileDrawerOpen}
          hasNotifications={appState.hasNotifications}
          renderHeader={(title: string, isHomePage?: boolean) => renderPageHeader(title, isHomePage)}
          onAlternativeViewClick={onAlternativeViewClick}
        />
      );
  }
}