import { useState, useRef, useEffect } from 'react';

interface NeoPredictPageProps {
  questions: any[];
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function NeoPredictPage({ questions, onVote }: NeoPredictPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [predictionStack, setPredictionStack] = useState<any[]>([]);
  const [coins, setCoins] = useState(2847);
  const [streak, setStreak] = useState(15);
  const [showBurst, setShowBurst] = useState(false);
  const [combo, setCombo] = useState(0);
  const [powerMode, setPowerMode] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // Power mode when combo reaches 5
    if (combo >= 5) {
      setPowerMode(true);
      setTimeout(() => setPowerMode(false), 5000);
    }
  }, [combo]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentQuestion) return;
    
    const vote = direction === 'right' ? 'yes' : 'no';
    const odds = direction === 'right' ? currentQuestion.yesOdds : currentQuestion.noOdds;
    
    // Increase combo
    setCombo(prev => prev + 1);
    
    // Burst effect
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1000);
    
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
      return newStack.slice(-5); // Keep only last 5
    });

    // Move to next question with 3D effect
    setCurrentIndex(prev => (prev + 1) % questions.length);
    setDragOffset(0);
    setSwipeDirection(null);
    
    // Advanced haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentQuestion) return;
    setIsDragging(true);
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const clampedDelta = Math.max(-200, Math.min(200, deltaX));
        setDragOffset(clampedDelta);
        
        if (Math.abs(clampedDelta) > 60) {
          setSwipeDirection(clampedDelta > 0 ? 'right' : 'left');
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 100) {
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
        const clampedDelta = Math.max(-200, Math.min(200, deltaX));
        setDragOffset(clampedDelta);
        
        if (Math.abs(clampedDelta) > 60) {
          setSwipeDirection(clampedDelta > 0 ? 'right' : 'left');
        } else {
          setSwipeDirection(null);
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 100) {
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

  if (!currentQuestion) {
    return (
      <div className="flex-1 bg-gradient-to-br from-black via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Legendary Run Complete!
          </h2>
          <p className="text-white/60">You've conquered all predictions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(168,85,247,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.4),transparent_50%)]" />
      </div>

      {/* Power Mode Overlay */}
      {powerMode && (
        <div className="fixed inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 animate-pulse pointer-events-none z-10" />
      )}

      {/* Burst Effect */}
      {showBurst && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s'
              }}
            >
              {['⭐', '💫', '✨', '💎', '🔥'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Top HUD */}
      <div className="relative z-20 flex items-center justify-between p-5 pt-12 bg-black/50 backdrop-blur-md">
        {/* Streak & Combo */}
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl border border-orange-500/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-orange-400">🔥</span>
              <span className="text-white font-bold text-sm">{streak} Streak</span>
            </div>
          </div>
          
          {combo > 0 && (
            <div className={`backdrop-blur-md rounded-2xl border px-4 py-2 ${
              powerMode 
                ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-500/50 animate-pulse' 
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
            }`}>
              <div className="flex items-center gap-2">
                <span className={powerMode ? "text-yellow-400" : "text-purple-400"}>⚡</span>
                <span className="text-white font-bold text-sm">{combo}x Combo</span>
              </div>
            </div>
          )}
        </div>

        {/* Coins */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl border border-cyan-500/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">💎</span>
            <span className="text-white font-bold text-sm">{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3D Card Stack */}
      <div className="flex-1 relative px-4 pt-8">
        {/* Background Cards (3D Effect) */}
        {questions.slice(currentIndex + 1, currentIndex + 4).map((question, index) => (
          <div
            key={question.id}
            className="absolute inset-4 top-16 rounded-3xl overflow-hidden"
            style={{
              transform: `translateY(${(index + 1) * 8}px) scale(${1 - (index + 1) * 0.02}) rotateY(${(index + 1) * 2}deg)`,
              opacity: 1 - (index + 1) * 0.2,
              zIndex: 10 - index
            }}
          >
            <img 
              src={question.image} 
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ))}
        
        {/* Current Card */}
        <div
          ref={cardRef}
          className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/20 shadow-2xl"
          style={{
            transform: `
              translateX(${dragOffset}px) 
              rotateY(${dragOffset * 0.05}deg) 
              rotateZ(${dragOffset * 0.02}deg)
              ${powerMode ? 'scale(1.05)' : ''}
            `,
            transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            filter: powerMode ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))' : ''
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={currentQuestion.image} 
              alt=""
              className="w-full h-full object-cover opacity-60"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Swipe Direction Overlays */}
          {swipeDirection === 'right' && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-400/40 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-green-500 text-white px-12 py-6 rounded-3xl font-black text-3xl shadow-2xl animate-pulse border-4 border-green-400 scale-110">
                ✓ YES
              </div>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute inset-0 bg-gradient-to-l from-red-500/40 to-red-400/40 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-red-500 text-white px-12 py-6 rounded-3xl font-black text-3xl shadow-2xl animate-pulse border-4 border-red-400 scale-110">
                ✗ NO
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8">
            {/* Question */}
            <div className="text-center pt-16">
              <h2 className="text-white font-black text-3xl leading-tight mb-8 drop-shadow-2xl">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="space-y-6">
              {/* Main Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/30">
                  <div className="text-center">
                    <p className="text-purple-300 text-sm mb-2 font-bold">ODDS</p>
                    <p className="text-white font-black text-4xl">
                      {dragOffset > 60 ? `${currentQuestion.yesOdds}x` : 
                       dragOffset < -60 ? `${currentQuestion.noOdds}x` : 
                       `${Math.max(currentQuestion.yesOdds, currentQuestion.noOdds)}x`}
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/30">
                  <div className="text-center">
                    <p className="text-cyan-300 text-sm mb-2 font-bold">VOTES</p>
                    <p className="text-white font-black text-4xl">
                      {currentQuestion.yesPercentage}%
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{currentQuestion.votes}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-4 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-300 text-sm font-bold">TIME LEFT</p>
                    <p className="text-white font-bold text-lg">{currentQuestion.timeLeft}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-300 text-sm font-bold">CATEGORY</p>
                    <p className="text-white font-bold text-lg capitalize">{currentQuestion.category}</p>
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
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 border-4 border-red-400"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={() => handleSwipe('right')}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 border-4 border-green-400"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Stack Indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">Stack: {predictionStack.length}/5</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < predictionStack.length 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
          <p className="text-white font-bold text-sm">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
}