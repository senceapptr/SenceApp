import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Question {
  id: number;
  text: string;
  title?: string;
  yesOdds: number;
  noOdds: number;
  category: string;
  votes: number;
  timeLeft: string;
  author: string;
  image?: string;
  endDate?: Date;
  yesPercentage?: number;
}

interface QuestionsListPageProps {
  onBack: () => void;
  questions?: Question[];
  onVote?: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  onQuestionDetail?: (question: Question) => void;
}

export function QuestionsListPage({ onBack, questions = [], onVote, onQuestionDetail }: QuestionsListPageProps) {
  const [addedToCoupon, setAddedToCoupon] = useState<Record<number, 'yes' | 'no' | null>>({});
  const [showAddAnimation, setShowAddAnimation] = useState<Record<number, 'yes' | 'no' | null>>({});
  const [exploreCount, setExploreCount] = useState(0);
  const [userCredits] = useState(12540);
  const [hotQuestions, setHotQuestions] = useState<Set<number>>(new Set());
  const [urgentQuestions, setUrgentQuestions] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Expanded questions for discovery with proper data structure
  const allQuestions: Question[] = questions.length > 0 ? questions : [
    {
      id: 1,
      text: "Galatasaray bu sezon şampiyonluğu kazanacak mı?",
      title: "Galatasaray bu sezon şampiyonluğu kazanacak mı?",
      yesOdds: 1.85,
      noOdds: 2.10,
      category: "Spor",
      votes: 15430,
      timeLeft: "2 gün 14 saat",
      author: "SportAnalyst",
      image: "https://images.unsplash.com/photo-1516567693080-64b6d1ea0fc8?w=800&q=80",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      yesPercentage: 65
    },
    {
      id: 2,
      text: "Bitcoin 2024 sonunda 100.000$ üzerinde olacak mı?",
      title: "Bitcoin 2024 sonunda 100.000$ üzerinde olacak mı?",
      yesOdds: 2.45,
      noOdds: 1.65,
      category: "Ekonomi",
      votes: 28760,
      timeLeft: "1 gün 8 saat",
      author: "CryptoTrader",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      yesPercentage: 72
    },
    {
      id: 3,
      text: "ChatGPT-5 2024 içinde piyasaya çıkacak mı?",
      title: "ChatGPT-5 2024 içinde piyasaya çıkacak mı?",
      yesOdds: 1.95,
      noOdds: 1.95,
      category: "Teknoloji",
      votes: 9820,
      timeLeft: "5 gün 2 saat",
      author: "TechGuru",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      yesPercentage: 58
    },
    {
      id: 4,
      text: "Taylor Swift'in yeni albümü ilk haftada 1M satar mı?",
      title: "Taylor Swift'in yeni albümü ilk haftada 1M satar mı?",
      yesOdds: 1.55,
      noOdds: 2.75,
      category: "Eğlence",
      votes: 34210,
      timeLeft: "3 gün 12 saat",
      author: "MusicFan",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      yesPercentage: 43
    },
    {
      id: 5,
      text: "Netflix'in abone sayısı 2024 sonunda 300M'u geçecek mi?",
      title: "Netflix'in abone sayısı 2024 sonunda 300M'u geçecek mi?",
      yesOdds: 2.25,
      noOdds: 1.75,
      category: "Eğlence",
      votes: 18760,
      timeLeft: "4 gün 6 saat",
      author: "StreamingPro",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      yesPercentage: 67
    },
    {
      id: 6,
      text: "Fenerbahçe Şampiyonlar Ligi'ne gidecek mi?",
      title: "Fenerbahçe Şampiyonlar Ligi'ne gidecek mi?",
      yesOdds: 1.75,
      noOdds: 2.25,
      category: "Spor",
      votes: 23410,
      timeLeft: "18 saat",
      author: "FootballExpert",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      endDate: new Date(Date.now() + 18 * 60 * 60 * 1000),
      yesPercentage: 52
    },
    {
      id: 7,
      text: "Apple Vision Pro Türkiye'ye 2024'te gelecek mi?",
      title: "Apple Vision Pro Türkiye'ye 2024'te gelecek mi?",
      yesOdds: 2.10,
      noOdds: 1.85,
      category: "Teknoloji",
      votes: 14320,
      timeLeft: "2 gün 15 saat",
      author: "AppleFan",
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      yesPercentage: 61
    },
    {
      id: 8,
      text: "Dolar kuru yıl sonunda 35 TL'yi geçecek mi?",
      title: "Dolar kuru yıl sonunda 35 TL'yi geçecek mi?",
      yesOdds: 1.65,
      noOdds: 2.45,
      category: "Ekonomi",
      votes: 45320,
      timeLeft: "6 saat",
      author: "EconomistPro",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      endDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
      yesPercentage: 38
    },
    {
      id: 9,
      text: "Tesla Model Y Türkiye'de üretilecek mi?",
      title: "Tesla Model Y Türkiye'de üretilecek mi?",
      yesOdds: 2.75,
      noOdds: 1.55,
      category: "Teknoloji",
      votes: 9870,
      timeLeft: "Süresi doldu",
      author: "TeslaTR",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      endDate: new Date(Date.now() - 1000),
      yesPercentage: 74
    },
    {
      id: 10,
      text: "Survivor 2024 şampiyonu erkek yarışmacı olacak mı?",
      title: "Survivor 2024 şampiyonu erkek yarışmacı olacak mı?",
      yesOdds: 1.90,
      noOdds: 2.00,
      category: "Eğlence",
      votes: 27650,
      timeLeft: "12 saat",
      author: "RealityTVFan",
      image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80",
      endDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
      yesPercentage: 55
    }
  ];

  // Premium category colors - more sophisticated
  const categoryStyles = {
    'Spor': { bg: '#1F2937', textColor: 'text-emerald-200', accentColor: '#10B981' },
    'Ekonomi': { bg: '#1F2937', textColor: 'text-amber-200', accentColor: '#F59E0B' },
    'Teknoloji': { bg: '#1F2937', textColor: 'text-blue-200', accentColor: '#3B82F6' },
    'Eğlence': { bg: '#1F2937', textColor: 'text-purple-200', accentColor: '#8B5CF6' },
    'default': { bg: '#1F2937', textColor: 'text-gray-200', accentColor: '#6B7280' }
  };

  // Check if question is expired with safe fallback
  const isExpired = (question: Question) => {
    if (!question) return false;
    return question.timeLeft === "Süresi doldu" || (question.endDate && question.endDate < new Date());
  };

  // Get time urgency level with safe checks
  const getUrgencyLevel = (timeLeft: string) => {
    if (!timeLeft || typeof timeLeft !== 'string') return 'normal';
    if (timeLeft.includes('saat') && parseInt(timeLeft) <= 24) return 'critical';
    if (timeLeft.includes('gün') && parseInt(timeLeft) <= 2) return 'high';
    return 'normal';
  };

  // Mark hot and urgent questions with safe checks
  useEffect(() => {
    const hot = new Set<number>();
    const urgent = new Set<number>();

    allQuestions.forEach(q => {
      if (q && q.votes && q.votes > 20000) hot.add(q.id);
      if (q && q.timeLeft && getUrgencyLevel(q.timeLeft) !== 'normal') urgent.add(q.id);
    });

    setHotQuestions(hot);
    setUrgentQuestions(urgent);
  }, []);

  const handleVote = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    const question = allQuestions.find(q => q.id === questionId);
    
    // Prevent voting on expired questions
    if (question && isExpired(question)) {
      return;
    }

    // Show add to coupon animation
    setShowAddAnimation(prev => ({ ...prev, [questionId]: vote }));
    setAddedToCoupon(prev => ({ ...prev, [questionId]: vote }));
    
    // Call parent vote handler to add to coupon
    if (onVote) {
      onVote(questionId, vote, odds);
    }
    
    setExploreCount(prev => prev + 1);

    // Clear animation after delay
    setTimeout(() => {
      setShowAddAnimation(prev => ({ ...prev, [questionId]: null }));
    }, 2000);
  };

  const handleCardClick = (question: Question, event: React.MouseEvent) => {
    // Don't open detail if clicking on buttons or interactive elements
    const target = event.target as HTMLElement;
    const isButton = target.closest('button');
    const isInteractive = target.closest('[data-interactive]');
    
    if (!isButton && !isInteractive && onQuestionDetail && question) {
      onQuestionDetail(question);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F2F3F5] z-50 overflow-hidden">
      {/* Premium Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/5">
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          {/* Left - Feed Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-primary font-semibold text-xl tracking-tight">Feed</h1>
          </div>

          {/* Right - Profile & Credits */}
          <div className="flex items-center gap-3">
            {/* Credits */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#432870] to-[#B29EFD] px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.719,17.073l-6.562-6.51c-0.27-0.268-0.27-0.701,0-0.969l6.562-6.51c0.27-0.268,0.707-0.268,0.977,0c0.27,0.268,0.27,0.701,0,0.969L4.661,9.998l6.035,5.954c0.27,0.268,0.27,0.701,0,0.969C10.425,17.34,9.989,17.34,9.719,17.073z" />
              </svg>
              <span className="text-white font-semibold text-sm">{userCredits.toLocaleString()}</span>
            </div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#432870] to-[#B29EFD] p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-[#432870] font-semibold text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Container */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{ paddingTop: '100px', paddingBottom: '20px' }}
      >
        {allQuestions.map((question, index) => {
          if (!question) return null;
          
          const categoryStyle = categoryStyles[question.category as keyof typeof categoryStyles] || categoryStyles.default;
          const expired = isExpired(question);
          const urgency = getUrgencyLevel(question.timeLeft || '');
          const isHot = hotQuestions.has(question.id);
          const inCoupon = addedToCoupon[question.id];

          return (
            <div
              key={question.id}
              className={`relative w-full overflow-hidden bg-white cursor-pointer ${
                expired ? 'opacity-60' : ''
              } ${index === allQuestions.length - 1 ? '' : 'border-b border-black/5'}`}
              style={{ height: '345px' }}
              onClick={(e) => handleCardClick(question, e)}
            >
              {/* Background Image - Full Coverage */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={question.image || `https://images.unsplash.com/photo-1516567693080-64b6d1ea0fc8?w=800&q=80`}
                  alt={question.text || question.title || ''}
                  className="w-full h-full object-cover"
                />
                {/* Original gradient overlay for better text readability */}
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

              {/* Content Container - Redesigned Layout */}
              <div className="relative z-10 h-full flex flex-col justify-between p-5">
                
                {/* Top Section - Question at Top Left with Shadow */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Question Title - Top Left with Enhanced Shadow */}
                    <h2 
                      className="text-white font-bold text-2xl leading-tight mb-4"
                      style={{ 
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.6)' 
                      }}
                    >
                      {question.text || question.title || 'Soru metni mevcut değil'}
                    </h2>
                    
                    {/* Category - Below Question */}
                    <div className="inline-flex items-center gap-2">
                      <div 
                        className="rounded-full px-4 py-2 backdrop-blur-md border border-white/20"
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

                  {/* Status Badges - Top Right */}
                  <div className="flex flex-col gap-2" data-interactive="true">
                    {isHot && !expired && (
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-bold uppercase tracking-wide">HOT</span>
                      </div>
                    )}
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

                    {/* Time Left with Enhanced Styling */}
                    <div 
                      className={`backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border ${
                        expired ? 'bg-gray-600/80 border-gray-500/30' :
                        urgency === 'critical' ? 'bg-red-600/80 border-red-500/30' :
                        urgency === 'high' ? 'bg-orange-600/80 border-orange-500/30' :
                        'bg-blue-600/80 border-blue-500/30'
                      }`}
                      data-interactive="true"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white font-semibold text-sm">{question.timeLeft || 'Süre belirsiz'}</span>
                    </div>
                  </div>

                  {/* Premium Vote Buttons - More Elegant Colors */}
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
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-white font-bold text-lg">EVET</span>
                        <div className="bg-white/25 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                          <span className="text-white font-bold text-lg">{(question.yesOdds || 1.0).toFixed(2)}</span>
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
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-white font-bold text-lg">HAYIR</span>
                        <div className="bg-white/25 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                          <span className="text-white font-bold text-lg">{(question.noOdds || 1.0).toFixed(2)}</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Coupon Success State */}
                  {inCoupon && !expired && (
                    <div className="text-center" data-interactive="true">
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-5 py-3 inline-flex items-center gap-3 shadow-lg border border-indigo-400/30 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="font-bold text-sm">Kupona Eklendi</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tap Indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          );
        })}

        {/* End of Feed */}
        <div className="text-center py-8 px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#432870] rounded-full"></div>
            </div>
          </div>
          <h3 className="text-primary font-bold text-lg mb-2">Keşfin Tamamlandı</h3>
          <p className="text-muted-foreground mb-4">Kuponundaki tahminlerin sonuçlanmasını bekle</p>
          
          {exploreCount >= 3 && (
            <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold px-6 py-3 rounded-xl inline-block shadow-lg">
              {exploreCount} Tahmin Yaptın
            </div>
          )}
        </div>
      </div>

      {/* Floating Success Animation */}
      <AnimatePresence>
        {Object.entries(showAddAnimation).map(([questionId, vote]) => 
          vote && (
            <motion.div
              key={`${questionId}-${vote}`}
              className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 pointer-events-none"
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-[#4A6FA5] to-[#432870] text-white px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Kupona Eklendi</span>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}