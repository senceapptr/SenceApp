import { Question, CouponSelection } from '../types';
import { questions, featuredQuestions } from '../constants/questions';

export const findQuestionById = (id: number): Question | null => {
  const allQuestions = [...featuredQuestions, ...questions];
  return allQuestions.find(q => q.id === id) || null;
};

export const createVoteSelection = (questionId: number, vote: 'yes' | 'no', odds: number): CouponSelection | null => {
  const question = findQuestionById(questionId);
  if (!question) return null;
  
  return {
    id: questionId,
    title: question.title,
    vote,
    odds
  };
};

export const getFilteredQuestions = (selectedCategory: string): Question[] => {
  const allQuestions = [...questions];
  
  switch (selectedCategory) {
    case 'ending-soon':
      return allQuestions.sort((a, b) => {
        const timeA = parseTimeLeft(a.timeLeft);
        const timeB = parseTimeLeft(b.timeLeft);
        return timeA - timeB;
      });
    case 'popular':
      return allQuestions.sort((a, b) => {
        const votesA = parseVotes(a.votes);
        const votesB = parseVotes(b.votes);
        return votesB - votesA;
      });
    case 'teknoloji':
      return allQuestions.filter(q => q.category === 'teknoloji');
    case 'spor':
      return allQuestions.filter(q => q.category === 'spor');
    case 'kripto':
      return allQuestions.filter(q => q.category === 'kripto');
    case 'politika':
      return allQuestions.filter(q => q.category === 'politika');
    default:
      return allQuestions;
  }
};

const parseTimeLeft = (timeLeft: string): number => {
  const timeStr = timeLeft.toLowerCase();
  if (timeStr.includes('saat')) {
    const hours = parseInt(timeStr.match(/\d+/)?.[0] || '0');
    return hours;
  } else if (timeStr.includes('gün')) {
    const days = parseInt(timeStr.match(/\d+/)?.[0] || '0');
    return days * 24;
  } else if (timeStr.includes('hafta')) {
    const weeks = parseInt(timeStr.match(/\d+/)?.[0] || '0');
    return weeks * 24 * 7;
  }
  return 0;
};

const parseVotes = (votes: string): number => {
  const voteStr = votes.toLowerCase();
  if (voteStr.includes('k')) {
    const num = parseFloat(voteStr.match(/[\d,\.]+/)?.[0]?.replace(',', '.') || '0');
    return num * 1000;
  }
  return parseInt(voteStr.match(/\d+/)?.[0] || '0');
};

export const animateButtonFeedback = () => {
  // React Native animation would go here
  // For now, we'll just log the action
  console.log('Button animation triggered');
}; 