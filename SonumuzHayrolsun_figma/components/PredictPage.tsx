import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PredictPageProps {
  questions: any[];
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
  maxSelections?: number;
  showBoostedOdds?: boolean;
  onNavigateHome?: () => void;
}

export function PredictPage({ questions, onVote, showHeader = true, maxSelections = 5, showBoostedOdds = false, onNavigateHome }: PredictPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [predictionStack, setPredictionStack] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStackLimitError, setShowStackLimitError] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentIndex];
  const canCreateCoupon = predictionStack.length === maxSelections;

  // Prevent page scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentQuestion) return;
    
    // Check if stack is full
    if (predictionStack.length >= maxSelections) {
      setShowStackLimitError(true);
      setTimeout(() => setShowStackLimitError(false), 3000);
      return;
    }
    
    const vote = direction === 'right' ? 'yes' : 'no';
    const normalOdds = direction === 'right' ? currentQuestion.yesOdds : currentQuestion.noOdds;
    const boostedOdds = showBoostedOdds ? 
      (direction === 'right' ? currentQuestion.boostedYesOdds : currentQuestion.boostedNoOdds) : 
      normalOdds;
    
    const newPrediction = {
      id: currentQuestion.id,
      title: currentQuestion.title,
      vote: vote,
      odds: boostedOdds,
      normalOdds: normalOdds,
      boosted: showBoostedOdds,
      percentage: direction === 'right' ? currentQuestion.yesPercentage : (100 - currentQuestion.yesPercentage),
      category: currentQuestion.category
    };

    setPredictionStack(prev => {
      const newStack = [...prev, newPrediction];
      if (newStack.length === maxSelections) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      return newStack;
    });

    // Move to next question
    setCurrentIndex(prev => (prev + 1) % questions.length);
    setDragOffset(0);
    setSwipeDirection(null);
    
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleCreateCoupon = () => {
    if (!canCreateCoupon) return;
    
    // All coupons are now free
    setPredictionStack([]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleClearStack = () => {
    setPredictionStack([]);
  };

  const handleBack = () => {
    // Navigate to home page
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      // Fallback to browser history or app state
      window.history.back();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentQuestion || showIntro) return;
    setIsDragging(true);
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const clampedDelta = Math.max(-150, Math.min(150, deltaX));
        setDragOffset(clampedDelta);
        
        if (Math.abs(clampedDelta) > 50) {
          setSwipeDirection(clampedDelta > 0 ? 'right' : 'left');
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 80) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      } else {
        setDragOffset(0);
        setSwipeDirection(null);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!currentQuestion || showIntro) return;
    setIsDragging(true);
    const startX = e.touches[0].clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const deltaX = e.touches[0].clientX - startX;
        const clampedDelta = Math.max(-150, Math.min(150, deltaX));
        setDragOffset(clampedDelta);
        
        if (Math.abs(clampedDelta) > 50) {
          setSwipeDirection(clampedDelta > 0 ? 'right' : 'left');
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 80) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      } else {
        setDragOffset(0);
        setSwipeDirection(null);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const getLeagueWarning = (category: string) => {
    const activeLeagues = ['spor', 'gündem'];
    return activeLeagues.includes(category);
  };

  // Modern Intro Screen
  if (showIntro) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] min-h-screen relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-40 h-40 bg-[#B29EFD]/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-40 right-20 w-32 h-32 bg-[#C9F158]/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-60 right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        {/* Modern Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10 p-6 pt-16"
        >
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBack}
              className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <div className="text-center">
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white font-black text-xl"
              >
                Hızlı Tahmin
              </motion.h1>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#C9F158] text-sm font-bold"
              >
                Artırılmış Oranlar
              </motion.p>
            </div>
            
            <div className="w-12 h-12" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-sm text-center"
          >
            {/* Animated Icon */}
            <motion.div 
              className="w-28 h-28 bg-gradient-to-br from-[#C9F158] to-[#A8D83F] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white/20"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <span className="text-5xl">⚡</span>
            </motion.div>

            {/* Title */}
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white font-black text-3xl mb-6 leading-tight"
            >
              Hızlı Tahmin Modu
            </motion.h2>

            {/* Rules with enhanced animations */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20 shadow-xl"
            >
              <div className="space-y-5 text-left">
                {[
                  { icon: "1", text: "Soruları geçemezsin - EVET veya HAYIR demen gerekiyor", delay: 0.6 },
                  { icon: "2", text: "5 tahmin yaparak kupon oluşturabilirsin", delay: 0.7 },
                  { icon: "3", text: "Bu sayfadaki oranlar artırıldı - daha fazla kazanç!", delay: 0.8 }
                ].map((rule, index) => (
                  <motion.div 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: rule.delay }}
                    className="flex items-start gap-4"
                  >
                    <motion.div 
                      className="w-8 h-8 bg-[#C9F158] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-[#432870] text-sm font-black">{rule.icon}</span>
                    </motion.div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {rule.text.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Start Button */}
            <motion.button
              onClick={() => setShowIntro(false)}
              className="w-full bg-gradient-to-r from-[#C9F158] to-[#A8D83F] hover:from-[#A8D83F] hover:to-[#C9F158] text-[#432870] font-black py-5 px-6 rounded-3xl transition-all duration-300 shadow-2xl border-2 border-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">Başla</span>
                <motion.svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </div>
            </motion.button>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-white/60 text-sm mt-6 leading-relaxed"
            >
              💡 <strong>İpucu:</strong> Kartı kaydırmak için sürükle veya butonları kullan
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-black mb-4 text-white">Tüm Sorular Tamamlandı!</h2>
          <p className="text-white/80 text-lg">Yeni sorular çok yakında...</p>
          <div className="flex justify-center gap-4 mt-8">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Infinity, delay }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
          />
        ))}
        
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-[#B29EFD]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-20 h-20 bg-[#C9F158]/30 rounded-full blur-2xl"
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Sleek Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10 p-6 pt-16"
      >
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          {/* Simplified Progress - No Numbers */}
          <div className="flex-1 mx-6">
            <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#C9F158] to-[#A8D83F]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          
          {/* User Info */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-right">
              <p className="text-white font-black text-sm">@mehmet_k</p>
              <p className="text-[#C9F158] font-bold text-xs">8,500 💎</p>
            </div>
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#C9F158] to-[#A8D83F] p-0.5"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 200,
                  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
                  opacity: 0,
                  scale: [0, 1.5, 0],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              >
                {['🎉', '⭐', '💎', '🔥', '⚡', '🚀', '✨', '💜', '🎯'][Math.floor(Math.random() * 9)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Stack Limit Error */}
      <AnimatePresence>
        {showStackLimitError && (
          <motion.div 
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-red-400"
          >
            <div className="flex items-center gap-3">
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-xl"
              >
                ⚠️
              </motion.span>
              <p className="font-bold text-sm">Kuponunda {maxSelections} tahmin var! Önce kuponunu temizle.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Main Card Area */}
      <div className="relative mx-6 mt-36 mb-6 h-[460px]">
        {/* Next card preview with better animation */}
        {questions[currentIndex + 1] && (
          <motion.div 
            className="absolute inset-2 bg-[#432870]/20 backdrop-blur-sm rounded-3xl opacity-60 shadow-xl border border-white/10" 
            animate={{ 
              scale: [0.98, 0.99, 0.98],
              rotate: [-1, 1, -1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
        
        {/* Current Card with enhanced animations */}
        <motion.div
          ref={cardRef}
          className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl border-2 border-white/30"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.01}deg)`,
            transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          whileHover={{ scale: 1.01 }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src={currentQuestion.image} 
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/60" />
          </div>

          {/* Enhanced Swipe Direction Overlays */}
          <AnimatePresence>
            {swipeDirection === 'right' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-[#432870]/20 to-[#B29EFD]/20 flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-[#432870] text-white px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl border-2 border-[#B29EFD]"
                >
                  EVET ✓
                </motion.div>
              </motion.div>
            )}
            {swipeDirection === 'left' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-l from-red-500/20 to-rose-400/20 flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.8, rotate: 5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-rose-500 text-white px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl border-2 border-rose-400"
                >
                  HAYIR ✗
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Layout */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            {/* Question */}
            <motion.div 
              className="text-center pt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-[#202020] font-black text-2xl leading-tight mb-6 tracking-tight">
                {currentQuestion.title}
              </h2>
            </motion.div>

            {/* Bottom Section */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Category Badge */}
              <div className="text-center">
                <motion.div 
                  className="inline-block bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full px-5 py-2.5 mb-3 shadow-lg border border-white/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white text-sm font-bold uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                </motion.div>
              </div>

              {/* Community Info */}
              <motion.div 
                className="bg-gradient-to-r from-[#F2F3F5] to-white/90 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg border border-[#432870]/10"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-[#202020] font-bold text-sm">
                  %{currentQuestion.yesPercentage} Evet dedi • {currentQuestion.votes} oy
                </p>
              </motion.div>

              {/* Boosted Odds Info */}
              <motion.div 
                className="bg-gradient-to-r from-[#C9F158]/20 to-[#C9F158]/10 backdrop-blur-md border border-[#C9F158]/40 rounded-2xl p-3 text-center shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(201, 241, 88, 0.4)",
                    "0 0 0 8px rgba(201, 241, 88, 0)",
                  ] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-[#432870] text-sm font-bold">
                  ⚡ Artırılmış Oranlar Aktif
                </p>
              </motion.div>

              {/* League Warning */}
              {getLeagueWarning(currentQuestion.category) && (
                <motion.div 
                  className="bg-gradient-to-r from-[#B29EFD]/20 to-[#432870]/10 backdrop-blur-md border border-[#B29EFD]/40 rounded-2xl p-3 text-center shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-[#432870] text-sm font-bold">
                    🏆 Bu tahmin liga puanını etkileyecek
                  </p>
                </motion.div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  onClick={() => handleSwipe('left')}
                  className="flex-1 bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 hover:to-red-800 text-white font-bold py-4 px-6 rounded-2xl shadow-xl border border-rose-400/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ boxShadow: '0 15px 30px rgba(239, 68, 68, 0.3)' }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1 font-black">HAYIR</span>
                    {showBoostedOdds ? (
                      <div className="text-sm opacity-90">
                        <span className="line-through text-white/60">{currentQuestion.noOdds}x</span>
                        <span className="ml-1 text-xl font-black">{currentQuestion.boostedNoOdds}x</span>
                      </div>
                    ) : (
                      <span className="text-xl font-black">{currentQuestion.noOdds}x</span>
                    )}
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => handleSwipe('right')}
                  className="flex-1 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#C5B4FF] text-white font-bold py-4 px-6 rounded-2xl shadow-xl border border-[#B29EFD]/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ boxShadow: '0 15px 30px rgba(178, 158, 253, 0.3)' }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg mb-1 font-black">EVET</span>
                    {showBoostedOdds ? (
                      <div className="text-sm opacity-90">
                        <span className="line-through text-white/60">{currentQuestion.yesOdds}x</span>
                        <span className="ml-1 text-xl font-black">{currentQuestion.boostedYesOdds}x</span>
                      </div>
                    ) : (
                      <span className="text-xl font-black">{currentQuestion.yesOdds}x</span>
                    )}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Stack Area */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t-2 border-white/10 z-30"
      >
        <div className="p-6">
          {/* Enhanced Stack Header */}
          <motion.div 
            className="flex items-center justify-between mb-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-[#C9F158] to-[#A8D83F] rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-[#432870] font-bold text-lg">📝</span>
              </motion.div>
              <h3 className="text-white font-black text-lg">
                Kupon ({predictionStack.length}/{maxSelections})
              </h3>
            </div>
            <div className="flex gap-1">
              {[...Array(maxSelections)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    i < predictionStack.length 
                      ? 'bg-[#C9F158] shadow-sm' 
                      : 'bg-white/30'
                  }`}
                  animate={i < predictionStack.length ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Enhanced Stack Cards Grid */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            <AnimatePresence>
              {predictionStack.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border-2 border-white/20 shadow-lg flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-md ${
                    prediction.vote === 'yes' 
                      ? 'bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white' 
                      : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                  }`}>
                    {prediction.vote === 'yes' ? '✓' : '✗'}
                  </div>
                  <div className="text-white font-black text-xs">
                    {prediction.odds}x
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Enhanced Empty slots */}
            {[...Array(maxSelections - predictionStack.length)].map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border-2 border-white/20 border-dashed flex items-center justify-center hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white/70 text-2xl font-light">+</div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleCreateCoupon}
              disabled={!canCreateCoupon}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-base transition-all duration-300 ${
                canCreateCoupon
                  ? 'bg-gradient-to-r from-[#C9F158] to-[#A8D83F] hover:from-[#A8D83F] hover:to-[#C9F158] text-[#432870] shadow-xl border border-[#C9F158]/20'
                  : 'bg-white/10 text-white/50 cursor-not-allowed backdrop-blur-md'
              }`}
              whileHover={canCreateCoupon ? { scale: 1.05, y: -2 } : {}}
              whileTap={canCreateCoupon ? { scale: 0.95 } : {}}
              style={canCreateCoupon ? { boxShadow: '0 10px 25px rgba(201, 241, 88, 0.3)' } : {}}
            >
              {canCreateCoupon ? '🚀 Kupon Yap' : `${predictionStack.length}/${maxSelections} Tahmin`}
            </motion.button>
            
            {predictionStack.length > 0 && (
              <motion.button
                onClick={handleClearStack}
                className="px-5 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🗑️
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}