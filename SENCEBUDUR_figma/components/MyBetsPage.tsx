import { useState } from 'react';

interface MyBetsPageProps {
  showHeader?: boolean;
}

export function MyBetsPage({ showHeader = true }: MyBetsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const bets = [
    {
      id: 3,
      date: '19 Ocak 2025',
      status: 'pending',
      amount: 10,
      payout: 28,
      odds: 2.8,
      selections: [
        { question: 'Netflix dizi sayısını artıracak mı?', vote: 'Evet', odds: 1.4 },
        { question: 'Amazon drone teslimat başlatacak mı?', vote: 'Hayır', odds: 2.0 }
      ]
    },
    {
      id: 1,
      date: '21 Ocak 2025',
      status: 'won',
      amount: 25,
      payout: 67.5,
      odds: 2.7,
      selections: [
        { question: 'Lakers playoff\'a kalacak mı?', vote: 'Evet', odds: 1.5 },
        { question: 'Bitcoin 100K geçecek mi?', vote: 'Evet', odds: 1.8 }
      ]
    },
    {
      id: 2,
      date: '20 Ocak 2025',
      status: 'lost',
      amount: 15,
      payout: 0,
      odds: 3.2,
      selections: [
        { question: 'Tesla yeni model açıklayacak mı?', vote: 'Hayır', odds: 2.2 },
        { question: 'Apple VR fiyat düşürecek mi?', vote: 'Evet', odds: 1.45 }
      ]
    }
  ];

  const totalWon = bets.filter(bet => bet.status === 'won').reduce((acc, bet) => acc + bet.payout, 0);
  const totalLost = bets.filter(bet => bet.status === 'lost').reduce((acc, bet) => acc + bet.amount, 0);
  const pendingCount = bets.filter(bet => bet.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-green-700'; // Darkened from previous color
      case 'lost': return 'text-red-500';
      case 'pending': return 'text-[#432870]';
      default: return 'text-[#202020]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'won': return 'Kazandı';
      case 'lost': return 'Kaybetti';
      case 'pending': return 'Bekliyor';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'won': return 'bg-gradient-to-r from-green-600/15 to-green-700/25 border-green-600/40'; // Darkened background
      case 'lost': return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200';
      case 'pending': return 'bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 border-[#432870]/30';
      default: return 'bg-white border-[#F2F3F5]';
    }
  };

  const filteredBets = bets.filter(bet => {
    if (selectedFilter === 'all') return true;
    return bet.status === selectedFilter;
  });

  const filters = [
    { id: 'all', label: 'Tümü', count: bets.length },
    { id: 'pending', label: 'Bekleyenler', count: pendingCount },
    { id: 'won', label: 'Kazananlar', count: bets.filter(b => b.status === 'won').length },
    { id: 'lost', label: 'Kaybedenler', count: bets.filter(b => b.status === 'lost').length }
  ];

  return (
    <div className="flex-1 px-5 pt-6 pb-24 bg-[#F2F3F5]">
      {/* Header */}
      {showHeader && (
        <div className="mb-6">
          <h1 className="font-black text-2xl text-[#202020] mb-4">Kuponlarım</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border-2 border-[#432870]/20 rounded-2xl p-4 text-center shadow-md">
              <div className="text-[#432870] font-black text-2xl">{pendingCount}</div>
              <div className="text-[#202020] font-bold text-sm">Bekleyen</div>
            </div>
            <div className="bg-white border-2 border-green-600/50 rounded-2xl p-4 text-center shadow-md">
              <div className="text-green-700 font-black text-2xl">{totalWon}</div>
              <div className="text-[#202020] font-bold text-sm">Kazanç</div>
            </div>
            <div className="bg-white border-2 border-red-200 rounded-2xl p-4 text-center shadow-md">
              <div className="text-red-500 font-black text-2xl">{totalLost}</div>
              <div className="text-[#202020] font-bold text-sm">Kayıp</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-5 py-3 rounded-full font-bold transition-all text-sm transform hover:scale-105 ${
              filter.id === selectedFilter 
                ? 'bg-[#432870] text-white shadow-lg' 
                : 'bg-[#F2F3F5] text-[#202020] hover:bg-white hover:shadow-md'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Bets List */}
      <div className="space-y-4">
        {filteredBets.map((bet) => (
          <div 
            key={bet.id} 
            className={`rounded-3xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 ${getStatusBg(bet.status)}`}
          >
            {/* Bet Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/50">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`font-black text-lg ${getStatusColor(bet.status)}`}>
                    {getStatusText(bet.status)}
                  </span>
                  {bet.status === 'pending' && (
                    <span className="bg-[#432870] text-white text-xs px-3 py-1.5 rounded-full font-bold">
                      Sonuç Bekleniyor
                    </span>
                  )}
                </div>
                <div className="text-sm text-[#202020]/70 mt-1 font-medium">
                  {bet.date} • {bet.amount} puan • {bet.odds}x oran
                </div>
              </div>
              <div className="text-right">
                {bet.status === 'won' && (
                  <div className="text-green-700 font-black text-2xl">+{bet.payout}</div>
                )}
                {bet.status === 'lost' && (
                  <div className="text-red-500 font-black text-2xl">-{bet.amount}</div>
                )}
                {bet.status === 'pending' && (
                  <div className="text-[#432870] font-black text-2xl">{bet.payout}</div>
                )}
              </div>
            </div>

            {/* Selections */}
            <div className="p-5 space-y-3">
              {bet.selections.map((selection, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-white/80 rounded-2xl p-4 border border-white shadow-sm"
                >
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#202020] leading-tight mb-2">
                      {selection.question}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black ${
                        selection.vote === 'Evet' 
                          ? 'bg-green-600/25 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {selection.vote}
                      </span>
                      <span className="text-xs text-[#432870] font-black bg-[#432870]/20 px-3 py-1.5 rounded-full">
                        {selection.odds}x
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBets.length === 0 && (
        <div className="text-center text-[#202020]/70 mt-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="font-black text-lg mb-2 text-[#202020]">
            {selectedFilter === 'all' ? 'Henüz kupon yok' : 'Bu kategoride kupon yok'}
          </h3>
          <p className="text-sm">
            {selectedFilter === 'all' ? 'İlk tahminini yap ve kuponunu oluştur!' : 'Farklı bir filtre seçmeyi deneyin'}
          </p>
        </div>
      )}
    </div>
  );
}