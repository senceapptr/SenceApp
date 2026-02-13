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

export function WriteQuestionPage({ onBack, onOpenQuestionDetail }: WriteQuestionPageProps) {
  const { activeTab, setActiveTab, submittedQuestions, loading, refreshQuestions } = useWriteQuestionState();
  
  const {
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
  } = useQuestionForm();

  const { handleSubmit, isSubmitting, showSuccess, categories } = useFormHandlers(formData, resetForm, refreshQuestions);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      <WriteQuestionHeader onBack={onBack} />
      
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
            categories={categories}
            onQuestionChange={setQuestion}
            onDescriptionChange={setDescription}
            onEndDateChange={setEndDate}
            onCategoryChange={setCategoryIds}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <StatusTab
            questions={submittedQuestions}
            loading={loading}
            onOpenQuestionDetail={onOpenQuestionDetail}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  content: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
