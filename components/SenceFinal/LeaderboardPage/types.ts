// Leaderboard Types

export type LeaderboardTab = 'global' | 'friends';

export interface LeaderboardUser {
    id: string;
    username: string;
    full_name: string | null;
    profile_image: string | null;
    credits: number;
    level: number;
    rank: number;
}

export interface LeaderboardPageProps {
    onBack: () => void;
    onMenuToggle: () => void;
}

export interface PodiumProps {
    users: LeaderboardUser[];
    currentUserId?: string;
}

export interface LeaderboardListProps {
    users: LeaderboardUser[];
    currentUserId?: string;
    loading?: boolean;
    onRefresh?: () => void;
    refreshing?: boolean;
    ListHeaderComponent?: React.ReactElement | null;
    ListEmptyComponent?: React.ReactElement | null;
}

export interface LeaderboardItemProps {
    user: LeaderboardUser;
    isCurrentUser?: boolean;
}

export interface TabSwitcherProps {
    activeTab: LeaderboardTab;
    onTabChange: (tab: LeaderboardTab) => void;
}

export interface UserRankCardProps {
    rank: number;
    totalUsers: number;
    credits: number;
    profileImage?: string | null;
    username: string;
}

export interface PageHeaderProps {
    onBack: () => void;
    onMenuToggle: () => void;
}
