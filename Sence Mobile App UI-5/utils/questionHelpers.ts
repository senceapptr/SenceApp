import { featuredQuestions, questions } from '../constants/questions';

export const getFilteredQuestions = (selectedCategory: string) => {
  try {
    if (selectedCategory === 'all') {
      return questions;
    }
    if (selectedCategory === 'ending-soon') {
      return questions.filter(q => 
        q && q.timeLeft && (
          q.timeLeft.includes('saat') || 
          q.timeLeft.includes('1 gün') || 
          q.timeLeft.includes('2 gün')
        )
      );
    }
    return questions.filter(q => q && q.category === selectedCategory);
  } catch (error) {
    console.warn('Error filtering questions:', error);
    return [];
  }
};

export const findQuestionById = (questionId: number) => {
  try {
    if (!questionId || typeof questionId !== 'number') {
      return null;
    }
    
    const allQuestions = [...featuredQuestions, ...questions];
    return allQuestions.find(q => q && q.id === questionId) || null;
  } catch (error) {
    console.warn('Error finding question by ID:', error);
    return null;
  }
};

export const createVoteSelection = (questionId: number, vote: 'yes' | 'no', odds: number) => {
  try {
    if (!questionId || !vote || typeof odds !== 'number') {
      return null;
    }
    
    const question = findQuestionById(questionId);
    if (!question) return null;
    
    return {
      id: questionId,
      title: question.title || question.text || 'Başlıksız soru',
      vote,
      odds,
      category: question.category || 'Diğer'
    };
  } catch (error) {
    console.warn('Error creating vote selection:', error);
    return null;
  }
};

export const animateButtonFeedback = () => {
  try {
    const button = document.activeElement as HTMLElement;
    if (button && button.style) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (button.style) {
          button.style.transform = '';
        }
      }, 150);
    }
  } catch (error) {
    console.warn('Error animating button feedback:', error);
  }
};