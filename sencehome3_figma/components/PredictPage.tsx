import { useState, useRef } from 'react';

interface PredictPageProps {
  questions: any[];
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function PredictPage({ questions, onVote }: PredictPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState('');
  const [swipeCount, setSwipeCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentQuestion) return;
    
    const vote = direction === 'right' ? 'yes' : 'no';
    const odds = direction === 'right' ? currentQuestion.yesOdds : currentQuestion.noOdds;
    
    setShowFeedback(direction === 'right' ? 'yes' : 'no');
    setSwipeCount(prev => prev + 1);
    
    setTimeout(() => {
      onVote(currentQuestion.id, vote, odds);
      setCurrentIndex(prev => (prev + 1) % questions.length);
      setDragOffset(0);
      setShowFeedback('');
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        setDragOffset(Math.max(-200, Math.min(200, deltaX)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 80) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      } else {
        setDragOffset(0);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const startX = e.touches[0].clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const deltaX = e.touches[0].clientX - startX;
        setDragOffset(Math.max(-200, Math.min(200, deltaX)));
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 80) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      } else {
        setDragOffset(0);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center pt-4 pb-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center animate-in fade-in-0">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-bold text-xl text-gray-900 mb-2">Tebrikler!</h2>
          <p className="text-gray-600 mb-4">Tüm soruları yanıtladın</p>
          <p className="text-sm text-purple-600 font-semibold">{swipeCount} tahmin yaptın!</p>
          <button 
            onClick={() => setCurrentIndex(0)}
            className="mt-4 bg-gradient-to-r from-[#6B46F0] to-purple-600 text-white font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all"
          >
            Tekrar Başla
          </button>
        </div>
      </div>
    );
  }

  const getSwipeTip = () => {
    if (swipeCount === 0) return "Kartı sağa/sola kaydır veya butonları kullan! 👆";
    if (swipeCount < 3) return "Harika gidiyorsun! 🔥";
    if (swipeCount < 5) return "Süper tahminler! ⭐";
    return "Tahmin ustası! 🏆";
  };

  return (
    <div className="flex-1 flex flex-col pt-4 pb-24 px-5 bg-gradient-to-b from-purple-50 via-white to-gray-50 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      
      {/* Header with fun stats */}
      <div className="text-center mb-6 relative z-10">
        <h1 className="font-bold text-3xl text-gray-900 mb-2">⚡ Hızlı Tahmin</h1>
        <p className="text-purple-600 font-semibold mb-3">{getSwipeTip()}</p>
        
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 shadow-sm">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">✗</span>
            </div>
            <span className="text-red-700 font-medium">Sola: Hayır</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <span className="text-green-700 font-medium">Sağa: Evet</span>
          </div>
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="flex-1 relative max-w-sm mx-auto w-full">
        {/* Next cards preview */}
        {questions[currentIndex + 1] && (
          <div className="absolute inset-0 bg-white rounded-3xl shadow-lg scale-95 opacity-40 transform rotate-1 border border-gray-200" />
        )}
        {questions[currentIndex + 2] && (
          <div className="absolute inset-0 bg-gray-100 rounded-3xl shadow-md scale-90 opacity-20 transform -rotate-1" />
        )}
        
        {/* Current Card */}
        <div
          ref={cardRef}
          className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none border-2 border-gray-100"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg)`,
            opacity: Math.max(0.8, 1 - Math.abs(dragOffset) / 300),
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={currentQuestion.image} 
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${currentQuestion.gradient} opacity-60`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
          </div>

          {/* Swipe Feedback Overlays */}
          {(dragOffset > 50 || showFeedback === 'yes') && (
            <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#00AF54] to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-3xl shadow-2xl transform scale-110 border-4 border-white animate-pulse">
                ✓ EVET
              </div>
            </div>
          )}
          {(dragOffset < -50 || showFeedback === 'no') && (
            <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-gradient-to-r from-[#FF4E4E] to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-3xl shadow-2xl transform scale-110 border-4 border-white animate-pulse">
                ✗ HAYIR
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20 shadow-lg">
                {currentIndex + 1}/{questions.length}
              </div>
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20 shadow-lg">
                {currentQuestion.timeLeft}
              </div>
            </div>

            {/* Middle - Question Title */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-2xl leading-tight text-white mb-2 drop-shadow-xl">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Bottom Section */}
            <div>
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/20 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium">{currentQuestion.votes}</span>
                  <span className="text-white/80 text-sm">Toplam Oy</span>
                </div>
                
                {/* Vote Percentage Bar */}
                <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-3 shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00AF54] to-green-400 rounded-full shadow-lg transition-all duration-500"
                    style={{ width: `${currentQuestion.yesPercentage}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-[#FF4E4E] to-red-400 rounded-full shadow-lg transition-all duration-500"
                    style={{ 
                      left: `${currentQuestion.yesPercentage}%`, 
                      width: `${100 - currentQuestion.yesPercentage}%` 
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-white text-sm">
                  <span className="bg-red-500/30 backdrop-blur-sm px-3 py-1 rounded-full border border-red-300/30">
                    Hayır {100 - currentQuestion.yesPercentage}%
                  </span>
                  <span className="bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full border border-green-300/30">
                    Evet {currentQuestion.yesPercentage}%
                  </span>
                </div>
              </div>

              {/* Odds Display */}
              <div className="flex justify-between items-center gap-4">
                <div className="bg-gradient-to-r from-[#FF4E4E] to-red-600 rounded-xl px-4 py-3 text-center flex-1 shadow-lg border border-red-300/30">
                  <div className="text-white font-bold text-lg">{currentQuestion.noOdds}x</div>
                  <div className="text-white/90 font-medium text-sm">Hayır</div>
                </div>
                
                <div className="bg-gradient-to-r from-[#00AF54] to-green-600 rounded-xl px-4 py-3 text-center flex-1 shadow-lg border border-green-300/30">
                  <div className="text-white font-bold text-lg">{currentQuestion.yesOdds}x</div>
                  <div className="text-white/90 font-medium text-sm">Evet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-8 justify-center mt-6 relative z-10">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-gradient-to-r from-[#FF4E4E] to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 border-4 border-white"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-gradient-to-r from-[#00AF54] to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 border-4 border-white"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Progress and Stats */}
      <div className="text-center mt-4 space-y-2">
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-lg">
          <div className="w-2 h-2 bg-[#6B46F0] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            Soru {currentIndex + 1} / {questions.length}
          </span>
        </div>
        
        {swipeCount > 0 && (
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1 border border-purple-200">
            <span className="text-xs font-semibold text-purple-700">
              🎯 {swipeCount} tahmin yapıldı
            </span>
          </div>
        )}
      </div>
    </div>
  );
}