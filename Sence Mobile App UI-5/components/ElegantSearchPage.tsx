import { useState, useEffect, useRef } from 'react';

interface ElegantSearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function ElegantSearchPage({ questions, onQuestionClick, onVote }: ElegantSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filters = [
    { id: 'trending', label: '🔥 Trending', color: 'from-orange-400 to-red-400', bgColor: 'bg-orange-50' },
    { id: 'ending-soon', label: '⏰ Ending Soon', color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-50' },
    { id: 'high-odds', label: '💎 High Odds', color: 'from-green-400 to-emerald-400', bgColor: 'bg-green-50' },
    { id: 'popular', label: '⭐ Popular', color: 'from-purple-400 to-pink-400', bgColor: 'bg-purple-50' },
    { id: 'crypto', label: '₿ Crypto', color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'sports', label: '⚽ Sports', color: 'from-blue-400 to-cyan-400', bgColor: 'bg-blue-50' },
    { id: 'tech', label: '📱 Tech', color: 'from-indigo-400 to-purple-400', bgColor: 'bg-indigo-50' }
  ];

  const trendingInsights = [
    { keyword: 'AI Revolution', percentage: '+892%', emoji: '🤖', color: 'from-purple-400 to-blue-400' },
    { keyword: 'Crypto Rally', percentage: '+567%', emoji: '🚀', color: 'from-yellow-400 to-orange-400' },
    { keyword: 'Sports Finale', percentage: '+234%', emoji: '🏆', color: 'from-green-400 to-blue-400' }
  ];

  useEffect(() => {
    // Simulate trending calculation
    const generateTrending = () => {
      const trending = [...questions]
        .map(q => ({ ...q, trendScore: Math.random() * 100 }))
        .sort((a, b) => b.trendScore - a.trendScore);
      setTrendingData(trending);
    };
    generateTrending();
  }, [questions]);

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      setIsPulling(false);
      setPullDistance(0);
    }, 1500);
  };

  const handleScroll = (e: any) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop < -80 && !isRefreshing) {
      setIsPulling(true);
      setPullDistance(Math.abs(scrollTop));
      if (Math.abs(scrollTop) > 120) {
        handlePullToRefresh();
      }
    } else if (scrollTop >= 0) {
      setIsPulling(false);
      setPullDistance(0);
    }
  };

  const getFilteredQuestions = () => {
    let filtered = [...questions];

    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (selectedFilter) {
      case 'trending':
        return trendingData.slice(0, 10);
      case 'ending-soon':
        return filtered.filter(q => 
          q.timeLeft.includes('saat') || 
          q.timeLeft.includes('1 gün')
        );
      case 'high-odds':
        return filtered.filter(q => q.yesOdds > 2.0 || q.noOdds > 2.0);
      case 'popular':
        return filtered.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
      case 'crypto':
        return filtered.filter(q => q.category === 'kripto');
      case 'sports':
        return filtered.filter(q => q.category === 'spor');
      case 'tech':
        return filtered.filter(q => q.category === 'teknoloji');
      default:
        return filtered;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* Soft Background Orbs */}
      <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-40 -left-20 w-60 h-60 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Pull to Refresh Indicator */}
      {isPulling && (
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
          style={{ 
            transform: `translateX(-50%) translateY(${Math.min(pullDistance / 2, 80)}px)`,
            opacity: Math.min(pullDistance / 100, 1)
          }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-xl border border-white/30">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 border-2 border-blue-500 rounded-full ${isRefreshing ? 'border-t-transparent animate-spin' : 'border-t-blue-200'}`} />
              <span className="text-gray-700 font-medium">
                {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="pb-28 overflow-y-auto h-screen"
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Header */}
        <div className="px-6 pt-12 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Discover 🔮
            </h1>
            <p className="text-gray-500 text-sm">
              Find trending predictions & hot topics
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
              <div className="flex items-center px-4 py-4">
                <div className="mr-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search predictions, topics..."
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                />
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="ml-3 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Insights */}
        <div className="px-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Trending Insights</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {trendingInsights.map((insight, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30 min-w-[140px] hover:scale-105 transition-transform duration-300"
              >
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <span className="text-2xl">{insight.emoji}</span>
                  </div>
                  <p className="text-gray-800 font-bold text-sm mb-1">{insight.keyword}</p>
                  <p className="text-green-500 font-bold text-xs">{insight.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 mb-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 relative overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'scale-105 shadow-lg'
                    : 'hover:scale-105'
                }`}
              >
                {/* Background */}
                <div className={`absolute inset-0 ${
                  selectedFilter === filter.id 
                    ? `bg-gradient-to-r ${filter.color}` 
                    : filter.bgColor
                }`} />
                
                {/* Glow effect */}
                {selectedFilter === filter.id && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${filter.color} blur opacity-30`} />
                )}
                
                <span className={`relative font-bold text-sm whitespace-nowrap ${
                  selectedFilter === filter.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {filter.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="px-6">
          <div className="space-y-4">
            {getFilteredQuestions().map((question, index) => (
              <div
                key={question.id}
                className="group bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div className="relative">
                  {/* Background Image */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={question.image} 
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top badges */}
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 border border-white/30">
                        <span className="text-white text-xs font-bold uppercase">{question.category}</span>
                      </div>
                      
                      {selectedFilter === 'trending' && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl px-3 py-2 shadow-lg animate-pulse">
                          <span className="text-white text-xs font-bold">🔥 HOT</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div>
                      <h3 
                        className="text-white font-bold text-lg mb-4 leading-tight cursor-pointer hover:text-blue-200 transition-colors drop-shadow-lg"
                        onClick={() => onQuestionClick(question.id)}
                      >
                        {question.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-blue-200 text-xs font-bold">ODDS</p>
                            <p className="text-white font-bold">{Math.max(question.yesOdds, question.noOdds)}x</p>
                          </div>
                          <div className="text-center">
                            <p className="text-purple-200 text-xs font-bold">VOTES</p>
                            <p className="text-white font-bold">{question.votes}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-orange-200 text-xs font-bold">TIME</p>
                            <p className="text-white font-bold text-xs">{question.timeLeft}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => onVote(question.id, 'no', question.noOdds)}
                          className="flex-1 bg-white/20 hover:bg-red-500/80 backdrop-blur-md text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 border border-white/30 hover:border-red-400"
                        >
                          NO {question.noOdds}x
                        </button>
                        <button
                          onClick={() => onVote(question.id, 'yes', question.yesOdds)}
                          className="flex-1 bg-white/20 hover:bg-green-500/80 backdrop-blur-md text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 border border-white/30 hover:border-green-400"
                        >
                          YES {question.yesOdds}x
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More Indicator */}
        <div className="px-6 mt-8 mb-4 text-center">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl py-4 shadow-lg border border-white/30">
            <p className="text-gray-500 text-sm">Pull down to refresh • Swipe for more</p>
          </div>
        </div>
      </div>
    </div>
  );
}