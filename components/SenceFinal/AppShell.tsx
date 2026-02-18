import React, { useState, useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { FAQPage } from '@/components/SenceFinal/FAQPage';
import { HomePage } from '@/components/SenceFinal/HomePage';
import { TasksPage } from '@/components/SenceFinal/TasksPage';
import { AboutPage } from '@/components/SenceFinal/AboutPage';
import { LoginPage } from '@/components/SenceFinal/LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { LeaguePage } from '@/components/SenceFinal/LeaguePage';
import { MarketPage } from '@/components/SenceFinal/MarketPage';
import { BottomTabs } from '@/components/SenceFinal/BottomTabs';
import { AdminPanel } from '@/components/SenceFinal/AdminPanel';
import { AdminRedesignLabPage } from '@/components/SenceFinal/AdminRedesignLabPage';
import { AdminProfileRedesignMockPage } from '@/components/SenceFinal/AdminProfileRedesignMockPage';
import { CouponsPage } from '@/components/SenceFinal/CouponsPage';
import { ProfilePage } from '@/components/SenceFinal/ProfilePage';
import { SupportPage } from '@/components/SenceFinal/SupportPage';
import { GameHubPage } from '@/components/SenceFinal/GameHubPage';
import { SettingsPage } from '@/components/SenceFinal/SettingsPage';
import { FeedbackPage } from '@/components/SenceFinal/FeedbackPage';
import { DiscoverPage } from '@/components/SenceFinal/DiscoverPage';
import { CouponDrawer } from '@/components/SenceFinal/CouponDrawer';
import { SlideOutMenu } from '@/components/SenceFinal/SlideOutMenu';
import { HelpCenterPage } from '@/components/SenceFinal/HelpCenterPage';
import { ThemeTransition } from '@/components/SenceFinal/ThemeTransition';
import { EditProfilePage } from '@/components/SenceFinal/EditProfilePage';
import { NewDiscoverPage } from '@/components/SenceFinal/NewDiscoverPage';
import { LeaderboardPage } from '@/components/SenceFinal/LeaderboardPage';
import { WriteQuestionPage } from '@/components/SenceFinal/WriteQuestionPage';
import { NotificationsPage } from '@/components/SenceFinal/NotificationsPage';
import { ConfettiAnimation } from '@/components/SenceFinal/ConfettiAnimation';
import { QuestionDetailPage } from '@/components/SenceFinal/QuestionDetailPage';
import { PrivacySettingsPage } from '@/components/SenceFinal/PrivacySettingsPage';
import { CategoryQuestionsPage } from '@/components/SenceFinal/CategoryQuestionsPage';
import { QuestionCardDesignPage } from '@/components/SenceFinal/QuestionCardDesignPage';
// EmailVerificationPage is defined inline in this file
import { InputOTP } from '@/components/PremiumSence/ui/input-otp';
import { LEGAL_CONFIG, openExternalUrl } from '@/constants/legal';
import { verificationService } from '@/services/verification.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PageType =
  | 'home'
  | 'coupons'
  | 'leagues'
  | 'gameHub'
  | 'newDiscover'
  | 'discoverNew'
  | 'writeQuestion'
  | 'tasks'
  | 'settings'
  | 'market'
  | 'notifications'
  | 'profile'
  | 'questionDetail'
  | 'questionCardDesign'
  | 'editProfile'
  | 'privacySettings'
  | 'helpCenter'
  | 'support'
  | 'faq'
  | 'feedback'
  | 'about'
  | 'adminPanel'
  | 'adminRedesignLab'
  | 'adminProfileRedesignMock'
  | 'allQuestions'
  | 'emailVerification'
  | 'leaderboard';

interface Question {
  id: string;
  title: string;
  image: string;
  noOdds: number;
  yesOdds: number;
  endDate: string;
  category: string;
  timeLeft: string;
  totalVotes: number;
  description: string;
  publishDate: string;
  totalAmount: number;
  noPercentage: number;
  yesPercentage: number;
}

interface CouponSelection {
  id: number;
  odds: number;
  title: string;
  boosted?: boolean;
  questionId: string;
  vote: 'yes' | 'no';
}

interface UserProfile {
  bio: string;
  email: string;
  username: string;
  fullName: string;
  coverImage: string;
  profileImage: string;
}

// AllQuestionsModal - CategoryQuestionsPage'i slide animasyonu ile açar
function AllQuestionsModal({
  handleQuestionDetail,
  handleVote,
  onBack,
}: {
  onBack: () => void;
  handleQuestionDetail: (questionId: string, sourceCategory?: any) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      friction: 10,
      tension: 50,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackWithAnimation = () => {
    // Slide out animation
    Animated.spring(slideAnim, {
      friction: 10,
      tension: 50,
      toValue: SCREEN_WIDTH,
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
          color: '#7C3AED',
          icon: '🌟',
          id: 'all',
          label: 'Tüm Sorular',
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
  const { checkEmailVerification, isEmailVerified, markEmailAsVerified, pendingVerification, profile, user } =
    useAuth();
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
  const [isLeagueRaceActive, setIsLeagueRaceActive] = useState(false);
  const [couponSelections, setCouponSelections] = useState<CouponSelection[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponsRefreshTrigger, setCouponsRefreshTrigger] = useState(0);

  // User Profile state - gerçek auth verilerinden oluştur
  const userProfile: UserProfile = {
    bio: profile?.bio || 'Henüz bio eklenmedi',
    coverImage:
      profile?.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    email: user?.email || '',
    fullName: profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı',
    profileImage:
      profile?.profile_image ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    username: profile?.username || user?.email?.split('@')[0] || 'kullanici',
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
      category: 'Genel',
      description: 'Soru detayları yükleniyor...',
      endDate: '2024-12-31T23:59:59',
      id: questionIdString,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      noOdds: 2.0,
      noPercentage: 50,
      publishDate: 'Yükleniyor...',
      timeLeft: 'Yükleniyor...',
      title: 'Soru Yükleniyor...',
      totalAmount: 0,
      totalVotes: 0,
      yesOdds: 2.0,
      yesPercentage: 50,
    };
    setSelectedQuestion(mockQuestion);

    // Sağdan açılış animasyonu - hızlı timing
    questionDetailSlideAnim.setValue(SCREEN_WIDTH);
    Animated.timing(questionDetailSlideAnim, {
      duration: 250, // Hızlı - 250ms
      toValue: 0,
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
          category: result.data.categories?.name || 'Genel',
          description: result.data.description || '',
          endDate: result.data.end_date,
          id: result.data.id || questionIdString,
          image:
            result.data.image_url ||
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
          noOdds: result.data.no_odds || 2.0,
          noPercentage: result.data.no_percentage || 50,
          publishDate: new Date(result.data.created_at).toLocaleDateString('tr-TR'),
          timeLeft: calculateTimeLeft(result.data.end_date),
          title: result.data.title || 'Soru',
          totalAmount: result.data.total_amount || 0,
          totalVotes: result.data.total_votes || 0,
          yesOdds: result.data.yes_odds || 2.0,
          yesPercentage: result.data.yes_percentage || 50,
        };

        setSelectedQuestion(question);
      } else {
        // Backend'den veri gelmezse mock data kullan
        const mockQuestion: Question = {
          category: 'Genel',
          description: 'Bu soru için detay bilgisi bulunamadı.',
          endDate: '2024-12-31T23:59:59',
          id: questionIdString,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
          noOdds: 2.0,
          noPercentage: 50,
          publishDate: 'Bilinmiyor',
          timeLeft: 'Bilinmiyor',
          title: 'Soru Bulunamadı',
          totalAmount: 0,
          totalVotes: 0,
          yesOdds: 2.0,
          yesPercentage: 50,
        };
        setSelectedQuestion(mockQuestion);
      }
    } catch (error) {
      console.error('Question detail load error:', error);

      // Hata durumunda mock data kullan
      const mockQuestion: Question = {
        category: 'Genel',
        description: 'Soru detayları yüklenirken bir hata oluştu.',
        endDate: '2024-12-31T23:59:59',
        id: questionId.toString(),
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        noOdds: 2.0,
        noPercentage: 50,
        publishDate: 'Bilinmiyor',
        timeLeft: 'Bilinmiyor',
        title: 'Soru Yüklenemedi',
        totalAmount: 0,
        totalVotes: 0,
        yesOdds: 2.0,
        yesPercentage: 50,
      };
      setSelectedQuestion(mockQuestion);
    }
  };

  const handleCloseQuestionDetail = () => {
    // Basit kapanış animasyonu - sağa kayıp gitsin
    Animated.timing(questionDetailSlideAnim, {
      duration: 200, // Çok hızlı - 200ms
      toValue: SCREEN_WIDTH,
      useNativeDriver: true,
    }).start(() => {
      // Animasyon tamamlandığında modal'ı kapat
      setIsQuestionDetailOpen(false);
      setSelectedQuestion(null);
      setSourceCategory(null);
    });
  };

  const handleVote = (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => {
    setCouponSelections(prevSelections => {
      // Check if question is already in coupon
      const existingSelectionIndex = prevSelections.findIndex(selection => selection.questionId === questionId);

      if (existingSelectionIndex !== -1) {
        // Update existing selection
        const updatedSelections = [...prevSelections];
        updatedSelections[existingSelectionIndex] = {
          ...updatedSelections[existingSelectionIndex],
          odds,
          vote,
        };
        return updatedSelections;
      }

      // Add new selection
      const newSelection: CouponSelection = {
        boosted: Math.random() > 0.7, // Random boost for demo
        id: Date.now(), // Simple ID generation
        odds,
        questionId,
        title: questionTitle || `Soru ${questionId}`, // Use actual title if provided
        vote,
      };
      return [...prevSelections, newSelection];
    });

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

  const handleNavigateToPage = (page: string) => {
    setCurrentPage(page as PageType);
    setIsMenuOpen(false);
  };

  const handleTasksNavigate = () => {
    setCurrentPage('tasks');
  };

  const handleTasksPageNavigation = (page: 'home' | 'leagues' | 'gameHub') => {
    setCurrentPage(page);
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
        [{ style: 'default', text: 'Tamam' }],
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
          <AllQuestionsModal onBack={handleBack} handleQuestionDetail={handleQuestionDetail} handleVote={handleVote} />
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
            onRaceModeChange={setIsLeagueRaceActive}
            onMenuToggle={handleMenuToggle}
          />
        );
      case 'gameHub':
        return <GameHubPage onBack={() => setCurrentPage('home')} onMenuToggle={handleMenuToggle} />;
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
            onOpenQuestionDetail={questionId => handleQuestionDetail(questionId)}
          />
        );
      case 'tasks':
        return (
          <TasksPage onBack={handleBack} onMenuToggle={handleMenuToggle} onNavigateToPage={handleTasksPageNavigation} />
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
                Alert.alert(
                  'Hesap Güvenliği',
                  'Email doğrulamanız tamamlandı. Şifre yenileme ve hesap silme işlemlerini Ayarlar menüsünden yönetebilirsiniz.',
                );
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
        return <EditProfilePage onBack={handleBack} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
      case 'privacySettings':
        return <PrivacySettingsPage onBack={handleBack} />;
      case 'helpCenter':
        return (
          <HelpCenterPage
            onBack={handleBack}
            onSupport={() => setCurrentPage('support')}
            onFAQ={() => setCurrentPage('faq')}
            onTerms={() => {
              openExternalUrl(LEGAL_CONFIG.termsOfUseUrl);
            }}
          />
        );
      case 'support':
        return <SupportPage onBack={handleBack} />;
      case 'faq':
        return <FAQPage onBack={handleBack} />;
      case 'feedback':
        return <FeedbackPage onBack={handleBack} />;
      case 'about':
        return <AboutPage onBack={handleBack} />;
      case 'adminPanel':
        return <AdminPanel onBack={handleBack} />;
      case 'adminRedesignLab':
        return (
          <AdminRedesignLabPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            onOpenProfileRedesignMock={() => setCurrentPage('adminProfileRedesignMock')}
          />
        );
      case 'adminProfileRedesignMock':
        return <AdminProfileRedesignMockPage onBack={() => setCurrentPage('adminRedesignLab')} onMenuToggle={handleMenuToggle} />;
      case 'market':
        return <MarketPage onBack={handleBack} userCredits={userCredits} />;
      case 'notifications':
        return (
          <NotificationsPage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            onNavigateToPage={page => setCurrentPage(page as PageType)}
            onOpenQuestionDetail={questionId => handleQuestionDetail(questionId)}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            onBack={handleBack}
            onMenuToggle={handleMenuToggle}
            onOpenQuestionDetail={questionId => handleQuestionDetail(questionId)}
            userProfile={userProfile}
          />
        );
      case 'questionCardDesign':
        return <QuestionCardDesignPage onBack={handleBack} onMenuToggle={handleMenuToggle} />;
      case 'leaderboard':
        return <LeaderboardPage onBack={handleBack} onMenuToggle={handleMenuToggle} />;
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent hidden={false} />
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
            {(['home', 'coupons', 'gameHub', 'leagues'] as PageType[]).includes(currentPage) && !isLeagueRaceActive && (
              <BottomTabs currentPage={currentPage} onPageChange={handlePageChange} />
            )}
            {/* Coupon Drawer - detay modalı kapalıyken ana katmanda render edilir */}
            {!isQuestionDetailOpen && (
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
            )}
          </View>
        </SlideOutMenu>

        {/* Confetti Animation */}
        <ConfettiAnimation isVisible={showConfetti} onComplete={() => setShowConfetti(false)} />

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

            {/* Coupon Drawer - detay modalı açıkken bu katmanda render edilir */}
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
        </Modal>
      </ThemeTransition>
    </View>
  );
}

// Ana App component - authentication kontrolü yapar
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppWithAuth />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// Authentication kontrolü yapan component
function AppWithAuth() {
  const { loading, pendingVerification, user } = useAuth();
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
    return <AppContentWrapper />;
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
  const { markEmailAsVerified, pendingVerification, pendingVerificationUser } = useAuth();

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
  onVerified,
  userEmail,
  userId,
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
        Alert.alert('Başarılı', 'Email adresiniz başarıyla doğrulandı!', [
          {
            onPress: () => {
              onVerified();
            },
            text: 'Tamam',
          },
        ]);
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
      style={{ backgroundColor: '#FFFFFF', flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#432870" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 40,
              height: 80,
              justifyContent: 'center',
              marginBottom: 20,
              width: 80,
            }}
          >
            <Text style={{ fontSize: 40 }}>✉️</Text>
          </View>

          <Text style={{ color: '#111827', fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
            Email Doğrulama
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 16, lineHeight: 24, paddingHorizontal: 20, textAlign: 'center' }}>
            {userEmail} adresine gönderilen 6 haneli kodu girin
          </Text>
        </View>

        {/* OTP Input */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <InputOTP length={6} value={otp} onChange={setOtp} style={{ marginVertical: 20 }} />

          {sendingOTP && (
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <ActivityIndicator size="small" color="#432870" />
              <Text style={{ color: '#6B7280', fontSize: 14 }}>Kod gönderiliyor...</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            {
              alignItems: 'center',
              backgroundColor: '#432870',
              borderRadius: 12,
              justifyContent: 'center',
              marginBottom: 24,
              paddingVertical: 16,
            },
            (loading || otp.length !== 6) && { backgroundColor: '#9CA3AF' },
          ]}
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
          <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 8 }}>Kodu almadınız mı?</Text>
          <TouchableOpacity
            style={{ paddingHorizontal: 24, paddingVertical: 12 }}
            onPress={handleSendOTP}
            disabled={countdown > 0 || resendLoading}
            activeOpacity={0.7}
          >
            {resendLoading ? (
              <ActivityIndicator size="small" color="#432870" />
            ) : (
              <Text style={[countdown > 0 && { color: '#9CA3AF' }]}>
                {countdown > 0 ? `Kodu Tekrar Gönder (${formatCountdown(countdown)})` : 'Kodu Tekrar Gönder'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View
          style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderRadius: 12, borderWidth: 1, padding: 16 }}
        >
          <Text style={{ color: '#6B7280', fontSize: 13, lineHeight: 20, textAlign: 'center' }}>
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
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  emailVerificationBanner: {
    backgroundColor: '#FEF3C7',
    borderBottomColor: '#FCD34D',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
  },
  emailVerificationBannerButton: {
    backgroundColor: '#432870',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  emailVerificationBannerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  emailVerificationBannerText: {
    color: '#92400E',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#432870',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  modalFullScreenWrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  pageContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  pageText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  pageWrapper: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  questionDetailContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    width: SCREEN_WIDTH,
  },
});
