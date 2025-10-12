import { useState } from 'react';
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
import { PageRenderer } from './components/PageRenderer';

export default function App() {
  const appState = useAppState();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following' | 'activity'>('followers');
  const [showWriteQuestion, setShowWriteQuestion] = useState(false);

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

  // Check if we should hide navigation (trivia mode OR predict mode)
  const shouldHideNavigation = appState.currentPage === 'trivia' || appState.currentPage === 'predict';

  const handleWriteQuestionClick = () => {
    setShowWriteQuestion(true);
    appState.setProfileDrawerOpen(false);
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