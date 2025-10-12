import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './useAppState';

interface UseAppHandlersProps {
  appState: AppState;
  setShowProfileDropdown: (show: boolean) => void;
  setFollowersModalTab: (tab: 'followers' | 'following' | 'activity') => void;
  setShowFollowersModal: (show: boolean) => void;
}

export function useAppHandlers({
  appState,
  setShowProfileDropdown,
  setFollowersModalTab,
  setShowFollowersModal
}: UseAppHandlersProps) {
  // Authentication handlers
  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('sence_auth', 'true');
      appState.setIsAuthenticated(true);
      appState.setAuthScreen('welcome');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSignUp = async () => {
    try {  
      await AsyncStorage.setItem('sence_auth', 'true');
      appState.setIsAuthenticated(true);
      appState.setAuthScreen('welcome');
      appState.setGameCredits(500);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('sence_auth');
      appState.setIsAuthenticated(false);
      appState.setAuthScreen('welcome');
      appState.setCurrentPage('home');
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Vote handler
  const handleVote = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    if (appState.couponSelections.length >= 5) {
      // Show toast or alert
      console.log('Maximum 5 selections allowed');
      return;
    }

    // Find question title from questions
    const allQuestions = [
      ...require('../constants/questions').featuredQuestions,
      ...require('../constants/questions').questions
    ];
    const question = allQuestions.find(q => q.id === questionId);
    const title = question?.title || `Soru ${questionId}`;

    const selection = {
      id: questionId,
      title,
      vote,
      odds,
      timestamp: Date.now()
    };

    appState.setCouponSelections(prev => [...prev, selection]);
    
    // Open CouponDrawer after voting
    appState.setCouponDrawerOpen(true);
    
    // Haptic feedback would go here in React Native
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Question detail handler
  const handleQuestionDetail = (questionId: number) => {
    // Find question logic would go here
    const question = { id: questionId }; // Placeholder
    appState.setSelectedQuestion(question);
    appState.setQuestionDetailOpen(true);
  };

  // Navigation handlers
  const handleProfileNavigation = () => {
    appState.setCurrentPage('profile');
  };

  const handleEditProfileNavigation = () => {
    appState.setCurrentPage('edit-profile');
  };

  const handleNavigateHome = () => {
    appState.setCurrentPage('home');
  };

  const handleNotificationsClick = () => {
    appState.setNotificationsOpen(true);
  };

  const handleMarketClick = () => {
    appState.setCurrentPage('market');
  };

  const handleSettingsClick = () => {
    appState.setCurrentPage('settings');
  };

  const handleWriteQuestionClick = () => {
    appState.setCurrentPage('write-question');
  };

  const handleFollowersClick = (tab: 'followers' | 'following' | 'activity') => {
    setFollowersModalTab(tab);
    setShowFollowersModal(true);
  };

  return {
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
  };
} 