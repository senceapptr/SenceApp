import { useState } from 'react';

export function MyBetsPage() {
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
      case 'won': return 'text-[#00AF54]';
      case 'lost': return 'text-[#FF4E4E]';
      case 'pending': return 'text-[#F5A623]';
      default: return 'text-gray-500';
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
      case 'won': return 'bg-green-50 border-green-200';
      case 'lost': return 'bg-red-50 border-red-200';
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
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
    <div className="flex-1 px-5 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-gray-900 mb-4">Kuponlarım</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-4 text-center">
            <div className="text-[#F5A623] font-bold text-xl">{pendingCount}</div>
            <div className="text-yellow-700 font-medium text-sm">Bekleyen</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 text-center">
            <div className="text-[#00AF54] font-bold text-xl">{totalWon}</div>
            <div className="text-green-700 font-medium text-sm">Kazanç</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 text-center">
            <div className="text-[#FF4E4E] font-bold text-xl">{totalLost}</div>
            <div className="text-red-700 font-medium text-sm">Kayıp</div>
          </div>
        </div>
      </div>

      {/* Tıklanabilir Filtreler */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm ${
              filter.id === selectedFilter 
                ? 'bg-[#6B46F0] text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Bets List */}
      <div className="space-y-4">
        {filteredBets.map((bet) => (
          <div key={bet.id} className={`bg-white rounded-2xl border shadow-sm ${getStatusBg(bet.status)}`}>
            {/* Bet Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getStatusColor(bet.status)}`}>
                    {getStatusText(bet.status)}
                  </span>
                  {bet.status === 'pending' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      Sonuç Bekleniyor
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">{bet.date}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {bet.amount} puan • {bet.odds}x oran
                </div>
              </div>
              <div className="text-right">
                {bet.status === 'won' && (
                  <div className="text-[#00AF54] font-bold text-lg">+{bet.payout}</div>
                )}
                {bet.status === 'lost' && (
                  <div className="text-[#FF4E4E] font-bold text-lg">-{bet.amount}</div>
                )}
                {bet.status === 'pending' && (
                  <div className="text-[#F5A623] font-bold text-lg">{bet.payout}</div>
                )}
              </div>
            </div>

            {/* Selections */}
            <div className="p-4 space-y-3">
              {bet.selections.map((selection, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 leading-tight">
                      {selection.question}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selection.vote === 'Evet' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {selection.vote}
                      </span>
                      <span className="text-xs text-[#6B46F0] font-bold bg-purple-100 px-2 py-1 rounded-full">
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
        <div className="text-center text-gray-500 mt-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="font-semibold text-lg mb-2">
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