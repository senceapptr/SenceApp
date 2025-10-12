import { useState, useRef, useEffect } from 'react';

interface SocialQuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function SocialQuestionDetail({ isOpen, onClose, question, onVote }: SocialQuestionDetailProps) {
  const [scrollY, setScrollY] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>('yes'); // Simulate user has voted
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollY(scrollRef.current.scrollTop);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  if (!isOpen || !question) return null;

  const comments = [
    { 
      id: 1, 
      user: '@crypto_king', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      comment: 'Lakers gerçekten iyi oynuyor bu sezon! Anthony Davis formda 🔥', 
      time: '2dk', 
      likes: 12,
      replies: 3,
      isLiked: false
    },
    { 
      id: 2, 
      user: '@spor_analisti', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      comment: 'Sakatlıklar çok etkili olacak, dikkatli olmak lazım', 
      time: '5dk', 
      likes: 8,
      replies: 1,
      isLiked: true
    },
    { 
      id: 3, 
      user: '@basketbol_expert', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4e9?w=100&h=100&fit=crop&crop=face',
      comment: 'İstatistikler playoff\'a işaret ediyor, %65 gerçekçi', 
      time: '12dk', 
      likes: 15,
      replies: 5,
      isLiked: false
    }
  ];

  const socialFeed = [
    { user: '@tahmin_ustasi', action: 'bu soruya 3.20 oranlı kupon yaptı', time: '1dk', type: 'coupon' },
    { user: '@lucky_player', action: 'bu soruyu 8 arkadaşına gönderdi', time: '3dk', type: 'share' },
    { user: '@spor_fan', action: '"Ben de oyladım" dedi', time: '7dk', type: 'vote' }
  ];

  const handleShare = (type: 'question' | 'coupon') => {
    if (type === 'question') {
      // Share question logic
      console.log('Sharing question:', question.title);
    } else {
      // Share coupon logic  
      console.log('Sharing coupon for:', question.title);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Detail Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-t-3xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border-t border-gray-700">
          
          {/* Scrollable Content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {/* Hero Image Section */}
            <div className="relative h-64">
              <img 
                src={question.image} 
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Question overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-white font-bold text-2xl leading-tight mb-3 drop-shadow-2xl">
                  {question.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {question.votes}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {question.timeLeft}
                  </span>
                </div>
              </div>
            </div>

            {/* Question Stats & User Vote */}
            <div className="p-5 bg-gradient-to-b from-gray-900 to-gray-800 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-purple-400 text-sm font-bold">Oran</p>
                    <p className="text-white font-bold text-2xl">
                      {userVote === 'yes' ? question.yesOdds : question.noOdds}x
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-cyan-400 text-sm font-bold">Sosyal Kanıt</p>
                    <p className="text-white font-bold text-lg">%{question.yesPercentage} Evet</p>
                  </div>
                </div>

                {/* User's Vote */}
                {userVote && (
                  <div className={`px-4 py-2 rounded-2xl ${
                    userVote === 'yes' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                  }`}>
                    <p className="font-bold text-sm">
                      {userVote === 'yes' ? '✓ Evet Oyladın' : '✗ Hayır Oyladın'}
                    </p>
                  </div>
                )}
              </div>

              {/* Share Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('question')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="text-lg">🔗</span>
                  Arkadaşlarına sor
                </button>
                <button
                  onClick={() => handleShare('coupon')}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="text-lg">🎯</span>
                  Kuponunu paylaş
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-5 bg-gray-800">
              <h3 className="text-white font-bold text-xl mb-4">💬 Yorumlar ({comments.length})</h3>
              
              {/* Comment Input */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ne düşünüyorsun?"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl p-3 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      rows={2}
                    />
                    <button className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-4 rounded-xl text-sm hover:shadow-lg transition-all">
                      Gönder
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700/30 rounded-2xl p-4 border border-gray-600/30">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img src={comment.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-purple-400 font-bold text-sm">{comment.user}</span>
                          <span className="text-gray-500 text-xs">{comment.time}</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed mb-3">{comment.comment}</p>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center gap-4">
                          <button className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                            comment.isLiked 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-gray-400 hover:text-red-400'
                          }`}>
                            <span className="text-sm">{comment.isLiked ? '❤️' : '🤍'}</span>
                            {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 font-medium transition-colors">
                            <span className="text-sm">💬</span>
                            {comment.replies}
                          </button>
                          <button className="text-xs text-gray-400 hover:text-purple-400 font-medium transition-colors">
                            Cevapla
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Feed Integration */}
            <div className="p-5 bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700/50">
              <h4 className="text-gray-300 font-bold text-lg mb-4">📊 Sosyal Aktivite</h4>
              <div className="space-y-3">
                {socialFeed.map((activity, index) => (
                  <div 
                    key={index}
                    className="bg-gray-700/20 backdrop-blur-sm rounded-xl p-3 border border-gray-600/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'coupon' ? 'bg-green-500' :
                        activity.type === 'share' ? 'bg-blue-500' :
                        'bg-purple-500'
                      } animate-pulse`} />
                      
                      <div className="flex-1">
                        <p className="text-gray-300 text-sm">
                          <span className="text-purple-400 font-bold">{activity.user}</span>
                          <span className="text-gray-400"> {activity.action}</span>
                        </p>
                        <p className="text-gray-500 text-xs">{activity.time}</p>
                      </div>

                      <div className="flex gap-2">
                        <button className="text-xs text-gray-500 hover:text-red-400 transition-colors">❤️</button>
                        <button className="text-xs text-gray-500 hover:text-blue-400 transition-colors">💬</button>
                        <button className="text-xs text-gray-500 hover:text-green-400 transition-colors">Ben de</button>
                        <button className="text-xs text-gray-500 hover:text-purple-400 transition-colors">Paylaş</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}