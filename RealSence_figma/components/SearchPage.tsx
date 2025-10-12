import { useState } from 'react';

interface SearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
}

export function SearchPage({ questions, onQuestionClick, onVote, showHeader = true }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', count: questions.length, color: 'bg-purple-100 text-purple-700' },
    { id: 'spor', name: 'Spor', count: questions.filter(q => q.category === 'spor').length, color: 'bg-green-100 text-green-700' },
    { id: 'teknoloji', name: 'Teknoloji', count: questions.filter(q => q.category === 'teknoloji').length, color: 'bg-blue-100 text-blue-700' },
    { id: 'kripto', name: 'Kripto', count: questions.filter(q => q.category === 'kripto').length, color: 'bg-orange-100 text-orange-700' }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 pt-4 pb-24 bg-gradient-to-b from-white to-gray-50">
      {/* Search Bar - Always Visible */}
      <div className="px-5 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Soru keşfet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-0 rounded-2xl py-4 px-5 pr-12 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm focus:shadow-md"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Header */}
      {showHeader && (
        <div className="px-5 mb-6">
          <h1 className="font-bold text-2xl text-gray-900 mb-4">🔍 Soru Keşfet</h1>
          
          {/* Statistics */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-4 border border-purple-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-bold text-2xl text-purple-600">{questions.length}</div>
                <div className="text-sm text-gray-600">Toplam Soru</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-green-600">
                  {questions.filter(q => q.timeLeft.includes('saat') || q.timeLeft.includes('1 gün')).length}
                </div>
                <div className="text-sm text-gray-600">Bitmek Üzere</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-orange-600">
                  {questions.filter(q => q.yesPercentage > 60).length}
                </div>
                <div className="text-sm text-gray-600">Trend Olan</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Kategoriler</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : `${category.color} hover:shadow-md`
              }`}
            >
              <div className="font-bold text-lg">{category.count}</div>
              <div className={`font-medium ${selectedCategory === category.id ? 'text-white' : ''}`}>
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Results - Removed Category, Added Percentages */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Keşfet ({filteredQuestions.length})
          </h3>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
            >
              Temizle
            </button>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredQuestions.map((question, index) => (
              <div 
                key={question.id}
                className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  height: '240px'
                }}
                onClick={() => onQuestionClick(question.id)}
              >
                {/* Full Photo Background */}
                <div className="absolute inset-0">
                  <img 
                    src={question.image} 
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-between p-3">
                  
                  {/* Top Content */}
                  <div>
                    {/* Question Title */}
                    <h4 className="text-white font-bold text-sm leading-tight mb-2 drop-shadow-2xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {question.title}
                    </h4>

                    {/* Vote Count and Time - Top Right */}
                    <div className="absolute top-3 right-3 text-right">
                      <p className="text-white text-xs font-bold drop-shadow-lg mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        {question.votes}
                      </p>
                      <p className="text-white text-xs font-bold drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        {question.timeLeft}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div>
                    {/* Simple Percentage Display Above Buttons */}
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-xs font-bold drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        %{question.yesPercentage} evet
                      </span>
                      <span className="text-white text-xs font-bold drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        %{100 - question.yesPercentage} hayır
                      </span>
                    </div>

                    {/* Enhanced Voting Buttons with Integrated Odds */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(question.id, 'yes', question.yesOdds);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#00AF54] to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold transition-all py-3 px-2 rounded-lg transform active:scale-95 shadow-xl"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs">EVET</span>
                          <span className="text-sm font-bold">{question.yesOdds}x</span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(question.id, 'no', question.noOdds);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#FF4E4E] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold transition-all py-3 px-2 rounded-lg transform active:scale-95 shadow-xl"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs">HAYIR</span>
                          <span className="text-sm font-bold">{question.noOdds}x</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}