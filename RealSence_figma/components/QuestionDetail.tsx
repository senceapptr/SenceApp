import { useState, useRef, useEffect } from 'react';
import { CircularProgress } from './CircularProgress';

interface QuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

interface Comment {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface TopVoter {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  vote: 'yes' | 'no';
  amount: number;
  odds: number;
  potentialWin: number;
}

export function QuestionDetail({ isOpen, onClose, question, onVote }: QuestionDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'comments' | 'voters'>('info');
  const [newComment, setNewComment] = useState('');
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        setIsTabsSticky(scrollTop > 100);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!isOpen || !question) return null;

  const comments: Comment[] = [
    {
      id: '1',
      username: 'crypto_king',
      displayName: 'Ahmet K.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      content: 'Bu kesinlikle olacak! Geçen hafta ki trendlere bakın 📈',
      timestamp: '5 dakika önce',
      likes: 12,
      isLiked: false
    },
    {
      id: '2',
      username: 'prediction_master',
      displayName: 'Zeynep D.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face',
      content: 'Çok emin değilim, pazar koşulları değişken görünüyor',
      timestamp: '12 dakika önce',
      likes: 8,
      isLiked: true
    },
    {
      id: '3',
      username: 'future_seer',
      displayName: 'Elif Y.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      content: 'Geçmiş verilere göre şans %65 civarında 🎯',
      timestamp: '1 saat önce',
      likes: 15,
      isLiked: false
    },
    {
      id: '4',
      username: 'market_wizard',
      displayName: 'Can Ö.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      content: 'Son gelişmeleri takip eden herkes için mantıklı seçim',
      timestamp: '2 saat önce',
      likes: 6,
      isLiked: false
    },
    {
      id: '5',
      username: 'trend_hunter',
      displayName: 'Deniz K.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      content: 'Risk yönetimi açısından dengeli bir tercih olabilir',
      timestamp: '3 saat önce',
      likes: 9,
      isLiked: true
    }
  ];

  const topVoters: TopVoter[] = [
    // Top YES voters
    {
      id: '1',
      username: 'crypto_whale',
      displayName: 'Kripto Balina',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      vote: 'yes',
      amount: 5000,
      odds: 2.1,
      potentialWin: 10500
    },
    {
      id: '2',
      username: 'big_better',
      displayName: 'Büyük Bahisçi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      vote: 'yes',
      amount: 3500,
      odds: 2.1,
      potentialWin: 7350
    },
    {
      id: '3',
      username: 'prediction_pro',
      displayName: 'Tahmin Pro',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face',
      vote: 'yes',
      amount: 2800,
      odds: 2.1,
      potentialWin: 5880
    },
    {
      id: '4',
      username: 'smart_investor',
      displayName: 'Akıllı Yatırımcı',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      vote: 'yes',
      amount: 2200,
      odds: 2.1,
      potentialWin: 4620
    },
    {
      id: '5',
      username: 'trend_follower',
      displayName: 'Trend Takipçisi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      vote: 'yes',
      amount: 1800,
      odds: 2.1,
      potentialWin: 3780
    },
    // Top NO voters
    {
      id: '6',
      username: 'bear_market',
      displayName: 'Ayı Piyasa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      vote: 'no',
      amount: 4200,
      odds: 1.8,
      potentialWin: 7560
    },
    {
      id: '7',
      username: 'contrarian',
      displayName: 'Karşı Görüş',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      vote: 'no',
      amount: 3100,
      odds: 1.8,
      potentialWin: 5580
    },
    {
      id: '8',
      username: 'skeptic_trader',
      displayName: 'Şüpheci Tüccar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      vote: 'no',
      amount: 2600,
      odds: 1.8,
      potentialWin: 4680
    },
    {
      id: '9',
      username: 'risk_manager',
      displayName: 'Risk Yöneticisi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      vote: 'no',
      amount: 2000,
      odds: 1.8,
      potentialWin: 3600
    },
    {
      id: '10',
      username: 'cautious_better',
      displayName: 'Temkinli Bahisçi',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face',
      vote: 'no',
      amount: 1500,
      odds: 1.8,
      potentialWin: 2700
    }
  ];

