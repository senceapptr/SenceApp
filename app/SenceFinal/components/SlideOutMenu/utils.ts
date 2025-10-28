import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  { id: 1, title: 'Bildirimler', highlight: false, page: 'notifications' },
  { id: 2, title: 'Trivia', highlight: true, page: null },
  { id: 3, title: 'Swipe', highlight: true, page: null },
  { id: 4, title: 'Soru Yaz', highlight: false, page: 'writeQuestion' },
  { id: 5, title: 'Soru Kartları', highlight: false, page: 'questionCardDesign' },
  { id: 6, title: 'Görevler', highlight: false, page: 'tasks' },
  { id: 7, title: 'Market', highlight: false, page: 'market' },
  { id: 8, title: 'Ayarlar', highlight: false, page: 'settings' },
];

export const userProfile = {
  name: 'Ahmet Yılmaz',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  balance: 2450.00,
  isOnline: true
};








