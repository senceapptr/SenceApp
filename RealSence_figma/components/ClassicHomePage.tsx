import { FeaturedCarousel } from './FeaturedCarousel';
import { FilterPills } from './FilterPills';
import { CircularProgress } from './CircularProgress';
import { featuredQuestions } from '../constants/questions';
import { getFilteredQuestions } from '../utils/questionHelpers';

interface ClassicHomePageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: string) => void;
  handleQuestionDetail: (id: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  scrollY: number;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
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
  hasNotifications
}: ClassicHomePageProps) {
  const showSticky = scrollY > 400;
  const filteredQuestions = getFilteredQuestions(selectedCategory);

  return (
    <>
      {/* New Classic Header */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent tracking-tight">
              Sence
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-gray-800 font-bold text-sm">@kullanici</p>
              <p className="text-gray-500 text-xs">{gameCredits} kredi</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileDrawerOpen(true)}
                className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-all duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              {hasNotifications && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Pills */}
      {showSticky && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm animate-in slide-in-from-top-2">
          <div className="max-w-sm mx-auto px-5 py-3">
            <FilterPills 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      )}

      {/* Featured Carousel */}
      <div className={`px-5 mb-6 transition-all duration-500 ${showSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <FeaturedCarousel 
          questions={featuredQuestions} 
          onQuestionClick={handleQuestionDetail}
          onVote={handleVote}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4 h-18">
          <button
            onClick={() => setCurrentPage('trivia')}
            className="group relative bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-purple-500/10 border-2 border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-4 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm h-full"
          >
            <div className="flex items-center justify-between h-full">
              <div className="text-left">
                <h3 className="text-gray-900 font-black text-lg tracking-tight mb-1">TRIVIA</h3>
                <p className="text-gray-600 text-xs">Test bilgini</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-110">
                <span className="text-lg">🧠</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('predict')}
            className="group relative bg-gradient-to-br from-purple-500/5 via-blue-500/10 to-purple-500/10 border-2 border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-4 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm h-full"
          >
            <div className="flex items-center justify-between h-full">
              <div className="text-left">
                <h3 className="text-gray-900 font-black text-lg tracking-tight mb-1">KEŞFET</h3>
                <p className="text-gray-600 text-xs">Soruları keşfet</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-110">
                <span className="text-lg">🔍</span>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => setCurrentPage('league')}
          className="group relative w-full bg-gradient-to-br from-orange-500/5 via-yellow-500/10 to-orange-500/10 border-2 border-orange-500/20 hover:border-orange-500/40 rounded-2xl p-4 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm h-18"
        >
          <div className="flex items-center justify-between h-full">
            <div className="text-left">
              <h3 className="text-gray-900 font-black text-lg tracking-tight mb-1">LİGLER</h3>
              <p className="text-gray-600 text-xs">Arkadaşlarınla yarış</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-110">
              <span className="text-lg">🏆</span>
            </div>
          </div>
        </button>
      </div>

      {/* Filter Pills */}
      <div className={`px-5 mb-4 transition-all duration-500 ${showSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <FilterPills 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Fixed Question Cards - Full Width Buttons with Right-Aligned Meta */}
      <div className={`px-5 space-y-4 pb-24 ${showSticky ? 'mt-20' : ''}`}>
        {filteredQuestions.map((question, index) => (
          <div
            key={question.id}
            className="group relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 transform hover:scale-102"
            style={{ 
              animationDelay: `${index * 100}ms`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5)',
              height: '200px'
            }}
          >
            <div className="absolute inset-0">
              <img 
                src={question.image} 
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            </div>

            <div className="relative z-10 h-full p-4 flex flex-col justify-between">
              {/* Top Section - Question and Category */}
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 
                    className="text-white font-black text-base leading-tight cursor-pointer hover:text-purple-200 transition-colors drop-shadow-2xl mb-2"
                    onClick={() => handleQuestionDetail(question.id)}
                    style={{ textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}
                  >
                    {question.title}
                  </h3>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 inline-block">
                    <span className="text-white text-xs font-bold uppercase tracking-wide">{question.category}</span>
                  </div>
                </div>

                {/* Circular Progress - Right Side */}
                <div className="flex-shrink-0">
                  <CircularProgress 
                    percentage={question.yesPercentage}
                    majorityVote={question.yesPercentage > 50 ? 'yes' : 'no'}
                    size={70}
                    strokeWidth={6}
                  />
                </div>
              </div>

              {/* Bottom Section - Meta Info and Full Width Buttons */}
              <div>
                {/* Meta Info - Right Aligned */}
                <div className="flex justify-end gap-3 text-xs mb-2">
                  <span className="text-white font-bold drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {question.votes}
                  </span>
                  <span className="text-white font-bold drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {question.timeLeft}
                  </span>
                </div>
                
                {/* Full Width Action Buttons */}
                <div className="flex rounded-xl overflow-hidden shadow-2xl h-10">
                  <button
                    onClick={() => handleVote(question.id, 'yes', question.yesOdds)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs">EVET</span>
                      <span className="text-xs opacity-90 font-bold">{question.yesOdds}x</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleVote(question.id, 'no', question.noOdds)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs">HAYIR</span>
                      <span className="text-xs opacity-90 font-bold">{question.noOdds}x</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}