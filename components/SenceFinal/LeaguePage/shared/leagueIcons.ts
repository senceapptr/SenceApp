import { Ionicons } from '@expo/vector-icons';

export type LeagueIconName = 'trophy' | 'flame' | 'rocket' | 'star' | 'diamond' | 'football';

export interface LeagueIconOption {
  color: string;
  id: LeagueIconName;
}

export const DEFAULT_LEAGUE_ICON_NAME: LeagueIconName = 'trophy';
export const DEFAULT_LEAGUE_ICON_COLOR = '#FFD700';

export const LEAGUE_ICON_OPTIONS: LeagueIconOption[] = [
  { color: '#FFD700', id: 'trophy' },
  { color: '#FF6B35', id: 'flame' },
  { color: '#8B5CF6', id: 'rocket' },
  { color: '#FBBF24', id: 'star' },
  { color: '#06B6D4', id: 'diamond' },
  { color: '#256EFF', id: 'football' },
];

const ALLOWED_NAMES = new Set<LeagueIconName>(LEAGUE_ICON_OPTIONS.map(option => option.id));

export const isLeagueIconName = (value?: string | null): value is LeagueIconName =>
  !!value && ALLOWED_NAMES.has(value as LeagueIconName);

export const getLeagueIconColorByName = (name?: string | null): string => {
  if (!isLeagueIconName(name)) {
    return DEFAULT_LEAGUE_ICON_COLOR;
  }

  return LEAGUE_ICON_OPTIONS.find(option => option.id === name)?.color ?? DEFAULT_LEAGUE_ICON_COLOR;
};

export const resolveLeagueIcon = (iconName?: string | null, iconColor?: string | null) => {
  const safeName = isLeagueIconName(iconName) ? iconName : DEFAULT_LEAGUE_ICON_NAME;
  const fallbackColor = getLeagueIconColorByName(safeName);

  return {
    color: iconColor || fallbackColor,
    name: safeName as keyof typeof Ionicons.glyphMap,
  };
};
