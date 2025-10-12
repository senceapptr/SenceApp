import { useState } from 'react';

interface DarkHomePageProps {
  onNavigate: (page: string) => void;
  onQuestionClick: (id: number) => void;
  userCoins: number;
  dailyPredictions: number;
  yesterdayResults: { correct: number; total: number };
}

export function DarkHomePage({ 
  onNavigate, 
  onQuestionClick, 
  userCoins, 
  dailyPredictions, 
  yesterdayResults 
}: DarkHomePageProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigationCards = [
    {
      id: 'quick-predict',
      icon: '🎯',
      title: 'Hızlı Tahmin',
      description: 'Swipe ile anında tahmin yap',
      gradient: 'from-purple-600 via-pink-600 to-red-500',
      page: 'search'
    },
    {
      id: 'daily-questions',
      icon: '📅',
      title: 'Günlük Sorular',
      description: 'Her gün yeni tahmin fırsatları',
      gradient: 'from-blue-600 via-cyan-600 to-teal-500',
      page: 'daily-questions'
    },
    {
      id: 'trending',
      icon: '📈',
      title: 'Trend Tahminler',
      description: 'En çok oylanan sorular',
      gradient: 'from-orange-600 via-yellow-600 to-amber-500',
      page: 'trending'
    },
    {
      id: 'for-you',
      icon: '🧠',
      title: 'Senin İçin',
      description: 'Kişiselleştirilmiş öneriler',
      gradient: 'from-green-600 via-emerald-600 to-cyan-500',
      page: 'for-you'
    }
  ];

  const recentActivity = [
    { user: '@crypto_king', action: 'bu soruya 3.20 oranlı kupon yaptı', time: '2dk', type: 'coupon' },
    { user: '@tahmin_ustasi', action: 'bu soruyu 5 arkadaşına gönderdi', time: '5dk', type: 'share' },
    { user: '@spor_analisti', action: 'bu soruya "Kesinlikle evet!" dedi', time: '8dk', type: 'comment' },
    { user: '@lucky_player', action: 'seni takip etmeye başladı', time: '12dk', type: 'follow' }
  ];

  const handleCardClick = (page: string) => {
    if (page === 'search') {
      onNavigate('search');
    } else if (page === 'daily-questions') {
      onNavigate('predict');
    } else if (page === 'trending') {
      onNavigate('predict');
    } else if (page === 'for-you') {
      onNavigate('predict');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="pb-24">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-5 pt-12 bg-black/50 backdrop-blur-sm border-b border-gray-800">
          {/* Coins */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-2 shadow-lg shadow-yellow-500/25">
                <span className="text-black font-bold text-sm">💰</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-yellow-400 font-bold text-lg">{userCoins}</p>
              <p className="text-gray-500 text-xs">Coin</p>
            </div>
          </div>

          {/* Sence Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-white font-bold text-2xl tracking-tight" 
                style={{ fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif' }}>
              Sence
            </h1>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="absolute top-14 right-0 bg-gray-800/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-gray-700 min-w-48 animate-in slide-in-from-top-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700/50 rounded-xl transition-colors text-white text-sm">
                  👤 Profil
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700/50 rounded-xl transition-colors text-white text-sm">
                  ⚙️ Ayarlar
                </button>
                <hr className="border-gray-700 my-2" />
                <button className="w-full text-left px-3 py-2 hover:bg-red-500/20 rounded-xl transition-colors text-red-400 text-sm">
                  🚪 Çıkış
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Daily Activity Card */}
        <div className="p-5">
          <div className="bg-gradient-to-r from-gray-800/80 via-gray-800/60 to-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold text-xl mb-2">Bugün kaç tahmin yaptın?</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-6 py-3 shadow-lg">
                  <span className="text-white font-bold text-3xl">{dailyPredictions}</span>
                  <p className="text-purple-200 text-sm">Tahmin</p>
                </div>
                <div className="text-2xl">🔥</div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl px-6 py-3 shadow-lg">
                  <span className="text-white font-bold text-3xl">{yesterdayResults.correct}/{yesterdayResults.total}</span>
                  <p className="text-green-200 text-sm">Dün tuttu</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Dünkü kuponun {yesterdayResults.correct}/{yesterdayResults.total} tuttu 🔥
              </p>
            </div>
            
            <button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              📤 Son kuponunu paylaş
            </button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="px-5 mb-6">
          <h3 className="text-white font-bold text-xl mb-4">Keşfet</h3>
          <div className="grid grid-cols-2 gap-4">
            {navigationCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.page)}
                className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:border-gray-600/50"
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2 group-hover:text-white transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-20 blur-xl rounded-3xl transition-opacity duration-300`} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="px-5">
          <h3 className="text-white font-bold text-xl mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-gray-800/60 to-gray-800/40 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:bg-gray-800/80"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'coupon' ? 'bg-green-500' :
                    activity.type === 'share' ? 'bg-blue-500' :
                    activity.type === 'comment' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  } animate-pulse`} />
                  
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="text-purple-400 font-bold">{activity.user}</span>
                      <span className="text-gray-300"> {activity.action}</span>
                    </p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-purple-600/30 transition-colors">
                      <span className="text-xs">❤️</span>
                    </button>
                    <button className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-blue-600/30 transition-colors">
                      <span className="text-xs">💬</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-5 mt-6">
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-purple-400 font-bold text-2xl">47</p>
                <p className="text-gray-500 text-xs">Toplam Doğru</p>
              </div>
              <div>
                <p className="text-green-400 font-bold text-2xl">%78</p>
                <p className="text-gray-500 text-xs">Başarı Oranı</p>
              </div>
              <div>
                <p className="text-yellow-400 font-bold text-2xl">12</p>
                <p className="text-gray-500 text-xs">Günlük Seri</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}