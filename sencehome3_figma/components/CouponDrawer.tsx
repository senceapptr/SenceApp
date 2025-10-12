import { useState } from 'react';

interface CouponSelection {
  id: number;
  title: string;
  vote: 'yes' | 'no';
  odds: number;
}

interface CouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selections: CouponSelection[];
  onRemoveSelection: (id: number) => void;
  onClearAll: () => void;
}

export function CouponDrawer({ isOpen, onClose, selections, onRemoveSelection, onClearAll }: CouponDrawerProps) {
  const [betAmount, setBetAmount] = useState(10);

  if (!isOpen) return null;

  const totalOdds = selections.reduce((acc, selection) => acc * selection.odds, 1);
  const potentialWin = betAmount * totalOdds;

  const quickAmounts = [10, 20, 50, 100];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Mobile-optimized Drawer - Üst boşluk kaldırıldı */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-gradient-to-t from-white via-white to-purple-50 rounded-t-3xl shadow-2xl" style={{ height: '75vh' }}>
          <div className="flex flex-col h-full">
            {/* Header - Üst boşluk kaldırıldı */}
            <div className="flex items-center justify-between p-5 pb-4 bg-gradient-to-r from-[#6B46F0] via-purple-600 to-[#8980F5] rounded-t-3xl flex-shrink-0 relative">
              {/* Drag handle inside header */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
              
              <div className="mt-2">
                <h2 className="font-bold text-xl text-white">🎯 Kuponum</h2>
                <p className="text-white/80 text-sm">Kazanmaya hazır mısın?</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {selections.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Kupon Boş</h3>
                  <p className="text-sm">Tahmin seçmeye başla!</p>
                  <p className="text-xs mt-1 text-gray-400">En fazla 4 tahmin ekleyebilirsin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Tahminlerim ({selections.length}/4)</h3>
                    <button
                      onClick={onClearAll}
                      className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors bg-red-50 px-3 py-1 rounded-full hover:bg-red-100"
                    >
                      Temizle
                    </button>
                  </div>

                  {selections.map((selection) => (
                    <div key={selection.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-3">
                          <p className="font-semibold text-sm leading-tight text-gray-900 mb-2">{selection.title}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              selection.vote === 'yes' 
                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                                : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                            }`}>
                              {selection.vote === 'yes' ? 'Evet' : 'Hayır'}
                            </span>
                            <span className="font-bold text-[#6B46F0] bg-purple-100 px-2 py-1.5 rounded-full text-xs">
                              {selection.odds}x
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveSelection(selection.id)}
                          className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Betting Section - Kompakt tasarım */}
            {selections.length > 0 && (
              <div className="border-t border-gray-200 p-5 bg-gradient-to-t from-gray-50 to-white flex-shrink-0">
                {/* Bet Amount - Revize edildi */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    💰 Yatırım Miktarı
                  </label>
                  
                  {/* Kompakt input ve butonlar */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-semibold text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Miktar"
                      min="1"
                    />
                    
                    {/* Hızlı bahis butonları - Küçük */}
                    <div className="flex gap-1">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setBetAmount(amount)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            betAmount === amount
                              ? 'bg-gradient-to-r from-[#6B46F0] to-purple-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary - Kompakt */}
                <div className="bg-white rounded-xl p-3 space-y-2 border border-gray-200 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Toplam Oran:</span>
                    <span className="font-bold text-[#6B46F0] text-base">{totalOdds.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Yatırım:</span>
                    <span className="font-semibold text-gray-900">{betAmount} puan</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Kazanç:</span>
                      <span className="text-green-600 text-lg">{potentialWin.toFixed(0)} puan</span>
                    </div>
                  </div>
                </div>

                {/* Create Coupon Button */}
                <button className="w-full bg-gradient-to-r from-[#00AF54] via-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95">
                  🚀 Kupon Oluştur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}