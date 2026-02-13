import { SubmittedQuestion, StatusBadgeColors } from './types';

// Mock submitted questions data
export const submittedQuestionsData: SubmittedQuestion[] = [
  {
    id: '1',
    title: "2024 yılında Türkiye'de elektrikli araç satışları %50 artacak mı?",
    description: "Türkiye'de elektrikli araç pazarının büyüme trendi devam edecek mi?",
    endDate: "2024-12-31",
    status: 'approved',
    submittedAt: "2024-01-15",
    isPublished: true,
    isApprovedAndPublished: true,
  },
  {
    id: '2',
    title: "ChatGPT-5 2024 yılında çıkacak mı?",
    description: "OpenAI'ın yeni modeli bu yıl piyasaya çıkacak mı?",
    endDate: "2024-12-31",
    status: 'pending',
    submittedAt: "2024-01-20",
    isPublished: false,
    isApprovedAndPublished: false,
  },
  {
    id: '3',
    title: "Bitcoin 2024'te 100.000$ seviyesini görecek mi?",
    description: "Kripto para piyasasındaki gelişmeler",
    endDate: "2024-12-31",
    status: 'rejected',
    submittedAt: "2024-01-10",
    isPublished: false,
    isApprovedAndPublished: false,
    rejectionReason: "Soru çok spekülatiif ve belirsiz kriterler içeriyor."
  }
];

// Date utilities
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const getMinDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const parseDateInput = (dateString: string): Date | null => {
  const [yearString, monthString, dayString] = dateString.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }
  }

  const fallback = new Date(dateString);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

// Status badge colors (dark theme)
export const getStatusBadgeColors = (status: string): StatusBadgeColors => {
  switch (status) {
    case 'approved':
      return {
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        dotColor: '#10B981',
        textColor: '#34D399',
        label: 'Onaylandı'
      };
    case 'pending':
      return {
        backgroundColor: 'rgba(245, 158, 11, 0.25)',
        dotColor: '#F59E0B',
        textColor: '#FCD34D',
        label: 'Bekliyor'
      };
    case 'rejected':
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
        dotColor: '#EF4444',
        textColor: '#FCA5A5',
        label: 'Reddedildi'
      };
    default:
      return {
        backgroundColor: 'rgba(107, 114, 128, 0.3)',
        dotColor: '#9CA3AF',
        textColor: '#D1D5DB',
        label: 'Bilinmiyor'
      };
  }
};

// Form validation
export const validateQuestionForm = (
  question: string,
  _description: string,
  endDate: string
): boolean => {
  if (!question.trim() || !endDate) {
    return false;
  }

  const selectedDate = parseDateInput(endDate);
  if (!selectedDate) {
    return false;
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedDateStart = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  return selectedDateStart >= todayStart;
};

// Guidelines data
export const guidelines = [
  "Sorular net ve anlaşılır olmalı",
  "Ölçülebilir ve doğrulanabilir kriterler içermeli",
  "Küfür, hakaret ve uygunsuz içerik yasak",
  "Bitiş tarihi geçmişte olamaz"
];

// Options data
export const optionsData = [
  {
    type: 'yes' as const,
    label: 'EVET',
    color: '#10B981',
    description: 'Sorunuzun gerçekleşeceğini düşünenler'
  },
  {
    type: 'no' as const,
    label: 'HAYIR',
    color: '#EF4444',
    description: 'Sorunuzun gerçekleşmeyeceğini düşünenler'
  }
];

