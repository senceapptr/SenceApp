import { useState } from 'react';
import { Alert } from 'react-native';
import { TabType, QuestionFormData, SubmittedQuestion } from './types';
import { submittedQuestionsData, validateQuestionForm } from './utils';

export const useWriteQuestionState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('write');
  const [submittedQuestions] = useState<SubmittedQuestion[]>(submittedQuestionsData);

  return {
    activeTab,
    setActiveTab,
    submittedQuestions,
  };
};

export const useQuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');

  const resetForm = () => {
    setQuestion('');
    setDescription('');
    setEndDate('');
  };

  const formData: QuestionFormData = {
    question,
    description,
    endDate,
  };

  return {
    question,
    setQuestion,
    description,
    setDescription,
    endDate,
    setEndDate,
    formData,
    resetForm,
  };
};

export const useFormHandlers = (
  formData: QuestionFormData,
  resetForm: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    const { question, description, endDate } = formData;

    if (!validateQuestionForm(question, description, endDate)) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  return {
    handleSubmit,
    isSubmitting,
    showSuccess,
  };
};


