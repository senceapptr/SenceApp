import { useState, useRef } from 'react';
import { QuestionCard } from './QuestionCard';

interface AlternativeSearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  onBack: () => void;
}

export function AlternativeSearchPage({ questions, onQuestionClick, onVote, onBack }: AlternativeSearchPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const questionsRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', name: 'Tümü', icon: '📂', count: questions.length },
    { id: 'spor', name: 'Spor', icon: '⚽', count: questions.filter(q => q.category === 'spor').length },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻', count: questions.filter(q => q.category === 'teknoloji').length },
    { id: 'ekonomi', name: 'Ekonomi', icon: '📈', count: questions.filter(q => q.category === 'ekonomi').length },
    { id: 'politika', name: 'Politika', icon: '🏛️', count: questions.filter(q => q.category === 'politika').length },
    { id: 'eğlence', name: 'Eğlence', icon: '🎬', count: questions.filter(q => q.category === 'eğlence').length },
    { id: 'sağlık', name: 'Sağlık', icon: '⚕️', count: questions.filter(q => q.category === 'sağlık').length },
    { id: 'çevre', name: 'Çevre', icon: '🌱', count: questions.filter(q => q.category === 'çevre').length }
  ];

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

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

  // Create masonry grid layout
  const createMasonryLayout = () => {
    const layout = [];
    let currentRow = [];
    
    categories.forEach((category, index) => {
      const isTrend = category.count > 15; // Trend criteria
      
      if (index === 0 || index === 3 || index === 6) {
        // Start new row
        if (currentRow.length > 0) {
          layout.push([...currentRow]);
          currentRow = [];
        }
      }

      // Create layout patterns similar to the image
      if (index === 0) {
        // First row: small, large
        currentRow.push({ ...category, size: 'small', position: 'left' });
        if (categories[1]) {
          currentRow.push({ ...categories[1], size: 'large', position: 'right', isTrend: categories[1].count > 15 });
        }
      } else if (index === 2) {
        // Second row: three small
        currentRow.push({ ...category, size: 'small' });
        if (categories[3]) currentRow.push({ ...categories[3], size: 'small' });
        if (categories[4]) currentRow.push({ ...categories[4], size: 'small' });
      } else if (index === 5) {
        // Third row: large, small
        currentRow.push({ ...category, size: 'large', isTrend: category.count > 15 });
        if (categories[6]) currentRow.push({ ...categories[6], size: 'small' });
      }
    });

    if (currentRow.length > 0) {
      layout.push(currentRow);
    }

    return layout;
  };

  const masonryLayout = createMasonryLayout();

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-16 bg-white border-b border-[#F2F3F5]">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#432870] flex items-center justify-center text-white hover:bg-[#5A3A8B] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 className="text-[#202020] font-black text-xl">Kategoriler</h1>
        
        <div className="w-10 h-10" />
      </div>

      {/* Category Grid */}
      <div className="p-6 space-y-4">
        {masonryLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-4 h-32">
            {row.map((category) => {
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    category.size === 'large' ? 'col-span-2' : 'col-span-1'
                  } ${
                    category.isTrend || isSelected
                      ? 'bg-gradient-to-br from-[#432870] to-[#5A3A8B] text-white'
                      : 'bg-white text-[#202020] border-2 border-[#F2F3F5]'
                  }`}
                  style={{
                    boxShadow: category.isTrend || isSelected 
                      ? '0 20px 40px rgba(67, 40, 112, 0.3)' 
                      : '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-current opacity-20" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-current opacity-10" />
                  </div>

                  {/* Trend Badge */}
                  {(category.isTrend || isSelected) && (
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        {category.isTrend ? (
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
                          {category.isTrend && (
                            <span className="text-xs opacity-80">Trend</span>
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

      {/* Questions List */}
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
            
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onVote={onVote}
                onQuestionClick={onQuestionClick}
              />
            ))}
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