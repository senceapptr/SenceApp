import { featuredQuestions, questions } from '../constants/questions';

export const getFilteredQuestions = (selectedCategory: string) => {
  if (selectedCategory === 'all') {
    return questions;
  }
  if (selectedCategory === 'ending-soon') {
    return questions.filter(q => 
      q.timeLeft.includes('saat') || 
      q.timeLeft.includes('1 gün') || 
      q.timeLeft.includes('2 gün')
    );
  }
  return questions.filter(q => q.category === selectedCategory);
};

export const findQuestionById = (questionId: number) => {
  return [...featuredQuestions, ...questions].find(q => q.id === questionId);
};

export const createVoteSelection = (questionId: number, vote: 'yes' | 'no', odds: number) => {
  const question = findQuestionById(questionId);
  if (!question) return null;
  
  return {
    id: questionId,
    title: question.title,
    vote,
    odds,
    category: question.category
  };
};

export const animateButtonFeedback = () => {
  const button = document.activeElement as HTMLElement;
  if (button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
};