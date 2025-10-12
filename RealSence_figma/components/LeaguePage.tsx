import { useState } from 'react';

interface LeaguePageProps {
  showHeader?: boolean;
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

export function LeaguePage({ showHeader = true }: LeaguePageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-leagues' | 'create'>('discover');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLeagueConfigModal, setShowLeagueConfigModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [userCredits] = useState(8500);
  const [userTickets] = useState(0);

  // League configuration state
  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    categories: [],
    isPrivate: true,
    endDate: '',
    startingCredits: 1000,
    maxParticipants: 20
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
      // Join logic here
      setShowJoinModal(false);
      // Show success or redirect
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
      <div className="flex-1 bg-gradient-to-b from-white to-gray-50 pb-24">
        {/* Header */}
        {showHeader && (
          <div className="px-5 pt-6 pb-4">
            <h1 className="font-bold text-2xl text-gray-900 mb-4">🏆 Ligler</h1>
            <p className="text-gray-600">Arkadaşlarınla yarış, ödüller kazan!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5 mb-6">
          <div className="bg-gray-100 rounded-2xl p-1 flex">
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
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
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
              <h3 className="font-bold text-lg text-gray-900 mb-4">Katılabileceğin Ligler</h3>
              {availableLeagues.map((league) => (
                <div key={league.id} className="bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{league.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{league.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            league.category === 'spor' ? 'bg-green-100 text-green-700' :
                            league.category === 'teknoloji' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
                          </span>
                          <span className="text-gray-500 text-xs">•</span>
                          <span className="text-gray-500 text-xs">@{league.creator}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-600 font-bold text-lg">{league.prize}</div>
                        <div className="text-gray-500 text-sm">Ödül</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👥 {league.participants}/{league.maxParticipants}</span>
                        <span>📅 {league.endDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleJoinLeague(league)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        Katıl
                      </button>
                      <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all duration-300">
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
              <h3 className="font-bold text-lg text-gray-900 mb-4">Katıldığın Ligler</h3>
              {myLeagues.map((league) => (
                <div key={league.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl border-2 border-purple-200 shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{league.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{league.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                            #{league.position} Sırada
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            league.category === 'spor' ? 'bg-green-100 text-green-700' :
                            league.category === 'teknoloji' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-600 font-bold text-lg">{league.prize}</div>
                        <div className="text-gray-500 text-sm">Ödül</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👥 {league.participants}/{league.maxParticipants}</span>
                        <span>📅 {league.endDate}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleViewLeaderboard(league)}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      Sıralamaya Bak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-bold text-2xl text-gray-900 mb-2">Kendi Ligini Oluştur</h3>
                <p className="text-gray-600">Arkadaşlarınla özel lig oluştur ve yarışın başlasın!</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-6 border border-purple-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">Lig Özellikleri</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Özel davetiye sistemi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Canlı sıralama</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Kategori seçimi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Özel ödüller</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Premium Creation Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="relative bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 animate-bounce">💰</div>
                    <h4 className="font-bold text-white mb-2 text-lg">Kredi ile</h4>
                    <p className="text-emerald-100 font-bold">5,000 kredi</p>
                    <p className="text-emerald-200 text-sm mt-1">50% İndirim</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowTicketModal(true)}
                  className="relative bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 animate-bounce">🎫</div>
                    <h4 className="font-bold text-white mb-2 text-lg">Bilet ile</h4>
                    <p className="text-purple-100 font-bold">₺29'dan başlar</p>
                    <p className="text-purple-200 text-sm mt-1">Premium özellikler</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Join League Modal */}
      {showJoinModal && selectedLeague && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">Liga Katıl</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{selectedLeague.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{selectedLeague.description}</p>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4 mb-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {selectedLeague.joinCost?.toLocaleString()} kredi
                  </div>
                  <p className="text-sm text-gray-600">Katılım ücreti</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Mevcut krediniz:</span>
                  <span className="font-bold text-lg text-gray-900">{userCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Katılım ücreti:</span>
                  <span className="font-bold text-lg text-purple-600">{selectedLeague.joinCost?.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Kalan kredi:</span>
                    <span className="font-bold text-lg text-green-600">
                      {(userCredits - selectedLeague.joinCost!).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={confirmJoinLeague}
                disabled={userCredits < selectedLeague.joinCost!}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                  userCredits >= selectedLeague.joinCost!
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {userCredits >= selectedLeague.joinCost! ? '🚀 Liga Katıl' : 'Yetersiz Kredi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && selectedLeague && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">🏆 Sıralama</h3>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{selectedLeague.name}</h4>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
                  <div className="text-2xl mb-2">🎁</div>
                  <div className="text-purple-600 font-bold text-lg">{selectedLeague.prize}</div>
                  <p className="text-gray-600 text-sm">Kazanana gidecek</p>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                  <div
                    key={user.rank}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      user.isCurrentUser
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 shadow-lg animate-pulse'
                        : user.rank <= 3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {user.rank <= 3 ? (
                            <span>{user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}</span>
                          ) : (
                            <span>#{user.rank}</span>
                          )}
                        </div>
                        
                        <img 
                          src={user.avatar} 
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        
                        <div>
                          <p className={`font-bold ${user.isCurrentUser ? 'text-purple-700' : 'text-gray-900'}`}>
                            {user.username}
                            {user.isCurrentUser && <span className="ml-2 text-purple-500">• Sen</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{user.points.toLocaleString()}</p>
                        <p className="text-gray-500 text-xs">puan</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl mb-2">⏰</div>
                  <p className="text-blue-800 font-bold">Lig Sona Eriş Tarihi</p>
                  <p className="text-blue-600">{selectedLeague.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {showSuccessScreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full text-center p-8">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="font-bold text-2xl text-gray-900 mb-4">Başarıyla Oluşturuldu!</h2>
            <p className="text-gray-600 mb-8">Ligin hazır! Şimdi arkadaşlarını davet et ve yarışmaya başla.</p>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-green-800 mb-1">Hemen Yarışmaya Başla</h3>
              <p className="text-green-600 text-sm">Ligin aktif ve katılımcıların bekleniyor</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoToMyLeagues}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                🏆 Ligimi Görüntüle
              </button>
              
              <button
                onClick={() => setShowSuccessScreen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-all duration-300"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Details Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">Kredi ile Oluştur</h3>
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💰</div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {discountedPrice.toLocaleString()} kredi
                  </div>
                  <div className="text-gray-500 mb-2">
                    <span className="line-through">10,000 kredi</span>
                    <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      50% İndirim
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">İlk lig oluşturma indirimi</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Mevcut krediniz:</span>
                  <span className="font-bold text-lg text-gray-900">{userCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">İndirimli fiyat:</span>
                  <span className="font-bold text-lg text-green-600">{discountedPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCreateWithCredits}
                disabled={userCredits < discountedPrice}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                  userCredits >= discountedPrice
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {userCredits >= discountedPrice ? '🚀 Lig Oluştur' : 'Yetersiz Kredi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">Lig Bileti Satın Al</h3>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎫</div>
                <p className="text-gray-600">Mevcut biletleriniz: <span className="font-bold">{userTickets}</span></p>
              </div>

              <div className="space-y-4">
                {ticketPrices.map((option) => (
                  <div
                    key={option.id}
                    className={`border-2 rounded-2xl p-4 transition-all duration-300 ${
                      option.isPopular 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{option.title}</h4>
                      {option.isPopular && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          Popüler
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-bold text-xl text-purple-600">{option.price}</span>
                      {option.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">{option.originalPrice}</span>
                      )}
                      {option.discount && (
                        <span className="text-green-600 font-bold text-sm">{option.discount}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                    
                    <button
                      onClick={() => handlePurchaseTicket(option.id)}
                      className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300"
                    >
                      Satın Al
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* League Configuration Modal */}
      {showLeagueConfigModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">Lig Detayları</h3>
                <button
                  onClick={() => setShowLeagueConfigModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* League Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lig Adı</label>
                  <input
                    type="text"
                    value={leagueConfig.name}
                    onChange={(e) => setLeagueConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Lig adını girin..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategoriler</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          leagueConfig.categories.includes(category.id)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-lg mb-1">{category.icon}</div>
                          <div className="text-sm font-medium">{category.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gizlilik</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLeagueConfig(prev => ({ ...prev, isPrivate: true }))}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        leagueConfig.isPrivate
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">🔒</div>
                        <div className="text-sm font-medium">Özel</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setLeagueConfig(prev => ({ ...prev, isPrivate: false }))}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        !leagueConfig.isPrivate
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">🌐</div>
                        <div className="text-sm font-medium">Herkese Açık</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={leagueConfig.endDate}
                    onChange={(e) => setLeagueConfig(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Starting Credits */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Başlangıç Kredisi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setLeagueConfig(prev => ({ ...prev, startingCredits: amount }))}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          leagueConfig.startingCredits === amount
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm font-bold">{amount}</div>
                          <div className="text-xs">kredi</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Maksimum Katılımcı</label>
                  <input
                    type="number"
                    value={leagueConfig.maxParticipants}
                    onChange={(e) => setLeagueConfig(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    min="2"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreateLeague}
                  className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  🚀 Lig Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}