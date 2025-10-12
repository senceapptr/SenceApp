import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { questions, featuredQuestions } from '../constants/questions';

interface AlternativeHomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function AlternativeHomePage({ onBack, handleQuestionDetail, handleVote }: AlternativeHomePageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Enhanced featured questions - 5 questions for carousel
  const enhancedFeatured = [
    {
      id: 1,
      title: "ChatGPT-5 bu yıl içinde çıkacak mı?",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      votes: 127000,
      timeLeft: "2 gün 14 saat",
      category: "Teknoloji",
      yesOdds: 2.4,
      noOdds: 1.6,
      dominantColor: "#4F46E5" // Purple for tech
    },
    {
      id: 2,
      title: "Türkiye Milli Takımı Euro 2024'te finale kalacak mı?",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      votes: 89000,
      timeLeft: "3 gün 12 saat",
      category: "Spor",
      yesOdds: 3.2,
      noOdds: 1.8,
      dominantColor: "#059669" // Green for sports
    },
    {
      id: 3,
      title: "Bitcoin 2024 sonunda 100.000 doları aşacak mı?",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
      votes: 234000,
      timeLeft: "5 gün 8 saat",
      category: "Ekonomi",
      yesOdds: 2.1,
      noOdds: 2.0,
      dominantColor: "#F59E0B" // Orange for finance
    },
    {
      id: 4,
      title: "Apple Vision Pro 2024'te Türkiye'ye gelecek mi?",
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop",
      votes: 156000,
      timeLeft: "1 gün 8 saat",
      category: "Teknoloji",
      yesOdds: 1.9,
      noOdds: 2.1,
      dominantColor: "#6366F1" // Indigo for Apple
    },
    {
      id: 5,
      title: "İstanbul'da emlak fiyatları bu yıl %30 daha artacak mı?",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      votes: 445000,
      timeLeft: "4 gün 6 saat",
      category: "Ekonomi",
      yesOdds: 2.8,
      noOdds: 1.6,
      dominantColor: "#DC2626" // Red for real estate
    }
  ];

  // Active Coupons Data - updated with app purple and darker rich tones
  const activeCoupons = [
    {
      id: 1,
      name: "Süper Combo",
      questionCount: 5,
      totalOdds: 12.8,
      potentialWinnings: 2560,
      endsIn: "2g 14s",
      gradient: "from-[#432870] to-[#5A3A8B]" // App purple gradient
    },
    {
      id: 2,
      name: "Tech Special",
      questionCount: 3,
      totalOdds: 6.4,
      potentialWinnings: 1280,
      endsIn: "5s 8d",
      gradient: "from-[#134E4A] to-[#0F766E]" // Dark teal gradient
    },
    {
      id: 3,
      name: "Risk Master",
      questionCount: 8,
      totalOdds: 24.6,
      potentialWinnings: 4920,
      endsIn: "1g 12s",
      gradient: "from-[#DC2626] to-[#B91C1C]" // Dark red gradient
    }
  ];

  // Category color mapping - rich, dark tones
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: { border: string; background: string } } = {
      'Teknoloji': { border: '#1E40AF', background: '#1E40AF' }, // Dark blue
      'Spor': { border: '#059669', background: '#059669' }, // Dark emerald
      'Ekonomi': { border: '#D97706', background: '#D97706' }, // Dark amber
      'Eğlence': { border: '#DC2626', background: '#DC2626' }, // Dark red
      'Müzik': { border: '#7C3AED', background: '#7C3AED' }, // Dark purple
      'Politika': { border: '#1F2937', background: '#1F2937' }, // Dark slate
      'Sosyal Medya': { border: '#BE185D', background: '#BE185D' }, // Dark pink
      'Dünya': { border: '#047857', background: '#047857' }, // Dark teal
    };
    
    return colorMap[category] || { border: '#6B7280', background: '#6B7280' }; // Default gray
  };

  // Trend Questions with enhanced data
  const trendQuestions = [
    {
      id: 6,
      title: "Netflix Türkiye'de abonelik fiyatları %50 artacak mı?",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
      votes: 89400,
      timeLeft: "3 gün 12 saat",
      yesOdds: 2.8,
      noOdds: 1.6,
      yesPercentage: 68
    },
    {
      id: 7,
      title: "Yapay zeka 2024 sonuna kadar %25 işsizlik artışına sebep olacak mı?",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
      votes: 156000,
      timeLeft: "1 gün 8 saat",
      yesOdds: 3.2,
      noOdds: 1.4,
      yesPercentage: 78
    },
    {
      id: 8,
      title: "Galatasaray bu sezon Şampiyonlar Ligi'nde çeyrek finale kalacak mı?",
      category: "Spor", 
      image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=400&fit=crop",
      votes: 234000,
      timeLeft: "4 gün 6 saat",
      yesOdds: 4.1,
      noOdds: 1.3,
      yesPercentage: 82
    },
    {
      id: 9,
      title: "Erdem Özveren bu yıl içinde evlenecek mi?",
      category: "Eğlence",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      votes: 67000,
      timeLeft: "2 gün 3 saat", 
      yesOdds: 1.8,
      noOdds: 2.2,
      yesPercentage: 45
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      
      // Calculate header opacity based on scroll position
      // Start fading when scrolled past the stats area (around 450px)
      // Full opacity when reaching buttons area (around 550px)
      const startFade = 420; // Position where "127k Oy" stats are
      const fullOpaque = 520; // Position where YES/NO buttons are
      
      if (newScrollY <= startFade) {
        setHeaderOpacity(0);
      } else if (newScrollY >= fullOpaque) {
        setHeaderOpacity(1);
      } else {
        // Fluid interpolation between start and full opacity
        const progress = (newScrollY - startFade) / (fullOpaque - startFade);
        setHeaderOpacity(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track current feature index for scroll
  useEffect(() => {
    const handleFeatureScroll = () => {
      const carousel = document.getElementById('feature-carousel');
      if (carousel) {
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = carousel.clientWidth;
        const newIndex = Math.round(scrollLeft / cardWidth);
        setCurrentFeatureIndex(newIndex);
      }
    };

    const carousel = document.getElementById('feature-carousel');
    if (carousel) {
      carousel.addEventListener('scroll', handleFeatureScroll);
      return () => carousel.removeEventListener('scroll', handleFeatureScroll);
    }
  }, []);

  const formatVotes = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
    return count.toString();
  };

  // Enhanced Semi-circle progress component with dark background like AlternativeSearchPage
  const SemiCircleProgress = ({ percentage, isYes }: { percentage: number, isYes: boolean }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.3 });
    
    const radius = 26;
    const circumference = Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = isInView ? circumference * (1 - percentage / 100) : circumference;
    
    return (
      <div className="relative" ref={ref}>
        <div className="relative w-20 h-12 bg-black/70 backdrop-blur-md rounded-t-full flex items-end justify-center border-2 border-b-0 border-white/40 shadow-lg">
          <svg className="w-16 h-10 transform" viewBox="0 0 64 32">
            {/* Background semicircle */}
            <path
              d="M 6 26 A 26 26 0 0 1 58 26"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Progress semicircle */}
            <motion.path
              d="M 6 26 A 26 26 0 0 1 58 26"
              fill="none"
              stroke={isYes ? "#10B981" : "#EF4444"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset: isInView ? strokeDashoffset : strokeDasharray }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div 
              className="text-white font-bold text-xs drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              %{percentage}
            </motion.div>
            <motion.div 
              className="text-white text-xs opacity-90 drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.7 }}
            >
              {isYes ? 'EVET' : 'HAYIR'}
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  // Profile menu component
  const ProfileMenu = () => (
    <AnimatePresence>
      {profileMenuOpen && (
        <>
          <motion.div 
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileMenuOpen(false)}
          />
          <motion.div
            className="fixed top-20 right-6 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 min-w-48"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">Erdem Özveren</div>
                  <div className="text-sm text-gray-500">@erdem</div>
                </div>
              </div>
            </div>
            
            <div className="py-1">
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Profilim
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Görünüm
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Ayarlar
              </button>
            </div>
            
            <div className="border-t border-gray-100 py-1">
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Çıkış Yap
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-white pb-24" ref={contentRef}>
      {/* Fixed Header with Dynamic Background */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`
        }}
      >
        <div className="flex items-center justify-between px-6 py-6 pt-16">
          <div className="flex items-center">
            <motion.h1 
              className="font-black text-3xl tracking-tight drop-shadow-lg transition-colors duration-300"
              style={{
                color: headerOpacity > 0.5 ? '#000000' : '#ffffff',
                textShadow: headerOpacity > 0.5 ? 'none' : '2px 2px 4px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.5)'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Sence.
            </motion.h1>
          </div>
          
          {/* Enhanced Circular Profile Photo with Click Handler */}
          <motion.div 
            className="relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <div 
              className="w-12 h-12 rounded-full overflow-hidden border-3 backdrop-blur-sm shadow-xl transition-colors duration-300"
              style={{ 
                borderColor: headerOpacity > 0.5 
                  ? (enhancedFeatured[currentFeatureIndex]?.dominantColor || "#000000")
                  : "#ffffff"
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Enhanced notification badge */}
            <motion.div 
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white text-xs font-bold">3</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Profile Menu */}
      <ProfileMenu />

      {/* Hero Section with Featured Questions Carousel */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Scrollable Featured Questions - Only Background Scrolls */}
        <div 
          id="feature-carousel"
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full"
        >
          {enhancedFeatured.map((question, index) => (
            <div key={question.id} className="flex-shrink-0 w-full h-full relative snap-center">
              {/* Background Image - Clickable to open detail */}
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => handleQuestionDetail(question.id)}
              >
                <img 
                  src={question.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
              </div>

              {/* Featured Question Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* Stats Row - Top with improved format - Clickable */}
                <div 
                  className="flex items-center justify-between mb-6 cursor-pointer"
                  onClick={() => handleQuestionDetail(question.id)}
                >
                  <motion.div 
                    className="bg-white/25 backdrop-blur-md rounded-full px-4 py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-white font-semibold text-sm">
                      👥 {formatVotes(question.votes)} Oy
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white/25 backdrop-blur-md rounded-full px-4 py-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-white font-semibold text-sm">
                      ⏱️ {question.timeLeft}
                    </span>
                  </motion.div>
                </div>

                {/* Question Title - Center - Clickable */}
                <motion.h2 
                  className="text-white font-black text-2xl leading-tight mb-8 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => handleQuestionDetail(question.id)}
                >
                  {question.title}
                </motion.h2>

                {/* Action Buttons - Bottom */}
                <motion.div 
                  className="flex gap-4 mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(question.id, 'yes', question.yesOdds);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="font-black text-lg">EVET</div>
                      <div className="text-sm opacity-90">{question.yesOdds}x</div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(question.id, 'no', question.noOdds);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="font-black text-lg">HAYIR</div>
                      <div className="text-sm opacity-90">{question.noOdds}x</div>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Carousel Indicators - Don't move with scroll */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex justify-center gap-2">
            {enhancedFeatured.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentFeatureIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Active Coupons Section - Updated with app purple */}
      <div className="bg-gray-50 px-4 py-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#432870] font-bold text-xl">Aktif Kuponlar</h3>
          <motion.button 
            className="text-[#432870] font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
          >
            Tümünü gör
          </motion.button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {activeCoupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 w-72 bg-gradient-to-br ${coupon.gradient} rounded-3xl p-6 text-white relative overflow-hidden cursor-pointer shadow-lg`}
              whileHover={{ 
                scale: 1.03,
                y: -6,
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                zIndex: 20
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <motion.div 
                  className="w-full h-full"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  style={{
                    backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)`,
                    backgroundSize: '50px 50px'
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h4 className="font-bold text-xl mb-4">{coupon.name}</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/80">Soru Sayısı</span>
                    <span className="font-semibold">{coupon.questionCount} adet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Toplam Oran</span>
                    <span className="font-semibold">{coupon.totalOdds}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Potansiyel Kazanç</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{coupon.potentialWinnings}</span>
                      <span className="text-yellow-300">💎</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Bitiş</span>
                    <span className="font-semibold">{coupon.endsIn}</span>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/0 transition-all duration-500 pointer-events-none"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trend Questions Section with Category Colors */}
      <div className="bg-gray-50 px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 font-bold text-xl">Trend Sorular</h3>
          <motion.button 
            className="text-orange-600 font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
          >
            Tümünü görüntüle
          </motion.button>
        </div>
        
        {/* Question Cards with Category-based Borders and Colors */}
        <div className="space-y-4">
          {trendQuestions.map((question, index) => {
            const categoryColor = getCategoryColor(question.category);
            return (
              <motion.div
                key={question.id}
                className="rounded-3xl overflow-hidden shadow-lg cursor-pointer group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.01,
                  y: -4,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                onClick={() => handleQuestionDetail(question.id)}
                style={{
                  border: `4px solid ${categoryColor.border}` // Thicker category-based border
                }}
              >
                {/* Card container - Optimized height for proper element spacing */}
                <div className="relative h-[26rem]">
                  {/* Background Image */}
                  <img 
                    src={question.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                  {/* Category - Left edge flush like AlternativeSearchPage */}
                  <div className="absolute top-6 left-0 z-20">
                    <motion.div 
                      className="backdrop-blur-md rounded-r-full px-4 py-2 border border-white/20"
                      whileHover={{ scale: 1.05 }}
                      style={{
                        backgroundColor: `${categoryColor.background}E6` // Add opacity to category color
                      }}
                    >
                      <span className="text-white font-bold text-sm">{question.category}</span>
                    </motion.div>
                  </div>

                  {/* Semi-circle progress - Top Right Corner */}
                  <div className="absolute top-6 right-6 z-20">
                    <SemiCircleProgress 
                      percentage={question.yesPercentage} 
                      isYes={question.yesPercentage > 50}
                    />
                  </div>

                  {/* Vote Count - Above Question Text, Right Edge Flush, High Z-Index */}
                  <div className="absolute bottom-44 right-0 z-20">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-l-full text-sm font-bold shadow-lg border border-white/30">
                      👥 {formatVotes(question.votes)}
                    </div>
                  </div>

                  {/* Time Remaining - Below Vote Count, Same Style - Proper spacing */}
                  <div className="absolute bottom-36 right-0 z-20">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-l-full text-sm font-bold shadow-lg">
                      ⏱️ {question.timeLeft}
                    </div>
                  </div>

                  {/* Question Text - Full width, extends over both buttons */}
                  <div className="absolute bottom-28 left-6 right-6 z-10">
                    <h4 className="text-white font-bold text-xl leading-tight">
                      {question.title}
                    </h4>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <div className="flex gap-4">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(question.id, 'yes', question.yesOdds);
                        }}
                        className="flex-1 bg-green-600/90 backdrop-blur-sm text-white font-bold py-3 rounded-2xl transition-all duration-300 border border-green-500/30 shadow-lg"
                        whileHover={{ 
                          backgroundColor: "rgba(34, 197, 94, 0.95)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center">
                          <div className="font-black text-base">EVET</div>
                          <div className="text-sm opacity-90">{question.yesOdds}x</div>
                        </div>
                      </motion.button>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(question.id, 'no', question.noOdds);
                        }}
                        className="flex-1 bg-red-600/90 backdrop-blur-sm text-white font-bold py-3 rounded-2xl transition-all duration-300 border border-red-500/30 shadow-lg"
                        whileHover={{ 
                          backgroundColor: "rgba(239, 68, 68, 0.95)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center">
                          <div className="font-black text-base">HAYIR</div>
                          <div className="text-sm opacity-90">{question.noOdds}x</div>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}