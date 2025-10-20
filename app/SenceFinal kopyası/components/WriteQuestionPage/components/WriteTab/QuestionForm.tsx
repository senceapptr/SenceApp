import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface QuestionFormProps {
  question: string;
  description: string;
  endDate: string;
  onQuestionChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onEndDateChange: (text: string) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  description,
  endDate,
  onQuestionChange,
  onDescriptionChange,
  onEndDateChange,
}) => {
  return (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Yeni Soru Oluştur</Text>
        <Text style={styles.formSubtitle}>
          Sorun incelendikten sonra yayınlanacak. Topluluk kurallarına uygun sorular yazın.
        </Text>
      </View>

      <View style={styles.formFields}>
        {/* Question Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Soru <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Örn: 2024 yılında Bitcoin 100.000$ seviyesini aşacak mı?"
            placeholderTextColor="rgba(32,32,32,0.4)"
            value={question}
            onChangeText={onQuestionChange}
            multiline
            textAlignVertical="top"
            maxLength={200}
          />
          <Text style={styles.characterCount}>
            {question.length}/200
          </Text>
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Soru Açıklaması <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.textArea, styles.descriptionArea]}
            placeholder="Sorunuz hakkında daha detaylı bilgi verin. Kriterler ve koşulları açıklayın."
            placeholderTextColor="rgba(32,32,32,0.4)"
            value={description}
            onChangeText={onDescriptionChange}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {description.length}/500
          </Text>
        </View>

        {/* End Date Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Bitiş Tarihi <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="rgba(32,32,32,0.4)"
            value={endDate}
            onChangeText={onEndDateChange}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
    lineHeight: 20,
  },
  formFields: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  requiredStar: {
    color: '#EF4444',
  },
  textArea: {
    backgroundColor: '#F2F3F5',
    borderWidth: 2,
    borderColor: 'rgba(67,40,112,0.2)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#202020',
    minHeight: 96,
    textAlignVertical: 'top',
  },
  descriptionArea: {
    minHeight: 128,
  },
  dateInput: {
    backgroundColor: '#F2F3F5',
    borderWidth: 2,
    borderColor: 'rgba(67,40,112,0.2)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#202020',
  },
  characterCount: {
    fontSize: 12,
    color: 'rgba(32,32,32,0.5)',
    textAlign: 'right',
  },
});


