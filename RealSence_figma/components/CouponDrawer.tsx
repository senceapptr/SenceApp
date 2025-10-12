import { useState } from 'react';

interface CouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selections: any[];
  onRemoveSelection: (id: number) => void;
  onClearAll: () => void;
  isFree?: boolean;
}

export function CouponDrawer({ isOpen, onClose, selections, onRemoveSelection, onClearAll, isFree = false }: CouponDrawerProps) {
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
      
      {/* Fixed Height Coupon Drawer - Optimized to Prevent Scrolling */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl h-[80vh] flex flex-col overflow-hidden">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
          
          {/* Compact Header */}
          <div className="relative bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] px-6 py-3 flex-shrink-0">
            <button 
              onClick={onClose}
              className="absolute top-2 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-black text-white mb-1">Kupon Oluştur</h1>
              <p className="text-white/90 text-xs font-medium">
                {selections.length}/5 tahmin seçildi
              </p>
            </div>
          </div>

          {/* Selections Section - Fixed Height to Accommodate 5 Items */}
          <div className="px-6 py-2 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900">Seçimlerim</h3>
              {selections.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Temizle
                </button>
              )}
            </div>
            
            {selections.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Henüz tahmin seçmedin</h3>
                  <p className="text-gray-600 text-sm">Ana sayfadan tahminlerini seç</p>
                </div>
              </div>
            ) : (
              /* Optimized height for exactly 5 selections without scrolling */
              <div 
                className="space-y-1.5"
                style={{ height: 'calc(100% - 2rem)' }}
              >
                {selections.map((selection, index) => (
                  <div
                    key={selection.id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-2.5 border border-gray-200 hover:border-purple-200 transition-all duration-300 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-bold text-gray-900 text-xs leading-tight mb-1 truncate">
                          {selection.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                            selection.vote === 'yes' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {selection.vote === 'yes' ? 'EVET' : 'HAYIR'}
                          </span>
                          <span className="text-purple-600 font-bold text-xs">
                            {selection.odds}x
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onRemoveSelection(selection.id)}
                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors flex-shrink-0"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compact Betting Section - Only when selections exist */}
          {selections.length > 0 && (
            <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-sm">Bahis Miktarı</h3>
                
                {/* Compact Credit Input */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-center font-bold text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      placeholder="Miktar"
                    />
                  </div>
                  <span className="text-gray-600 font-medium text-sm">kredi</span>
                </div>

                {/* Compact Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`py-1.5 px-2 rounded-md font-bold text-xs transition-all duration-200 ${
                        betAmount === amount
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compact Summary Section - Fixed Height */}
          {selections.length > 0 && (
            <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-100 flex-shrink-0">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-purple-100">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-gray-600 text-xs font-medium mb-1">Toplam Oran</p>
                    <p className="text-xl font-black text-purple-600">
                      {totalOdds.toFixed(2)}x
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs font-medium mb-1">Potansiyel Kazanç</p>
                    <p className="text-xl font-black text-green-600">
                      {Math.round(potentialWin)} kredi
                    </p>
                  </div>
                </div>
                
                <button
                  disabled={selections.length === 0}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 transform ${
                    selections.length > 0
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:scale-105'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  💰 Kupon Oluştur
                </button>
              </div>
            </div>
          )}

          {/* Empty State Action */}
          {selections.length === 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold transition-all duration-300"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}