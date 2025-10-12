import { useState } from 'react';

interface SearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function SearchPage({ questions, onQuestionClick, onVote }: SearchPageProps) {
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
      {/* Header */}
      <div className="px-5 mb-6">
        <h1 className="font-bold text-2xl text-gray-900 mb-4">🔍 Soru Ara</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Soru ara..."
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

      {/* Masonry Grid Results */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Sonuçlar ({filteredQuestions.length})
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
            {filteredQuestions.map((question, index) => {
              // Dinamik minimum genişlik hesaplama
              const yesWidth = Math.max(question.yesPercentage, 35);
              const noWidth = Math.max(100 - question.yesPercentage, 35);
              const total = yesWidth + noWidth;
              const normalizedYes = (yesWidth / total) * 100;
              const normalizedNo = (noWidth / total) * 100;
              
              return (
                <div 
                  key={question.id}
                  className={`
                    bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer
                    animate-in fade-in-0 slide-in-from-bottom-4
                  `}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    minHeight: index % 3 === 0 ? '280px' : index % 2 === 0 ? '320px' : '300px'
                  }}
                  onClick={() => onQuestionClick(question.id)}
                >
                  {/* Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={question.image} 
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        question.category === 'spor' ? 'bg-green-500 text-white' :
                        question.category === 'teknoloji' ? 'bg-blue-500 text-white' :
                        question.category === 'kripto' ? 'bg-orange-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {question.category?.charAt(0).toUpperCase() + question.category?.slice(1)}
                      </span>
                    </div>
                    
                    {/* Time Left Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {question.timeLeft}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-3 leading-tight line-clamp-3 text-sm">
                      {question.title}
                    </h4>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        {question.votes}
                      </span>
                    </div>

                    {/* Voting Buttons - Overflow düzeltildi */}
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 h-9 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(question.id, 'yes', question.yesOdds);
                        }}
                        className="bg-gradient-to-r from-[#00AF54] to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold transition-all text-xs flex items-center justify-center transform active:scale-95"
                        style={{ width: `${normalizedYes}%` }}
                      >
                        <div className="flex items-center gap-1 px-1">
                          <span className="truncate">Evet</span>
                          <span className="bg-white/25 rounded px-1 text-xs font-bold whitespace-nowrap">{question.yesOdds}x</span>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVote(question.id, 'no', question.noOdds);
                        }}
                        className="bg-gradient-to-r from-[#FF4E4E] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold transition-all text-xs flex items-center justify-center transform active:scale-95"
                        style={{ width: `${normalizedNo}%` }}
                      >
                        <div className="flex items-center gap-1 px-1">
                          <span className="truncate">Hayır</span>
                          <span className="bg-white/25 rounded px-1 text-xs font-bold whitespace-nowrap">{question.noOdds}x</span>
                        </div>
                      </button>
                    </div>

                    {/* Percentage Display */}
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Evet: {question.yesPercentage}%</span>
                      <span>Hayır: {100 - question.yesPercentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}