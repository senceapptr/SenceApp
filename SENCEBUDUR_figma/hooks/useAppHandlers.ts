import { AppState } from './useAppState';
import { cycleDesignMode, getInitialPageForMode } from '../utils/designMode';
import { findQuestionById, createVoteSelection, animateButtonFeedback } from '../utils/questionHelpers';

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
    setShowProfileDropdown(false);
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

  // Profile navigation handlers
  const handleProfileNavigation = () => {
    setShowProfileDropdown(false);
    appState.setCurrentPage('profile');
  };

  const handleEditProfileNavigation = () => {
    setShowProfileDropdown(false);
    const profilePage = appState.designMode === 'neo' ? 'neo-profile' : 
                       appState.designMode === 'elegant' ? 'elegant-profile' : 
                       'edit-profile';
    appState.setCurrentPage(profilePage);
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    appState.setCurrentPage('home');
  };

  const handleNotificationsClick = () => {
    setShowProfileDropdown(false);
    appState.setNotificationsOpen(true);
    appState.setHasNotifications(false);
  };

  const handleMarketClick = () => {
    setShowProfileDropdown(false);
    appState.setCurrentPage('market');
  };

  const handleSettingsClick = () => {
    setShowProfileDropdown(false);
    appState.setCurrentPage('settings');
  };

  // Followers modal handlers
  const handleFollowersClick = (tab: 'followers' | 'following' | 'activity' = 'followers') => {
    setFollowersModalTab(tab);
    setShowFollowersModal(true);
  };

  return {
    handleLogin,
    handleSignUp,
    handleLogout,
    handleCycleDesignMode,
    handleVote,
    handleQuestionDetail,
    handleProfileNavigation,
    handleEditProfileNavigation,
    handleNavigateHome,
    handleNotificationsClick,
    handleMarketClick,
    handleSettingsClick,
    handleFollowersClick
  };
}