import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { TabType, QuestionFormData, QuestionStatus, SubmittedQuestion } from './types';
import { submittedQuestionsData, validateQuestionForm } from './utils';
import { useAuth } from '@/contexts/AuthContext';
import { questionsService } from '@/services/questions.service';
import { categoriesService } from '@/services/categories.service';

const APPROVED_BACKEND_STATUSES = ['active', 'closed', 'resolved'];

const mapBackendStatusToUiStatus = (status: string): QuestionStatus => {
  if (status === 'draft') return 'pending';
  if (APPROVED_BACKEND_STATUSES.includes(status)) return 'approved';
  return 'rejected';
};

const isQuestionPublished = (question: any): boolean => {
  if (!APPROVED_BACKEND_STATUSES.includes(question.status)) return false;
  if (!question.publish_date) return true;

  const publishTimestamp = new Date(question.publish_date).getTime();
  return Number.isFinite(publishTimestamp) && publishTimestamp <= Date.now();
};

export const useWriteQuestionState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('write');
  const [submittedQuestions, setSubmittedQuestions] = useState<SubmittedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Kullanıcının sorularını yükle
  const loadUserQuestions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await questionsService.getUserQuestions(user.id);
      
      if (error) {
        console.error('Load user questions error:', error);
        // Hata durumunda mock data kullan
        setSubmittedQuestions(submittedQuestionsData);
        return;
      }

      // Backend verilerini frontend formatına çevir
      const mappedQuestions: SubmittedQuestion[] =
        data?.map((q: any) => {
          const status = mapBackendStatusToUiStatus(q.status);
          const published = isQuestionPublished(q);

          return {
            id: q.id,
            title: q.title,
            description: q.description || '',
            endDate: q.end_date,
            status,
            submittedAt: q.created_at,
            isPublished: published,
            isApprovedAndPublished: status === 'approved' && published,
            rejectionReason: status === 'rejected' ? 'İçerik kurallarına uygun değil' : undefined,
          };
        }) || [];

      setSubmittedQuestions(mappedQuestions);
    } catch (error) {
      console.error('Load user questions error:', error);
      // Hata durumunda mock data kullan
      setSubmittedQuestions(submittedQuestionsData);
    } finally {
      setLoading(false);
    }
  };

  // Tab değiştiğinde soruları yükle
  useEffect(() => {
    if (activeTab === 'status') {
      loadUserQuestions();
    }
  }, [activeTab, user]);

  return {
    activeTab,
    setActiveTab,
    submittedQuestions,
    loading,
    refreshQuestions: loadUserQuestions,
  };
};

export const useQuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const resetForm = () => {
    setQuestion('');
    setDescription('');
    setEndDate('');
    setCategoryIds([]);
  };

  const formData: QuestionFormData = {
    question,
    description,
    endDate,
    categoryIds,
  };

  return {
    question,
    setQuestion,
    description,
    setDescription,
    endDate,
    setEndDate,
    categoryIds,
    setCategoryIds,
    formData,
    resetForm,
  };
};

export const useFormHandlers = (
  formData: QuestionFormData,
  resetForm: () => void,
  refreshQuestions?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { user } = useAuth();

  // Kategorileri yükle
  const loadCategories = async () => {
    try {
      const { data, error } = await categoriesService.getActiveCategories();
      
      if (error) {
        console.error('Load categories error:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Hata', 'Kullanıcı girişi bulunamadı.');
      return;
    }

    const { question, description, endDate, categoryIds } = formData;

    if (!validateQuestionForm(question, description, endDate) || categoryIds.length === 0) {
      Alert.alert('Hata', 'Lütfen soru metni, bitiş tarihi ve en az bir kategori seçin.');
      return;
    }

    if (categoryIds.length > 3) {
      Alert.alert('Hata', 'En fazla 3 kategori seçebilirsiniz.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Soru oluştur
      const { data, error } = await questionsService.createQuestion({
        title: question.trim(),
        description: description.trim(),
        category_ids: categoryIds,
        end_date: endDate,
      }, user.id);

      if (error) {
        console.error('Create question error:', error);
        Alert.alert('Hata', error.message || 'Soru oluşturulurken bir hata oluştu.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      resetForm();
      
      // Soruları yenile
      if (refreshQuestions) {
        refreshQuestions();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Submit question error:', error);
      Alert.alert('Hata', 'Soru oluşturulurken bir hata oluştu.');
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    showSuccess,
    categories,
  };
};

