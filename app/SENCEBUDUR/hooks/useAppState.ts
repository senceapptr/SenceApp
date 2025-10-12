import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DesignMode = 'classic';

export type AppState = ReturnType<typeof useAppState>;

export const useAppState = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'signup'>('welcome');
  
  // Design system toggles
  const [designMode] = useState<DesignMode>('classic');
  
  // App state
  const [currentPage, setCurrentPage] = useState('home');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [questionDetailOpen, setQuestionDetailOpen] = useState(false);
  const [socialQuestionDetailOpen, setSocialQuestionDetailOpen] = useState(false);
  const [couponDrawerOpen, setCouponDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [couponSelections, setCouponSelections] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ending-soon');
  const [scrollY, setScrollY] = useState(0);
  
  // Notification state
  const [hasNotifications, setHasNotifications] = useState(true);
  
  // User stats
  const [userPoints, setUserPoints] = useState(2450);
  const [gameCredits, setGameCredits] = useState(1250);
  const [userCoins, setUserCoins] = useState(120);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [dailyPredictions, setDailyPredictions] = useState(8);
  const [yesterdayResults] = useState({ correct: 3, total: 5 });
  const [userLevel, setUserLevel] = useState(7);

  // Check authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedAuth = await AsyncStorage.getItem('sence_auth');
        if (savedAuth) {
          setIsAuthenticated(true);
        }
        // Always use classic design mode and home page
        setCurrentPage('home');
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    checkAuthStatus();
  }, []);

  return {
    // Authentication
    isAuthenticated,
    setIsAuthenticated,
    authScreen,
    setAuthScreen,
    
    // Design mode
    designMode,
    
    // App state
    currentPage,
    setCurrentPage,
    profileDrawerOpen,
    setProfileDrawerOpen,
    questionDetailOpen,
    setQuestionDetailOpen,
    socialQuestionDetailOpen,
    setSocialQuestionDetailOpen,
    couponDrawerOpen,
    setCouponDrawerOpen,
    notificationsOpen,
    setNotificationsOpen,
    selectedQuestion,
    setSelectedQuestion,
    couponSelections,
    setCouponSelections,
    selectedCategory,
    setSelectedCategory,
    scrollY,
    setScrollY,
    
    // User data
    hasNotifications,
    setHasNotifications,
    userPoints,
    setUserPoints,
    gameCredits,
    setGameCredits,
    userCoins,
    userLevel,
    dailyStreak,
    dailyPredictions,
    yesterdayResults
  };
}; 