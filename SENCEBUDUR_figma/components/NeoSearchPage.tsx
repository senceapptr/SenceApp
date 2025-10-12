import { useState, useEffect } from 'react';

interface NeoSearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function NeoSearchPage({ questions, onQuestionClick, onVote }: NeoSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filters = [
    { id: 'trending', label: '🔥 Trending', gradient: 'from-orange-500 to-red-500' },
    { id: 'ai', label: '🤖 AI Picks', gradient: 'from-purple-500 to-pink-500' },
    { id: 'ending-soon', label: '⏰ Ending Soon', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'high-odds', label: '💎 High Odds', gradient: 'from-green-500 to-emerald-500' },
    { id: 'crypto', label: '₿ Crypto', gradient: 'from-yellow-400 to-yellow-600' },
    { id: 'sports', label: '⚽ Sports', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'tech', label: '📱 Tech', gradient: 'from-indigo-500 to-purple-500' }
  ];

  const algorithmicTrends = [
    { keyword: 'AI Revolution', boost: '+892%', emoji: '🤖' },
    { keyword: 'Crypto Bull Run', boost: '+567%', emoji: '🚀' },
    { keyword: 'Playoff Race', boost: '+234%', emoji: '🏆' },
    { keyword: 'Election 2024', boost: '+189%', emoji: '🗳️' }
  ];

  useEffect(() => {
    // Simulate AI recommendations
    const generateAIRecommendations = () => {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      setAiRecommendations(shuffled.slice(0, 3));
    };

    // Simulate trending calculation
    const generateTrending = () => {
      const trending = [...questions]
        .map(q => ({ ...q, trendScore: Math.random() * 100 }))
        .sort((a, b) => b.trendScore - a.trendScore);
      setTrendingTopics(trending);
    };

    generateAIRecommendations();
    generateTrending();
  }, [questions]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
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
        return trendingTopics.slice(0, 10);
      case 'ai':
        return aiRecommendations;
      case 'ending-soon':
        return filtered.filter(q => 
          q.timeLeft.includes('saat') || 
          q.timeLeft.includes('1 gün')
        );
      case 'high-odds':
        return filtered.filter(q => q.yesOdds > 2.0 || q.noOdds > 2.0);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3),transparent_50%)]" />
      </div>

      <div className="relative z-10 pb-28">
        {/* Header */}
        <div className="p-5 pt-12 bg-black/50 backdrop-blur-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🔮 AI Discovery
            </h1>
            <p className="text-white/60 text-sm">
              Powered by next-gen prediction algorithms
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur" />
            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="flex items-center px-4 py-3">
                <div className={`mr-3 ${isSearching ? 'animate-spin' : ''}`}>
                  {isSearching ? '🔄' : '🔍'}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search predictions, topics, trends..."
                  className="flex-1 bg-transparent text-white placeholder-white/50 outline-none"
                />
                <button className="ml-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">✨</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Algorithm Insights */}
        <div className="px-5 mb-6">
          <h3 className="text-white font-black text-lg mb-4">📈 Algorithm Insights</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {algorithmicTrends.map((trend, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 min-w-[160px]"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{trend.emoji}</div>
                  <p className="text-white font-bold text-sm mb-1">{trend.keyword}</p>
                  <p className="text-green-400 font-bold text-xs">{trend.boost} surge</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 mb-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-shrink-0 relative overflow-hidden rounded-2xl px-4 py-2 transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'scale-105'
                    : 'hover:scale-105'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} ${
                  selectedFilter === filter.id ? 'opacity-100' : 'opacity-60'
                }`} />
                
                {/* Glow effect */}
                {selectedFilter === filter.id && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${filter.gradient} blur opacity-50`} />
                )}
                
                <span className="relative text-white font-bold text-sm whitespace-nowrap">
                  {filter.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations Section */}
        {selectedFilter === 'ai' && (
          <div className="px-5 mb-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">AI Recommendations</h3>
                  <p className="text-white/60 text-sm">Powered by machine learning</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                Our AI analyzed your prediction patterns and found these high-probability matches for you.
              </p>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        <div className="px-5">
          <div className="space-y-4">
            {getFilteredQuestions().map((question, index) => (
              <div
                key={question.id}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  {/* Background Image */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={question.image} 
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top badges */}
                    <div className="flex justify-between items-start">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1">
                        <span className="text-cyan-400 text-xs font-bold">{question.category}</span>
                      </div>
                      
                      {selectedFilter === 'ai' && (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl px-3 py-1">
                          <span className="text-white text-xs font-bold">🤖 AI PICK</span>
                        </div>
                      )}
                      
                      {selectedFilter === 'trending' && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl px-3 py-1 animate-pulse">
                          <span className="text-white text-xs font-bold">🔥 TRENDING</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div>
                      <h3 
                        className="text-white font-bold text-lg mb-3 leading-tight cursor-pointer hover:text-cyan-400 transition-colors"
                        onClick={() => onQuestionClick(question.id)}
                      >
                        {question.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-purple-400 text-xs font-bold">ODDS</p>
                            <p className="text-white font-bold">{Math.max(question.yesOdds, question.noOdds)}x</p>
                          </div>
                          <div className="text-center">
                            <p className="text-cyan-400 text-xs font-bold">VOTES</p>
                            <p className="text-white font-bold">{question.votes}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-orange-400 text-xs font-bold">TIME</p>
                            <p className="text-white font-bold text-xs">{question.timeLeft}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => onVote(question.id, 'no', question.noOdds)}
                          className="flex-1 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
                        >
                          NO {question.noOdds}x
                        </button>
                        <button
                          onClick={() => onVote(question.id, 'yes', question.yesOdds)}
                          className="flex-1 bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
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

        {/* Loading State */}
        {isSearching && (
          <div className="px-5 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <span className="text-white">🔮</span>
              </div>
              <p className="text-white/60">AI is searching the prediction matrix...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}