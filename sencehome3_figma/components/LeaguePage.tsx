export function LeaguePage() {
  const currentLeagues = [
    {
      id: 1,
      name: 'Ofis Arkadaşları',
      members: 8,
      position: 3,
      points: 245,
      timeLeft: '3 gün',
      prize: '🏆 500 puan'
    },
    {
      id: 2,
      name: 'Üniversite Dostları',
      members: 12,
      position: 1,
      points: 387,
      timeLeft: '1 gün',
      prize: '🥇 1000 puan'
    }
  ];

  const topPlayers = [
    { name: '@mehmet_k', points: 387, position: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: '@ahmet_s', points: 298, position: 2, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { name: '@ayse_k', points: 245, position: 3, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4e9?w=100&h=100&fit=crop&crop=face' }
  ];

  return (
    <div className="flex-1 px-5 pt-6 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-bold text-2xl text-gray-900 mb-2">Arkadaş Ligleri</h1>
        <p className="text-gray-600">Arkadaşlarınla yarış, kazanma heyecanını paylaş!</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6B46F0] to-[#8B5CF6] rounded-3xl p-6 mb-6 text-white">
        <div className="text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="font-bold text-xl mb-2">Haftalık Lig Yarışması</h2>
          <p className="text-white/90 mb-4">7 gün boyunca tahminlerini yap, en çok puan topla!</p>
          <button className="bg-white text-[#6B46F0] font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors">
            Yeni Lig Oluştur
          </button>
        </div>
      </div>

      {/* Current Leagues */}
      {currentLeagues.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Aktif Liglerim</h3>
          <div className="space-y-3">
            {currentLeagues.map((league) => (
              <div key={league.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{league.name}</h4>
                    <p className="text-sm text-gray-600">{league.members} kişi • {league.timeLeft} kaldı</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      league.position === 1 ? 'text-[#F5A623]' : 
                      league.position === 2 ? 'text-gray-500' : 
                      league.position === 3 ? 'text-[#CD7F32]' : 'text-gray-400'
                    }`}>
                      #{league.position}
                    </div>
                    <div className="text-sm text-gray-600">{league.points} puan</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B46F0] font-medium">{league.prize}</span>
                  <button className="text-[#6B46F0] font-medium text-sm hover:text-purple-700">
                    Detaylar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Preview */}
      <div className="mb-8">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Bu Haftanın Liderleri</h3>
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="space-y-3">
            {topPlayers.map((player) => (
              <div key={player.position} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  player.position === 1 ? 'bg-[#F5A623] text-white' : 
                  player.position === 2 ? 'bg-gray-400 text-white' : 
                  'bg-[#CD7F32] text-white'
                }`}>
                  {player.position}
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{player.name}</div>
                  <div className="text-sm text-gray-600">{player.points} puan</div>
                </div>
                {player.position === 1 && (
                  <div className="text-2xl">👑</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Haftalık Yarış</h4>
              <p className="text-sm text-gray-600">Her hafta yeni lig, yeni heyecan!</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Arkadaşlarını Davet Et</h4>
              <p className="text-sm text-gray-600">En fazla 20 kişilik lig oluştur</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Ödüller Kazan</h4>
              <p className="text-sm text-gray-600">İlk 3'e giren herkese ödül!</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-[#6B46F0] hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors">
          Yeni Lig Oluştur
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors">
          Lige Katıl
        </button>
      </div>
    </div>
  );
}