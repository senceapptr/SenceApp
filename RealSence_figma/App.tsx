import { useAppState } from './hooks/useAppState';
import { AuthenticationScreens } from './components/AuthenticationScreens';
import { ClassicHomePage } from './components/ClassicHomePage';
import { BottomTabs } from './components/BottomTabs';
import { NeoBottomTabs } from './components/NeoBottomTabs';
import { ElegantBottomTabs } from './components/ElegantBottomTabs';
import { ProfileDrawer } from './components/ProfileDrawer';
import { QuestionDetail } from './components/QuestionDetail';
import { SocialQuestionDetail } from './components/SocialQuestionDetail';
import { CouponDrawer } from './components/CouponDrawer';
import { NotificationsPage } from './components/NotificationsPage';
import { PredictPage } from './components/PredictPage';
import { NeoPredictPage } from './components/NeoPredictPage';
import { ElegantPredictPage } from './components/ElegantPredictPage';
import { MyBetsPage } from './components/MyBetsPage';
import { LeaguePage } from './components/LeaguePage';
import { SearchPage } from './components/SearchPage';
import { NeoSearchPage } from './components/NeoSearchPage';
import { ElegantSearchPage } from './components/ElegantSearchPage';
import { DarkHomePage } from './components/DarkHomePage';
import { NeoHomePage } from './components/NeoHomePage';
import { ElegantHomePage } from './components/ElegantHomePage';
import { TriviaPage } from './components/TriviaPage';
import { EditProfilePage } from './components/EditProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { getDesignModeInfo, getBackgroundClass, cycleDesignMode, getInitialPageForMode } from './utils/designMode';
import { findQuestionById, createVoteSelection, animateButtonFeedback } from './utils/questionHelpers';
import { featuredQuestions, questions, allPredictQuestions } from './constants/questions';

