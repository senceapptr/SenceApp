export interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  completed: boolean;
  timeLeft?: string;
}

export type TaskTab = 'daily' | 'monthly';

export interface TasksListProps {
  tasks: Task[];
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
  showDailyTimer?: boolean;
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



