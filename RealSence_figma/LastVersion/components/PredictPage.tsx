import { useState, useRef, useEffect } from 'react';

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

  // Intro Screen
  if (showIntro) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#353831] via-[#2A2F35] to-[#1F2328] min-h-screen relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#c9f158]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-32 h-32 bg-[#6B46C1]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-10 w-24 h-24 bg-[#c9f158]/30 rounded-full blur-2xl"></div>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-40 bg-[#353831]/95 backdrop-blur-md border-b border-[#c9f158]/20 p-6 pt-16">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="w-12 h-12 rounded-full bg-[#C9F158]/20 backdrop-blur-md border border-[#C9F158]/30 flex items-center justify-center text-[#C9F158] hover:bg-[#C9F158]/30 transition-all duration-300 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h1 className="text-white font-black text-xl">Hızlı Tahmin</h1>
              <p className="text-[#C9F158] text-sm font-bold">Artırılmış Oranlar</p>
            </div>
            
            <div className="w-12 h-12" />
          </div>
        </div>

        {/* Intro Content */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="max-w-sm text-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#c9f158] to-[#b8e847] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="text-4xl">⚡</span>
            </div>

            {/* Title */}
            <h2 className="text-white font-black text-2xl mb-4">
              Hızlı Tahmin Modu
            </h2>

            {/* Rules */}
            <div className="bg-[#353831]/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-[#C9F158]/20">
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#c9f158] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#353831] text-sm font-bold">1</span>
                  </div>
                  <p className="text-white/90 text-sm">
                    Soruları <strong>geçemezsin</strong> - EVET veya HAYIR demen gerekiyor
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#c9f158] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#353831] text-sm font-bold">2</span>
                  </div>
                  <p className="text-white/90 text-sm">
                    <strong>5 tahmin</strong> yaparak kupon oluşturabilirsin
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#c9f158] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#353831] text-sm font-bold">3</span>
                  </div>
                  <p className="text-white/90 text-sm">
                    Bu sayfadaki <strong>oranlar artırıldı</strong> - daha fazla kazanç!
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setShowIntro(false)}
              className="w-full bg-gradient-to-r from-[#c9f158] to-[#b8e847] hover:from-[#b8e847] hover:to-[#c9f158] text-[#353831] font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">Başla</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>

            <p className="text-white/60 text-xs mt-4">
              Kaydırmak için kartı sürükle veya butonları kullan
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#353831] via-[#2A2F35] to-[#1F2328] flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-black mb-4 text-white">Tüm Sorular Tamamlandı!</h2>
          <p className="text-white/80 text-lg">Yeni sorular çok yakında...</p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-[#353831] via-[#2A2F35] to-[#1F2328] min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#C9F158]/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#6B46C1]/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-[#C9F158]/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-[#6B46C1]/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-[#353831]/95 backdrop-blur-md border-b border-[#C9F158]/20 p-6 pt-16">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-full bg-[#C9F158]/20 backdrop-blur-md border border-[#C9F158]/30 flex items-center justify-center text-[#C9F158] hover:bg-[#C9F158]/30 transition-all duration-300 shadow-lg hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Progress Indicator */}
          <div className="flex-1 mx-6">
            <div className="bg-[#6B46C1]/30 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#C9F158] to-[#A8D83F] transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-white/80 text-sm font-bold">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-black text-sm">@mehmet_k</p>
              <p className="text-[#C9F158] font-bold text-xs">8,500 💎</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C9F158] to-[#A8D83F] p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              {['🎉', '⭐', '💎', '🔥', '⚡', '🚀', '✨'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Stack Limit Error */}
      {showStackLimitError && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-red-400 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <p className="font-bold text-sm">Kuponunda {maxSelections} tahmin var! Önce kuponunu temizle.</p>
          </div>
        </div>
      )}

      {/* Main Card Area */}
      <div className="relative mx-6 mt-36 mb-6 h-[460px]">
        {/* Next card (background) */}
        {questions[currentIndex + 1] && (
          <div className="absolute inset-2 bg-[#6B46C1]/10 backdrop-blur-sm rounded-3xl opacity-40 scale-98 -rotate-1 shadow-xl border border-[#6B46C1]/20" />
        )}
        
        {/* Current Card */}
        <div
          ref={cardRef}
          className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl border-2 border-[#C9F158]/30"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.01}deg)`,
            transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(201, 241, 88, 0.2)'
          }}
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

          {/* Swipe Direction Overlay */}
          {swipeDirection === 'right' && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-400/20 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl animate-pulse border-2 border-emerald-400">
                EVET ✓
              </div>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute inset-0 bg-gradient-to-l from-red-500/20 to-rose-400/20 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-rose-500 text-white px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl animate-pulse border-2 border-rose-400">
                HAYIR ✗
              </div>
            </div>
          )}

          {/* Content Layout */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            {/* Question */}
            <div className="text-center pt-8">
              <h2 className="text-[#202020] font-black text-2xl leading-tight mb-6 tracking-tight">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Bottom Section */}
            <div className="space-y-4">
              {/* Category Badge */}
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-[#353831] to-[#6B46C1] rounded-full px-5 py-2.5 mb-3 shadow-lg border border-[#C9F158]/20">
                  <span className="text-white text-sm font-bold uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                </div>
              </div>

              {/* Community Info */}
              <div className="bg-gradient-to-r from-[#F2F3F5] to-white/90 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg border border-[#353831]/20">
                <p className="text-[#202020] font-bold text-sm">
                  %{currentQuestion.yesPercentage} Evet dedi • {currentQuestion.votes} oy
                </p>
              </div>

              {/* Boosted Odds Info */}
              <div className="bg-gradient-to-r from-[#C9F158]/20 to-[#C9F158]/10 backdrop-blur-md border border-[#C9F158]/40 rounded-2xl p-3 text-center shadow-lg">
                <p className="text-[#353831] text-sm font-bold">
                  ⚡ Artırılmış Oranlar Aktif
                </p>
              </div>

              {/* League Warning */}
              {getLeagueWarning(currentQuestion.category) && (
                <div className="bg-gradient-to-r from-[#6B46C1]/20 to-[#6B46C1]/10 backdrop-blur-md border border-[#6B46C1]/40 rounded-2xl p-3 text-center shadow-lg">
                  <p className="text-[#353831] text-sm font-bold">
                    🏆 Bu tahmin liga puanını etkileyecek
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="flex-1 bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 hover:to-red-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl border border-rose-400/50"
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
                </button>
                
                <button
                  onClick={() => handleSwipe('right')}
                  className="flex-1 bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 hover:from-emerald-600 hover:to-green-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl border border-emerald-400/50"
                  style={{ boxShadow: '0 15px 30px rgba(34, 197, 94, 0.3)' }}
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stack Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#353831]/95 backdrop-blur-md border-t-2 border-[#C9F158]/20 z-30">
        <div className="p-6">
          {/* Enhanced Stack Header */}
          <div className="flex items-center justify-between mb-4 p-4 bg-[#6B46C1]/20 backdrop-blur-md rounded-2xl border border-[#C9F158]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#C9F158] to-[#A8D83F] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[#353831] font-bold text-lg">📝</span>
              </div>
              <h3 className="text-white font-black text-lg">
                Kupon ({predictionStack.length}/{maxSelections})
              </h3>
            </div>
            <div className="flex gap-1">
              {[...Array(maxSelections)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    i < predictionStack.length 
                      ? 'bg-[#C9F158] shadow-sm scale-110' 
                      : 'bg-[#6B46C1]/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Stack Cards Grid */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            {predictionStack.map((prediction, index) => (
              <div
                key={prediction.id}
                className="bg-[#6B46C1]/20 backdrop-blur-md rounded-2xl p-3 border-2 border-[#C9F158]/30 shadow-lg animate-in slide-in-from-bottom-2 flex flex-col items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-md ${
                  prediction.vote === 'yes' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                }`}>
                  {prediction.vote === 'yes' ? '✓' : '✗'}
                </div>
                <div className="text-white font-black text-xs">
                  {prediction.odds}x
                </div>
              </div>
            ))}
            
            {/* Enhanced Empty slots */}
            {[...Array(maxSelections - predictionStack.length)].map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-[#6B46C1]/10 backdrop-blur-md rounded-2xl p-3 border-2 border-[#C9F158]/20 border-dashed flex items-center justify-center hover:border-[#C9F158]/40 hover:bg-[#6B46C1]/20 transition-all duration-300"
              >
                <div className="text-white/70 text-2xl font-light">+</div>
              </div>
            ))}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCreateCoupon}
              disabled={!canCreateCoupon}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-base transition-all duration-300 transform ${
                canCreateCoupon
                  ? 'bg-gradient-to-r from-[#C9F158] to-[#A8D83F] hover:from-[#A8D83F] hover:to-[#C9F158] text-[#353831] shadow-xl hover:scale-105 border border-[#C9F158]/20'
                  : 'bg-[#6B46C1]/20 text-white/50 cursor-not-allowed backdrop-blur-md'
              }`}
              style={canCreateCoupon ? { boxShadow: '0 10px 25px rgba(201, 241, 88, 0.3)' } : {}}
            >
              {canCreateCoupon ? '🚀 Kupon Yap' : `${predictionStack.length}/${maxSelections} Tahmin`}
            </button>
            
            {predictionStack.length > 0 && (
              <button
                onClick={handleClearStack}
                className="px-5 py-4 bg-[#6B46C1]/20 backdrop-blur-md hover:bg-[#6B46C1]/30 text-white font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg border border-[#C9F158]/20"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}