export default function App() {
  const appState = useAppState();

  // Authentication handlers
  const handleLogin = () => {
    localStorage.setItem('sence_auth', 'true');
    appState.setIsAuthenticated(true);
    appState.setAuthScreen('welcome');
  };

  const handleSignUp = () => {
    localStorage.setItem('sence_auth', 'true');
    appState.setIsAuthenticated(true);
    appState.setAuthScreen('welcome');
    appState.setGameCredits(500);
  };

  const handleLogout = () => {
    localStorage.removeItem('sence_auth');
    appState.setIsAuthenticated(false);
    appState.setAuthScreen('welcome');
    appState.setCurrentPage('home');
  };

  // Design mode handler
  const handleCycleDesignMode = () => {
    const newMode = cycleDesignMode(appState.designMode);
    appState.setDesignMode(newMode);
    localStorage.setItem('sence_design_mode', newMode);
    appState.setCurrentPage(getInitialPageForMode(newMode));
  };

  // Vote handler
  const handleVote = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    if (appState.couponSelections.length >= 5) {
      alert('Kuponunda 5 tahmin var! Yeni tahmin eklemek için önce kuponunu temizle.');
      return;
    }

    const selection = createVoteSelection(questionId, vote, odds);
    if (selection) {
      appState.setCouponSelections(prev => {
        const existing = prev.find(s => s.id === questionId);
        if (existing) {
          return prev.map(s => s.id === questionId ? selection : s);
        }
        return prev.length < 5 ? [...prev, selection] : prev;
      });
      appState.setCouponDrawerOpen(true);
      animateButtonFeedback();
    }
  };

  // Question detail handler
  const handleQuestionDetail = (questionId: number) => {
    const question = findQuestionById(questionId);
    appState.setSelectedQuestion(question);
    
    if (appState.currentPage === 'dark-home') {
      appState.setSocialQuestionDetailOpen(true);
    } else {
      appState.setQuestionDetailOpen(true);
    }
  };

  // Common header component for pages
  const renderPageHeader = (title: string) => (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 px-5 pt-12 pb-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent tracking-tight">
            Sence
          </h1>
          <span className="text-gray-400">•</span>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-gray-800 font-bold text-sm">@kullanici</p>
            <p className="text-gray-500 text-xs">{appState.gameCredits} kredi</p>
          </div>
          <div className="relative">
            <button
              onClick={() => appState.setProfileDrawerOpen(true)}
              className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-all duration-300"
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            {appState.hasNotifications && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Page rendering logic
  const renderCurrentPage = () => {
    if (appState.currentPage === 'trivia') {
      return <TriviaPage onBack={() => appState.setCurrentPage('home')} />;
    }

    // Elegant Mode Pages
    if (appState.designMode === 'elegant') {
      switch (appState.currentPage) {
        case 'elegant-home':
          return (
            <ElegantHomePage
              onNavigate={appState.setCurrentPage}
              onQuestionClick={handleQuestionDetail}
              userCoins={appState.userCoins}
              userLevel={appState.userLevel}
              userStreak={appState.dailyStreak}
            />
          );
        case 'elegant-predict':
          return (
            <>
              {renderPageHeader('Keşfet')}
              <SearchPage 
                questions={[...featuredQuestions, ...questions]} 
                onQuestionClick={handleQuestionDetail} 
                onVote={handleVote} 
                showHeader={false}
              />
            </>
          );
        case 'elegant-search':
          return (
            <>
              {renderPageHeader('Hızlı Tahmin')}
              <PredictPage 
                questions={allPredictQuestions} 
                onVote={handleVote} 
                showHeader={false}
                maxSelections={5}
                showBoostedOdds={true}
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
              userCoins={appState.userCoins}
              userLevel={appState.userLevel}
              userStreak={appState.dailyStreak}
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
              userCoins={appState.userCoins}
              userLevel={appState.userLevel}
              userStreak={appState.dailyStreak}
            />
          );
        case 'neo-predict':
          return (
            <>
              {renderPageHeader('Keşfet')}
              <NeoSearchPage 
                questions={[...featuredQuestions, ...questions]} 
                onQuestionClick={handleQuestionDetail} 
                onVote={handleVote} 
                showHeader={false}
              />
            </>
          );
        case 'neo-search':
          return (
            <>
              {renderPageHeader('Hızlı Tahmin')}
              <NeoPredictPage 
                questions={allPredictQuestions} 
                onVote={handleVote} 
                showHeader={false}
                maxSelections={5}
                showBoostedOdds={true}
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
              userCoins={appState.userCoins}
              userLevel={appState.userLevel}
              userStreak={appState.dailyStreak}
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
            userCoins={appState.userCoins}
            dailyPredictions={appState.dailyPredictions}
            yesterdayResults={appState.yesterdayResults}
          />
        );
      case 'predict':
        return (
          <>
            {renderPageHeader('Keşfet')}
            <SearchPage 
              questions={[...featuredQuestions, ...questions]} 
              onQuestionClick={handleQuestionDetail} 
              onVote={handleVote} 
              showHeader={false}
            />
          </>
        );
      case 'search':
        return (
          <>
            {renderPageHeader('Hızlı Tahmin')}
            <PredictPage 
              questions={allPredictQuestions} 
              onVote={handleVote} 
              showHeader={false}
              maxSelections={5}
              showBoostedOdds={true}
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
          />
        );
    }
  };

  const renderBottomTabs = () => {
    switch (appState.designMode) {
      case 'neo':
        return <NeoBottomTabs currentPage={appState.currentPage} onPageChange={appState.setCurrentPage} />;
      case 'elegant':
        return <ElegantBottomTabs currentPage={appState.currentPage} onPageChange={appState.setCurrentPage} />;
      default:
        return <BottomTabs currentPage={appState.currentPage} onPageChange={appState.setCurrentPage} />;
    }
  };

  // Show authentication screens if not authenticated
  if (!appState.isAuthenticated) {
    return (
      <AuthenticationScreens
        authScreen={appState.authScreen}
        setAuthScreen={appState.setAuthScreen}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    );
  }

  const designModeInfo = getDesignModeInfo(appState.designMode);
  const backgroundClass = getBackgroundClass(appState.designMode);

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <div className={`max-w-sm mx-auto min-h-screen relative ${backgroundClass}`}>
        {renderCurrentPage()}
        {renderBottomTabs()}

        {/* Design Mode Toggle Button */}
        <button
          onClick={handleCycleDesignMode}
          className={`fixed top-20 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r ${designModeInfo.color} text-white animate-pulse`}
          title={`Switch from ${designModeInfo.label} Mode`}
        >
          <span className="text-lg animate-bounce">{designModeInfo.icon}</span>
        </button>

        {/* Design Mode Indicator */}
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-40 backdrop-blur-md rounded-full px-4 py-2 border ${
          appState.designMode === 'elegant' 
            ? 'bg-white/70 border-white/30' 
            : appState.designMode === 'neo'
            ? 'bg-black/60 border-purple-500/30'
            : 'bg-white/70 border-white/30'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              appState.designMode === 'elegant' ? 'bg-blue-400' :
              appState.designMode === 'neo' ? 'bg-cyan-400' :
              'bg-purple-400'
            }`} />
            <span className={`text-xs font-bold ${
              appState.designMode === 'elegant' ? 'text-gray-800' :
              appState.designMode === 'neo' ? 'text-white' :
              'text-gray-800'
            }`}>
              {designModeInfo.label} MODE
            </span>
          </div>
        </div>

        {/* Modals & Drawers */}
        <ProfileDrawer 
          isOpen={appState.profileDrawerOpen} 
          onClose={() => appState.setProfileDrawerOpen(false)}
          onEditProfile={() => {
            appState.setProfileDrawerOpen(false);
            const profilePage = appState.designMode === 'neo' ? 'neo-profile' : 
                               appState.designMode === 'elegant' ? 'elegant-profile' : 
                               'edit-profile';
            appState.setCurrentPage(profilePage);
          }}
          onSettings={() => {
            appState.setProfileDrawerOpen(false);
            appState.setCurrentPage('settings');
          }}
          onNotifications={() => {
            appState.setProfileDrawerOpen(false);
            appState.setNotificationsOpen(true);
            appState.setHasNotifications(false);
          }}
          onLogout={handleLogout}
          hasNotifications={appState.hasNotifications}
        />
        
        <QuestionDetail
          isOpen={appState.questionDetailOpen}
          onClose={() => appState.setQuestionDetailOpen(false)}
          question={appState.selectedQuestion}
          onVote={handleVote}
        />

        <SocialQuestionDetail
          isOpen={appState.socialQuestionDetailOpen}
          onClose={() => appState.setSocialQuestionDetailOpen(false)}
          question={appState.selectedQuestion}
          onVote={handleVote}
        />

        <CouponDrawer
          isOpen={appState.couponDrawerOpen}
          onClose={() => appState.setCouponDrawerOpen(false)}
          selections={appState.couponSelections}
          onRemoveSelection={(id) => {
            appState.setCouponSelections(prev => prev.filter(s => s.id !== id));
          }}
          onClearAll={() => appState.setCouponSelections([])}
          isFree={true}
        />

        <NotificationsPage
          isOpen={appState.notificationsOpen}
          onClose={() => appState.setNotificationsOpen(false)}
        />
      </div>
    </div>
  );
}