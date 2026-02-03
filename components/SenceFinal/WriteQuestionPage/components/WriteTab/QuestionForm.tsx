import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface QuestionFormProps {
  question: string;
  description: string;
  endDate: string;
  categoryIds: string[];
  categories: any[];
  onQuestionChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onEndDateChange: (text: string) => void;
  onCategoryChange: (categoryIds: string[]) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  description,
  endDate,
  categoryIds,
  categories,
  onQuestionChange,
  onDescriptionChange,
  onEndDateChange,
  onCategoryChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    endDate ? new Date(endDate) : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onEndDateChange(formattedDate);
    }
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  console.log('QuestionForm categories:', categories);
  console.log('QuestionForm categoryIds:', categoryIds);

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
            placeholderTextColor="#8B949E"
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
            Soru Açıklaması
          </Text>
          <TextInput
            style={[styles.textArea, styles.descriptionArea]}
            placeholder="Sorunuz hakkında daha detaylı bilgi verin. Kriterler ve koşulları açıklayın."
            placeholderTextColor="#8B949E"
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

        {/* Category Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Kategoriler <Text style={styles.requiredStar}>*</Text>
          </Text>
          
          {/* Açıklama metni */}
          <Text style={styles.categoryDescription}>
            İlk seçtiğiniz kategori ana kategori olacaktır. En fazla 3 kategori seçebilirsiniz.
          </Text>
          
          {/* Kategori pill'leri */}
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const isSelected = categoryIds.includes(category.id);
              const isPrimary = categoryIds[0] === category.id;
              const isSecondary = categoryIds[1] === category.id;
              const isThird = categoryIds[2] === category.id;
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillSelected,
                    isPrimary && styles.categoryPillPrimary,
                    isSecondary && styles.categoryPillSecondary,
                    isThird && styles.categoryPillThird
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      // Kategoriyi kaldır
                      const newCategoryIds = categoryIds.filter(id => id !== category.id);
                      onCategoryChange(newCategoryIds);
                    } else if (categoryIds.length < 3) {
                      // Kategoriyi ekle
                      const newCategoryIds = [...categoryIds, category.id];
                      onCategoryChange(newCategoryIds);
                    }
                  }}
                  disabled={!isSelected && categoryIds.length >= 3}
                >
                  <Text style={[
                    styles.categoryPillIcon,
                    isSelected && styles.categoryPillIconSelected
                  ]}>
                    {category.icon}
                  </Text>
                  <Text style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected
                  ]}>
                    {category.name}
                  </Text>
                  {isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>ANA</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* End Date Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Bitiş Tarihi <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateText, !endDate && styles.placeholderText]}>
              {endDate ? formatDateForDisplay(endDate) : 'Tarih seçin'}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
              locale="tr-TR"
            />
          )}
        </View>
      </View>

      {/* Category Selection Modal */}
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#8B949E',
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
    color: '#F0F6FC',
  },
  requiredStar: {
    color: '#EF4444',
  },
  textArea: {
    backgroundColor: '#21262D',
    borderWidth: 2,
    borderColor: '#30363D',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#F0F6FC',
    minHeight: 96,
    textAlignVertical: 'top',
  },
  descriptionArea: {
    minHeight: 128,
  },
  dateInput: {
    backgroundColor: '#21262D',
    borderWidth: 2,
    borderColor: '#30363D',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  dateText: {
    fontSize: 16,
    color: '#F0F6FC',
  },
  placeholderText: {
    color: '#8B949E',
  },
  characterCount: {
    fontSize: 12,
    color: '#8B949E',
    textAlign: 'right',
  },
  pickerContainer: {
    backgroundColor: '#21262D',
    borderWidth: 2,
    borderColor: '#30363D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    color: '#F0F6FC',
  },
  categoryButton: {
    backgroundColor: '#21262D',
    borderWidth: 2,
    borderColor: '#30363D',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    minHeight: 56,
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#F0F6FC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#21262D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#8B949E',
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  categoryItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryItemContent: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 4,
  },
  categoryItemDescription: {
    fontSize: 14,
    color: '#8B949E',
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderColor: '#10B981',
  },
  categoryItemCheckmark: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#8B949E',
    fontWeight: '400',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262D',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#30363D',
    minWidth: 100,
    justifyContent: 'center',
    position: 'relative',
  },
  categoryPillSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryPillPrimary: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    transform: [{ scale: 1.05 }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryPillSecondary: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  categoryPillThird: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  categoryPillIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#8B949E',
  },
  categoryPillIconSelected: {
    color: '#FFFFFF',
  },
  categoryPillText: {
    fontSize: 14,
    color: '#8B949E',
    fontWeight: '600',
  },
  categoryPillTextSelected: {
    color: '#FFFFFF',
  },
  primaryBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 30,
    alignItems: 'center',
  },
  primaryBadgeText: {
    fontSize: 10,
    color: '#0D1117',
    fontWeight: '900',
  },
});


