import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { FilterPills } from './components/FilterPills';
import { QuestionCard } from './components/QuestionCard';
import { BottomTabs } from './components/BottomTabs';
import { ProfileDrawer } from './components/ProfileDrawer';
import { QuestionDetail } from './components/QuestionDetail';
import { CouponDrawer } from './components/CouponDrawer';
import { PredictPage } from './components/PredictPage';
import { MyBetsPage } from './components/MyBetsPage';
import { LeaguePage } from './components/LeaguePage';
import { SearchPage } from './components/SearchPage';
import { EditProfilePage } from './components/EditProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [questionDetailOpen, setQuestionDetailOpen] = useState(false);
  const [couponDrawerOpen, setCouponDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [couponSelections, setCouponSelections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ending-soon');
  const [scrollY, setScrollY] = useState(0);
  const [userPoints, setUserPoints] = useState(2450);
  const [dailyStreak, setDailyStreak] = useState(7);

  // Scroll tracking for sticky effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Daily motivation messages for retention
  const getMotivationMessage = () => {
    const messages = [
      "🔥 Günlük serin devam ediyor!",
      "⭐ Harika tahminler yapıyorsun!",
      "🎯 Bugün şansını dene!",
      "💫 Kazanma zamanı!",
      "🚀 Tahmin ustası!"
    ];
    return messages[dailyStreak % messages.length];
  };

  const featuredQuestions = [
    {
      id: 1,
      title: "Lakers playoff'lara kalabilecek mi?",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      gradient: "from-purple-600 via-purple-700 to-orange-500",
      yesPercentage: 65,
      votes: "15,2K oy",
      timeLeft: "14 saat kaldı",
      category: "spor",
      description: "Los Angeles Lakers'ın bu sezon playoff'lara kalıp kalamayacağı büyük merak konusu.",
      yesOdds: 1.45,
      noOdds: 2.80
    },
    {
      id: 2,
      title: "Bitcoin 100.000$ geçecek mi?",
      image: "https://images.unsplash.com/photo-1518544866273-fc7986c2da2c?w=800&h=600&fit=crop",
      gradient: "from-orange-500 via-red-500 to-purple-600",
      yesPercentage: 72,
      votes: "22,1K oy",
      timeLeft: "3 gün kaldı",
      category: "kripto",
      description: "Bitcoin'in 2025 sonuna kadar 100.000 dolara ulaşıp ulaşmayacağı hakkında tahmin.",
      yesOdds: 1.35,
      noOdds: 3.10
    },
    {
      id: 3,
      title: "Tesla yeni model açıklayacak mı?",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
      gradient: "from-red-500 via-pink-500 to-purple-600",
      yesPercentage: 58,
      votes: "8,7K oy",
      timeLeft: "1 gün kaldı",
      category: "teknoloji",
      description: "Tesla'nın bu yıl içinde yeni bir araç modeli açıklayıp açıklamayacağı.",
      yesOdds: 1.65,
      noOdds: 2.25
    },
    {
      id: 4,
      title: "Apple VR gözlük fiyatını düşürecek mi?",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=600&fit=crop",
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      yesPercentage: 43,
      votes: "12,5K oy",
      timeLeft: "5 gün kaldı",
      category: "teknoloji",
      description: "Apple Vision Pro'nun fiyatının bu yıl içinde düşürülüp düşürülmeyeceği.",
      yesOdds: 2.15,
      noOdds: 1.70
    }
  ];

  const questions = [
    {
      id: 6,
      title: "Netflix yeni dizi sayısını artıracak mı?",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
      yesPercentage: 67,
      votes: "9,8K oy",
      timeLeft: "2 gün kaldı",
      category: "teknoloji",
      yesOdds: 1.48,
      noOdds: 2.65
    },
    {
      id: 7,
      title: "Spotify podcast yatırımını artıracak mı?",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
      yesPercentage: 54,
      votes: "7,3K oy",
      timeLeft: "5 gün kaldı",
      category: "teknoloji",
      yesOdds: 1.85,
      noOdds: 1.95
    },
    {
      id: 8,
      title: "Amazon drone teslimatı başlatacak mı?",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
      yesPercentage: 39,
      votes: "15,1K oy",
      timeLeft: "1 hafta kaldı",
      category: "teknoloji",
      yesOdds: 2.45,
      noOdds: 1.55
    },
    {
      id: 9,
      title: "Real Madrid Şampiyonlar Ligi kazanacak mı?",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
      yesPercentage: 71,
      votes: "18,3K oy",
      timeLeft: "3 saat kaldı",
      category: "spor",
      yesOdds: 1.40,
      noOdds: 2.95
    },
    {
      id: 10,
      title: "Ethereum 5000$ seviyesini görecek mi?",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
      yesPercentage: 63,
      votes: "14,7K oy",
      timeLeft: "6 saat kaldı",
      category: "kripto",
      yesOdds: 1.58,
      noOdds: 2.42
    },
    {
      id: 11,
      title: "Galatasaray şampiyonluğu alacak mı?",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
      yesPercentage: 82,
      votes: "25,1K oy",
      timeLeft: "4 saat kaldı",
      category: "spor",
      yesOdds: 1.22,
      noOdds: 4.10
    },
    {
      id: 12,
      title: "Google yeni AI modelini duyuracak mı?",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=300&fit=crop",
      yesPercentage: 45,
      votes: "11,9K oy",
      timeLeft: "2 gün kaldı",
      category: "teknoloji",
      yesOdds: 2.22,
      noOdds: 1.65
    },
    {
      id: 13,
      title: "Dogecoin 1$ seviyesini geçecek mi?",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
      yesPercentage: 38,
      votes: "8,6K oy",
      timeLeft: "1 gün kaldı",
      category: "kripto",
      yesOdds: 2.63,
      noOdds: 1.48
    },
    {
      id: 14,
      title: "Fenerbahçe Avrupa'da başarılı olacak mı?",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      yesPercentage: 56,
      votes: "19,4K oy",
      timeLeft: "8 saat kaldı",
      category: "spor",
      yesOdds: 1.79,
      noOdds: 2.05
    },
    {
      id: 15,
      title: "Microsoft yeni Surface lansmanı yapacak mı?",
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop",
      yesPercentage: 49,
      votes: "7,2K oy",
      timeLeft: "3 gün kaldı",
      category: "teknoloji",
      yesOdds: 2.04,
      noOdds: 1.80
    }
  ];

  const handleVote = (questionId, vote, odds) => {
    const question = [...featuredQuestions, ...questions].find(q => q.id === questionId);
    if (question) {
      const selection = {
        id: questionId,
        title: question.title,
        vote,
        odds
      };
      setCouponSelections(prev => {
        const existing = prev.find(s => s.id === questionId);
        if (existing) {
          return prev.map(s => s.id === questionId ? selection : s);
        }
        return prev.length < 4 ? [...prev, selection] : prev;
      });
      setCouponDrawerOpen(true);
      
      // Retention: Simulated haptic feedback with visual feedback
      const button = document.activeElement;
      if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      }
    }
  };

  const handleQuestionDetail = (questionId) => {
    const question = [...featuredQuestions, ...questions].find(q => q.id === questionId);
    setSelectedQuestion(question);
    setQuestionDetailOpen(true);
  };

  const getFilteredQuestions = () => {
    if (selectedCategory === 'all') {
      return questions;
    }
    if (selectedCategory === 'ending-soon') {
      return questions.filter(q => 
        q.timeLeft.includes('saat') || 
        q.timeLeft.includes('1 gün') || 
        q.timeLeft.includes('2 gün')
      );
    }
    return questions.filter(q => q.category === selectedCategory);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'search':
        return <PredictPage questions={featuredQuestions} onVote={handleVote} />;
      case 'predict':
        return <SearchPage questions={[...featuredQuestions, ...questions]} onQuestionClick={handleQuestionDetail} onVote={handleVote} />;
      case 'my-bets':
        return <MyBetsPage />;
      case 'league':
        return <LeaguePage />;
      case 'edit-profile':
        return <EditProfilePage onBack={() => setCurrentPage('home')} />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('home')} />;
      case 'notifications':
        return <NotificationsPage onBack={() => setCurrentPage('home')} />;
      default:
        const showSticky = scrollY > 200;
        return (
          <>
            {/* Retention: Daily motivation banner */}
            {currentPage === 'home' && (
              <div className="px-5 mt-2">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-3 text-center shadow-lg animate-in slide-in-from-top-2">
                  <p className="text-white font-bold text-sm">
                    {getMotivationMessage()} {dailyStreak} gün streak! 🔥
                  </p>
                </div>
              </div>
            )}

            {/* Sticky Filter Pills */}
            {showSticky && (
              <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm animate-in slide-in-from-top-2">
                <div className="max-w-sm mx-auto px-5 py-3">
                  <FilterPills 
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>
            )}

            {/* Featured Carousel */}
            <div className={`px-5 mt-4 transition-all duration-500 ${showSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <FeaturedCarousel 
                questions={featuredQuestions} 
                onQuestionClick={handleQuestionDetail}
                onVote={handleVote}
              />
            </div>

            {/* Filter Pills */}
            <div className={`px-5 mt-4 transition-all duration-500 ${showSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <FilterPills 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Question Cards */}
            <div className={`px-5 mt-4 space-y-3 pb-24 ${showSticky ? 'mt-20' : ''}`}>
              {getFilteredQuestions().map((question, index) => (
                <div 
                  key={question.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 hover:scale-[1.01] transition-transform duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <QuestionCard 
                    {...question}
                    onQuestionClick={() => handleQuestionDetail(question.id)}
                    onVote={(vote, odds) => handleVote(question.id, vote, odds)}
                  />
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile viewport container */}
      <div className="max-w-sm mx-auto bg-white min-h-screen relative">
        {/* Header */}
        <Header 
          onProfileClick={() => setProfileDrawerOpen(true)}
          onNotificationClick={() => setNotificationsOpen(true)}
        />
        
        {/* Page Content */}
        {renderCurrentPage()}

        {/* Bottom Tabs */}
        <BottomTabs currentPage={currentPage} onPageChange={setCurrentPage} />

        {/* Modals & Drawers */}
        <ProfileDrawer 
          isOpen={profileDrawerOpen} 
          onClose={() => setProfileDrawerOpen(false)}
          onEditProfile={() => {
            setProfileDrawerOpen(false);
            setCurrentPage('edit-profile');
          }}
          onSettings={() => {
            setProfileDrawerOpen(false);
            setCurrentPage('settings');
          }}
        />
        
        <QuestionDetail
          isOpen={questionDetailOpen}
          onClose={() => setQuestionDetailOpen(false)}
          question={selectedQuestion}
          onVote={handleVote}
        />

        <CouponDrawer
          isOpen={couponDrawerOpen}
          onClose={() => setCouponDrawerOpen(false)}
          selections={couponSelections}
          onRemoveSelection={(id) => {
            setCouponSelections(prev => prev.filter(s => s.id !== id));
          }}
          onClearAll={() => setCouponSelections([])}
        />

        <NotificationsPage
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />

        {/* Retention: Floating encouragement for inactive users */}
        {currentPage === 'home' && scrollY > 500 && (
          <div className="fixed bottom-28 right-5 z-20 animate-in slide-in-from-right-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-2xl">
              <p className="text-xs font-bold">💎 Harika tahminler seni bekliyor!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}