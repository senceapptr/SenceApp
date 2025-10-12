import { useState } from 'react';

interface CouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selections: any[];
  onRemoveSelection: (id: number) => void;
  onClearAll: () => void;
  isFree?: boolean;
}

export function CouponDrawer({ 
  isOpen, 
  onClose, 
  selections, 
  onRemoveSelection, 
  onClearAll,
  isFree = false
}: CouponDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOdds = selections.reduce((acc, selection) => acc * selection.odds, 1);
  const potentialWin = totalOdds * 10; // Standard calculation without free kupon logic

  const handleSubmit = async () => {
    if (selections.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    alert('Kupon başarıyla oluşturuldu! 🎉');
    
    setIsSubmitting(false);
    onClearAll();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-2">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-[#F2F3F5] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#F2F3F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div>
              <h2 className="text-[#202020] font-black text-xl">Kuponum</h2>
              <p className="text-[#432870] text-sm font-bold">
                {selections.length}/5 tahmin
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F3F5] hover:bg-gray-200 flex items-center justify-center text-[#202020] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selections.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-[#F2F3F5] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-[#202020] font-black text-lg mb-2">Kuponun Boş</h3>
            <p className="text-[#202020]/70 text-sm">
              Tahmin yapmak için sorulara evet veya hayır diyerek kuponunu oluştur.
            </p>
          </div>
        ) : (
          <>
            {/* Selections List - Smaller Cards with Fixed Height - Removed % prediction text */}
            <div className="p-6 space-y-3 overflow-y-auto" style={{ maxHeight: '40vh' }}>
              {selections.map((selection) => (
                <div 
                  key={selection.id} 
                  className="bg-gradient-to-r from-[#F2F3F5] to-white rounded-xl p-3 border border-[#432870]/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#202020] font-bold text-xs mb-2 leading-tight line-clamp-2">
                        {selection.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          selection.vote === 'yes' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-50 text-green-700 border border-green-200' 
                            : 'bg-gradient-to-r from-red-100 to-rose-50 text-red-700 border border-red-200'
                        }`}>
                          {selection.vote === 'yes' ? 'EVET' : 'HAYIR'}
                        </span>
                        <span className="text-[#432870] font-black text-sm">
                          {selection.odds}x
                        </span>
                        {selection.boosted && (
                          <span className="bg-gradient-to-r from-[#B29EFD] to-[#432870] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            BOOST
                          </span>
                        )}
                      </div>
                      {/* Removed the percentage prediction line */}
                    </div>
                    
                    <button
                      onClick={() => onRemoveSelection(selection.id)}
                      className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors flex-shrink-0"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary - Fixed at Bottom */}
            <div className="p-6 pt-4 bg-gradient-to-b from-white to-[#F2F3F5] border-t border-[#432870]/10">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#432870]/20 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#202020] font-bold">Toplam Oran</span>
                  <span className="text-[#432870] font-black text-xl">
                    {totalOdds.toFixed(2)}x
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#202020] font-bold">Bahis Tutarı</span>
                  <span className="text-[#B29EFD] font-black text-lg">10 kredi</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#F2F3F5]">
                  <span className="text-[#202020] font-black">Potansiyel Kazanç</span>
                  <span className="text-[#432870] font-black text-xl">
                    {Math.round(potentialWin)} kredi
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClearAll}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-[#202020] font-bold py-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Temizle
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || selections.length === 0}
                  className={`flex-2 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#A688F7] text-white hover:shadow-2xl'
                  }`}
                  style={!isSubmitting ? { boxShadow: '0 15px 30px rgba(67, 40, 112, 0.4)' } : {}}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      Oluşturuluyor...
                    </div>
                  ) : (
                    'Kupon Oluştur'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}