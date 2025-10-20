import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QuestionForm } from './QuestionForm';
import { OptionsInfo } from './OptionsInfo';
import { GuidelinesCard } from './GuidelinesCard';
import { SubmitButton } from './SubmitButton';
import { QuestionFormData } from '../../types';
import { validateQuestionForm } from '../../utils';

interface WriteTabProps {
  formData: QuestionFormData;
  onQuestionChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onEndDateChange: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const WriteTab: React.FC<WriteTabProps> = ({
  formData,
  onQuestionChange,
  onDescriptionChange,
  onEndDateChange,
  onSubmit,
  isSubmitting,
}) => {
  const isFormValid = validateQuestionForm(
    formData.question,
    formData.description,
    formData.endDate
  );

  return (
    <View style={styles.writeTabContent}>
      <QuestionForm
        question={formData.question}
        description={formData.description}
        endDate={formData.endDate}
        onQuestionChange={onQuestionChange}
        onDescriptionChange={onDescriptionChange}
        onEndDateChange={onEndDateChange}
      />
      
      <OptionsInfo />
      
      <GuidelinesCard />
      
      <SubmitButton
        onPress={onSubmit}
        disabled={!isFormValid || isSubmitting}
        isSubmitting={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  writeTabContent: {
    gap: 24,
  },
});


