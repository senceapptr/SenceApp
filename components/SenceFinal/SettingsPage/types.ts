export interface SettingsPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  onEditProfile?: () => void;
  onPrivacySettings?: () => void;
  onSecurity?: () => void;
  onHelpCenter?: () => void;
  onFeedback?: () => void;
  onAbout?: () => void;
}

export type SettingType = 'toggle' | 'select' | 'navigate';

export interface SettingItem {
  key: string;
  label: string;
  description: string;
  type: SettingType;
}

export interface SettingSection {
  title: string;
  items: SettingItem[];
}

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
  color: string;
}

export interface SettingsState {
  notifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
}

// Component Props
export interface PageHeaderProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export interface UserCardProps {
  username: string;
  avatarUrl: string;
  onPress?: () => void;
}

export interface SettingSectionProps {
  section: SettingSection;
  settings: SettingsState;
  isDarkMode: boolean;
  onToggleSetting: (key: string) => void;
  onNavigate: (key: string) => void;
}

export interface SettingCardProps {
  item: SettingItem;
  settings: SettingsState;
  isDarkMode: boolean;
  onToggle: (key: string) => void;
  onNavigate: (key: string) => void;
}

export interface SettingSwitchProps {
  value: boolean;
  onValueChange: () => void;
  isDarkMode: boolean;
}

export interface SocialButtonProps {
  social: SocialLink;
  onPress: () => void;
  isDarkMode: boolean;
}

export interface SocialSectionProps {
  socialLinks: SocialLink[];
  onSocialPress: (url: string) => void;
  isDarkMode: boolean;
}

export interface DangerButtonProps {
  onPress: () => void;
  isDarkMode: boolean;
}

