import { useState, useEffect } from 'react';
import { FeaturedCarousel } from './FeaturedCarousel';
import { FilterPills } from './FilterPills';
import { QuestionCard } from './QuestionCard';
import { questions, featuredQuestions } from '../constants/questions';

interface ClassicHomePageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: string) => void;
  handleQuestionDetail: (questionId: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  scrollY: number;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
  renderHeader: (title: string, isHomePage?: boolean) => JSX.Element;
}

export function ClassicHomePage({
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
  handleQuestionDetail,
  handleVote,
  scrollY,
  gameCredits,
  setProfileDrawerOpen,
  hasNotifications,
  renderHeader
}: ClassicHomePageProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Set default category to "tümü" when component mounts
  useEffect(() => {
    if (selectedCategory === '') {
      setSelectedCategory('tümü');
    }
  }, [selectedCategory, setSelectedCategory]);

  useEffect(() => {
    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'fixed w-1 h-1 bg-[#432870] rounded-full opacity-20 pointer-events-none z-10';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      particle.style.animation = 'float-up 8s linear forwards';
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 8000);
    };

    const interval = setInterval(createParticle, 2000);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        to {
          transform: translateY(-${window.innerHeight + 100}px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(interval);
      style.remove();
    };
  }, []);

  const toggleCardExpansion = (cardId: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const filteredQuestions = selectedCategory === 'tümü' 
    ? questions 
    : questions.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header with personalized greeting */}
      {renderHeader('', true)}

      {/* Featured Section - WITHOUT "Öne Çıkanlar" title */}
      <div className="px-5 py-4">
        <FeaturedCarousel 
          questions={featuredQuestions} 
          onQuestionClick={handleQuestionDetail} 
          onVote={handleVote}
        />
      </div>

      {/* Premium Action Buttons Section - All Same Color, 20% Taller */}
      <div className="px-5 py-4 bg-[#F2F3F5]">
        <div className="space-y-4">
          {/* Top Row - Trivia and Hızlı Tahmin - Premium Design */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentPage('trivia')}
              className="relative overflow-hidden bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-5 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
              style={{
                boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="font-black text-lg tracking-wide">Trivia</h3>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#B29EFD]/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
            </button>

            <button
              onClick={() => setCurrentPage('predict')}
              className="relative overflow-hidden bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-5 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
              style={{
                boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="font-black text-lg tracking-wide">Hızlı Tahmin</h3>
              </div>
              <div className="absolute bottom-0 left-0 w-14 h-14 bg-gradient-to-tr from-[#B29EFD]/20 to-transparent rounded-full translate-y-7 -translate-x-7"></div>
            </button>
          </div>

          {/* Bottom Row - Ligler (Full Width) - Premium Design */}
          <button
            onClick={() => setCurrentPage('league')}
            className="relative overflow-hidden w-full bg-gradient-to-r from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-5 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
            style={{
              boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="font-black text-lg tracking-wide">Ligler</h3>
            </div>
            <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-[#B29EFD]/20 to-transparent rounded-full -translate-y-10"></div>
            <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-gradient-to-tl from-[#B29EFD]/20 to-transparent rounded-full translate-y-8"></div>
          </button>
        </div>
      </div>

      {/* Questions Section */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#202020] font-black text-xl">Günün Soruları</h2>
          <span className="text-[#432870] font-bold text-sm">{filteredQuestions.length} soru</span>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <FilterPills
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Questions Grid */}
        <div className="space-y-4 pb-20">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onQuestionClick={handleQuestionDetail}
              onVote={handleVote}
              isExpanded={expandedCards.has(question.id)}
              onToggleExpansion={() => toggleCardExpansion(question.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}