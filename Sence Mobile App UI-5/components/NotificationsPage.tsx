import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
      color: 'from-emerald-500 to-green-600',
      reward: '+250 kredi'
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
      read: false,
      icon: '👥',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 4,
      type: 'prediction',
      title: 'Tahmin Hatırlatması',
      message: '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
      time: '2 saat önce',
      read: true,
      icon: '⏰',
      color: 'from-orange-500 to-amber-500'
    },
    {
      id: 5,
      type: 'system',
      title: 'Günlük Bonus',
      message: 'Günlük giriş bonusun hazır! 100 kredi kazandın',
      time: '1 gün önce',
      read: true,
      icon: '🎁',
      color: 'from-[#C9F158] to-[#353831]',
      reward: '+100 kredi'
    }
  ]);

  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());

  const markAsRead = (id: number) => {
    // Add micro animation
    setAnimatingItems(prev => new Set([...prev, id]));
    
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 200);
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  const NotificationItem = ({ notification }: { notification: any }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: animatingItems.has(notification.id) ? 0.98 : 1 
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3, 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group ${
        notification.read 
          ? 'bg-white/80 border-gray-100 hover:bg-white hover:shadow-md' 
          : 'bg-white border-[#432870]/10 shadow-md hover:shadow-lg hover:border-[#432870]/20'
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      {/* Subtle gradient overlay for unread */}
      {!notification.read && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#432870]/5 via-transparent to-[#B29EFD]/5 opacity-60" />
      )}

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          {/* Icon with micro animation */}
          <motion.div 
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${notification.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-white text-xl">{notification.icon}</span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className={`font-bold text-base ${notification.read ? 'text-[#202020]/70' : 'text-[#202020]'}`}>
                {notification.title}
              </h4>
              {!notification.read && (
                <motion.div 
                  className="w-2.5 h-2.5 bg-[#432870] rounded-full flex-shrink-0 mt-1.5"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              )}
            </div>
            
            <p className={`text-sm mb-3 leading-relaxed ${notification.read ? 'text-[#202020]/60' : 'text-[#202020]/80'}`}>
              {notification.message}
            </p>

            <div className="flex items-center justify-between">
              <p className={`text-xs ${notification.read ? 'text-[#202020]/50' : 'text-[#432870] font-semibold'}`}>
                {notification.time}
              </p>
              
              {notification.reward && (
                <div className="bg-gradient-to-r from-[#C9F158]/20 to-[#353831]/20 text-[#353831] px-3 py-1 rounded-full text-xs font-bold">
                  {notification.reward}
                </div>
              )}
            </div>
          </div>

          {/* Delete button - appears on hover */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all"
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notification.id);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Modal version (when isOpen prop is used)
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-[#432870] to-[#B29EFD] rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-[#202020] font-bold text-xl">Bildirimler</h2>
                {unreadCount > 0 && (
                  <p className="text-[#432870] text-sm font-semibold">{unreadCount} okunmamış</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAll}
                  className="bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#A688F7] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Tümünü Oku
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#202020] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {notifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔔</span>
                  </div>
                  <h3 className="text-[#202020] font-bold text-lg mb-2">Henüz Bildirim Yok</h3>
                  <p className="text-[#202020]/70 text-sm">
                    Tahmin yaptıkça buraya bildirimler gelecek.
                  </p>
                </motion.div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  // Full page version
  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-16 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-[#432870] to-[#B29EFD] rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </motion.div>
          <div>
            <h1 className="text-[#202020] font-bold text-xl">Bildirimler</h1>
            {unreadCount > 0 && (
              <p className="text-[#432870] text-sm font-semibold">{unreadCount} okunmamış</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAll}
            className="bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#A688F7] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Tümünü Oku
          </motion.button>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-6 space-y-4 pb-24">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔔</span>
              </div>
              <h2 className="text-[#202020] font-bold text-xl mb-4">Henüz Bildirim Yok</h2>
              <p className="text-[#202020]/70 text-base leading-relaxed max-w-sm mx-auto">
                Tahmin yaptıkça, liga katıldıkça ve sosyal etkileşimlerde bulundukça buraya bildirimler gelecek.
              </p>
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}