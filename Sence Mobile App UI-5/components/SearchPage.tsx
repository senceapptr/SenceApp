import { useState } from 'react';
import { FilterPills } from './FilterPills';
import { QuestionCard } from './QuestionCard';

interface SearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
}

export function SearchPage({ questions, onQuestionClick, onVote, showHeader = true }: SearchPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tümü', count: questions.length },
    { id: 'spor', name: 'Spor', count: questions.filter(q => q.category === 'spor').length },
    { id: 'teknoloji', name: 'Teknoloji', count: questions.filter(q => q.category === 'teknoloji').length },
    { id: 'ekonomi', name: 'Ekonomi', count: questions.filter(q => q.category === 'ekonomi').length },
    { id: 'politika', name: 'Politika', count: questions.filter(q => q.category === 'politika').length },
    { id: 'eğlence', name: 'Eğlence', count: questions.filter(q => q.category === 'eğlence').length }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 bg-[#F2F3F5] pb-24">
      {/* Header */}
      {showHeader && (
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-black text-3xl text-[#202020] mb-4">
            <svg className="w-8 h-8 inline-block mr-3 text-[#432870]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Keşfet
          </h1>
          <p className="text-[#202020]/70">İlgi alanlarındaki soruları keşfet ve tahmin yap!</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-5 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Soru veya kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-[#F2F3F5] rounded-full py-4 px-6 pr-12 text-[#202020] placeholder-[#202020]/50 focus:border-[#432870] focus:outline-none transition-colors shadow-sm"
          />
          <svg 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#202020]/50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-5 mb-6">
        <FilterPills
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Questions List */}
      <div className="px-5">
        {filteredQuestions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#202020] font-black text-lg">
                {searchQuery ? `"${searchQuery}" arama sonuçları` : 
                 selectedCategory === 'all' ? 'Tüm Sorular' : 
                 categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-[#432870] font-bold text-sm">
                {filteredQuestions.length} soru
              </span>
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
            <div className="text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto text-[#432870]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-[#202020] font-black text-xl mb-2">
              {searchQuery ? 'Aradığın soru bulunamadı' : 'Bu kategoride soru yok'}
            </h3>
            <p className="text-[#202020]/70">
              {searchQuery ? 'Farklı kelimeler deneyebilirsin' : 'Başka bir kategori seçmeyi deneyin'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 bg-[#432870] hover:bg-[#5A3A8B] text-white px-6 py-3 rounded-full font-bold transition-colors"
              >
                Aramayı Temizle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}