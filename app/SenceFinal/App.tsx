import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Dimensions, Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import { CategoryQuestionsPage } from './components/CategoryQuestionsPage';
import { CouponDrawer } from './components/CouponDrawer';
import { ConfettiAnimation } from './components/ConfettiAnimation';
import { BottomTabs } from './components/BottomTabs';
import { SlideOutMenu } from './components/SlideOutMenu';
import { LoginPage } from './components/LoginPage';
import { AdminPanel } from './components/AdminPanel';
import { QuestionDetailSkeleton } from './components/QuestionDetailSkeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PageType = 'home' | 'discover' | 'coupons' | 'leagues' | 'writeQuestion' | 'tasks' | 'settings' | 'market' | 'notifications' | 'profile' | 'questionDetail' | 'questionCardDesign' | 'editProfile' | 'privacySettings' | 'helpCenter' | 'support' | 'faq' | 'feedback' | 'about' | 'adminPanel' | 'allQuestions';

interface Question {
  id: string;
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
  questionId: string;
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

// AllQuestionsModal - CategoryQuestionsPage'i slide animasyonu ile açar
function AllQuestionsModal({ 
  onBack, 
  handleQuestionDetail, 
  handleVote 
}: { 
  onBack: () => void;
  handleQuestionDetail: (questionId: string, sourceCategory?: any) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackWithAnimation = () => {
    // Slide out animation
    Animated.spring(slideAnim, {
      toValue: SCREEN_WIDTH,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
    }).start(() => {
      onBack();
    });
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <CategoryQuestionsPage
        category={{
          id: 'all',
          label: 'Tüm Sorular',
          icon: '🌟',
          color: '#7C3AED',
        }}
        onBack={handleBackWithAnimation}
        handleQuestionDetail={handleQuestionDetail}
        handleVote={handleVote}
      />
    </Animated.View>
  );
}

// Ana uygulama içeriği - sadece giriş yapmış kullanıcılar için
function AppContent() {
  const { user, profile } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Question Detail and Coupon states
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [sourceCategory, setSourceCategory] = useState<any>(null);
  const [isQuestionDetailOpen, setIsQuestionDetailOpen] = useState(false);
  const [isQuestionDetailLoading, setIsQuestionDetailLoading] = useState(false);
  // Animasyon state'i kaldırıldı - kullanıcı deneyimi için kritik
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [couponSelections, setCouponSelections] = useState<CouponSelection[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponsRefreshTrigger, setCouponsRefreshTrigger] = useState(0);

  // User Profile state - gerçek auth verilerinden oluştur
  const userProfile: UserProfile = {
    username: profile?.username || user?.email?.split('@')[0] || 'kullanici',
    fullName: profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı',
    bio: profile?.bio || 'Henüz bio eklenmedi',
    email: user?.email || '',
    profileImage: profile?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    coverImage: profile?.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  };

  // User credits - gerçek profil verisinden al
  const userCredits = profile?.credits || 10000;

  // Zaman hesaplama fonksiyonu
  const calculateTimeLeft = (endDate: string): string => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Sona erdi';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} gün ${hours} saat`;
    return `${hours} saat`;
  };

  // Question Detail slide animation
  const questionDetailSlideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  
  // Animasyon state'i kaldırıldı - kullanıcı deneyimi için kritik

  const handleQuestionDetail = async (questionId: number | string, sourceCategory?: any) => {
    // ID'yi string'e çevir (UUID formatında olmalı)
    const questionIdString = questionId.toString();
    
    // Source category'yi set et
    setSourceCategory(sourceCategory);
    
    // HEMEN AÇ - kategori sayfası gibi anında açılsın
    setIsQuestionDetailOpen(true);
    setIsQuestionDetailLoading(false);
    
    // Mock question ile anında göster
    const mockQuestion: Question = {
      id: questionIdString,
      title: "Soru Yükleniyor...",
      description: "Soru detayları yükleniyor...",
      category: "Genel",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      yesOdds: 2.0,
      noOdds: 2.0,
      totalVotes: 0,
      timeLeft: "Yükleniyor...",
      publishDate: "Yükleniyor...",
      endDate: "2024-12-31T23:59:59",
      yesPercentage: 50,
      noPercentage: 50,
      totalAmount: 0
    };
    setSelectedQuestion(mockQuestion);
    
    // Sağdan açılış animasyonu - hızlı timing
    questionDetailSlideAnim.setValue(SCREEN_WIDTH);
    Animated.timing(questionDetailSlideAnim, {
      toValue: 0,
      duration: 250, // Hızlı - 250ms
      useNativeDriver: true,
    }).start();
    
    // Arka planda veri yükle - cache yok, direkt backend
    try {
      // Direkt backend'den çek
      const { questionsService } = await import('@/services/questions.service');
      const result = await (questionsService as any).getQuestionById(questionIdString);
      
      if (result.data) {
        // Backend'den gelen veriyi Question formatına dönüştür
        const question: Question = {
          id: result.data.id || questionIdString,
          title: result.data.title || 'Soru',
          description: result.data.description || '',
          category: result.data.categories?.name || 'Genel',
          image: result.data.image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
          yesOdds: result.data.yes_odds || 2.0,
          noOdds: result.data.no_odds || 2.0,
          totalVotes: result.data.total_votes || 0,
          timeLeft: calculateTimeLeft(result.data.end_date),
          publishDate: new Date(result.data.created_at).toLocaleDateString('tr-TR'),
          endDate: result.data.end_date,
          yesPercentage: result.data.yes_percentage || 50,
          noPercentage: result.data.no_percentage || 50,
          totalAmount: result.data.total_amount || 0
        };
        
        setSelectedQuestion(question);
      } else {
        // Backend'den veri gelmezse mock data kullan
        const mockQuestion: Question = {
          id: questionIdString,
          title: "Soru Bulunamadı",
          description: "Bu soru için detay bilgisi bulunamadı.",
          category: "Genel",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
          yesOdds: 2.0,
          noOdds: 2.0,
          totalVotes: 0,
          timeLeft: "Bilinmiyor",
          publishDate: "Bilinmiyor",
          endDate: "2024-12-31T23:59:59",
          yesPercentage: 50,
          noPercentage: 50,
          totalAmount: 0
        };
        setSelectedQuestion(mockQuestion);
      }
    } catch (error) {
      console.error('Question detail load error:', error);
      
      // Hata durumunda mock data kullan
      const mockQuestion: Question = {
        id: questionId.toString(),
        title: "Soru Yüklenemedi",
        description: "Soru detayları yüklenirken bir hata oluştu.",
        category: "Genel",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
        yesOdds: 2.0,
        noOdds: 2.0,
        totalVotes: 0,
        timeLeft: "Bilinmiyor",
        publishDate: "Bilinmiyor",
        endDate: "2024-12-31T23:59:59",
        yesPercentage: 50,
        noPercentage: 50,
        totalAmount: 0
      };
      setSelectedQuestion(mockQuestion);
    }
  };

  const handleCloseQuestionDetail = () => {
    // Basit kapanış animasyonu - sağa kayıp gitsin
    Animated.timing(questionDetailSlideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 200, // Çok hızlı - 200ms
      useNativeDriver: true,
    }).start(() => {
      // Animasyon tamamlandığında modal'ı kapat
      setIsQuestionDetailOpen(false);
      setSelectedQuestion(null);
      setSourceCategory(null);
    });
  };

