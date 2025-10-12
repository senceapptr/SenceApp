import { useState, useRef } from 'react';
import { QuestionCard } from './QuestionCard';

interface SearchPage2Props {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
}

export function SearchPage2({ questions, onQuestionClick, onVote, showHeader = true }: SearchPage2Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-6 pt-16 bg-white border-b border-[#F2F3F5]">
          <h1 className="text-[#202020] font-black text-2xl">Keşfet</h1>
          <div className="w-10 h-10" />
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

      {/* Questions List - 2 Column Grid */}
      <div ref={questionsRef} className="px-6 pb-24">
        {filteredQuestions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#202020] font-black text-lg">
                {selectedCategory === 'all' ? 'Tüm Sorular' : `${categories.find(c => c.id === selectedCategory)?.name} Soruları`}
              </h2>
              <div className="text-[#432870] font-bold text-sm">
                {filteredQuestions.length} soru
              </div>
            </div>
            
            {/* 2 Column Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="w-full">
                  <QuestionCard
                    question={question}
                    onVote={onVote}
                    onQuestionClick={onQuestionClick}
                    isCompact={true}
                  />
                </div>
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