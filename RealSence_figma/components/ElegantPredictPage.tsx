import { useState, useRef, useEffect } from 'react';

interface ElegantPredictPageProps {
  questions: any[];
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function ElegantPredictPage({ questions, onVote }: ElegantPredictPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [predictionStack, setPredictionStack] = useState<any[]>([]);
  const [coins, setCoins] = useState(2847);
  const [streak, setStreak] = useState(15);
  const [showCelebration, setShowCelebration] = useState(false);
  const [swipeIntensity, setSwipeIntensity] = useState(0);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentQuestion) return;
    
    const vote = direction === 'right' ? 'yes' : 'no';
    const odds = direction === 'right' ? currentQuestion.yesOdds : currentQuestion.noOdds;
    
    // Celebration effect
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 800);
    
    // Add to prediction stack
    const newPrediction = {
      id: currentQuestion.id,
      title: currentQuestion.title,
      vote: vote,
      odds: odds,
      percentage: direction === 'right' ? currentQuestion.yesPercentage : (100 - currentQuestion.yesPercentage)
    };

    setPredictionStack(prev => {
      const newStack = [...prev, newPrediction];
      return newStack.slice(-5);
    });

    // Move to next question with smooth transition
    setCurrentIndex(prev => (prev + 1) % questions.length);
    setDragOffset(0);
    setSwipeDirection(null);
    setSwipeIntensity(0);
    
    // Enhanced haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([30, 10, 30]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentQuestion) return;
    setIsDragging(true);
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const clampedDelta = Math.max(-250, Math.min(250, deltaX));
        setDragOffset(clampedDelta);
        
        // Calculate swipe intensity for visual feedback
        const intensity = Math.abs(clampedDelta) / 250;
        setSwipeIntensity(intensity);
        
        if (Math.abs(clampedDelta) > 80) {
          setSwipeDirection(clampedDelta > 0 ? 'right' : 'left');
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 120) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      } else {
        setDragOffset(0);
        setSwipeDirection(null);
        setSwipeIntensity(0);
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
        const clampedDelta = Math.max(-250, Math.min(250, deltaX));
        setDragOffset(clampedDelta);
        
        const intensity = Math.abs(clampedDelta) / 250;
        setSwipeIntensity(intensity);
        
        if (Math.abs(clampedDelta) > 80) {
          setSwipeDirection(clampedDelta > 0 ? 'right' : 'left');
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 120) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      } else {
        setDragOffset(0);
        setSwipeDirection(null);
        setSwipeIntensity(0);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!currentQuestion) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-6xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Amazing Work!
          </h2>
          <p className="text-gray-600 text-lg">You've completed all predictions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Soft Background Orbs */}
      <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-40 -left-20 w-60 h-60 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '0.8s'
              }}
            >
              {['✨', '🎉', '⭐', '💫', '🔥'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Top Stats Bar */}
      <div className="flex items-center justify-between p-6 pt-12 relative z-20">
        {/* Streak */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white">🔥</span>
            </div>
            <div>
              <p className="text-orange-600 font-bold text-sm">{streak} Streak</p>
              <p className="text-gray-500 text-xs">Keep it up!</p>
            </div>
          </div>
        </div>

        {/* Coins */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white">💎</span>
            </div>
            <div>
              <p className="text-blue-600 font-bold text-sm">{coins.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">Coins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Stack Area */}
      <div className="flex-1 relative px-6 pt-8">
        {/* Background Cards (Layered Depth) */}
        {questions.slice(currentIndex + 1, currentIndex + 3).map((question, index) => (
          <div
            key={question.id}
            className="absolute inset-0 top-8 bottom-24 bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30"
            style={{
              transform: `
                translateY(${(index + 1) * 8}px) 
                scale(${1 - (index + 1) * 0.03}) 
                rotateY(${(index + 1) * 1}deg)
              `,
              opacity: 1 - (index + 1) * 0.3,
              zIndex: 10 - index
            }}
          >
            <img 
              src={question.image} 
              alt=""
              className="w-full h-1/2 object-cover rounded-t-3xl opacity-60"
            />
          </div>
        ))}
        
        {/* Current Card */}
        <div
          ref={cardRef}
          className="relative h-full bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl border border-white/40"
          style={{
            transform: `
              translateX(${dragOffset}px) 
              rotateY(${dragOffset * 0.03}deg) 
              rotateZ(${dragOffset * 0.01}deg)
              scale(${1 - swipeIntensity * 0.05})
            `,
            transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: `0 ${20 + swipeIntensity * 20}px ${40 + swipeIntensity * 20}px rgba(0,0,0,${0.15 + swipeIntensity * 0.1})`
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Image */}
          <div className="h-1/2 overflow-hidden">
            <img 
              src={currentQuestion.image} 
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          </div>

          {/* Swipe Direction Overlays */}
          {swipeDirection === 'right' && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 flex items-center justify-center"
              style={{ opacity: swipeIntensity }}
            >
              <div className="bg-green-500 text-white px-8 py-4 rounded-3xl font-bold text-2xl shadow-2xl border-4 border-green-400 transform scale-110 animate-pulse">
                ✓ YES
              </div>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div 
              className="absolute inset-0 bg-gradient-to-l from-red-400/30 to-pink-400/30 flex items-center justify-center"
              style={{ opacity: swipeIntensity }}
            >
              <div className="bg-red-500 text-white px-8 py-4 rounded-3xl font-bold text-2xl shadow-2xl border-4 border-red-400 transform scale-110 animate-pulse">
                ✗ NO
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className="relative z-10 h-1/2 p-6 flex flex-col justify-between">
            {/* Question */}
            <div className="text-center">
              <h2 className="text-gray-800 font-bold text-2xl leading-tight mb-6">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
                  <div className="text-center">
                    <p className="text-purple-600 text-sm font-bold mb-1">ODDS</p>
                    <p className="text-gray-800 font-bold text-2xl">
                      {dragOffset > 80 ? `${currentQuestion.yesOdds}x` : 
                       dragOffset < -80 ? `${currentQuestion.noOdds}x` : 
                       `${Math.max(currentQuestion.yesOdds, currentQuestion.noOdds)}x`}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50">
                  <div className="text-center">
                    <p className="text-blue-600 text-sm font-bold mb-1">COMMUNITY</p>
                    <p className="text-gray-800 font-bold text-2xl">
                      {currentQuestion.yesPercentage}%
                    </p>
                    <p className="text-gray-500 text-xs">{currentQuestion.votes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-bold">TIME LEFT</p>
                    <p className="text-gray-800 font-bold">{currentQuestion.timeLeft}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-600 text-sm font-bold">CATEGORY</p>
                    <p className="text-gray-800 font-bold capitalize">{currentQuestion.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-4 border-white"
          style={{ boxShadow: '0 10px 30px rgba(244, 63, 94, 0.4)' }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-4 border-white"
          style={{ boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)' }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Progress & Stack Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/20">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-gray-800 font-bold text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-medium">Stack:</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < predictionStack.length 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}