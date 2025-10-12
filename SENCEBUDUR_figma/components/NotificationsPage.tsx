import { useState } from 'react';

interface NotificationsPageProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function NotificationsPage({ isOpen = true, onClose }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'prediction',
      title: 'Tahmin Sonuçlandı',
      message: '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
      time: '2 dk önce',
      read: false,
      icon: '🎯',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 2,
      type: 'league',
      title: 'Liga Sıralaması',
      message: 'Spor liginde 3. sıraya yükseldin!',
      time: '15 dk önce',
      read: false,
      icon: '🏆',
      color: 'from-[#432870] to-[#B29EFD]'
    },
    {
      id: 3,
      type: 'friend',
      title: 'Yeni Takipçi',
      message: 'ahmet_bey seni takip etmeye başladı',
      time: '1 saat önce',
      read: true,
      icon: '👥',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 4,
      type: 'prediction',
      title: 'Tahmin Hatırlatması',
      message: '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
      time: '2 saat önce',
      read: true,
      icon: '⏰',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      type: 'system',
      title: 'Günlük Bonus',
      message: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
      time: '1 gün önce',
      read: true,
      icon: '🎁',
      color: 'from-[#B29EFD] to-[#432870]'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:scale-102 hover:shadow-lg ${
        notification.read 
          ? 'bg-white border-[#F2F3F5] opacity-80' 
          : 'bg-gradient-to-r from-[#432870]/5 to-[#B29EFD]/5 border-[#432870]/20 shadow-md'
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${notification.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <span className="text-white text-lg">{notification.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-black text-sm ${notification.read ? 'text-[#202020]/70' : 'text-[#202020]'}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-[#B29EFD] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          
          <p className={`text-sm mb-2 leading-relaxed ${notification.read ? 'text-[#202020]/60' : 'text-[#202020]/80'}`}>
            {notification.message}
          </p>
          
          <p className={`text-xs ${notification.read ? 'text-[#202020]/50' : 'text-[#432870] font-bold'}`}>
            {notification.time}
          </p>
        </div>
      </div>
    </div>
  );

  // Modal version (when isOpen prop is used)
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-2">
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-[#F2F3F5] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-[#F2F3F5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-[#202020] font-black text-xl">Bildirimler</h2>
                {unreadCount > 0 && (
                  <p className="text-[#432870] text-sm font-bold">{unreadCount} okunmamış</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={clearAll}
                  className="bg-[#B29EFD] hover:bg-[#A688F7] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                >
                  Tümünü Oku
                </button>
              )}
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F2F3F5] hover:bg-gray-200 flex items-center justify-center text-[#202020] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#F2F3F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔔</span>
                </div>
                <h3 className="text-[#202020] font-black text-lg mb-2">Henüz Bildirim Yok</h3>
                <p className="text-[#202020]/70 text-sm">
                  Tahmin yaptıkça buraya bildirimler gelecek.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full page version
  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-16 bg-white border-b border-[#F2F3F5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h1 className="text-[#202020] font-black text-xl">Bildirimler</h1>
            {unreadCount > 0 && (
              <p className="text-[#432870] text-sm font-bold">{unreadCount} okunmamış</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={clearAll}
            className="bg-[#432870] hover:bg-[#5A3A8B] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
          >
            Tümünü Oku
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-6 space-y-4 pb-24">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">🔔</span>
            </div>
            <h2 className="text-[#202020] font-black text-xl mb-4">Henüz Bildirim Yok</h2>
            <p className="text-[#202020]/70 text-base leading-relaxed max-w-sm mx-auto">
              Tahmin yaptıkça, liga katıldıkça ve sosyal etkileşimlerde bulundukça buraya bildirimler gelecek.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}