import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeTransition } from './components/ThemeTransition';
import { HomePage } from './components/HomePage';
import { AlternativeSearchPage } from './components/AlternativeSearchPage';
import { CouponsPage } from './components/CouponsPage';
import { LeaguePage } from './components/LeaguePage';
import { WriteQuestionPage } from './components/WriteQuestionPage';
import { TasksPage } from './components/TasksPage';
import { SettingsPage } from './components/SettingsPage';
import { MarketPage } from './components/MarketPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ProfilePage } from './components/ProfilePage';
import { QuestionDetailPage } from './components/QuestionDetailPage';
import { QuestionCardDesignPage } from './components/QuestionCardDesignPage';
import { EditProfilePage } from './components/EditProfilePage';
import { PrivacySettingsPage } from './components/PrivacySettingsPage';
import { HelpCenterPage } from './components/HelpCenterPage';
import { SupportPage } from './components/SupportPage';
import { FAQPage } from './components/FAQPage';
import { FeedbackPage } from './components/FeedbackPage';
import { AboutPage } from './components/AboutPage';
import { NewDiscoverPage } from './components/NewDiscoverPage';
import { CouponDrawer } from './components/CouponDrawer';
import { ConfettiAnimation } from './components/ConfettiAnimation';
import { BottomTabs } from './components/BottomTabs';
import { SlideOutMenu } from './components/SlideOutMenu';

type PageType = 'home' | 'discover' | 'coupons' | 'leagues' | 'writeQuestion' | 'tasks' | 'settings' | 'market' | 'notifications' | 'profile' | 'questionDetail' | 'questionCardDesign' | 'editProfile' | 'privacySettings' | 'helpCenter' | 'support' | 'faq' | 'feedback' | 'about';

interface Question {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  yesOdds: number;
  noOdds: number;
  totalVotes: number;
  timeLeft: string;
  publishDate: string;
  endDate: string;
  yesPercentage: number;
  noPercentage: number;
  totalAmount: number;
}

interface CouponSelection {
  id: number;
  questionId: number;
  title: string;
  vote: 'yes' | 'no';
  odds: number;
  boosted?: boolean;
}

