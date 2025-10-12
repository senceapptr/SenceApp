import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';

interface CouponPrediction {
  id: number;
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  category: string;
  result?: 'won' | 'lost' | 'pending';
}

interface Coupon {
  id: number;
  predictions: CouponPrediction[];
  totalOdds: number;
  potentialEarnings: number;
  status: 'live' | 'won' | 'lost';
  createdAt: Date;
  claimedReward?: boolean;
}

interface AlternativeCouponsPageProps {
  onBack: () => void;
  onNavigateToDiscover: () => void;
}

export function AlternativeCouponsPage({ onBack, onNavigateToDiscover }: AlternativeCouponsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'live' | 'won' | 'lost'>('live');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
    categories: [] as string[]
  });

  // Mock coupon data
  const mockCoupons: Coupon[] = [
    {
      id: 1,
      predictions: [
        { id: 1, question: "ChatGPT-5 bu yıl çıkacak mı?", choice: 'yes', odds: 2.4, category: 'teknoloji', result: 'pending' },
        { id: 2, question: "Bitcoin 100K doları aşacak mı?", choice: 'yes', odds: 2.1, category: 'finans', result: 'pending' },
        { id: 3, question: "Türkiye finale kalacak mı?", choice: 'no', odds: 1.8, category: 'spor', result: 'pending' }
      ],
      totalOdds: 9.07,
      potentialEarnings: 4535,
      status: 'live',
      createdAt: new Date(),
      claimedReward: false
    },
    {
      id: 2,
      predictions: [
        { id: 4, question: "Apple Vision Pro Türkiye'ye gelecek mi?", choice: 'yes', odds: 1.9, category: 'teknoloji', result: 'won' },
        { id: 5, question: "Netflix fiyatları artacak mı?", choice: 'yes', odds: 2.2, category: 'teknoloji', result: 'won' }
      ],
      totalOdds: 4.18,
      potentialEarnings: 2090,
      status: 'won',
      createdAt: new Date(Date.now() - 86400000),
      claimedReward: false
    },
    {
      id: 3,
      predictions: [
        { id: 6, question: "Tesla Model Y fiyatı düşecek mi?", choice: 'no', odds: 1.5, category: 'finans', result: 'lost' },
        { id: 7, question: "Instagram Reels kaldırılacak mı?", choice: 'yes', odds: 3.2, category: 'sosyal-medya', result: 'lost' }
      ],
      totalOdds: 4.8,
      potentialEarnings: 2400,
      status: 'lost',
      createdAt: new Date(Date.now() - 172800000),
      claimedReward: false
    }
  ];

  const categories = ['teknoloji', 'finans', 'spor', 'sosyal-medya', 'müzik', 'magazin', 'politika'];

  const filteredCoupons = mockCoupons.filter(coupon => {
    if (selectedCategory !== 'live' && coupon.status !== selectedCategory) return false;
    if (selectedCategory === 'live' && coupon.status !== 'live') return false;
    
    if (filters.status.length > 0 && !filters.status.includes(coupon.status)) return false;
    if (filters.categories.length > 0) {
      const couponCategories = coupon.predictions.map(p => p.category);
      if (!filters.categories.some(cat => couponCategories.includes(cat))) return false;
    }
    
    return true;
  });

  const handleCouponClick = (coupon: Coupon) => {
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setSelectedCoupon(coupon);
    setShowCouponDetail(true);
  };

  const handleClaimReward = (couponId: number) => {
    // Simulate claiming reward with celebration
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Update coupon as claimed
    const couponIndex = mockCoupons.findIndex(c => c.id === couponId);
    if (couponIndex !== -1) {
      mockCoupons[couponIndex].claimedReward = true;
    }
    
    setShowCouponDetail(false);
  };

  // Coupon Card Component
  const CouponCard = ({ coupon, index }: { coupon: Coupon, index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          y: -8,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleCouponClick(coupon)}
        className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 mb-4 ${
          coupon.status === 'live' ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200' :
          coupon.status === 'won' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' :
          'bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200'
        }`}
      >
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
          coupon.status === 'live' ? 'bg-blue-500 text-white' :
          coupon.status === 'won' ? 'bg-green-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {coupon.status === 'live' ? '🔴 CANLI' : 
           coupon.status === 'won' ? '🎉 KAZANDI' : '❌ KAYBETTİ'}
        </div>

        {/* Compact Predictions List */}
        <div className="mb-4 mt-2">
          <div className="space-y-2">
            {coupon.predictions.slice(0, 3).map((prediction, idx) => (
              <div key={prediction.id} className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      prediction.choice === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                    </span>
                    <span className="text-xs text-gray-500">{prediction.category}</span>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <span className="text-sm font-bold text-purple-600">{prediction.odds}x</span>
                </div>
              </div>
            ))}
            
            {coupon.predictions.length > 3 && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">
                  +{coupon.predictions.length - 3} tahmin daha
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 border-t border-white/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Potansiyel Kazanç</p>
              <p className="font-bold text-gray-900">₺{coupon.potentialEarnings.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Toplam Oran</p>
            <p className="text-xl font-black text-purple-600">{coupon.totalOdds.toFixed(2)}x</p>
          </div>
        </div>

        {/* Special effects for winning coupons */}
        {coupon.status === 'won' && !coupon.claimedReward && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    );
  };

  // Filter Modal Component
  const FilterModal = () => {
    if (!showFilterModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Durum</h3>
            <div className="space-y-2">
              {['live', 'won', 'lost'].map(status => (
                <label key={status} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, status: [...prev.status, status] }));
                      } else {
                        setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }));
                      }
                    }}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300"
                  />
                  <span className="text-gray-700">
                    {status === 'live' ? 'Canlı' : status === 'won' ? 'Kazanan' : 'Kaybeden'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Tarih</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Tümü' },
                { value: 'today', label: 'Bugün' },
                { value: 'week', label: 'Bu Hafta' },
                { value: 'month', label: 'Bu Ay' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={filters.dateRange === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Kategoriler</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, categories: [...prev.categories, category] }));
                      } else {
                        setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
                      }
                    }}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilters({ status: [], dateRange: 'all', categories: [] })}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold"
            >
              Temizle
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl font-semibold"
            >
              Uygula
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Coupon Detail Modal Component
  const CouponDetailModal = () => {
    if (!selectedCoupon || !showCouponDetail) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 ${
            selectedCoupon.status === 'live' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
            selectedCoupon.status === 'won' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            'bg-gradient-to-r from-red-500 to-pink-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-xl font-bold">Kupon Detayı</h2>
                <p className="text-white/80 text-sm">#{selectedCoupon.id}</p>
              </div>
              <button
                onClick={() => setShowCouponDetail(false)}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-white">
                <p className="text-sm opacity-80">Toplam Oran</p>
                <p className="text-2xl font-black">{selectedCoupon.totalOdds.toFixed(2)}x</p>
              </div>
              <div className="text-white text-right">
                <p className="text-sm opacity-80">Potansiyel Kazanç</p>
                <p className="text-2xl font-black">₺{selectedCoupon.potentialEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Tahminler ({selectedCoupon.predictions.length})</h3>
            
            <div className="space-y-3">
              {selectedCoupon.predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl border-2 ${
                    prediction.result === 'won' ? 'bg-green-50 border-green-200' :
                    prediction.result === 'lost' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 flex-1">
                      {prediction.question}
                    </p>
                    <span className="text-sm font-bold text-purple-600 ml-2">
                      {prediction.odds}x
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      prediction.choice === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                    </span>
                    
                    <span className="text-xs text-gray-500 capitalize">
                      {prediction.category}
                    </span>
                    
                    {prediction.result && (
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        prediction.result === 'won' ? 'bg-green-100 text-green-700' :
                        prediction.result === 'lost' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {prediction.result === 'won' ? '✅ KAZANDI' :
                         prediction.result === 'lost' ? '❌ KAYBETTİ' : '⏳ BEKLİYOR'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2">
                <span>📤</span>
                Paylaş
              </button>
              
              {selectedCoupon.status === 'won' && !selectedCoupon.claimedReward && (
                <motion.button
                  onClick={() => handleClaimReward(selectedCoupon.id)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🎉</span>
                  Ödülü Al
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="px-6 pt-16 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <motion.h1 
              className="text-4xl font-black text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Kuponlarım
            </motion.h1>
          </div>
          
          <button
            onClick={() => setShowFilterModal(true)}
            className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm9 3l-9 9-9-9h18z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-6">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {[
            { id: 'live', name: 'Canlı', icon: '🔴', count: mockCoupons.filter(c => c.status === 'live').length },
            { id: 'won', name: 'Kazanan', icon: '🎉', count: mockCoupons.filter(c => c.status === 'won').length },
            { id: 'lost', name: 'Kaybeden', icon: '❌', count: mockCoupons.filter(c => c.status === 'lost').length }
          ].map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:shadow-md'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{category.icon}</span>
              <div className="text-left">
                <p className="font-bold">{category.name}</p>
                <p className={`text-sm ${selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {category.count} kupon
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Coupons List */}
      <div className="px-6 pb-24">
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">
              Hazır mısın?
            </h3>
            <p className="text-gray-600 mb-6">
              İlk kuponunu oluştur, bugün %25 bonus kredi.
            </p>
            <motion.button
              onClick={onNavigateToDiscover}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yeni Kupon
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCoupons.map((coupon, index) => (
              <CouponCard key={coupon.id} coupon={coupon} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        <FilterModal />
        <CouponDetailModal />
      </AnimatePresence>
    </div>
  );
}