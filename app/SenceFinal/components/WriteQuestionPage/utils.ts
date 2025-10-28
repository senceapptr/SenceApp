import { SubmittedQuestion, StatusBadgeColors } from './types';

// Mock submitted questions data
export const submittedQuestionsData: SubmittedQuestion[] = [
  {
    id: 1,
    title: "2024 yılında Türkiye'de elektrikli araç satışları %50 artacak mı?",
    description: "Türkiye'de elektrikli araç pazarının büyüme trendi devam edecek mi?",
    endDate: "2024-12-31",
    status: 'approved',
    submittedAt: "2024-01-15"
  },
  {
    id: 2,
    title: "ChatGPT-5 2024 yılında çıkacak mı?",
    description: "OpenAI'ın yeni modeli bu yıl piyasaya çıkacak mı?",
    endDate: "2024-12-31",
    status: 'pending',
    submittedAt: "2024-01-20"
  },
  {
    id: 3,
    title: "Bitcoin 2024'te 100.000$ seviyesini görecek mi?",
    description: "Kripto para piyasasındaki gelişmeler",
    endDate: "2024-12-31",
    status: 'rejected',
    submittedAt: "2024-01-10",
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

// Status badge colors
export const getStatusBadgeColors = (status: string): StatusBadgeColors => {
  switch (status) {
    case 'approved':
      return {
        backgroundColor: '#D1FAE5',
        dotColor: '#10B981',
        textColor: '#065F46',
        label: 'Onaylandı'
      };
    case 'pending':
      return {
        backgroundColor: '#FEF3C7',
        dotColor: '#F59E0B',
        textColor: '#92400E',
        label: 'Bekliyor'
      };
    case 'rejected':
      return {
        backgroundColor: '#FEE2E2',
        dotColor: '#EF4444',
        textColor: '#991B1B',
        label: 'Reddedildi'
      };
    default:
      return {
        backgroundColor: '#F2F3F5',
        dotColor: '#6B7280',
        textColor: '#374151',
        label: 'Bilinmiyor'
      };
  }
};

// Form validation
export const validateQuestionForm = (
  question: string,
  description: string,
  endDate: string
): boolean => {
  if (!question.trim() || !endDate) {
    return false;
  }
  
  // Check if the end date is in the future
  const today = new Date();
  const selectedDate = new Date(endDate);
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);
  
  return selectedDate >= oneWeekFromNow;
};

// Guidelines data
export const guidelines = [
  "Sorular net ve anlaşılır olmalı",
  "Ölçülebilir ve doğrulanabilir kriterler içermeli",
  "Küfür, hakaret ve uygunsuz içerik yasak",
  "Soruların bitiş tarihi en az 1 hafta olmalı"
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