interface UserProfile {
  username: string;
  fullName: string;
  bio: string;
  email: string;
  profileImage: string;
  coverImage: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userCredits] = useState(1250000); // Mock user credits
  
  // Question Detail and Coupon states
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [couponSelections, setCouponSelections] = useState<CouponSelection[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'mehmet_k',
    fullName: 'Mehmet Kaya',
    bio: 'Tahmin tutkunuyum! 🎯',
    email: 'mehmet@example.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  });

  const handleQuestionDetail = (questionId: number) => {
    // Mock question data - in real app this would come from API
    const mockQuestion: Question = {
      id: questionId,
      title: "Tesla 2024 yılı sonuna kadar $300'ı aşacak mı?",
      description: "Tesla hisse senedi fiyatının 2024 yılı sonuna kadar $300 seviyesini aşıp aşmayacağı konusunda tahminini paylaş. Şirketin yeni model lansmanları, üretim kapasitesi artışı ve otonomus sürüş teknolojisi gelişmeleri göz önünde bulundurularak değerlendirme yapılacak.",
      category: "Teknoloji & Finans",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      yesOdds: 2.4,
      noOdds: 1.6,
      totalVotes: 2847,
      timeLeft: "3 gün 12 saat",
      publishDate: "15 Aralık 2024",
      endDate: "2024-12-31T23:59:59",
      yesPercentage: 42,
      noPercentage: 58,
      totalAmount: 45670
    };
    
    setSelectedQuestion(mockQuestion);
    setCurrentPage('questionDetail');
  };

  const handleVote = (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => {
    // Check if question is already in coupon
    const existingSelectionIndex = couponSelections.findIndex(
      selection => selection.questionId === questionId
    );

    if (existingSelectionIndex !== -1) {
      // Update existing selection
      const updatedSelections = [...couponSelections];
      updatedSelections[existingSelectionIndex] = {
        ...updatedSelections[existingSelectionIndex],
        vote,
        odds
      };
      setCouponSelections(updatedSelections);
    } else {
      // Add new selection
      const newSelection: CouponSelection = {
        id: Date.now(), // Simple ID generation
        questionId,
        title: questionTitle || `Soru ${questionId}`, // Use actual title if provided
        vote,
        odds,
        boosted: Math.random() > 0.7 // Random boost for demo
      };
      setCouponSelections([...couponSelections, newSelection]);
    }

    // Open coupon drawer
    setIsCouponDrawerOpen(true);
  };

  const handleRemoveSelection = (selectionId: number) => {
    setCouponSelections(couponSelections.filter(selection => selection.id !== selectionId));
  };

  const handleClearAll = () => {
    setCouponSelections([]);
  };

  const handleCouponSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleBack = () => {
    if (currentPage === 'questionDetail') {
      setSelectedQuestion(null);
      setCurrentPage('home');
    } else {
      setCurrentPage('home');
    }
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const handleNavigateToPage = (page: PageType) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const handleTasksNavigate = () => {
    setCurrentPage('tasks');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onBack={handleBack}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
            onMenuToggle={handleMenuToggle}
            onTasksNavigate={handleTasksNavigate}
          />
        );
      case 'discover':
        return (
          <NewDiscoverPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
          />
        );
      case 'coupons':
        return (
          <CouponsPage 
            onMenuToggle={handleMenuToggle}
            onQuestionDetail={handleQuestionDetail}
          />
        );
      case 'leagues':
        return (
          <LeaguePage 
            onBack={() => setCurrentPage('home')}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
            onMenuToggle={handleMenuToggle}
          />
        );
      case 'writeQuestion':
        return (
          <WriteQuestionPage 
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
          />
        );
      case 'tasks':
        return (
          <TasksPage 
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            onEditProfile={() => setCurrentPage('editProfile')}
            onPrivacySettings={() => setCurrentPage('privacySettings')}
            onHelpCenter={() => setCurrentPage('helpCenter')}
            onSecurity={() => console.log('Security page - to be implemented')}
            onFeedback={() => setCurrentPage('feedback')}
            onAbout={() => setCurrentPage('about')}
          />
        );
      case 'editProfile':
        return (
          <EditProfilePage 
            onBack={handleBack}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'privacySettings':
        return (
          <PrivacySettingsPage 
            onBack={handleBack}
          />
        );
      case 'helpCenter':
        return (
          <HelpCenterPage 
            onBack={handleBack}
            onSupport={() => setCurrentPage('support')}
            onFAQ={() => setCurrentPage('faq')}
            onTerms={() => console.log('Terms page - to be implemented')}
          />
        );
      case 'support':
        return (
          <SupportPage 
            onBack={handleBack}
          />
        );
      case 'faq':
        return (
          <FAQPage 
            onBack={handleBack}
          />
        );
      case 'feedback':
        return (
          <FeedbackPage 
            onBack={handleBack}
          />
        );
      case 'about':
        return (
          <AboutPage 
            onBack={handleBack}
          />
        );
      case 'market':
        return (
          <MarketPage 
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            userCredits={userCredits}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage 
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            userProfile={userProfile}
          />
        );
      case 'questionDetail':
        return selectedQuestion ? (
          <QuestionDetailPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            question={selectedQuestion}
            onVote={handleVote}
          />
        ) : null;
      case 'questionCardDesign':
        return (
          <QuestionCardDesignPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
          />
        );
      default:
        return (
          <HomePage
            onBack={handleBack}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
            onMenuToggle={handleMenuToggle}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent" 
          translucent 
          hidden={false}
        />
        <ThemeTransition>
          <View style={styles.container}>
            <SlideOutMenu isOpen={isMenuOpen} onClose={handleMenuClose} onNavigate={handleNavigateToPage}>
              <View style={styles.pageWrapper}>
                {renderCurrentPage()}
                {/* Only show bottom tabs on main pages */}
                {(['home', 'discover', 'coupons', 'leagues'] as PageType[]).includes(currentPage) && (
                  <BottomTabs currentPage={currentPage} onPageChange={handlePageChange} />
                )}
              </View>
            </SlideOutMenu>

          {/* Coupon Drawer */}
          <CouponDrawer
            isOpen={isCouponDrawerOpen}
            onClose={() => setIsCouponDrawerOpen(false)}
            selections={couponSelections}
            onRemoveSelection={handleRemoveSelection}
            onClearAll={handleClearAll}
            onCouponSuccess={handleCouponSuccess}
            userCredits={userCredits}
          />

          {/* Confetti Animation */}
          <ConfettiAnimation
            isVisible={showConfetti}
            onComplete={() => setShowConfetti(false)}
          />
          </View>
        </ThemeTransition>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pageWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  pageText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
});
