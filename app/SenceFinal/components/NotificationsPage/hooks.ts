import { useState } from 'react';
import { Notification } from './types';
import { mockNotifications, getUnreadCount } from './utils';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
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

  const unreadCount = getUnreadCount(notifications);

  return {
    notifications,
    animatingItems,
    markAsRead,
    clearAll,
    deleteNotification,
    unreadCount,
  };
};


