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

  // Sonsuz döngü için questions'ı genişlet
  const extendedQuestions = [...questions, ...questions, ...questions];
  const startIndex = questions.length; // Orta bölümden başla

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const goToNext = () => {
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      // Son kopyaya ulaştıysak, ilk kopyaya atla
      if (newIndex >= extendedQuestions.length - questions.length) {
        setTimeout(() => setCurrentIndex(questions.length), 300);
        return newIndex;
      }
      return newIndex;
    });
  };

  const goToPrev = () => {
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      // İlk kopyaya ulaştıysak, son kopyaya atla
      if (newIndex < questions.length) {
        setTimeout(() => setCurrentIndex(extendedQuestions.length - questions.length - 1), 300);
        return newIndex;
      }
      return newIndex;
    });
  };

  const getCurrentQuestion = () => {
    return extendedQuestions[currentIndex];
  };

  const getIndicatorIndex = () => {
    return (currentIndex - questions.length + questions.length) % questions.length;
  };

  return (
    <div className="relative">
      {/* Carousel Container - Sabit boyut */}
      <div className="overflow-hidden rounded-3xl h-48 shadow-lg">
        <div 
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {extendedQuestions.map((question, index) => (
            <div key={`${question.id}-${index}`} className="w-full flex-shrink-0 h-full">
              <div 
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${question.gradient} p-5 shadow-xl cursor-pointer h-full transform hover:scale-[1.02] transition-all duration-300`}
                onClick={() => onQuestionClick(question.id)}
              >
                {/* Background Image Overlay */}
                <div className="absolute inset-0 opacity-30">
                  <img 
                    src={question.image} 
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Enhanced Contrast Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight mb-3 drop-shadow-lg">
                      {question.title}
                    </h2>

                    {/* Vote Bar - Düzeltilmiş */}
                    <div className="relative h-2 bg-white/30 rounded-full overflow-hidden mb-2 shadow-inner">
                      <div 
                        className="absolute top-0 left-0 h-full bg-[#00AF54] rounded-full shadow-lg transition-all duration-500"
                        style={{ width: `${question.yesPercentage}%` }}
                      />
                      <div 
                        className="absolute top-0 h-full bg-[#FF4E4E] rounded-full shadow-lg transition-all duration-500"
                        style={{ 
                          left: `${question.yesPercentage}%`, 
                          width: `${100 - question.yesPercentage}%` 
                        }}
                      />
                    </div>

                    {/* Vote Results */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-bold text-sm drop-shadow-sm bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        Evet {question.yesPercentage}%
                      </span>
                      <span className="text-white font-bold text-sm drop-shadow-sm bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        Hayır {100 - question.yesPercentage}%
                      </span>
                    </div>
                  </div>

                  <div>
                    {/* Voting Buttons */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(question.id, 'yes', question.yesOdds);
                        }}
                        className="flex-1 bg-[#00AF54] hover:bg-green-600 text-white font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        Evet {question.yesOdds}x
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(question.id, 'no', question.noOdds);
                        }}
                        className="flex-1 bg-[#FF4E4E] hover:bg-red-600 text-white font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        Hayır {question.noOdds}x
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="text-white/90 text-xs bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      {question.votes} • {question.timeLeft}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(questions.length + index)}
            className={`transition-all duration-300 rounded-full transform hover:scale-110 ${
              index === getIndicatorIndex() 
                ? 'w-8 h-3 bg-gradient-to-r from-[#6B46F0] to-purple-600 shadow-lg' 
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}