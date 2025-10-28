export type PageType = 'home' | 'discover' | 'coupons' | 'leagues' | 'writeQuestion' | 'tasks' | 'settings' | 'market' | 'notifications' | 'profile' | 'questionCardDesign';

export interface MenuItem {
  id: number;
  title: string;
  highlight: boolean;
  page: PageType | null;
}

export interface MenuItemAnimation {
  opacity: any;
  translateX: any;
  scale: any;
}