  const handleProfileClick = (username: string) => {
    console.log('Navigate to profile:', username);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      console.log('Submit comment:', newComment);
      setNewComment('');
    }
  };

  const yesVoters = topVoters.filter(v => v.vote === 'yes').slice(0, 10);
  const noVoters = topVoters.filter(v => v.vote === 'no').slice(0, 10);

  // Helper function to get subtle voter card styling based on ranking
  const getVoterCardStyling = (index: number, vote: 'yes' | 'no') => {
    const isTop3 = index < 3;
    
    if (vote === 'yes') {
      return {
        containerClass: isTop3 
          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
          : 'bg-gray-50 border-gray-200',
        rankClass: isTop3 
          ? 'bg-emerald-500 text-white' 
          : 'bg-gray-400 text-white',
        textClass: isTop3 
          ? 'text-emerald-900' 
          : 'text-gray-700',
        amountClass: isTop3 
          ? 'text-emerald-800 font-bold' 
          : 'text-gray-600'
      };
    } else {
      return {
        containerClass: isTop3 
          ? 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-200' 
          : 'bg-gray-50 border-gray-200',
        rankClass: isTop3 
          ? 'bg-rose-500 text-white' 
          : 'bg-gray-400 text-white',
        textClass: isTop3 
          ? 'text-rose-900' 
          : 'text-gray-700',
        amountClass: isTop3 
          ? 'text-rose-800 font-bold' 
          : 'text-gray-600'
      };
    }
  };

  return (
    <>
      {/* Darkened Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Center Modal with Apple-style Design */}
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header with Question Image - Enhanced with Black Gradient */}
          <div className="relative h-56 flex-shrink-0">
            <img 
              src={question.image} 
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Enhanced gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 border border-white/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Circular Progress */}
            <div className="absolute top-4 left-4">
              <CircularProgress 
                percentage={question.yesPercentage}
                majorityVote={question.yesPercentage > 50 ? 'yes' : 'no'}
                size={50}
                strokeWidth={4}
              />
            </div>

            {/* Question Title Overlay with Enhanced Black Gradient Background */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Additional black gradient specifically for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />
              <div className="relative p-4">
                <h2 className="text-white font-black text-lg leading-tight" style={{ 
                  textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.6)',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))'
                }}>
                  {question.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Stats Row - Muted Colors */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-black text-gray-900">{question.votes}</p>
                  <p className="text-xs text-gray-600 font-medium">Toplam Oy</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-gray-700">{question.timeLeft}</p>
                  <p className="text-xs text-gray-600 font-medium">Kalan Süre</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-gray-700">{question.category}</p>
                  <p className="text-xs text-gray-600 font-medium">Kategori</p>
                </div>
              </div>
            </div>

            {/* Sticky Tabs */}
            <div className={`px-4 py-2 bg-white border-b border-gray-100 ${isTabsSticky ? 'sticky top-0 z-10 shadow-sm' : ''}`}>
              <div className="bg-gray-100 rounded-xl p-1 flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all duration-200 ${
                    activeTab === 'info'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📊 Detaylar
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all duration-200 ${
                    activeTab === 'comments'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  💬 Yorumlar ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab('voters')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all duration-200 ${
                    activeTab === 'voters'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🏆 En Yüksek
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className={activeTab === 'comments' ? 'pb-16' : 'pb-4'}>
              {activeTab === 'info' ? (
                <div className="p-4 space-y-4">
                  {/* Description */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Açıklama</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {question.description}
                    </p>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">İstatistikler</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 text-sm">Evet Oyu</span>
                        <span className="font-bold text-green-600">{question.yesPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${question.yesPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Hayır Oyu</span>
                        <span className="font-bold text-red-600">{100 - question.yesPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for future graph */}
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm italic">📈 Grafik eklenecek</p>
                  </div>
                </div>
              ) : activeTab === 'comments' ? (
                <div className="flex flex-col h-full">
                  {/* Comments List - No fixed comment input here */}
                  <div className="p-4 space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <button
                          onClick={() => handleProfileClick(comment.username)}
                          className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
                        >
                          <img 
                            src={comment.avatar} 
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-gray-200"
                          />
                        </button>
                        
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-2xl px-3 py-2">
                            <button
                              onClick={() => handleProfileClick(comment.username)}
                              className="font-bold text-gray-900 text-xs hover:text-purple-600 transition-colors"
                            >
                              {comment.displayName}
                            </button>
                            <p className="text-gray-700 text-xs mt-1">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 px-3">
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                              <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Voters Tab - Premium Subtle Design */
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* YES Voters */}
                    <div>
                      <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1">
                        <span className="text-emerald-600">✅</span>
                        <span>EVET</span>
                      </h3>
                      <div className="space-y-2">
                        {yesVoters.map((voter, index) => {
                          const styling = getVoterCardStyling(index, 'yes');
                          return (
                            <div
                              key={voter.id}
                              className={`${styling.containerClass} border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all duration-200`}
                              onClick={() => handleProfileClick(voter.username)}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-5 h-5 ${styling.rankClass} rounded-full flex items-center justify-center text-xs font-bold`}>
                                  {index + 1}
                                </div>
                                <img 
                                  src={voter.avatar} 
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`${styling.textClass} text-xs font-medium truncate`}>{voter.displayName}</p>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className={`${styling.amountClass} text-sm`}>{voter.amount.toLocaleString()} ₺</p>
                                <p className="text-gray-500 text-xs">{voter.odds}x</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* NO Voters */}
                    <div>
                      <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1">
                        <span className="text-rose-600">❌</span>
                        <span>HAYIR</span>
                      </h3>
                      <div className="space-y-2">
                        {noVoters.map((voter, index) => {
                          const styling = getVoterCardStyling(index, 'no');
                          return (
                            <div
                              key={voter.id}
                              className={`${styling.containerClass} border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all duration-200`}
                              onClick={() => handleProfileClick(voter.username)}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-5 h-5 ${styling.rankClass} rounded-full flex items-center justify-center text-xs font-bold`}>
                                  {index + 1}
                                </div>
                                <img 
                                  src={voter.avatar} 
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`${styling.textClass} text-xs font-medium truncate`}>{voter.displayName}</p>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className={`${styling.amountClass} text-sm`}>{voter.amount.toLocaleString()} ₺</p>
                                <p className="text-gray-500 text-xs">{voter.odds}x</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Comment Input Bar - Only visible on Comments tab */}
          {activeTab === 'comments' && (
            <div className="absolute bottom-20 left-0 right-0 p-3 bg-white border-t border-gray-100 shadow-lg">
              <div className="flex gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" 
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="w-8 h-8 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voting Buttons - Fixed at bottom */}
          <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={() => onVote(question.id, 'no', question.noOdds)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">HAYIR</span>
                  <span className="text-lg font-black">{question.noOdds}x</span>
                </div>
              </button>
              
              <button
                onClick={() => onVote(question.id, 'yes', question.yesOdds)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm">EVET</span>
                  <span className="text-lg font-black">{question.yesOdds}x</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}