import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface QuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionDetail({ isOpen, onClose, question, onVote }: QuestionDetailProps) {
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [activeTab, setActiveTab] = useState<'comments' | 'top-bettors'>('comments');
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !question) return null;

  const handleVote = (vote: 'yes' | 'no') => {
    setSelectedVote(vote);
    const odds = vote === 'yes' ? question.yesOdds : question.noOdds;
    onVote(question.id, vote, odds);
    
    setTimeout(() => {
      onClose();
      setSelectedVote(null);
    }, 1500);
  };

  const yesPercentage = question.yesPercentage || 65;
  const noPercentage = 100 - yesPercentage;

  // Mock data for comments and top bettors
  const comments = [
    { id: 1, user: 'Ali_Kaya', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', comment: 'Bu kesinlikle gerçekleşecek! Çok güçlü sinyaller var.', time: '2 saat önce' },
    { id: 2, user: 'Zeynep_A', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95a9cef?w=32&h=32&fit=crop&crop=face', comment: 'Bence biraz riskli ama denemeye değer.', time: '4 saat önce' },
    { id: 3, user: 'Mehmet123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', comment: 'Geçmiş veriler bunu destekliyor 📈', time: '6 saat önce' }
  ];

  const topBettors = {
    yes: [
      { user: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', bet: 2500 },
      { user: 'TahminMaster', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', bet: 1800 },
      { user: 'ProTrader', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', bet: 1200 }
    ],
    no: [
      { user: 'SafePlayer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95a9cef?w=32&h=32&fit=crop&crop=face', bet: 2000 },
      { user: 'RiskAnalyst', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face', bet: 1500 },
      { user: 'MarketBear', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', bet: 900 }
    ]
  };

  // Mock question author
  const questionAuthor = {
    name: 'TahminExpert',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    verified: true,
    publishedQuestions: 142
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Header Image */}
      <div className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src={question.image || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=320&fit=crop'}
          alt=""
          className="w-full h-full object-cover"
        />
        
        {/* Header Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        
        {/* Header Controls */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-white font-bold text-lg">{question.category}</div>
          
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-16 w-8 h-8 rounded-full bg-white/20 animate-pulse" />
        <div className="absolute bottom-32 left-12 w-6 h-6 rounded-full bg-[#C9F158]/40 animate-bounce" />
        <div className="absolute top-32 left-20 w-4 h-4 rounded-full bg-[#B29EFD]/60" />
      </div>

      {/* Scrollable Content */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 flex-1 overflow-auto pb-32 max-h-[calc(100vh-320px)]">
        <div className="p-6">
          {/* Question Title & Info */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[#202020] font-black text-2xl leading-tight flex-1 mr-4">{question.title}</h1>
            <button className="text-[#202020]/50 hover:text-[#432870] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          {/* Vote Count & Time */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-[#202020]/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-bold">{question.votes || 1247} oy</span>
            </div>
            <div className="flex items-center gap-2 text-[#202020]/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">2 gün kaldı</span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1494790108755-2616b95a9cef?w=32&h=32&fit=crop&crop=face"
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>
            <span className="text-[#202020]/70 font-bold text-sm">+{(question.votes || 1247) - 3} katılımcı</span>
          </div>

          {/* Odds Chart Placeholder */}
          <div className="bg-gradient-to-r from-[#F2F3F5] to-white rounded-2xl p-4 mb-4 border border-[#F2F3F5]">
            <div className="text-center mb-3">
              <h3 className="text-[#202020] font-bold text-sm mb-1">Oran Değişim Grafiği</h3>
              <p className="text-[#202020]/60 text-xs">Gerçek zamanlı oran hareketleri</p>
            </div>
            <div className="h-16 flex items-center justify-center border-2 border-dashed border-[#432870]/20 rounded-xl bg-[#432870]/5">
              <div className="text-center">
                <svg className="w-6 h-6 text-[#432870]/40 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-[#432870]/60 text-xs font-bold">Yakında</p>
              </div>
            </div>
          </div>

          {/* Minimal Percentage Bars */}
          <div className="bg-gradient-to-r from-white to-[#F2F3F5] rounded-2xl p-4 mb-6 border border-[#F2F3F5]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#34C759] font-black text-lg">{yesPercentage}%</span>
                <span className="text-[#202020]/70 text-sm">Evet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#202020]/70 text-sm">Hayır</span>
                <span className="text-[#FF3B30] font-black text-lg">{noPercentage}%</span>
              </div>
            </div>
            
            {/* Single Combined Bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#34C759] rounded-full transition-all duration-1000 absolute left-0"
                style={{ width: `${yesPercentage}%` }}
              />
              <div 
                className="h-full bg-[#FF3B30] rounded-full transition-all duration-1000 absolute right-0"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>

          {/* Success Message */}
          {selectedVote && (
            <div className="p-4 bg-[#432870]/10 rounded-2xl text-center animate-in fade-in duration-500 mb-6">
              <div className="text-[#432870] font-black text-lg mb-1">
                🎉 Tahmin Kuponuna Eklendi!
              </div>
              <div className="text-[#202020]/70 text-sm">
                Kuponunu görmek için ekranı kapatabilirsin
              </div>
            </div>
          )}

          {/* Description */}
          {question.description && (
            <div className="mb-6">
              <h3 className="text-[#202020] font-black text-lg mb-3">Açıklama</h3>
              <p className="text-[#202020]/80 leading-relaxed mb-4">{question.description}</p>
              
              {/* Question Author - After Description */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F2F3F5] to-white rounded-2xl border border-[#F2F3F5]">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={questionAuthor.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full border-2 border-[#432870]/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#202020] font-bold">{questionAuthor.name}</span>
                      {questionAuthor.verified && (
                        <svg className="w-4 h-4 text-[#432870]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-[#432870] text-sm font-bold">
                      {questionAuthor.publishedQuestions} soru yayınladı
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all">
                  Takip Et
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modern Tabs */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-t border-[#F2F3F5] z-10">
          <div className="px-6 py-4">
            <div className="flex bg-[#F2F3F5] rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'comments'
                    ? 'bg-white text-[#432870] shadow-md'
                    : 'text-[#202020]/70 hover:text-[#432870]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Yorumlar</span>
                  <div className="bg-[#432870]/20 rounded-full px-2 py-0.5 text-xs">
                    {comments.length}
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('top-bettors')}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'top-bettors'
                    ? 'bg-white text-[#432870] shadow-md'
                    : 'text-[#202020]/70 hover:text-[#432870]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>En Çok Bahis Yapanlar</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-8">
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Comment Input - Minimal */}
              <div className="bg-[#F2F3F5] rounded-2xl p-1 border border-transparent focus-within:border-[#432870]/30 transition-all duration-300">
                <div className="flex items-center gap-3 p-3">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt=""
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Yorum yaz..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-transparent text-[#202020] placeholder-[#202020]/60 focus:outline-none text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && commentText.trim()) {
                        // Add comment logic here
                        setCommentText('');
                      }
                    }}
                  />
                  {commentText.trim() && (
                    <button 
                      onClick={() => {
                        if (commentText.trim()) {
                          // Add comment logic here
                          setCommentText('');
                        }
                      }}
                      className="bg-[#432870] hover:bg-[#5A3A8B] text-white p-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Comments List */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gradient-to-r from-white to-[#F2F3F5]/50 rounded-2xl border border-[#F2F3F5] hover:shadow-md transition-all duration-300">
                  <ImageWithFallback
                    src={comment.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#202020] font-bold text-sm">{comment.user}</span>
                      <span className="text-[#202020]/50 text-xs">{comment.time}</span>
                    </div>
                    <p className="text-[#202020]/80 text-sm leading-relaxed mb-2">{comment.comment}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4">
                      <button className="text-[#432870] text-xs font-bold hover:text-[#5A3A8B] transition-colors flex items-center gap-1">
                        <span>👍</span>
                        <span>Beğen</span>
                      </button>
                      <button className="text-[#202020]/50 text-xs font-bold hover:text-[#432870] transition-colors">
                        Yanıtla
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'top-bettors' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="w-8 h-8 bg-[#34C759] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h4 className="text-[#34C759] font-black text-lg">EVET Tarafı</h4>
                </div>
                <div className="space-y-3">
                  {topBettors.yes.map((bettor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ImageWithFallback
                            src={bettor.avatar}
                            alt=""
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#34C759] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#202020] font-bold">{bettor.user}</span>
                          <div className="text-[#34C759] text-xs">EVET yatırımcısı</div>
                        </div>
                      </div>
                      <div className="text-[#34C759] font-black text-lg">{bettor.bet.toLocaleString('tr-TR')} 💎</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                  <div className="w-8 h-8 bg-[#FF3B30] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✗</span>
                  </div>
                  <h4 className="text-[#FF3B30] font-black text-lg">HAYIR Tarafı</h4>
                </div>
                <div className="space-y-3">
                  {topBettors.no.map((bettor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ImageWithFallback
                            src={bettor.avatar}
                            alt=""
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF3B30] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#202020] font-bold">{bettor.user}</span>
                          <div className="text-[#FF3B30] text-xs">HAYIR yatırımcısı</div>
                        </div>
                      </div>
                      <div className="text-[#FF3B30] font-black text-lg">{bettor.bet.toLocaleString('tr-TR')} 💎</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Vote Buttons - Standardized Colors */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F2F3F5] p-4 z-50">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleVote('yes')}
            disabled={selectedVote !== null}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedVote === 'yes'
                ? 'bg-[#34C759] text-white shadow-lg'
                : selectedVote === 'no'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#34C759]/10 hover:bg-[#34C759]/20 text-[#34C759] border-2 border-[#34C759]/20'
            }`}
          >
            <div className="text-center">
              <div className="font-black text-lg mb-1">EVET</div>
              <div className="font-black text-lg">{question.yesOdds}x</div>
            </div>
          </button>

          <button
            onClick={() => handleVote('no')}
            disabled={selectedVote !== null}
            className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              selectedVote === 'no'
                ? 'bg-[#FF3B30] text-white shadow-lg'
                : selectedVote === 'yes'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] border-2 border-[#FF3B30]/20'
            }`}
          >
            <div className="text-center">
              <div className="font-black text-lg mb-1">HAYIR</div>
              <div className="font-black text-lg">{question.noOdds}x</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}