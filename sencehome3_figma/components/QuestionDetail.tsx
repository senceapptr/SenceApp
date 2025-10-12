import { useState, useEffect, useRef } from 'react';

interface QuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionDetail({ isOpen, onClose, question, onVote }: QuestionDetailProps) {
  const [scrollY, setScrollY] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
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
    { id: 1, user: '@spor_fan', comment: 'Lakers gerçekten iyi oynuyor bu sezon', time: '2s', likes: 12 },
    { id: 2, user: '@basketbol_expert', comment: 'Sakatlıklar çok etkili olacak', time: '5dk', likes: 8 },
    { id: 3, user: '@nba_analiz', comment: 'İstatistikler playoff\'a işaret ediyor', time: '12dk', likes: 15 }
  ];

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Detail Drawer - Tam ekran */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Sticky Header */}
          {scrollY > 100 && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 p-4 rounded-t-3xl animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-lg text-gray-900 truncate flex-1 mr-4">
                  {question.title}
                </h1>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {/* Hero Image Section - Tam ekran */}
            <div className="relative h-72">
              <img 
                src={question.image} 
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${question.gradient} opacity-30`} />
              
              {/* Close button - Sadece scroll olmadığında */}
              {scrollY <= 100 && (
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Title overlay - Sadece scroll olmadığında */}
              {scrollY <= 100 && (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h1 className="font-bold text-2xl leading-tight text-white mb-2 drop-shadow-xl">
                    {question.title}
                  </h1>
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {question.votes}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {question.timeLeft}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="bg-white">
              <div className="p-5">
                {/* Kompakt Voting Section */}
                <div className="mb-4">
                  <div className="flex rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <button
                      onClick={() => {
                        onVote(question.id, 'yes', question.yesOdds);
                        onClose();
                      }}
                      className="bg-gradient-to-r from-[#00AF54] via-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 transition-all duration-300 flex-1 transform active:scale-95"
                      style={{ flexBasis: `${question.yesPercentage}%` }}
                    >
                      <div className="text-center">
                        <div className="text-lg">✓ Evet</div>
                        <div className="text-xs opacity-90">{question.yesOdds}x • {question.yesPercentage}%</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        onVote(question.id, 'no', question.noOdds);
                        onClose();
                      }}
                      className="bg-gradient-to-r from-[#FF4E4E] via-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 transition-all duration-300 flex-1 transform active:scale-95"
                      style={{ flexBasis: `${100 - question.yesPercentage}%` }}
                    >
                      <div className="text-center">
                        <div className="text-lg">✗ Hayır</div>
                        <div className="text-xs opacity-90">{question.noOdds}x • {100 - question.yesPercentage}%</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Kompakt Chart */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">📊 Trend</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 text-center border border-purple-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">📈</span>
                    </div>
                    <p className="text-sm text-gray-600">Grafik yakında eklenecek!</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">💭 Açıklama</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {question.description}
                    </p>
                  </div>
                </div>

                {/* Comments */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">💬 Yorumlar ({comments.length})</h3>
                    <button 
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      className="bg-gradient-to-r from-[#6B46F0] to-purple-600 text-white font-semibold px-4 py-2 rounded-full text-sm hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      Yorum Yaz
                    </button>
                  </div>

                  {/* Comment Form */}
                  {showCommentForm && (
                    <div className="bg-purple-50 rounded-2xl p-4 mb-4 border border-purple-200 animate-in slide-in-from-top-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Yorumunuzu yazın..."
                        className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleCommentSubmit}
                          className="bg-gradient-to-r from-[#6B46F0] to-purple-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:shadow-md transition-all"
                        >
                          Gönder
                        </button>
                        <button
                          onClick={() => setShowCommentForm(false)}
                          className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-all"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {comment.user.charAt(1).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-[#6B46F0] text-sm">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.comment}</p>
                            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                              {comment.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}