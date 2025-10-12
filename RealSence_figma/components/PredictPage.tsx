import { useState, useRef, useEffect } from 'react';

interface PredictPageProps {
  questions: any[];
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
  maxSelections?: number;
  showBoostedOdds?: boolean;
}

export function PredictPage({ questions, onVote, showHeader = true, maxSelections = 5, showBoostedOdds = false }: PredictPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [predictionStack, setPredictionStack] = useState<any[]>([]);
  const [coins, setCoins] = useState(120);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStackLimitError, setShowStackLimitError] = useState(false);
  
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentQuestion) return;
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
    if (!currentQuestion) return;
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

  if (!currentQuestion) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Tüm Sorular Tamamlandı!</h2>
          <p className="text-gray-600">Yeni sorular çok yakında...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              {['🎉', '⭐', '💎', '🔥', '⚡'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Stack Limit Error */}
      {showStackLimitError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-2">
          <p className="font-bold text-sm">Kuponunda {maxSelections} tahmin var! Önce kuponunu temizle.</p>
        </div>
      )}

      {/* Homepage-Style Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-br from-gray-50 via-white to-blue-50 border-b border-gray-100">
        <div className="max-w-sm mx-auto flex items-center justify-between p-4 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent tracking-tight">
              Sence
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-gray-800 font-bold text-sm">@kullanici</p>
              <p className="text-gray-500 text-xs">{coins} kredi</p>
            </div>
            <div className="relative">
              <button className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Card Area - Better positioning */}
      <div className="absolute top-32 left-0 right-0 bottom-[280px] max-w-sm mx-auto px-5">
        {/* Next card (background) - Enhanced depth */}
        {questions[currentIndex + 1] && (
          <div className="absolute inset-2 bg-white/60 rounded-3xl opacity-60 scale-98 -rotate-1 shadow-xl backdrop-blur-sm" />
        )}
        
        {/* Current Card with Enhanced Visual Appeal */}
        <div
          ref={cardRef}
          className="absolute inset-0 bg-white rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl border border-gray-200"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.015}deg)`,
            transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Image with Enhanced Overlay */}
          <div className="absolute inset-0">
            <img 
              src={currentQuestion.image} 
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/40" />
          </div>

          {/* Enhanced Swipe Direction Overlay */}
          {swipeDirection === 'right' && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-400/40 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-emerald-500 text-white px-10 py-5 rounded-3xl font-black text-3xl shadow-2xl animate-pulse border-2 border-emerald-400">
                EVET ✓
              </div>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute inset-0 bg-gradient-to-l from-red-500/40 to-rose-400/40 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-rose-500 text-white px-10 py-5 rounded-3xl font-black text-3xl shadow-2xl animate-pulse border-2 border-rose-400">
                HAYIR ✗
              </div>
            </div>
          )}

          {/* Enhanced Content Layout */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Enhanced Question with Perfect Readability */}
            <div className="text-center pt-8">
              <h2 
                className="text-white font-black text-2xl leading-tight mb-6 tracking-tight"
                style={{ 
                  textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.6)',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))'
                }}
              >
                {currentQuestion.title}
              </h2>
            </div>

            {/* Enhanced Bottom Section */}
            <div className="space-y-4">
              {/* Premium Category Badge */}
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md rounded-full px-5 py-2.5 mb-3 shadow-xl border border-white/20">
                  <span className="text-white text-sm font-bold uppercase tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {currentQuestion.category}
                  </span>
                </div>
              </div>

              {/* Enhanced Community Info */}
              <div className="bg-gradient-to-r from-white/20 via-white/30 to-white/20 backdrop-blur-md rounded-2xl p-4 text-center shadow-xl border border-white/30">
                <p className="text-white font-bold text-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  %{currentQuestion.yesPercentage} Evet dedi • {currentQuestion.votes} oy
                </p>
              </div>

              {/* Enhanced League Warning */}
              {getLeagueWarning(currentQuestion.category) && (
                <div className="bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-500/25 backdrop-blur-md border border-amber-300/40 rounded-2xl p-3 text-center shadow-xl">
                  <p className="text-amber-100 text-sm font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    🏆 Bu tahmin liga puanını etkileyecek
                  </p>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex gap-5">
                <button
                  onClick={() => handleSwipe('left')}
                  className="flex-1 bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 hover:to-red-800 text-white font-bold py-5 px-6 rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl border border-rose-400/50"
                  style={{ boxShadow: '0 15px 30px rgba(239, 68, 68, 0.4)' }}
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
                  className="flex-1 bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 hover:from-emerald-600 hover:to-green-800 text-white font-bold py-5 px-6 rounded-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl border border-emerald-400/50"
                  style={{ boxShadow: '0 15px 30px rgba(34, 197, 94, 0.4)' }}
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

      {/* Repositioned Bottom Stack Area - No Overlap */}
      <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-md border-t border-gray-200/50 z-30">
        <div className="max-w-sm mx-auto h-full flex flex-col p-5">
          {/* Enhanced Stack Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-black text-xl">
              Stack ({predictionStack.length}/{maxSelections})
            </h3>
            <div className="flex gap-1.5">
              {[...Array(maxSelections)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    i < predictionStack.length 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Stack Cards Grid */}
          <div className="grid grid-cols-5 gap-3 mb-5 flex-1">
            {predictionStack.map((prediction, index) => (
              <div
                key={prediction.id}
                className="bg-white rounded-2xl p-3 border border-gray-200 shadow-md animate-in slide-in-from-bottom-2 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-sm ${
                  prediction.vote === 'yes' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                }`}>
                  {prediction.vote === 'yes' ? '✓' : '✗'}
                </div>
                <div className="text-purple-600 text-xs font-black">
                  {prediction.odds}x
                </div>
              </div>
            ))}
            
            {/* Enhanced Empty slots */}
            {[...Array(maxSelections - predictionStack.length)].map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-gray-50 rounded-2xl p-3 border-2 border-gray-200 border-dashed flex items-center justify-center hover:border-purple-300 transition-colors duration-300"
              >
                <div className="text-gray-400 text-2xl">+</div>
              </div>
            ))}
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleCreateCoupon}
              disabled={!canCreateCoupon}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-lg transition-all duration-300 transform ${
                canCreateCoupon
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:scale-105 border border-purple-500/50'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              style={canCreateCoupon ? { boxShadow: '0 10px 25px rgba(147, 51, 234, 0.4)' } : {}}
            >
              {canCreateCoupon ? '🚀 Kupon Yap' : `${predictionStack.length}/${maxSelections} Tahmin`}
            </button>
            
            {predictionStack.length > 0 && (
              <button
                onClick={handleClearStack}
                className="px-5 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Progress indicator */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 border border-gray-200 shadow-lg">
          <p className="text-gray-800 text-sm font-bold">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
}