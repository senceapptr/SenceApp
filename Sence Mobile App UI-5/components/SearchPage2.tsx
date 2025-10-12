import { useState, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CircularProgress } from './CircularProgress';

interface SearchPage2Props {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
  onImmersiveViewClick?: () => void;
  onFeedViewClick?: () => void;
}

interface Question {
  id: number;
  title: string;
  text?: string;
  yesOdds: number;
  noOdds: number;
  category: string;
  votes: number;
  timeLeft: string;
  author?: string;
  image?: string;
  endDate?: Date;
  yesPercentage?: number;
}

export function SearchPage2({ questions, onQuestionClick, onVote, showHeader = true, onImmersiveViewClick, onFeedViewClick }: SearchPage2Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedToCoupon, setAddedToCoupon] = useState<Record<number, 'yes' | 'no' | null>>({});
  const questionsRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', name: 'Tümü', icon: '📂', count: questions.length },
    { id: 'trendler', name: 'Trendler', icon: '🔥', count: questions.filter(q => q.votes > 1000).length },
    { id: 'spor', name: 'Spor', icon: '⚽', count: questions.filter(q => q.category === 'spor').length },
    { id: 'müzik', name: 'Müzik', icon: '🎵', count: questions.filter(q => q.category === 'müzik').length },
    { id: 'finans', name: 'Finans', icon: '💰', count: questions.filter(q => q.category === 'ekonomi').length },
    { id: 'yeni', name: 'Yeni', icon: '✨', count: questions.filter(q => q.id > 15).length },
    { id: 'magazin', name: 'Magazin', icon: '📺', count: questions.filter(q => q.category === 'eğlence').length },
    { id: 'politika', name: 'Politika', icon: '🏛️', count: questions.filter(q => q.category === 'politika').length },
    { id: 'yakinda-bitecek', name: 'Yakında Bitecek', icon: '⏰', count: questions.filter(q => q.id <= 10).length },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻', count: questions.filter(q => q.category === 'teknoloji').length },
    { id: 'dizi-film', name: 'Dizi&Film', icon: '🎬', count: questions.filter(q => q.category === 'eğlence').length },
    { id: 'sosyal-medya', name: 'Sosyal Medya', icon: '📱', count: questions.filter(q => q.category === 'teknoloji').length },
    { id: 'ozel-oranlar', name: 'Özel Oranlar', icon: '🎯', count: questions.filter(q => q.yesOdds > 2.5 || q.noOdds > 2.5).length },
    { id: 'dünya', name: 'Dünya', icon: '🌍', count: questions.filter(q => q.category === 'politika').length }
  ];

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => {
        switch (selectedCategory) {
          case 'trendler': return q.votes > 1000;
          case 'müzik': return q.category === 'müzik';
          case 'finans': return q.category === 'ekonomi';
          case 'yeni': return q.id > 15;
          case 'magazin': return q.category === 'eğlence';
          case 'yakinda-bitecek': return q.id <= 10;
          case 'dizi-film': return q.category === 'eğlence';
          case 'sosyal-medya': return q.category === 'teknoloji';
          case 'ozel-oranlar': return q.yesOdds > 2.5 || q.noOdds > 2.5;
          case 'dünya': return q.category === 'politika';
          default: return q.category === selectedCategory;
        }
      });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Fluid animation scroll to questions
    if (questionsRef.current) {
      questionsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Enhanced category styles for better visual appeal
  const categoryStyles = {
    'Spor': { bg: '#1F2937', textColor: 'text-emerald-200', accentColor: '#10B981' },
    'Ekonomi': { bg: '#1F2937', textColor: 'text-amber-200', accentColor: '#F59E0B' },
    'Teknoloji': { bg: '#1F2937', textColor: 'text-blue-200', accentColor: '#3B82F6' },
    'Eğlence': { bg: '#1F2937', textColor: 'text-purple-200', accentColor: '#8B5CF6' },
    'Politika': { bg: '#1F2937', textColor: 'text-red-200', accentColor: '#EF4444' },
    'default': { bg: '#1F2937', textColor: 'text-gray-200', accentColor: '#6B7280' }
  };

  // Check if question is expired
  const isExpired = (question: Question) => {
    if (!question) return false;
    return question.timeLeft === "Süresi doldu" || (question.endDate && question.endDate < new Date());
  };

  const handleVote = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    const question = filteredQuestions.find(q => q.id === questionId);
    
    // Prevent voting on expired questions
    if (question && isExpired(question)) {
      return;
    }

    setAddedToCoupon(prev => ({ ...prev, [questionId]: vote }));
    
    // Call parent vote handler
    if (onVote) {
      onVote(questionId, vote, odds);
    }
  };

  const handleCardClick = (question: Question, event: React.MouseEvent) => {
    // Don't open detail if clicking on buttons or interactive elements
    const target = event.target as HTMLElement;
    const isButton = target.closest('button');
    const isInteractive = target.closest('[data-interactive]');
    
    if (!isButton && !isInteractive && onQuestionClick && question) {
      onQuestionClick(question.id);
    }
  };

  // Create new layout structure
  const createCategoryLayout = () => {
    const layout = [];
    
    // Row 1: Tümü + Trendler (2 kutucuk)
    layout.push([
      { ...categories[0], size: 'small' },
      { ...categories[1], size: 'large', isTrend: true }
    ]);
    
    // Row 2: Spor, Müzik, Finans
    layout.push([
      { ...categories[2], size: 'small' },
      { ...categories[3], size: 'small' },
      { ...categories[4], size: 'small' }
    ]);
    
    // Row 3: Yeni (2 kutucuk) + Magazin
    layout.push([
      { ...categories[5], size: 'large', isTrend: true },
      { ...categories[6], size: 'small' }
    ]);
    
    // Row 4: Politika + Yakında Bitecek (2 kutucuk)
    layout.push([
      { ...categories[7], size: 'small' },
      { ...categories[8], size: 'large', isTrend: true }
    ]);
    
    // Row 5: Teknoloji, Dizi&Film, Sosyal Medya
    layout.push([
      { ...categories[9], size: 'small' },
      { ...categories[10], size: 'small' },
      { ...categories[11], size: 'small' }
    ]);
    
    // Row 6: Özel Oranlar (2 kutucuk) + Dünya
    layout.push([
      { ...categories[12], size: 'large', isTrend: true },
      { ...categories[13], size: 'small' }
    ]);

    return layout;
  };

  const categoryLayout = createCategoryLayout();

  // Feed-style Question Card Component
  const FeedStyleQuestionCard = ({ question, index }: { question: Question; index: number }) => {
    const categoryStyle = categoryStyles[question.category as keyof typeof categoryStyles] || categoryStyles.default;
    const expired = isExpired(question);
    const inCoupon = addedToCoupon[question.id];

    // Enhanced image fallback with category-based defaults
    const getImageForCategory = (category: string) => {
      const categoryImages = {
        'spor': 'https://images.unsplash.com/photo-1516567693080-64b6d1ea0fc8?w=800&q=80',
        'teknoloji': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        'ekonomi': 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
        'eğlence': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        'politika': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'
      };
      return categoryImages[category.toLowerCase()] || 'https://images.unsplash.com/photo-1516567693080-64b6d1ea0fc8?w=800&q=80';
    };

    return (
      <div
        className={`relative w-full overflow-hidden bg-white cursor-pointer ${
          expired ? 'opacity-60' : ''
        } ${index === 0 ? '' : 'border-t border-black/5'}`}
        style={{ height: '345px' }}
        onClick={(e) => handleCardClick(question, e)}
      >
        {/* Background Image - Full Coverage */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={question.image || getImageForCategory(question.category)}
            alt={question.text || question.title || ''}
            className="w-full h-full object-cover"
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>

        {/* Expired State */}
        {expired && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-[#6B7280] text-white px-6 py-3 rounded-2xl font-medium">
              Süre Doldu
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          
          {/* Top Section - Question at Top Left with Circular Progress */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Question Title - Enhanced Shadow */}
              <h2 
                className="text-white font-bold text-xl leading-tight mb-3"
                style={{ 
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.6)' 
                }}
              >
                {question.text || question.title || 'Soru metni mevcut değil'}
              </h2>
              
              {/* Category - Below Question */}
              <div className="inline-flex items-center gap-2">
                <div 
                  className="rounded-full px-3 py-2 backdrop-blur-md border border-white/20"
                  style={{ backgroundColor: categoryStyle.bg }}
                  data-interactive="true"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: categoryStyle.accentColor }}
                    ></div>
                    <span className={`${categoryStyle.textColor} font-semibold text-sm uppercase tracking-wider`}>
                      {question.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Progress - Top Right */}
            <div className="flex-shrink-0" data-interactive="true">
              <CircularProgress
                percentage={question.yesPercentage || 50}
                majorityVote={(question.yesPercentage || 50) >= 50 ? 'yes' : 'no'}
                size={60}
                strokeWidth={6}
              />
            </div>
          </div>

          {/* Bottom Section - Stats, Time & Buttons */}
          <div className="space-y-4">
            {/* Stats & Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-3 py-2">
                  <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                  <span className="text-white font-medium text-sm">{(question.votes || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Time Left */}
              <div 
                className="backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border bg-blue-600/80 border-blue-500/30"
                data-interactive="true"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white font-semibold text-sm">{question.timeLeft || 'Süre belirsiz'}</span>
              </div>
            </div>

            {/* Premium Vote Buttons */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(question.id, 'yes', question.yesOdds || 1.0);
                }}
                disabled={expired || inCoupon !== undefined}
                className={`flex-1 relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  expired ? 'bg-gray-500/40 cursor-not-allowed border border-gray-400/20' :
                  inCoupon === 'yes' ? 'bg-gradient-to-r from-emerald-600 to-green-600 shadow-xl border border-emerald-400/30' :
                  inCoupon === 'no' ? 'bg-white/15 opacity-60 border border-white/10' :
                  'bg-gradient-to-r from-emerald-500/90 to-green-500/90 hover:from-emerald-600 hover:to-green-600 active:scale-[0.98] shadow-lg hover:shadow-xl border border-emerald-400/30 backdrop-blur-sm'
                }`}
                data-interactive="true"
              >
                <div className="p-3 flex items-center justify-between">
                  <span className="text-white font-bold text-base">EVET</span>
                  <div className="bg-white/25 backdrop-blur-sm rounded-xl px-2 py-1 border border-white/20">
                    <span className="text-white font-bold text-base">{(question.yesOdds || 1.0).toFixed(2)}</span>
                  </div>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote(question.id, 'no', question.noOdds || 1.0);
                }}
                disabled={expired || inCoupon !== undefined}
                className={`flex-1 relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  expired ? 'bg-gray-500/40 cursor-not-allowed border border-gray-400/20' :
                  inCoupon === 'no' ? 'bg-gradient-to-r from-rose-600 to-red-600 shadow-xl border border-rose-400/30' :
                  inCoupon === 'yes' ? 'bg-white/15 opacity-60 border border-white/10' :
                  'bg-gradient-to-r from-rose-500/90 to-red-500/90 hover:from-rose-600 hover:to-red-600 active:scale-[0.98] shadow-lg hover:shadow-xl border border-rose-400/30 backdrop-blur-sm'
                }`}
                data-interactive="true"
              >
                <div className="p-3 flex items-center justify-between">
                  <span className="text-white font-bold text-base">HAYIR</span>
                  <div className="bg-white/25 backdrop-blur-sm rounded-xl px-2 py-1 border border-white/20">
                    <span className="text-white font-bold text-base">{(question.noOdds || 1.0).toFixed(2)}</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Coupon Success State */}
            {inCoupon && !expired && (
              <div className="text-center" data-interactive="true">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-4 py-2 inline-flex items-center gap-2 shadow-lg border border-indigo-400/30 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="font-bold text-sm">Kupona Eklendi</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-6 pt-16 bg-white border-b border-[#F2F3F5]">
          <h1 className="text-[#202020] font-black text-2xl">Keşfet</h1>
          
          <div className="flex items-center gap-2">
            {onFeedViewClick && (
              <button
                onClick={onFeedViewClick}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#C9F158] to-[#353831] text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">Feed</span>
              </button>
            )}
            
            {onImmersiveViewClick && (
              <button
                onClick={onImmersiveViewClick}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Sürükleyici</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* View Buttons - When header is hidden */}
      {!showHeader && (onImmersiveViewClick || onFeedViewClick) && (
        <div className="flex justify-end px-6 pt-6 pb-2 gap-2">
          {onFeedViewClick && (
            <button
              onClick={onFeedViewClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C9F158] to-[#353831] text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Feed Görünümü</span>
            </button>
          )}
          
          {onImmersiveViewClick && (
            <button
              onClick={onImmersiveViewClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
              <span>Sürükleyici Görünüm</span>
            </button>
          )}
        </div>
      )}

      {/* Category Grid - No "Category Select" text */}
      <div className="p-6 space-y-4">
        {categoryLayout.map((row, rowIndex) => (
          <div key={rowIndex} className={`grid gap-4 h-32 ${
            row.length === 3 ? 'grid-cols-3' : 'grid-cols-3'
          }`}>
            {row.map((category) => {
              const isSelected = selectedCategory === category.id;
              const isTrend = category.isTrend;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    category.size === 'large' ? 'col-span-2' : 'col-span-1'
                  } ${
                    isTrend
                      ? 'bg-gradient-to-br from-[#432870] to-[#5A3A8B] text-white'
                      : isSelected
                      ? 'bg-gradient-to-br from-[#B29EFD] to-[#432870] text-white'
                      : 'bg-white text-[#202020] border-2 border-[#F2F3F5]'
                  }`}
                  style={{
                    boxShadow: isTrend || isSelected 
                      ? '0 20px 40px rgba(67, 40, 112, 0.3)' 
                      : '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-current opacity-20" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-current opacity-10" />
                  </div>

                  {/* Trend/Special Badge */}
                  {(isTrend || isSelected) && (
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        {isTrend ? (
                          <span className="text-sm">🔥</span>
                        ) : (
                          <span className="text-sm">✓</span>
                        )}
                      </div>
                      <div className="bg-white/20 rounded-full px-2 py-1">
                        <span className="text-xs font-bold">{category.count}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.size === 'large' && (
                        <div className="flex flex-col">
                          <span className="font-black text-lg">{category.name}</span>
                          {isTrend && (
                            <span className="text-xs opacity-80">Popüler</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-start">
                      <div className={`font-black ${category.size === 'large' ? 'text-2xl' : 'text-xl'}`}>
                        {category.count}
                      </div>
                      {category.size === 'small' && (
                        <div className="text-xs opacity-80 font-bold">{category.name}</div>
                      )}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected Category Info */}
      {selectedCategory !== 'all' && (
        <div className="px-6 py-4 bg-white mx-6 rounded-2xl shadow-md border border-[#F2F3F5] mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
                <span className="text-lg">
                  {categories.find(c => c.id === selectedCategory)?.icon}
                </span>
              </div>
              <div>
                <h3 className="text-[#202020] font-black text-lg">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <p className="text-[#202020]/70 text-sm">
                  {filteredQuestions.length} soru bulundu
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[#432870] font-bold text-sm hover:text-[#5A3A8B] transition-colors"
            >
              Temizle
            </button>
          </div>
        </div>
      )}

      {/* Questions List - Feed Style Layout - Full Width */}
      <div ref={questionsRef} className="pb-24">
        {filteredQuestions.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6 px-6">
              <h2 className="text-[#202020] font-black text-lg">
                {selectedCategory === 'all' ? 'Tüm Sorular' : `${categories.find(c => c.id === selectedCategory)?.name} Soruları`}
              </h2>
              <div className="text-[#432870] font-bold text-sm">
                {filteredQuestions.length} soru
              </div>
            </div>
            
            {/* Feed Style Vertical Layout - Full Width, No Gaps */}
            <div className="space-y-0">
              {filteredQuestions.map((question, index) => (
                <FeedStyleQuestionCard 
                  key={question.id} 
                  question={question} 
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-[#202020] font-black text-xl mb-2">Bu kategoride soru yok</h3>
            <p className="text-[#202020]/70">
              Başka bir kategori seçmeyi deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}