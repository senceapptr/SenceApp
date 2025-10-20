import React from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'react-native';
import { WriteQuestionPageProps } from './types';
import { useWriteQuestionState, useQuestionForm, useFormHandlers } from './hooks';
import { WriteQuestionHeader } from './components/WriteQuestionHeader';
import { WriteQuestionTabs } from './components/WriteQuestionTabs';
import { SuccessMessage } from './components/SuccessMessage';
import { WriteTab } from './components/WriteTab';
import { StatusTab } from './components/StatusTab';

export function WriteQuestionPage({ onBack, onMenuToggle }: WriteQuestionPageProps) {
  const { activeTab, setActiveTab, submittedQuestions } = useWriteQuestionState();
  
  const {
    question,
    setQuestion,
    description,
    setDescription,
    endDate,
    setEndDate,
    formData,
    resetForm,
  } = useQuestionForm();

  const { handleSubmit, isSubmitting, showSuccess } = useFormHandlers(formData, resetForm);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <WriteQuestionHeader onBack={onBack} onMenuToggle={onMenuToggle} />
      
      <WriteQuestionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <SuccessMessage visible={showSuccess} />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'write' ? (
          <WriteTab
            formData={formData}
            onQuestionChange={setQuestion}
            onDescriptionChange={setDescription}
            onEndDateChange={setEndDate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <StatusTab questions={submittedQuestions} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});


