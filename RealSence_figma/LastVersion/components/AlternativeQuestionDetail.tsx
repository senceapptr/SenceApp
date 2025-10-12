import { useState } from 'react';

interface AlternativeQuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function AlternativeQuestionDetail({ isOpen, onClose, question, onVote }: AlternativeQuestionDetailProps) {
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [showStats, setShowStats] = useState(false);

  if (!isOpen || !question) return null;

  const handleVote = (vote: 'yes' | 'no') => {
    setSelectedVote(vote);
    const odds = vote === 'yes' ? question.yesOdds : question.noOdds;
    onVote(question.id, vote, odds);
    
    // Auto close after vote
    setTimeout(() => {
      onClose();
      setSelectedVote(null);
    }, 1500);
  };

  const yesPercentage = question.yesPercentage || 65;
  const noPercentage = 100 - yesPercentage;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] p-6 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-lg rotate-45" />
              <div className="absolute top-8 left-1/3 w-8 h-8 bg-white rounded-full" />
            </div>

            <div className="relative z-10 flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                  <span className="text-white text-sm font-bold uppercase tracking-wider">{question.category}</span>
                </div>
                
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative z-10">
              <h1 className="text-white font-black text-xl leading-tight mb-4">{question.title}</h1>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-bold">{question.votes || 1247} oy</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold">2 gün kaldı</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Image */}
          {question.image && (
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={question.image} 
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Stats Section */}
          {showStats && (
            <div className="p-6 bg-gradient-to-r from-[#F2F3F5] to-white border-b border-[#432870]/10">
              <h3 className="text-[#202020] font-black text-lg mb-4">Topluluk Tahmini</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-[#202020] font-bold">Evet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                        style={{ width: `${yesPercentage}%` }}
                      />
                    </div>
                    <span className="text-green-700 font-black text-lg w-12">{yesPercentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-700 font-bold text-sm">✗</span>
                    </div>
                    <span className="text-[#202020] font-bold">Hayır</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000"
                        style={{ width: `${noPercentage}%` }}
                      />
                    </div>
                    <span className="text-red-700 font-black text-lg w-12">{noPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {question.description && (
            <div className="p-6 border-b border-[#F2F3F5]">
              <h3 className="text-[#202020] font-black text-lg mb-3">Açıklama</h3>
              <p className="text-[#202020]/80 leading-relaxed">{question.description}</p>
            </div>
          )}

          {/* Vote Buttons */}
          <div className="p-6">
            <div className="space-y-4">
              <button
                onClick={() => handleVote('yes')}
                disabled={selectedVote !== null}
                className={`w-full relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
                  selectedVote === 'yes'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-green-500/30'
                    : selectedVote === 'no'
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 border-green-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                      selectedVote === 'yes' ? 'bg-white/20' : 'bg-green-100'
                    }`}>
                      {selectedVote === 'yes' ? '🎉' : '✓'}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-xl">EVET</div>
                      <div className={`text-sm ${selectedVote === 'yes' ? 'text-white/80' : 'text-green-600'}`}>
                        Bu gerçekleşecek
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-2xl">{question.yesOdds}x</div>
                    <div className={`text-sm ${selectedVote === 'yes' ? 'text-white/80' : 'text-green-600'}`}>
                      oran
                    </div>
                  </div>
                </div>
                
                {selectedVote === 'yes' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </button>

              <button
                onClick={() => handleVote('no')}
                disabled={selectedVote !== null}
                className={`w-full relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
                  selectedVote === 'no'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-red-500/30'
                    : selectedVote === 'yes'
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 border-red-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                      selectedVote === 'no' ? 'bg-white/20' : 'bg-red-100'
                    }`}>
                      {selectedVote === 'no' ? '🎉' : '✗'}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-xl">HAYIR</div>
                      <div className={`text-sm ${selectedVote === 'no' ? 'text-white/80' : 'text-red-600'}`}>
                        Bu gerçekleşmeyecek
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-2xl">{question.noOdds}x</div>
                    <div className={`text-sm ${selectedVote === 'no' ? 'text-white/80' : 'text-red-600'}`}>
                      oran
                    </div>
                  </div>
                </div>
                
                {selectedVote === 'no' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </button>
            </div>

            {selectedVote && (
              <div className="mt-6 p-4 bg-gradient-to-r from-[#432870]/10 to-[#B29EFD]/10 rounded-2xl border border-[#432870]/20 text-center animate-in fade-in duration-500">
                <div className="text-[#432870] font-black text-lg mb-1">
                  🎉 Tahmin Kuponuna Eklendi!
                </div>
                <div className="text-[#202020]/70 text-sm">
                  Kuponunu görmek için ekranı kapatabilirsin
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="px-6 pb-6 text-center">
            <p className="text-[#202020]/50 text-xs leading-relaxed">
              Bu tahmin kesinlik taşımaz. Sadece eğlence amaçlıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}