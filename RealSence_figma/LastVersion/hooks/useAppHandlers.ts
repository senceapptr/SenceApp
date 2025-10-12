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
    try {
      localStorage.setItem('sence_auth', 'true');
      appState.setIsAuthenticated(true);
      appState.setAuthScreen('welcome');
    } catch (error) {
      console.warn('Error during login:', error);
    }
  };

  const handleSignUp = () => {
    try {
      localStorage.setItem('sence_auth', 'true');
      appState.setIsAuthenticated(true);
      appState.setAuthScreen('welcome');
      appState.setGameCredits(500);
    } catch (error) {
      console.warn('Error during signup:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('sence_auth');
      appState.setIsAuthenticated(false);
      appState.setAuthScreen('welcome');
      appState.setCurrentPage('home');
      setShowProfileDropdown(false);
    } catch (error) {
      console.warn('Error during logout:', error);
    }
  };

  // Design mode handler
  const handleCycleDesignMode = () => {
    try {
      const newMode = cycleDesignMode(appState.designMode);
      appState.setDesignMode(newMode);
      localStorage.setItem('sence_design_mode', newMode);
      appState.setCurrentPage(getInitialPageForMode(newMode));
    } catch (error) {
      console.warn('Error cycling design mode:', error);
    }
  };

  // Vote handler with error handling
  const handleVote = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    try {
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
    } catch (error) {
      console.warn('Error handling vote:', error);
    }
  };

  // Enhanced question detail handler - support both ID and question object
  const handleQuestionDetail = (questionIdOrObject: number | any) => {
    try {
      let question;
      
      // Handle both ID and question object
      if (typeof questionIdOrObject === 'number') {
        question = findQuestionById(questionIdOrObject);
      } else if (questionIdOrObject && typeof questionIdOrObject === 'object') {
        // If it's already a question object, use it directly
        question = questionIdOrObject;
        
        // Ensure it has required properties for compatibility
        if (!question.title && question.text) {
          question.title = question.text;
        }
        if (!question.text && question.title) {
          question.text = question.title;
        }
      }

      if (!question) {
        console.warn('Question not found:', questionIdOrObject);
        return;
      }

      appState.setSelectedQuestion(question);
      
      if (appState.currentPage === 'dark-home') {
        appState.setSocialQuestionDetailOpen(true);
      } else {
        appState.setQuestionDetailOpen(true);
      }
    } catch (error) {
      console.warn('Error handling question detail:', error);
    }
  };

  // Profile navigation handlers
  const handleProfileNavigation = () => {
    try {
      setShowProfileDropdown(false);
      appState.setCurrentPage('profile');
    } catch (error) {
      console.warn('Error navigating to profile:', error);
    }
  };

  const handleEditProfileNavigation = () => {
    try {
      setShowProfileDropdown(false);
      const profilePage = appState.designMode === 'neo' ? 'neo-profile' : 
                         appState.designMode === 'elegant' ? 'elegant-profile' : 
                         'edit-profile';
      appState.setCurrentPage(profilePage);
    } catch (error) {
      console.warn('Error navigating to edit profile:', error);
    }
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    try {
      appState.setCurrentPage('home');
    } catch (error) {
      console.warn('Error navigating to home:', error);
    }
  };

  const handleNotificationsClick = () => {
    try {
      setShowProfileDropdown(false);
      appState.setNotificationsOpen(true);
      appState.setHasNotifications(false);
    } catch (error) {
      console.warn('Error opening notifications:', error);
    }
  };

  const handleMarketClick = () => {
    try {
      setShowProfileDropdown(false);
      appState.setCurrentPage('market');
    } catch (error) {
      console.warn('Error navigating to market:', error);
    }
  };

  const handleSettingsClick = () => {
    try {
      setShowProfileDropdown(false);
      appState.setCurrentPage('settings');
    } catch (error) {
      console.warn('Error navigating to settings:', error);
    }
  };

  // Followers modal handlers
  const handleFollowersClick = (tab: 'followers' | 'following' | 'activity' = 'followers') => {
    try {
      setFollowersModalTab(tab);
      setShowFollowersModal(true);
    } catch (error) {
      console.warn('Error opening followers modal:', error);
    }
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