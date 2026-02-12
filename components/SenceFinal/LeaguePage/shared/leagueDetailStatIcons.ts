import { PRIMARY_BLUE } from './theme';

export const LEAGUE_DETAIL_STAT_ICONS = {
  endDate: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#EF4444',
    icon: 'calendar',
  },
  joinCost: {
    backgroundColor: 'rgba(139,92,246,0.15)',
    color: '#8B5CF6',
    icon: 'ticket',
  },
  participants: {
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    color: PRIMARY_BLUE,
    icon: 'people',
  },
  prize: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    color: '#F59E0B',
    icon: 'gift',
  },
} as const;
