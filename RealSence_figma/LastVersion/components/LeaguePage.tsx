import { useState } from 'react';

interface LeaguePageProps {
  showHeader?: boolean;
  onNavigate?: (page: string) => void;
}

interface League {
  id: number;
  name: string;
  description: string;
  category: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  endDate: string;
  isJoined: boolean;
  position?: number;
  creator: string;
  joinCost?: number;
}

export function LeaguePage({ showHeader = true, onNavigate }: LeaguePageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-leagues' | 'create'>('discover');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLeagueConfigModal, setShowLeagueConfigModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [userCredits] = useState(8500);
  const [userTickets] = useState(2); // Add current ticket count

  // League configuration state
  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    categories: [] as string[],
    isPrivate: true,
    endDate: '',
    startingCredits: 1000,
    maxParticipants: 20,
    duration: 7,
    entryFee: 0
  });

  const discountedPrice = 5000;

  const leagues: League[] = [
    {
      id: 1,
      name: "Spor Tahmin Ligi",
      description: "Futbol, basketbol ve diğer spor tahminleri",
      category: "spor",
      participants: 156,
      maxParticipants: 200,
      prize: "10,000 kredi",
      endDate: "15 Şubat",
      isJoined: true,
      position: 12,
      creator: "sporcu_mehmet",
      joinCost: 250
    },
    {
      id: 2,
      name: "Teknoloji Geleceği",
      description: "Tech şirketleri ve yeni teknolojiler hakkında",
      category: "teknoloji",
      participants: 89,
      maxParticipants: 100,
      prize: "7,500 kredi",
      endDate: "20 Şubat",
      isJoined: false,
      creator: "tech_guru",
      joinCost: 500
    },
    {
      id: 3,
      name: "Kripto Dünyası",
      description: "Bitcoin, altcoin ve kripto piyasa tahminleri",
      category: "kripto",
      participants: 234,
      maxParticipants: 300,
      prize: "15,000 kredi",
      endDate: "10 Mart",
      isJoined: true,
      position: 45,
      creator: "crypto_master",
      joinCost: 1000
    }
  ];

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, username: 'crypto_king', points: 3450, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
    { rank: 2, username: 'prediction_master', points: 3210, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
    { rank: 3, username: 'future_seer', points: 2980, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face' },
    { rank: 12, username: 'mehmet_k', points: 2150, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', isCurrentUser: true },
    { rank: 4, username: 'trend_hunter', points: 2850, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face' },
    { rank: 5, username: 'market_wizard', points: 2720, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' }
  ].sort((a, b) => a.rank - b.rank);

  const myLeagues = leagues.filter(league => league.isJoined);
  const availableLeagues = leagues.filter(league => !league.isJoined);

  const ticketPrices = [
    {
      id: '1-ticket',
      title: '1 Lig Bileti',
      price: '₺29',
      description: 'Tek lig oluşturma hakkı',
      available: true,
      isPopular: false
    },
    {
      id: '2-tickets',
      title: '2 Lig Bileti',
      price: '₺49',
      originalPrice: '₺58',
      discount: '15% indirim',
      description: 'İki lig oluşturma hakkı',
      available: true,
      isPopular: true
    },
    {
      id: '5-tickets',
      title: '5 Lig Bileti',
      price: '₺99',
      originalPrice: '₺145',
      discount: '32% indirim',
      description: 'Beş lig oluşturma hakkı',
      available: true,
      isPopular: false
    }
  ];

  const categories = [
    { id: 'spor', name: 'Spor', icon: '⚽' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻' },
    { id: 'kripto', name: 'Kripto', icon: '₿' },
    { id: 'politika', name: 'Politika', icon: '🏛️' },
    { id: 'ekonomi', name: 'Ekonomi', icon: '📈' },
    { id: 'eğlence', name: 'Eğlence', icon: '🎬' }
  ];

  const handleJoinLeague = (league: League) => {
    setSelectedLeague(league);
    setShowJoinModal(true);
  };

  const confirmJoinLeague = () => {
    if (selectedLeague && userCredits >= selectedLeague.joinCost!) {
      setShowJoinModal(false);
    }
  };

  const handleViewLeaderboard = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleCreateWithCredits = () => {
    setShowCreditModal(false);
    setShowLeagueConfigModal(true);
  };

  const handlePurchaseTicket = (optionId: string) => {
    setShowTicketModal(false);
    setShowLeagueConfigModal(true);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setLeagueConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleCreateLeague = () => {
    if (!leagueConfig.name || leagueConfig.categories.length === 0) {
      alert('Lütfen lig adını ve en az bir kategori seçin.');
      return;
    }
    
    setShowLeagueConfigModal(false);
    setShowSuccessScreen(true);
  };

  const handleGoToMyLeagues = () => {
    setShowSuccessScreen(false);
    setActiveTab('my-leagues');
  };

  return (
    <>
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 mx-4 max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="font-black text-xl mb-2">Ligler Dünyasına Hoş Geldin!</h2>
                <p className="text-white/90 text-base leading-relaxed">
                  Arkadaşlarınla, toplulukla ve başka kullanıcılarla rekabet et
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#B29EFD] to-[#432870] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-[#202020] font-bold text-base mb-1">Tahminlerini Yarıştır</h3>
                    <p className="text-[#202020]/70 text-sm leading-relaxed">
                      En iyi tahmin yapanlar sıralamada üste çıkar. Sen de yerini al!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C9F158] to-[#353831] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <h3 className="text-[#202020] font-bold text-base mb-1">Ödüller Kazan</h3>
                    <p className="text-[#202020]/70 text-sm leading-relaxed">
                      Liglerin birincileri büyük ödüller kazanır. Krediler, rozetler ve daha fazlası!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#432870] to-[#B29EFD] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <h3 className="text-[#202020] font-bold text-base mb-1">Özel Liglerini Oluştur</h3>
                    <p className="text-[#202020]/70 text-sm leading-relaxed">
                      Arkadaşlarınla özel liglerinde sadece sizin aranızda yarışın.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowWelcomePopup(false)}
                  className="w-full bg-gradient-to-r from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Hemen Başla 🚀
                </button>
                <button
                  onClick={() => setShowWelcomePopup(false)}
                  className="w-full bg-transparent border-2 border-[#432870]/20 text-[#432870] font-bold py-3 rounded-2xl hover:bg-[#432870]/10 transition-all duration-300"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-[#F2F3F5] pb-24">
        {/* Header */}
        {showHeader && (
          <div className="px-5 pt-6 pb-4">
            <h1 className="font-black text-3xl text-[#202020] mb-4">🏆 Ligler</h1>
            <p className="text-[#202020]/70">Arkadaşlarınla yarış, ödüller kazan!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5 mb-6">
          <div className="bg-[#F2F3F5] rounded-2xl p-1 flex border-2 border-white">
            {[
              { id: 'discover', label: 'Keşfet', icon: '🔍' },
              { id: 'my-leagues', label: 'Liglerım', icon: '👤' },
              { id: 'create', label: 'Oluştur', icon: '➕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#432870] shadow-md'
                    : 'text-[#202020]/70 hover:text-[#202020]'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-5">
          {activeTab === 'discover' && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-[#202020] mb-4">Katılabileceğin Ligler</h3>
              {availableLeagues.map((league) => (
                <div key={league.id} className="bg-white rounded-3xl border-2 border-[#F2F3F5] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-black text-lg text-[#202020] mb-2">{league.name}</h4>
                        <p className="text-[#202020]/70 text-sm mb-3">{league.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            league.category === 'spor' ? 'bg-[#B29EFD]/30 text-[#202020]' :
                            league.category === 'teknoloji' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
                          </span>
                          <span className="text-[#202020]/50 text-xs">•</span>
                          <span className="text-[#202020]/50 text-xs">@{league.creator}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#432870] font-black text-lg">{league.prize}</div>
                        <div className="text-[#202020]/50 text-sm">Ödül</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[#202020]/70">
                        <span>👥 {league.participants}/{league.maxParticipants}</span>
                        <span>📅 {league.endDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleJoinLeague(league)}
                        className="relative overflow-hidden flex-1 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-4 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
                        style={{
                          boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <span className="font-black text-base tracking-wide">Katıl</span>
                        </div>
                        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#B29EFD]/20 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
                      </button>
                      
                      <button 
                        onClick={() => {
                          console.log('Navigate to league detail for:', league.id);
                        }}
                        className="px-4 py-4 bg-[#F2F3F5] hover:bg-white text-[#202020] font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Detay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'my-leagues' && (
            <div className="space-y-4">
              <h3 className="font-black text-lg text-[#202020] mb-4">Katıldığın Ligler</h3>
              {myLeagues.map((league) => (
                <div key={league.id} className="bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 rounded-3xl border-2 border-[#432870]/30 shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-black text-lg text-[#202020] mb-2">{league.name}</h4>
                        <p className="text-[#202020]/70 text-sm mb-3">{league.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-[#432870] text-white px-3 py-1 rounded-full text-xs font-bold">
                            #{league.position} Sırada
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            league.category === 'spor' ? 'bg-[#B29EFD]/30 text-[#202020]' :
                            league.category === 'teknoloji' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#432870] font-black text-lg">{league.prize}</div>
                        <div className="text-[#202020]/50 text-sm">Ödül</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-[#202020]/70">
                        <span>👥 {league.participants}/{league.maxParticipants}</span>
                        <span>📅 {league.endDate}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleViewLeaderboard(league)}
                      className="relative overflow-hidden w-full bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-4 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
                      style={{
                        boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <span className="font-black text-base tracking-wide">Sıralamaya Bak</span>
                      </div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#B29EFD]/20 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-black text-2xl text-[#202020] mb-2">Kendi Ligini Oluştur</h3>
                <p className="text-[#202020]/70">Arkadaşlarınla özel lig oluştur ve yarışın başlasın!</p>
              </div>

              <div className="bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 rounded-3xl p-6 border-2 border-[#432870]/30">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🏆</div>
                  <h4 className="font-black text-xl text-[#202020] mb-3">Kendi ligin, kendi kuralların.</h4>
                  <p className="text-[#202020]/80 text-base leading-relaxed">
                    Sadece izlemekle yetinme. Arkadaşlarını topla, ligini kur, sıralamada 1. ol!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#B29EFD]">✓</span>
                    <span className="text-[#202020]">Özel davetiye sistemi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#B29EFD]">✓</span>
                    <span className="text-[#202020]">Canlı sıralama</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#B29EFD]">✓</span>
                    <span className="text-[#202020]">Kategori seçimi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#B29EFD]">✓</span>
                    <span className="text-[#202020]">Özel ödüller</span>
                  </div>
                </div>
              </div>

              {/* Creation Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="relative bg-gradient-to-br from-[#B29EFD] to-[#A688F7] hover:from-[#A688F7] hover:to-[#9B72F2] text-[#202020] rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">💰</div>
                    <h4 className="font-black text-[#202020] mb-2 text-lg">Kredi ile</h4>
                    <p className="text-[#202020] font-bold">Kredi ile oluştur</p>
                    <p className="text-[#202020]/70 text-sm mt-1">Hızlı ve kolay</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowTicketModal(true)}
                  className="relative bg-gradient-to-br from-[#432870] to-[#5A3A8B] hover:from-[#5A3A8B] hover:to-[#6B4A9D] text-white rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">🎫</div>
                    <h4 className="font-black text-white mb-2 text-lg">Bilet ile</h4>
                    <p className="text-white font-bold">Bilet kullan</p>
                    <p className="text-white/80 text-sm mt-1">Premium özellikler</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit Purchase Modal - Updated 5000 Credit */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreditModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-2">
            <div className="text-center mb-6">
              <h3 className="text-[#202020] font-black text-xl mb-2">Kredi ile Lig Oluştur</h3>
              <p className="text-[#202020]/70">Kendi ligini oluşturmak için 5,000 kredi gerekiyor</p>
            </div>
            
            <div className="bg-gradient-to-r from-[#B29EFD]/20 to-[#432870]/20 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <div className="text-[#432870] font-black text-3xl mb-2">5,000 kredi</div>
                <div className="text-[#202020]/70 text-sm">Mevcut bakiyen: {userCredits.toLocaleString()} kredi</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCreditModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#202020] font-bold py-4 rounded-2xl transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={handleCreateWithCredits}
                disabled={userCredits < 5000}
                className={`flex-1 font-bold py-4 rounded-2xl transition-colors ${
                  userCredits >= 5000
                    ? 'bg-[#432870] hover:bg-[#5A3A8B] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Purchase Modal - Updated with Ticket Count */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTicketModal(false)} />
          <div className="absolute inset-0 bg-white rounded-3xl m-4 overflow-hidden animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between p-6 border-b border-[#F2F3F5]">
              <div>
                <h3 className="text-[#202020] font-black text-xl">Lig Bileti Satın Al</h3>
                <p className="text-[#432870] font-bold text-sm mt-1">Mevcut biletlerin: {userTickets}</p>
              </div>
              <button 
                onClick={() => setShowTicketModal(false)}
                className="w-8 h-8 rounded-full bg-[#F2F3F5] flex items-center justify-center text-[#202020]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {ticketPrices.map((option) => (
                <div 
                  key={option.id}
                  className={`relative rounded-2xl border-2 p-6 transition-all cursor-pointer hover:scale-105 ${
                    option.isPopular 
                      ? 'border-[#432870] bg-gradient-to-r from-[#432870]/10 to-[#B29EFD]/10' 
                      : 'border-[#F2F3F5] bg-white'
                  }`}
                  onClick={() => handlePurchaseTicket(option.id)}
                >
                  {option.isPopular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#432870] text-white px-3 py-1 rounded-full text-xs font-bold">
                      En Popüler
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h4 className="text-[#202020] font-black text-lg mb-2">{option.title}</h4>
                    <div className="mb-3">
                      <span className="text-[#432870] font-black text-3xl">{option.price}</span>
                      {option.originalPrice && (
                        <span className="text-[#202020]/50 text-lg line-through ml-2">{option.originalPrice}</span>
                      )}
                    </div>
                    {option.discount && (
                      <div className="bg-[#B29EFD] text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                        {option.discount}
                      </div>
                    )}
                    <p className="text-[#202020]/70 text-sm">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* League Configuration Modal - Enhanced */}
      {showLeagueConfigModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLeagueConfigModal(false)} />
          <div className="absolute inset-0 bg-white rounded-3xl m-4 overflow-hidden animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between p-6 border-b border-[#F2F3F5]">
              <h3 className="text-[#202020] font-black text-xl">Lig Ayarları</h3>
              <button 
                onClick={() => setShowLeagueConfigModal(false)}
                className="w-8 h-8 rounded-full bg-[#F2F3F5] flex items-center justify-center text-[#202020]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              {/* League Name */}
              <div>
                <label className="text-[#202020] font-bold text-sm mb-2 block">Lig Adı</label>
                <input
                  type="text"
                  value={leagueConfig.name}
                  onChange={(e) => setLeagueConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Örn: Arkadaşlar Ligi"
                  className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-xl p-3 focus:border-[#432870] transition-colors"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="text-[#202020] font-bold text-sm mb-3 block">Kategoriler</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        leagueConfig.categories.includes(category.id)
                          ? 'border-[#432870] bg-[#432870]/10 text-[#432870]'
                          : 'border-[#F2F3F5] bg-white text-[#202020] hover:border-[#432870]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-bold text-sm">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <label className="text-[#202020] font-bold text-sm mb-3 block">Gizlilik</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLeagueConfig(prev => ({ ...prev, isPrivate: true }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      leagueConfig.isPrivate
                        ? 'border-[#432870] bg-[#432870]/10 text-[#432870]'
                        : 'border-[#F2F3F5] bg-white text-[#202020]'
                    }`}
                  >
                    <div className="text-2xl mb-2">🔒</div>
                    <div className="font-bold text-sm">Özel Lig</div>
                    <div className="text-xs opacity-70">Sadece davetliler</div>
                  </button>
                  <button
                    onClick={() => setLeagueConfig(prev => ({ ...prev, isPrivate: false }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !leagueConfig.isPrivate
                        ? 'border-[#432870] bg-[#432870]/10 text-[#432870]'
                        : 'border-[#F2F3F5] bg-white text-[#202020]'
                    }`}
                  >
                    <div className="text-2xl mb-2">🌍</div>
                    <div className="font-bold text-sm">Herkese Açık</div>
                    <div className="text-xs opacity-70">Herkes katılabilir</div>
                  </button>
                </div>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#202020] font-bold text-sm mb-2 block">Maksimum Kişi</label>
                  <input
                    type="number"
                    value={leagueConfig.maxParticipants}
                    onChange={(e) => setLeagueConfig(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    min="2"
                    max="100"
                    className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-xl p-3 focus:border-[#432870] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-[#202020] font-bold text-sm mb-2 block">Süre (Gün)</label>
                  <input
                    type="number"
                    value={leagueConfig.duration}
                    onChange={(e) => setLeagueConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="1"
                    max="30"
                    className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-xl p-3 focus:border-[#432870] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#202020] font-bold text-sm mb-2 block">Katılım Ücreti (Kredi)</label>
                <input
                  type="number"
                  value={leagueConfig.entryFee}
                  onChange={(e) => setLeagueConfig(prev => ({ ...prev, entryFee: parseInt(e.target.value) }))}
                  min="0"
                  placeholder="0 = Ücretsiz"
                  className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-xl p-3 focus:border-[#432870] transition-colors"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateLeague}
                className="w-full bg-[#432870] hover:bg-[#5A3A8B] text-white font-bold py-4 rounded-2xl transition-colors"
              >
                Ligi Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other modals remain the same... */}
      {/* Join League Modal */}
      {showJoinModal && selectedLeague && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowJoinModal(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-2">
            <div className="text-center mb-6">
              <h3 className="text-[#202020] font-black text-xl mb-2">
                {selectedLeague.name} Ligine Katıl
              </h3>
              <p className="text-[#202020]/70">{selectedLeague.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-[#B29EFD]/20 to-[#432870]/20 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <div className="text-[#432870] font-black text-2xl mb-2">
                  {selectedLeague.joinCost?.toLocaleString()} kredi
                </div>
                <div className="text-[#202020]/70 text-sm">
                  Mevcut bakiyen: {userCredits.toLocaleString()} kredi
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#202020] font-bold py-4 rounded-2xl transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={confirmJoinLeague}
                disabled={userCredits < selectedLeague.joinCost!}
                className={`flex-1 font-bold py-4 rounded-2xl transition-colors ${
                  userCredits >= selectedLeague.joinCost!
                    ? 'bg-[#432870] hover:bg-[#5A3A8B] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Katıl
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && selectedLeague && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLeaderboard(false)} />
          <div className="absolute inset-0 bg-white rounded-3xl m-4 overflow-hidden animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between p-6 border-b border-[#F2F3F5]">
              <div>
                <h3 className="text-[#202020] font-black text-xl">{selectedLeague.name}</h3>
                <p className="text-[#432870] font-bold text-sm mt-1">Sıralama</p>
              </div>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="w-8 h-8 rounded-full bg-[#F2F3F5] flex items-center justify-center text-[#202020]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-3 overflow-y-auto max-h-[80vh]">
              {leaderboardData.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                    user.isCurrentUser 
                      ? 'bg-gradient-to-r from-[#432870]/20 to-[#B29EFD]/20 border-2 border-[#432870]/30' 
                      : 'bg-[#F2F3F5] hover:bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    user.isCurrentUser ? 'bg-[#432870] text-white' :
                    'bg-gray-200 text-[#202020]'
                  }`}>
                    {user.rank}
                  </div>
                  
                  <img 
                    src={user.avatar} 
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${user.isCurrentUser ? 'text-[#432870]' : 'text-[#202020]'}`}>
                        {user.username}
                      </span>
                      {user.isCurrentUser && (
                        <span className="bg-[#432870] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                          Sen
                        </span>
                      )}
                    </div>
                    <div className="text-[#202020]/70 text-sm">
                      {user.points.toLocaleString()} puan
                    </div>
                  </div>
                  
                  {user.rank <= 3 && (
                    <div className="text-2xl">
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}