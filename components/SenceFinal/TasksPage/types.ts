export interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  icon?: string;
  completed: boolean;
  claimed: boolean;
  timeLeft?: string;
  actionType: 'navigate' | 'claim';
  navigationTarget?: '/home' | '/leagues' | '/gamehub' | null;
}

export type TaskTab = 'daily' | 'monthly';

export interface TaskCardProps {
  task: Task;
  onAction: (task: Task) => void;
}

export interface TasksListProps {
  tasks: Task[];
  onTaskAction: (task: Task) => void;
}

export interface TabsProps {
  activeTab: TaskTab;
  onChangeTab: (tab: TaskTab) => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onMenuToggle: () => void;
}

export interface ProgressSummaryProps {
  completed: number;
  total: number;
  claimed: number;
  showDailyTimer?: boolean;
  timeRemaining?: string;
}

export interface CalendarCardProps {
  monthNames: string[];
  dayNames: string[];
  currentMonth: number;
  currentYear: number;
  daysInMonth: number;
  firstDayOfMonth: number;
  today: number;
  loginDays: number[];
}
