import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MyBetsPageProps {
  onQuestionDetail: (question: any) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  onNavigateToAlternativeCoupons?: () => void;
}

interface Prediction {
  id: number;
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  result?: 'won' | 'lost' | 'pending';
  category: string;
}

interface Coupon {
  id: number;
  predictions: Prediction[];
  totalOdds: number;
  potentialEarnings: number;
  betAmount: number;
  status: 'active' | 'won' | 'lost' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
}

export function MyBetsPage({ onQuestionDetail, onVote, onNavigateToAlternativeCoupons }: MyBetsPageProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'live' | 'won' | 'lost'>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);

  // User stats
  const userStats = {
    totalCoupons: 47,
    wonCredits: 12850,
    lostCredits: 3240,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face",
    username: "mustafa_92"
  };

  // Mock data with bet amounts
  const mockCoupons: Coupon[] = [
    {
      id: 1,
      predictions: [
        { id: 1, question: "Bitcoin bu yıl 100.000 doları aşacak mı?", choice: 'yes', odds: 2.4, result: 'pending', category: 'kripto' },
        { id: 2, question: "ChatGPT-5 2024'te çıkacak mı?", choice: 'yes', odds: 1.8, result: 'pending', category: 'teknoloji' },
        { id: 3, question: "Türkiye Milli Takımı Avrupa Şampiyonası'nda finale kalacak mı?", choice: 'no', odds: 3.2, result: 'pending', category: 'spor' },
        { id: 4, question: "Netflix abonelik fiyatları %50 artacak mı?", choice: 'yes', odds: 2.1, result: 'pending', category: 'teknoloji' },
        { id: 5, question: "İstanbul'da emlak fiyatları bu yıl %30 daha artacak mı?", choice: 'no', odds: 1.9, result: 'pending', category: 'finans' }
      ],
      totalOdds: 13.82,
      potentialEarnings: 6910,
      betAmount: 500,
      status: 'active',
      createdAt: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 86400000 * 7)
    },
    {
      id: 2,
      predictions: [
        { id: 6, question: "Apple Vision Pro Türkiye'ye bu yıl gelecek mi?", choice: 'yes', odds: 1.9, result: 'won', category: 'teknoloji' },
        { id: 7, question: "Netflix abonelik fiyatları %50 artacak mı?", choice: 'yes', odds: 2.2, result: 'won', category: 'teknoloji' }
      ],
      totalOdds: 4.18,
      potentialEarnings: 2090,
      betAmount: 500,
      status: 'won',
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      id: 3,
      predictions: [
        { id: 8, question: "Tesla Model Y fiyatı düşecek mi?", choice: 'yes', odds: 1.5, result: 'lost', category: 'finans' },
        { id: 9, question: "Instagram Reels özelliği kaldırılacak mı?", choice: 'yes', odds: 4.2, result: 'lost', category: 'sosyal-medya' }
      ],
      totalOdds: 6.3,
      potentialEarnings: 3150,
      betAmount: 500,
      status: 'lost',
      createdAt: new Date(Date.now() - 86400000 * 5),
    }
  ];

  // Filter coupons based on selected tab
  const getFilteredCoupons = () => {
    switch (selectedTab) {
      case 'live':
        return mockCoupons.filter(coupon => coupon.status === 'active');
      case 'won':
        return mockCoupons.filter(coupon => coupon.status === 'won');
      case 'lost':
        return mockCoupons.filter(coupon => coupon.status === 'lost');
      default:
        return mockCoupons;
    }
  };

  const displayedCoupons = getFilteredCoupons();

  const formatTimeLeft = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} gün ${hours} saat`;
    return `${hours} saat`;
  };

  // Stats Box Component - Updated with darker, richer colors
  const StatsBox = ({ title, value, gradient }: { 
    title: string, 
    value: string | number, 
    gradient: string
  }) => {
    return (
      <div className={`flex-1 p-4 rounded-2xl ${gradient} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full -ml-6 -mb-6" />
        
        <div className="relative z-10">
          <div className="text-xs opacity-90 font-semibold mb-2">
            {title}
          </div>
          <div className="text-2xl font-black">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
      </div>
    );
  };

  const CouponCard = ({ coupon, index }: { coupon: Coupon, index: number }) => {
    // Show max 3 predictions
    const visiblePredictions = coupon.predictions.slice(0, 3);
    const remainingCount = coupon.predictions.length - 3;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedCoupon(coupon);
          setShowCouponDetail(true);
        }}
        className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 mb-6 border-2 ${
          coupon.status === 'active' ? 
            'bg-gradient-to-br from-[#432870]/5 via-[#B29EFD]/5 to-[#432870]/10 border-[#432870]/30 shadow-xl' :
          coupon.status === 'won' ? 
            'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300 shadow-lg' :
            'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 border-red-300 shadow-lg'
        }`}
      >
        {/* Header - Simplified */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${
              coupon.status === 'active' ? 'bg-[#432870] animate-pulse' :
              coupon.status === 'won' ? 'bg-green-500' : 
              'bg-red-500'
            }`} />
            <span className="font-bold text-[#202020]">
              Kupon #{coupon.id}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {coupon.status === 'active' && coupon.expiresAt && (
              <span className="text-xs bg-[#432870]/10 text-[#432870] px-3 py-1 rounded-full font-bold border border-[#432870]/20">
                ⏰ {formatTimeLeft(coupon.expiresAt)}
              </span>
            )}
            
            {coupon.status === 'won' && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold border border-green-200">
                🎉 Kazandı
              </span>
            )}
            
            {coupon.status === 'lost' && (
              <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold border border-red-200">
                😔 Kaybetti
              </span>
            )}
          </div>
        </div>

        {/* Predictions Preview - Max 3 */}
        <div className="mb-4">
          <div className="space-y-3">
            {visiblePredictions.map((prediction) => (
              <div
                key={prediction.id}
                className={`flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 border ${
                  prediction.result === 'won' ? 'border-green-200 bg-green-50/50' :
                  prediction.result === 'lost' ? 'border-red-200 bg-red-50/50' :
                  'border-[#432870]/20'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#202020] truncate text-sm">
                    {prediction.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      prediction.choice === 'yes' ? 'bg-green-100 text-green-700 border border-green-200' : 
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                    </span>
                    <span className="text-xs text-[#202020]/60 capitalize font-medium">
                      {prediction.category}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <span className="font-black text-[#432870]">{prediction.odds}x</span>
                  {prediction.result && (
                    <div className={`text-xs mt-1 ${
                      prediction.result === 'won' ? 'text-green-600' :
                      prediction.result === 'lost' ? 'text-red-600' : 'text-[#432870]'
                    }`}>
                      {prediction.result === 'won' ? '✅' : prediction.result === 'lost' ? '❌' : '⏳'}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {remainingCount > 0 && (
              <div className="text-center py-3 bg-gradient-to-r from-[#432870]/10 to-[#B29EFD]/10 rounded-xl border border-[#432870]/20">
                <span className="font-bold text-[#432870]">
                  +{remainingCount} tahmin daha
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/50">
          <div>
            <p className="text-xs text-[#202020]/60 font-medium">Potansiyel Kazanç</p>
            <p className="font-black text-[#202020] text-lg">₺{coupon.potentialEarnings.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#202020]/60 font-medium">Toplam Oran</p>
            <p className="text-2xl font-black text-[#432870]">{coupon.totalOdds.toFixed(2)}x</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyState = ({ type }: { type: 'all' | 'live' | 'won' | 'lost' }) => {
    const getEmptyStateContent = () => {
      switch(type) {
        case 'live':
          return {
            emoji: '🔴',
            title: 'Aktif kuponun yok',
            description: 'Şu anda canlı takip ettiğin kuponun bulunmuyor.'
          };
        case 'won':
          return {
            emoji: '🏆',
            title: 'Henüz kazandığın kupon yok',
            description: 'İlk kazancını elde ettiğinde burada görünecek.'
          };
        case 'lost':
          return {
            emoji: '😔',
            title: 'Kaybettiğin kupon yok',
            description: 'Bu güzel bir şey! Devam et.'
          };
        default:
          return {
            emoji: '📊',
            title: 'Henüz kuponun yok',
            description: 'İlk kuponunu oluştur ve heyecanı yaşa!'
          };
      }
    };

    const content = getEmptyStateContent();

    return (
      <div className="text-center py-20 px-6">
        <div className="text-6xl mb-4">
          {content.emoji}
        </div>
        <h3 className="text-[#202020] font-bold text-xl mb-2">
          {content.title}
        </h3>
        <p className="text-[#202020]/70 mb-6">
          {content.description}
        </p>
        <button className="bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#5A3A8B] hover:to-[#C9AFFE]">
          Yeni Kupon Oluştur
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#F2F3F5] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-black text-3xl text-[#202020]">
            Kuponlarım
          </h1>
          
          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-[#432870]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Boxes - Updated with darker, richer colors */}
        <div className="flex gap-4 mb-6">
          <StatsBox 
            title="Toplam Kupon" 
            value={userStats.totalCoupons} 
            gradient="bg-gradient-to-br from-[#432870] to-[#6B4A9D]"
          />
          <StatsBox 
            title="Kazanılan Kredi" 
            value={userStats.wonCredits} 
            gradient="bg-gradient-to-br from-[#16a34a] to-[#15803d]"
          />
          <StatsBox 
            title="Kaybedilen Kredi" 
            value={userStats.lostCredits} 
            gradient="bg-gradient-to-br from-[#dc2626] to-[#b91c1c]"
          />
        </div>
      </div>

      {/* Tabs - Updated with new categories */}
      <div className="px-5 mb-6">
        <div className="bg-[#F2F3F5] rounded-2xl p-1 flex border-2 border-white">
          {[
            { id: 'all', name: 'Tümü', count: mockCoupons.length },
            { id: 'live', name: 'Canlı', count: mockCoupons.filter(c => c.status === 'active').length },
            { id: 'won', name: 'Kazanan', count: mockCoupons.filter(c => c.status === 'won').length },
            { id: 'lost', name: 'Kaybeden', count: mockCoupons.filter(c => c.status === 'lost').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-white text-[#432870] shadow-md font-bold'
                  : 'text-[#202020]/70 hover:text-[#202020]'
              }`}
            >
              <span className="text-sm">{tab.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                selectedTab === tab.id ? 'bg-[#432870]/10 text-[#432870]' : 'bg-gray-200 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        {displayedCoupons.length === 0 ? (
          <EmptyState type={selectedTab} />
        ) : (
          <div className="space-y-4">
            {displayedCoupons.map((coupon, index) => (
              <CouponCard key={coupon.id} coupon={coupon} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Coupon Detail Modal - Updated to match design language */}
      <AnimatePresence>
        {showCouponDetail && selectedCoupon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl"
            >
              {/* Header */}
              <div className={`p-6 relative overflow-hidden ${
                selectedCoupon.status === 'active' ? 'bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD]' :
                selectedCoupon.status === 'won' ? 'bg-gradient-to-br from-[#16a34a] to-[#15803d]' :
                'bg-gradient-to-br from-[#dc2626] to-[#b91c1c]'
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
                
                <div className="flex items-center justify-between text-white relative z-10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={userStats.profileImage} 
                      alt={userStats.username}
                      className="w-12 h-12 rounded-full border-2 border-white/50"
                    />
                    <div>
                      <h2 className="text-xl font-bold">Kupon #{selectedCoupon.id}</h2>
                      <p className="text-white/80 text-sm">@{userStats.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCouponDetail(false)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 relative z-10">
                  <div className="text-center">
                    <p className="text-sm text-white">Yatırım</p>
                    <p className="text-xl font-black text-white">
                      {selectedCoupon.betAmount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white">Toplam Oran</p>
                    <p className="text-xl font-black text-white">{selectedCoupon.totalOdds.toFixed(2)}x</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white">Potansiyel</p>
                    <p className="text-xl font-black text-white">₺{selectedCoupon.potentialEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Content - Limited to 5 predictions, no scroll */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#202020]">
                    Tahminler ({selectedCoupon.predictions.length})
                  </h3>
                  <span className="text-xs bg-[#F2F3F5] text-[#202020]/70 px-2 py-1 rounded-full">
                    {selectedCoupon.createdAt.toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {selectedCoupon.predictions.slice(0, 5).map((prediction, index) => (
                    <div
                      key={prediction.id}
                      className={`p-4 rounded-2xl border-2 ${
                        prediction.result === 'won' ? 'bg-green-50 border-green-200' :
                        prediction.result === 'lost' ? 'bg-red-50 border-red-200' :
                        'bg-[#432870]/5 border-[#432870]/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-[#202020] flex-1 text-sm">
                          {prediction.question}
                        </p>
                        <span className="font-bold text-[#432870] ml-2">
                          {prediction.odds}x
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                          prediction.choice === 'yes' ? 'bg-green-100 text-green-700 border-green-200' : 
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                        </span>
                        
                        <span className="text-xs text-[#202020]/60 capitalize font-medium">
                          {prediction.category}
                        </span>
                        
                        {prediction.result && (
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            prediction.result === 'won' ? 'bg-green-100 text-green-700 border border-green-200' :
                            prediction.result === 'lost' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-[#432870]/10 text-[#432870] border border-[#432870]/20'
                          }`}>
                            {prediction.result === 'won' ? '✅ KAZANDI' :
                             prediction.result === 'lost' ? '❌ KAYBETTİ' : '⏳ BEKLİYOR'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {selectedCoupon.predictions.length > 5 && (
                    <div className="text-center py-2 text-[#202020]/60 text-sm">
                      +{selectedCoupon.predictions.length - 5} tahmin daha
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-[#F2F3F5] bg-[#F2F3F5]">
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#C9AFFE] text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                    <span>📤</span>
                    Kuponu Paylaş
                  </button>
                  <button className="py-3 px-4 bg-white hover:bg-gray-100 text-[#202020] rounded-xl font-bold transition-colors border-2 border-[#F2F3F5]">
                    📋
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}