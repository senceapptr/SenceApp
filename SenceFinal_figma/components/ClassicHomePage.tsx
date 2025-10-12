import { useState, useEffect } from 'react';
import { FeaturedCarousel } from './FeaturedCarousel';
import { FilterPills } from './FilterPills';
import { QuestionCard } from './QuestionCard';
import { questions, featuredQuestions } from '../constants/questions';

interface ClassicHomePageProps {
  onQuestionDetail: (question: any) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  onFollowersClick: (tab: 'followers' | 'following' | 'activity') => void;
  onNavigateHome: () => void;
  showProfileDropdown: boolean;
  onToggleProfileDropdown: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onMarketClick: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onWriteQuestionClick: () => void;
  onTasksClick: () => void;
  onImmersiveViewClick: () => void;
  onFeedViewClick: () => void;
  onAlternativeViewClick: () => void;
  onAlternativeSearchClick?: () => void;
}

export function ClassicHomePage({
  onQuestionDetail,
  onVote,
  onFollowersClick,
  onNavigateHome,
  showProfileDropdown,
  onToggleProfileDropdown,
  onProfileClick,
  onNotificationsClick,
  onMarketClick,
  onEditProfileClick,
  onSettingsClick,
  onLogoutClick,
  onWriteQuestionClick,
  onTasksClick,
  onImmersiveViewClick,
  onFeedViewClick,
  onAlternativeViewClick,
  onAlternativeSearchClick
}: ClassicHomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('tümü');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

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

  // Safe filtering with null checks
  const filteredQuestions = selectedCategory === 'tümü' 
    ? questions 
    : questions.filter(q => q?.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Categories based on available data
  const categoriesData = [
    { id: 'tümü', name: 'Tümü', count: questions.length },
    { id: 'spor', name: 'Spor', count: questions.filter(q => q?.category === 'spor').length },
    { id: 'teknoloji', name: 'Teknoloji', count: questions.filter(q => q?.category === 'teknoloji').length },
    { id: 'kripto', name: 'Kripto', count: questions.filter(q => q?.category === 'kripto').length },
    { id: 'politika', name: 'Politika', count: questions.filter(q => q?.category === 'politika').length }
  ].filter(cat => cat.count > 0); // Only show categories that have questions

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      <div className="px-5 pt-16 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#202020] font-black text-3xl">
              Merhaba! 👋
            </h1>
            <p className="text-[#202020]/70 mt-1">Bugün hangi soruları keşfedeceğiz?</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNotificationsClick}
              className="relative p-3 bg-white rounded-full shadow-sm border border-[#F2F3F5] hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5 text-[#432870]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
              onClick={onToggleProfileDropdown}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#432870] hover:border-[#B29EFD] transition-colors"
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Alternative View Button */}
      {onAlternativeViewClick && (
        <div className="px-5 pt-2 pb-2">
          <button
            onClick={onAlternativeViewClick}
            className="w-full bg-gradient-to-r from-[#C9F158] to-[#A8D83F] hover:from-[#A8D83F] hover:to-[#C9F158] text-[#432870] font-bold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#C9F158]/20 flex items-center justify-center gap-2"
          >
            <span className="text-lg">✨</span>
            <span>Alternatif Görünüm</span>
            <span className="text-lg">🎯</span>
          </button>
        </div>
      )}

      {/* Featured Section */}
      <div className="px-5 py-4">
        <FeaturedCarousel 
          questions={featuredQuestions} 
          onQuestionClick={onQuestionDetail} 
          onVote={onVote}
        />
      </div>

      {/* Premium Action Buttons Section */}
      <div className="px-5 py-4 bg-[#F2F3F5]">
        <div className="space-y-4">
          {/* Top Row - Trivia and Hızlı Tahmin */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onImmersiveViewClick}
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
              onClick={onFeedViewClick}
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

          {/* Bottom Row - Soru Yaz (Full Width) */}
          <button
            onClick={onWriteQuestionClick}
            className="relative overflow-hidden w-full bg-gradient-to-r from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-5 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
            style={{
              boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="font-black text-lg tracking-wide">Soru Yaz</h3>
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
            categories={categoriesData}
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
              onQuestionClick={onQuestionDetail}
              onVote={onVote}
              isExpanded={expandedCards.has(question.id)}
              onToggleExpansion={() => toggleCardExpansion(question.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}