import { useState, useEffect } from 'react';

interface FeaturedQuestion {
  id: number;
  title: string;
  image: string;
  gradient: string;
  yesPercentage: number;
  votes: string;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
}

interface FeaturedCarouselProps {
  questions: FeaturedQuestion[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function FeaturedCarousel({ questions, onQuestionClick, onVote }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle empty questions array
  if (!questions || questions.length === 0) {
    return (
      <div className="relative h-96 bg-[#F2F3F5] rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-[#202020] font-bold">Öne çıkan sorular yükleniyor...</p>
        </div>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + questions.length) % questions.length);
  };

  return (
    <div className="relative">
      {/* Main Carousel Container - Increased Height */}
      <div className="overflow-visible h-96">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + 15px))` }}
        >
          {questions.map((question, index) => {
            const isActive = index === currentIndex;
            const scale = isActive ? 'scale-100' : 'scale-95';
            const opacity = isActive ? 'opacity-100' : 'opacity-70';
            
            return (
              <div 
                key={question.id} 
                className={`w-full flex-shrink-0 h-full px-3 transition-all duration-500 ${scale} ${opacity}`}
              >
                
                {/* Main Card */}
                <div 
                  className="relative h-full cursor-pointer group rounded-3xl overflow-hidden shadow-2xl"
                  onClick={() => onQuestionClick(question.id)}
                >
                  
                  {/* Background Image - Maximum visibility */}
                  <div className="absolute inset-0">
                    <img 
                      src={question.image} 
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Very minimal overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
                  </div>
                  
                  {/* Content Layout */}
                  <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                    
                    {/* Top Section - Prominent Question */}
                    <div className="text-center">
                      <h2 className="text-white font-black text-2xl leading-tight drop-shadow-2xl mb-2">
                        {question.title}
                      </h2>
                    </div>
                    
                    {/* Large Space for Photo Focus */}
                    <div className="flex-1"></div>
                    
                    {/* Bottom Section */}
                    <div className="space-y-4">
                      
                      {/* Meta Information */}
                      <div className="flex justify-center gap-4">
                        <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-xs font-medium">{question.votes}</span>
                        </div>
                        <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-xs font-medium">{question.timeLeft}</span>
                        </div>
                      </div>
                      
                      {/* Dynamic Action Buttons */}
                      <div className="flex rounded-2xl overflow-hidden shadow-xl">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVote(question.id, 'yes', question.yesOdds);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 transition-all duration-200 transform hover:scale-105"
                          style={{ width: `${Math.max(question.yesPercentage, 15)}%` }}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-base font-bold">EVET</span>
                            <span className="text-xs opacity-90">{question.yesOdds}x</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVote(question.id, 'no', question.noOdds);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 transition-all duration-200 transform hover:scale-105"
                          style={{ width: `${Math.max(100 - question.yesPercentage, 15)}%` }}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-base font-bold">HAYIR</span>
                            <span className="text-xs opacity-90">{question.noOdds}x</span>
                          </div>
                        </button>
                      </div>
                      
                    </div>
                    
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Indicators - Updated colors */}
      <div className="flex justify-center mt-6 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full transform hover:scale-110 ${
              index === currentIndex 
                ? 'w-8 h-3 bg-[#9368B7] shadow-lg' 
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Minimal Navigation Arrows */}
      {questions.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#202020] hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#202020] hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}