  const handleVote = (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => {
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

  const handleCouponsNavigate = () => {
    setCurrentPage('coupons');
  };

  const handleDiscoverAllNavigate = () => {
    // Direkt CategoryQuestionsPage'i aç (discover sayfasını atla)
    setCurrentPage('allQuestions');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    // Profile güncellemeleri EditProfilePage'de backend'e kaydediliyor
    // Bu fonksiyon artık sadece UI state'ini güncellemek için kullanılıyor
    console.log('Profile update requested:', updatedProfile);
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
            onCouponsNavigate={handleCouponsNavigate}
            onDiscoverAllNavigate={handleDiscoverAllNavigate}
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
      case 'allQuestions':
        return (
          <AllQuestionsModal
            onBack={handleBack}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
          />
        );
      case 'coupons':
        return (
          <CouponsPage 
            onMenuToggle={handleMenuToggle}
            onQuestionDetail={handleQuestionDetail}
            refreshTrigger={couponsRefreshTrigger}
            onCreateCouponPress={handleDiscoverAllNavigate}
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
      case 'adminPanel':
        return (
          <AdminPanel 
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
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
        hidden={false}
      />
      <ThemeTransition>
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
          onCouponCreated={() => {
            // Kupon oluşturulduğunda kuponlarım sayfasını yenile
            setCouponsRefreshTrigger(prev => prev + 1);
          }}
        />

        {/* Confetti Animation */}
        <ConfettiAnimation
          isVisible={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />

        {/* Question Detail Modal with Slide Animation */}
        <Modal
          visible={isQuestionDetailOpen}
          animationType="none"
          transparent={true}
          onRequestClose={handleCloseQuestionDetail}
          statusBarTranslucent={false}
        >
          <Animated.View
            style={[
              styles.questionDetailContainer,
              {
                transform: [{ translateX: questionDetailSlideAnim }],
              },
            ]}
          >
            {selectedQuestion ? (
              <QuestionDetailPage
                onBack={handleCloseQuestionDetail}
                onMenuToggle={handleMenuToggle}
                question={selectedQuestion}
                onVote={handleVote}
                sourceCategory={sourceCategory}
              />
            ) : null}
          </Animated.View>
        </Modal>
      </ThemeTransition>
    </View>
  );
}

// Ana App component - authentication kontrolü yapar
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppWithAuth />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Authentication kontrolü yapan component
function AppWithAuth() {
  const { user, loading } = useAuth();

  // Loading durumu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Giriş yapılmamışsa login sayfasını göster
  if (!user) {
    return <LoginPage />;
  }

  // Giriş yapılmışsa ana uygulamayı göster
  return <AppContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
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
  questionDetailContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});
