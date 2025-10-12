import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from './hooks/useAppState';
import { useAppHandlers } from './hooks/useAppHandlers';
import { AuthenticationScreens } from './components/AuthenticationScreens';
import { BottomTabs } from './components/BottomTabs';
import { PageRenderer } from './components/PageRenderer';
import { ProfileDrawer } from './components/ProfileDrawer';
import { QuestionDetail } from './components/QuestionDetail';
import { SocialQuestionDetail } from './components/SocialQuestionDetail';
import { CouponDrawer } from './components/CouponDrawer';
import { NotificationsPage } from './components/NotificationsPage';
import { FollowersModal } from './components/FollowersModal';
import { WriteQuestionPage } from './components/WriteQuestionPage';
import { DemoPage } from './components/DemoPage';

export default function App() {
  const appState = useAppState();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following' | 'activity'>('followers');
  const [showWriteQuestion, setShowWriteQuestion] = useState(false);
  const [showDemo, setShowDemo] = useState(false); // Demo modunu kapat

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
    handleWriteQuestionClick,
    handleFollowersClick
  } = useAppHandlers({
    appState,
    setShowProfileDropdown,
    setFollowersModalTab,
    setShowFollowersModal
  });

  // Check if we should hide navigation (trivia mode OR predict mode)
  const shouldHideNavigation = appState.currentPage === 'trivia' || appState.currentPage === 'predict';

  const handleWriteQuestionClickLocal = () => {
    setShowWriteQuestion(true);
    appState.setProfileDrawerOpen(false);
  };

  // Show Demo Page
  if (showDemo) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
          <DemoPage />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Show authentication screens if not authenticated
  if (!appState.isAuthenticated) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
          <AuthenticationScreens
            authScreen={appState.authScreen}
            setAuthScreen={appState.setAuthScreen}
            onLogin={handleLogin}
            onSignUp={handleSignUp}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Show Write Question Page
  if (showWriteQuestion) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
          <WriteQuestionPage
            onBack={() => setShowWriteQuestion(false)}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
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

        {/* Modals & Drawers */}
        <ProfileDrawer 
          isOpen={appState.profileDrawerOpen} 
          onClose={() => appState.setProfileDrawerOpen(false)}
          onProfileClick={handleProfileNavigation}
          onEditProfile={handleEditProfileNavigation}
          onSettings={handleSettingsClick}
          onNotifications={handleNotificationsClick}
          onWriteQuestion={handleWriteQuestionClick}
          onMarket={handleMarketClick}
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
      </View>
    </SafeAreaProvider>
  );
} 