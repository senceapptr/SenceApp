interface NotificationsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPage({ isOpen, onClose }: NotificationsPageProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'vote_result',
      title: 'Tahminiz Kazandı! 🎉',
      message: 'Lakers playoff tahmininde haklı çıktınız. 28 puan kazandınız!',
      time: '2 dk önce',
      isRead: false,
      icon: '🏆',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 2,
      type: 'new_question',
      title: 'Yeni Trend Soru',
      message: 'Barcelona Real Madrid\'i yenecek mi? sorusu trend oluyor!',
      time: '15 dk önce',
      isRead: false,
      icon: '🔥',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 3,
      type: 'ending_soon',
      title: 'Son Dakika!',
      message: 'Bitcoin 100K sorusu 1 saat içinde kapanıyor. Tahminini yap!',
      time: '1 sa önce',
      isRead: true,
      icon: '⏰',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 4,
      type: 'friend_activity',
      title: 'Arkadaşın Tahmin Yaptı',
      message: '@ahmet_y Tesla sorusuna EVET dedi. Sen ne düşünüyorsun?',
      time: '3 sa önce',
      isRead: true,
      icon: '👥',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Rozet Kazandın! 🏅',
      message: 'Spor kategorisinde 10 doğru tahmin yaparak "Spor Uzmanı" rozetini kazandın!',
      time: '1 gün önce',
      isRead: true,
      icon: '🎯',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 6,
      type: 'coupon_result',
      title: 'Kupon Sonuçlandı',
      message: '4\'lü kuponunuz yarı yarıya tuttu. 12 puan kazandınız.',
      time: '2 gün önce',
      isRead: true,
      icon: '📋',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Notifications Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl h-[85vh] flex flex-col overflow-hidden">
          {/* Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h1 className="font-bold text-xl text-gray-900">Bildirimler</h1>
              <p className="text-sm text-gray-600">
                {notifications.filter(n => !n.isRead).length} okunmamış bildirim
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-5 flex gap-3 border-b border-gray-100 flex-shrink-0">
            <button className="flex-1 bg-gradient-to-r from-[#6B46F0] to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all">
              Tümünü Okundu İşaretle
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all">
              Ayarlar
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-4">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={`
                    relative rounded-2xl border transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer
                    animate-in fade-in-0 slide-in-from-bottom-4
                    ${notification.isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                    }
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0
                        bg-gradient-to-r ${notification.color}
                      `}>
                        <span className="text-xl">{notification.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`
                            font-bold leading-tight
                            ${notification.isRead ? 'text-gray-900' : 'text-gray-900'}
                          `}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                          )}
                        </div>
                        <p className={`
                          text-sm leading-relaxed mb-2
                          ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}
                        `}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {notification.time}
                          </span>
                          {notification.type === 'vote_result' && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              Kazanç
                            </span>
                          )}
                          {notification.type === 'new_question' && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                              Tahmin Et
                            </span>
                          )}
                          {notification.type === 'ending_soon' && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                              Acele Et
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Empty State için placeholder */}
            {notifications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="font-semibold text-gray-900 mb-2">Hiç bildirim yok</h3>
                <p className="text-gray-600">Yeni bildirimler burada görünecek</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}