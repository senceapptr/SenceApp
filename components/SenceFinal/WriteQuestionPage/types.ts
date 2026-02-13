export interface WriteQuestionPageProps {
  onBack: () => void;
  onOpenQuestionDetail: (questionId: string) => void;
}

export interface SubmittedQuestion {
  id: string;
  title: string;
  description: string;
  endDate: string;
  status: QuestionStatus;
  submittedAt: string;
  isPublished: boolean;
  isApprovedAndPublished: boolean;
  rejectionReason?: string;
}

export type QuestionStatus = 'pending' | 'approved' | 'rejected';

export type TabType = 'write' | 'status';

export interface QuestionFormData {
  question: string;
  description: string;
  endDate: string;
  categoryIds: string[];
}

export interface FormHandlers {
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  showSuccess: boolean;
}

export interface StatusBadgeColors {
  backgroundColor: string;
  dotColor: string;
  textColor: string;
  label: string;
}
