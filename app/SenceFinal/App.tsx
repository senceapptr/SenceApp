import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Dimensions, Modal, Alert, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeTransition } from '@/components/SenceFinal/ThemeTransition';
import { HomePage } from '@/components/SenceFinal/HomePage';
import { AlternativeSearchPage } from '@/components/SenceFinal/AlternativeSearchPage';
import { CouponsPage } from '@/components/SenceFinal/CouponsPage';
import { LeaguePage } from '@/components/SenceFinal/LeaguePage';
import { WriteQuestionPage } from '@/components/SenceFinal/WriteQuestionPage';
import { TasksPage } from '@/components/SenceFinal/TasksPage';
import { SettingsPage } from '@/components/SenceFinal/SettingsPage';
import { MarketPage } from '@/components/SenceFinal/MarketPage';
import { NotificationsPage } from '@/components/SenceFinal/NotificationsPage';
import { ProfilePage } from '@/components/SenceFinal/ProfilePage';
import { QuestionDetailPage } from '@/components/SenceFinal/QuestionDetailPage';
import { QuestionCardDesignPage } from '@/components/SenceFinal/QuestionCardDesignPage';
import { EditProfilePage } from '@/components/SenceFinal/EditProfilePage';
import { PrivacySettingsPage } from '@/components/SenceFinal/PrivacySettingsPage';
import { HelpCenterPage } from '@/components/SenceFinal/HelpCenterPage';
import { SupportPage } from '@/components/SenceFinal/SupportPage';
import { FAQPage } from '@/components/SenceFinal/FAQPage';
import { FeedbackPage } from '@/components/SenceFinal/FeedbackPage';
import { AboutPage } from '@/components/SenceFinal/AboutPage';
import { CategoryQuestionsPage } from '@/components/SenceFinal/CategoryQuestionsPage';
import { NewDiscoverPage } from '@/components/SenceFinal/NewDiscoverPage';
import { DiscoverPage } from '@/components/SenceFinal/DiscoverPage';
import { CouponDrawer } from '@/components/SenceFinal/CouponDrawer';
import { ConfettiAnimation } from '@/components/SenceFinal/ConfettiAnimation';
import { BottomTabs } from '@/components/SenceFinal/BottomTabs';
import { SlideOutMenu } from '@/components/SenceFinal/SlideOutMenu';
import { LoginPage } from '@/components/SenceFinal/LoginPage';
import { AdminPanel } from '@/components/SenceFinal/AdminPanel';
import { QuestionDetailSkeleton } from '@/components/SenceFinal/QuestionDetailSkeleton';
import { GameHubPage } from '@/components/SenceFinal/GameHubPage';
// EmailVerificationPage is defined inline in this file
import { InputOTP } from '@/components/PremiumSence/ui/input-otp';
import { verificationService } from '@/services/verification.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PageType = 'home' | 'coupons' | 'leagues' | 'gameHub' | 'newDiscover' | 'discoverNew' | 'writeQuestion' | 'tasks' | 'settings' | 'market' | 'notifications' | 'profile' | 'questionDetail' | 'questionCardDesign' | 'editProfile' | 'privacySettings' | 'helpCenter' | 'support' | 'faq' | 'feedback' | 'about' | 'adminPanel' | 'allQuestions' | 'emailVerification';

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
  const { user, profile, pendingVerification, isEmailVerified, markEmailAsVerified, checkEmailVerification } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showEmailVerificationBanner, setShowEmailVerificationBanner] = useState(false);
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

  // Email verification kontrolü - SignUp sonrası otomatik yönlendirme
  useEffect(() => {
    if (pendingVerification && user) {
      setCurrentPage('emailVerification');
    }
  }, [pendingVerification, user]);

  // Giriş yapan kullanıcının email verification durumunu kontrol et
  useEffect(() => {
    if (user && !pendingVerification) {
      // Profil yüklendikten sonra email verification durumunu kontrol et
      const checkVerification = async () => {
        await checkEmailVerification();
        // Profil yüklendikten sonra kontrol et
        // isEmailVerified state'i güncellenecek
      };
      checkVerification();
    }
  }, [user]);

  // Email verification durumu değiştiğinde banner'ı güncelle
  useEffect(() => {
    if (isEmailVerified || (profile && profile.is_verified === true)) {
      setShowEmailVerificationBanner(false);
    } else if (user && (profile?.is_verified === false || (!isEmailVerified && profile))) {
      // Profil yüklendi ve verified değilse göster
      setShowEmailVerificationBanner(true);
    }
  }, [isEmailVerified, user, profile]);

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
    // Ticket oluşturmak için ana sayfaya git - kullanıcı sorulara oy vererek ticket oluşturur
    setCurrentPage('home');
    // Kullanıcıya yönlendirme mesajı göster
    setTimeout(() => {
      Alert.alert(
        'Ticket Oluştur',
        'Sorulara EVET veya HAYIR oyu vererek ticket oluşturabilirsin. Birden fazla soru ekleyebilirsin!',
        [{ text: 'Tamam', style: 'default' }]
      );
    }, 300);
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
            onSearchNavigate={() => setCurrentPage('newDiscover')}
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
      case 'gameHub':
        return (
          <GameHubPage
            onBack={() => setCurrentPage('home')}
            onMenuToggle={handleMenuToggle}
          />
        );
      case 'newDiscover':
        return (
          <NewDiscoverPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
          />
        );
      case 'discoverNew':
        return (
          <DiscoverPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
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
            onSecurity={() => {
              // Email verification kontrolü
              if (!isEmailVerified) {
                setCurrentPage('emailVerification');
              } else {
                // İleride SecuritySettingsPage eklenecek
                console.log('Security page - to be implemented');
              }
            }}
            onFeedback={() => setCurrentPage('feedback')}
            onAbout={() => setCurrentPage('about')}
          />
        );
      case 'emailVerification':
        // Email verification page - shows when user manually navigates
        if (user) {
          return (
            <EmailVerificationPageWrapper
              userId={user.id}
              userEmail={user.email || ''}
              onVerified={async () => {
                await markEmailAsVerified();
                setCurrentPage('home');
              }}
            />
          );
        }
        return null;
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
            onSearchNavigate={() => setCurrentPage('newDiscover')}
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
            {/* Email Verification Banner - Verified olmayan kullanıcılar için */}
            {showEmailVerificationBanner && user && (
              <View style={styles.emailVerificationBanner}>
                <View style={styles.emailVerificationBannerContent}>
                  <Text style={styles.emailVerificationBannerText}>
                    ⚠️ Email adresiniz doğrulanmadı. Lütfen email doğrulama yapın.
                  </Text>
                  <TouchableOpacity
                    style={styles.emailVerificationBannerButton}
                    onPress={() => setCurrentPage('emailVerification')}
                  >
                    <Text style={styles.emailVerificationBannerButtonText}>Doğrula</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.emailVerificationBannerClose}
                    onPress={() => setShowEmailVerificationBanner(false)}
                  >
                    <Text style={styles.emailVerificationBannerCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {renderCurrentPage()}
            {/* Only show bottom tabs on main pages */}
            {(['home', 'coupons', 'gameHub', 'leagues'] as PageType[]).includes(currentPage) && (
              <BottomTabs currentPage={currentPage} onPageChange={handlePageChange} />
            )}
            {/* Coupon Drawer – sayfa içeriğiyle aynı view ağacında (iOS dokunma blokajı önlenir) */}
            <CouponDrawer
              isOpen={isCouponDrawerOpen}
              onClose={() => setIsCouponDrawerOpen(false)}
              selections={couponSelections}
              onRemoveSelection={handleRemoveSelection}
              onClearAll={handleClearAll}
              onCouponSuccess={handleCouponSuccess}
              userCredits={userCredits}
              onCouponCreated={() => {
                setCouponsRefreshTrigger(prev => prev + 1);
              }}
            />
          </View>
        </SlideOutMenu>

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
          <View style={styles.modalFullScreenWrapper}>
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
          </View>
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
  const { user, loading, pendingVerification } = useAuth();
  const [showEmailVerification, setShowEmailVerification] = React.useState(false);

  // TÜM HOOK'LAR ERKEN RETURN'LERDEN ÖNCE OLMALI!
  // SignUp sonrası email verification bekleniyor mu? (user null olsa bile)
  React.useEffect(() => {
    if (pendingVerification) {
      setShowEmailVerification(true);
    }
  }, [pendingVerification]);

  // Loading durumu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Email verification gösteriliyorsa
  if (showEmailVerification) {
    return (
      <AppContentWrapper />
    );
  }

  // Giriş yapılmamışsa login sayfasını göster
  if (!user) {
    return <LoginPage />;
  }

  // Giriş yapılmışsa ana uygulamayı göster
  return <AppContent />;
}

// Email verification için wrapper - user null olsa bile AppContent'i gösterebilmek için
function AppContentWrapper() {
  const { pendingVerification, pendingVerificationUser, markEmailAsVerified } = useAuth();

  // EmailVerificationPage'i render et
  if (pendingVerificationUser) {
    return (
      <EmailVerificationPageWrapper
        userId={pendingVerificationUser.id}
        userEmail={pendingVerificationUser.email}
        onVerified={async () => {
          markEmailAsVerified();
          // Verification başarılı - kullanıcıyı otomatik login et
          // Email ve şifre bilgilerini LoginPage'de saklamak gerekebilir
          // Şimdilik sadece state'i güncelle, session kendiliğinden oluşacak
        }}
      />
    );
  }

  return null;
}

// EmailVerificationPage wrapper - user bilgilerini prop olarak alır
function EmailVerificationPageWrapper({
  userId,
  userEmail,
  onVerified
}: {
  userId: string;
  userEmail: string;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingOTP, setSendingOTP] = useState(false);

  // Component mount olduğunda OTP gönder
  useEffect(() => {
    handleSendOTP();
  }, []); // Sadece mount'ta çalışsın

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    setResendLoading(true);
    setSendingOTP(true);
    try {
      const result = await verificationService.sendOTP(userId, userEmail);

      if (result.success) {
        setCountdown(60); // 60 saniye bekle
        if (countdown === 0) {
          // İlk gönderimde sessiz, tekrar gönderimde bildirim
          Alert.alert('Başarılı', 'Doğrulama kodu email adresinize gönderildi');
        }
      } else {
        Alert.alert('Hata', result.error || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setResendLoading(false);
      setSendingOTP(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Hata', 'Lütfen 6 haneli kodu girin');
      return;
    }

    setLoading(true);
    try {
      const result = await verificationService.verifyOTP(userId, userEmail, otp);

      if (result.success) {
        Alert.alert(
          'Başarılı',
          'Email adresiniz başarıyla doğrulandı!',
          [
            {
              text: 'Tamam',
              onPress: () => {
                onVerified();
              }
            }
          ]
        );
      } else {
        const errorMessage = result.error || 'Kod hatalı veya süresi dolmuş';
        const remainingAttempts = result.remainingAttempts;

        let message = errorMessage;
        if (remainingAttempts !== undefined && remainingAttempts > 0) {
          message += `\n\nKalan deneme hakkı: ${remainingAttempts}`;
        } else if (remainingAttempts === 0) {
          message += '\n\nYeni kod almak için "Kodu Tekrar Gönder" butonuna tıklayın.';
        }

        Alert.alert('Hata', message);
        setOtp(''); // OTP'yi temizle
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#432870" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 40 }}>✉️</Text>
          </View>

          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' }}>Email Doğrulama</Text>
          <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 }}>
            {userEmail} adresine gönderilen 6 haneli kodu girin
          </Text>
        </View>

        {/* OTP Input */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <InputOTP
            length={6}
            value={otp}
            onChange={setOtp}
            style={{ marginVertical: 20 }}
          />

          {sendingOTP && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 }}>
              <ActivityIndicator size="small" color="#432870" />
              <Text style={{ fontSize: 14, color: '#6B7280' }}>Kod gönderiliyor...</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[{ backgroundColor: '#432870', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }, (loading || otp.length !== 6) && { backgroundColor: '#9CA3AF' }]}
          onPress={handleVerify}
          disabled={loading || otp.length !== 6}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>Doğrula</Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>Kodu almadınız mı?</Text>
          <TouchableOpacity
            style={{ paddingVertical: 12, paddingHorizontal: 24 }}
            onPress={handleSendOTP}
            disabled={countdown > 0 || resendLoading}
            activeOpacity={0.7}
          >
            {resendLoading ? (
              <ActivityIndicator size="small" color="#432870" />
            ) : (
              <Text style={[countdown > 0 && { color: '#9CA3AF' }]}>
                {countdown > 0
                  ? `Kodu Tekrar Gönder (${formatCountdown(countdown)})`
                  : 'Kodu Tekrar Gönder'
                }
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={{ backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
            ⏰ Kod 10 dakika geçerlidir{'\n'}
            📧 Email'inizi kontrol etmeyi unutmayın (Spam klasörüne bakın)
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  emailVerificationBanner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  emailVerificationBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  emailVerificationBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  emailVerificationBannerButton: {
    backgroundColor: '#432870',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  emailVerificationBannerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emailVerificationBannerClose: {
    padding: 4,
  },
  emailVerificationBannerCloseText: {
    color: '#92400E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageWrapper: {
    flex: 1,
    backgroundColor: '#0D1117',
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
  modalFullScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  questionDetailContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: '#FFFFFF',
  },
});
