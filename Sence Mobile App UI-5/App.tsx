import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { useAppHandlers } from './hooks/useAppHandlers';
import { AuthenticationScreens } from './components/AuthenticationScreens';
import { BottomTabs } from './components/BottomTabs';
import { ProfileDrawer } from './components/ProfileDrawer';
import { QuestionDetail } from './components/QuestionDetail';
import { SocialQuestionDetail } from './components/SocialQuestionDetail';
import { CouponDrawer } from './components/CouponDrawer';
import { NotificationsPage } from './components/NotificationsPage';
import { FollowersModal } from './components/FollowersModal';
import { WriteQuestionPage } from './components/WriteQuestionPage';
import { TasksPage } from './components/TasksPage';
import { ImmersiveQuestionsPage } from './components/ImmersiveQuestionsPage';
import { QuestionsListPage } from './components/QuestionsListPage';
import { AlternativeHomePage } from './components/AlternativeHomePage';
import { PageRenderer } from './components/PageRenderer';

export default function App() {
  // State initialization
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following' | 'activity'>('followers');
  const [showWriteQuestion, setShowWriteQuestion] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showImmersiveQuestions, setShowImmersiveQuestions] = useState(false);
  const [showQuestionsList, setShowQuestionsList] = useState(false);
  const [showAlternativeHome, setShowAlternativeHome] = useState(false);

  // App state and handlers - called unconditionally as per React rules
  const appState = useAppState();
  const {
    handleLogin,
    handleSignUp,
    handleLogout,
    handleVote,
    handleQuestionDetail,
    handleProfileNavigation,
    handleEditProfileNavigation,
    handleNavigateHome,
    handleNotificationsClick,
    handleMarketClick,
    handleSettingsClick,
    handleFollowersClick
  } = useAppHandlers({
    appState,
    setShowProfileDropdown,
    setFollowersModalTab,
    setShowFollowersModal
  });

  // Check if we should hide navigation (trivia mode OR predict mode OR alternative home)
  const shouldHideNavigation = appState.currentPage === 'trivia' || appState.currentPage === 'predict' || showAlternativeHome;

  const handleWriteQuestionClick = () => {
    setShowWriteQuestion(true);
    setShowProfileDropdown(false);
    appState.setProfileDrawerOpen(false);
  };

  const handleTasksClick = () => {
    setShowTasks(true);
    setShowProfileDropdown(false);
    appState.setProfileDrawerOpen(false);
  };

  const handleImmersiveViewClick = () => {
    setShowImmersiveQuestions(true);
  };

  const handleFeedViewClick = () => {
    setShowQuestionsList(true);
  };

  const handleAlternativeViewClick = () => {
    setShowAlternativeHome(true);
  };

  // Profile click handler for alternative home
  const handleAlternativeProfileClick = () => {
    appState.setProfileDrawerOpen(true);
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

  // Show Write Question Page
  if (showWriteQuestion) {
    return (
      <WriteQuestionPage
        onBack={() => setShowWriteQuestion(false)}
      />
    );
  }

  // Show Tasks Page
  if (showTasks) {
    return (
      <TasksPage
        onBack={() => setShowTasks(false)}
      />
    );
  }

  // Show Immersive Questions Page
  if (showImmersiveQuestions) {
    return (
      <ImmersiveQuestionsPage
        onBack={() => setShowImmersiveQuestions(false)}
      />
    );
  }

  // Show Questions List Page
  if (showQuestionsList) {
    return (
      <QuestionsListPage
        onBack={() => setShowQuestionsList(false)}
        onVote={handleVote}
        onQuestionDetail={handleQuestionDetail}
      />
    );
  }

  // Show Alternative Home Page
  if (showAlternativeHome) {
    return (
      <div className="min-h-screen bg-[#F2F3F5]">
        <div className="w-full min-h-screen relative bg-[#F2F3F5]">
          <AlternativeHomePage
            onBack={() => setShowAlternativeHome(false)}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
          />
          
          {/* Standard Navigation for Alternative Home */}
          <BottomTabs currentPage="home" onPageChange={(page) => {
            if (page !== "home") {
              setShowAlternativeHome(false);
              appState.setCurrentPage(page);
            }
          }} />

          {/* Backdrop for dropdown */}
          {showProfileDropdown && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowProfileDropdown(false)}
            />
          )}

          {/* Modals & Drawers */}
          <ProfileDrawer 
            isOpen={appState.profileDrawerOpen} 
            onClose={() => appState.setProfileDrawerOpen(false)}
            onEditProfile={handleEditProfileNavigation}
            onSettings={handleSettingsClick}
            onNotifications={handleNotificationsClick}
            onWriteQuestion={handleWriteQuestionClick}
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

          <FollowersModal
            isOpen={showFollowersModal}
            onClose={() => setShowFollowersModal(false)}
            initialTab={followersModalTab}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      <div className="w-full min-h-screen relative bg-[#F2F3F5]">
        <PageRenderer
          appState={appState}
          handleQuestionDetail={handleQuestionDetail}
          handleVote={handleVote}
          handleFollowersClick={handleFollowersClick}
          handleNavigateHome={handleNavigateHome}
          showProfileDropdown={showProfileDropdown}
          onToggleProfileDropdown={() => setShowProfileDropdown(!showProfileDropdown)}
          onProfileClick={handleProfileNavigation}
          onNotificationsClick={handleNotificationsClick}
          onMarketClick={handleMarketClick}
          onEditProfileClick={handleEditProfileNavigation}
          onSettingsClick={handleSettingsClick}
          onLogoutClick={handleLogout}
          onWriteQuestionClick={handleWriteQuestionClick}
          onTasksClick={handleTasksClick}
          onImmersiveViewClick={handleImmersiveViewClick}
          onFeedViewClick={handleFeedViewClick}
          onAlternativeViewClick={handleAlternativeViewClick}
        />
        
        {/* Only show Classic Mode Navigation */}
        {!shouldHideNavigation && (
          <BottomTabs currentPage={appState.currentPage} onPageChange={appState.setCurrentPage} />
        )}

        {/* Backdrop for dropdown */}
        {showProfileDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileDropdown(false)}
          />
        )}

        {/* Modals & Drawers */}
        <ProfileDrawer 
          isOpen={appState.profileDrawerOpen} 
          onClose={() => appState.setProfileDrawerOpen(false)}
          onEditProfile={handleEditProfileNavigation}
          onSettings={handleSettingsClick}
          onNotifications={handleNotificationsClick}
          onWriteQuestion={handleWriteQuestionClick}
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

        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          initialTab={followersModalTab}
        />
      </div>
    </div>
  );
}