import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PendingQuestion } from '@/services/admin.service';
import { adminService } from '@/services/admin.service';

interface EditQuestionModalProps {
  visible: boolean;
  question: PendingQuestion | null;
  onClose: () => void;
  onSave: () => void;
}

interface Category {
  id: string;
  name: string;
}

export function EditQuestionModal({ visible, question, onClose, onSave }: EditQuestionModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [secondaryCategoryId, setSecondaryCategoryId] = useState('');
  const [thirdCategoryId, setThirdCategoryId] = useState('');
  const [endDate, setEndDate] = useState('');

  // Kategorileri yükle
  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  // Soru verilerini form'a yükle
  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setDescription(question.description || '');
      setCategoryId(question.category_id || '');
      setSecondaryCategoryId(question.secondary_category_id || '');
      setThirdCategoryId(question.third_category_id || '');
      setEndDate(question.end_date ? new Date(question.end_date).toISOString().split('T')[0] : '');
    }
  }, [question]);

  const loadCategories = async () => {
    try {
      const { data, error } = await adminService.getCategories();
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
      Alert.alert('Hata', 'Kategoriler yüklenemedi');
    }
  };

  const handleSave = async () => {
    if (!question) return;

    if (!title.trim()) {
      Alert.alert('Hata', 'Soru başlığı gereklidir');
      return;
    }

    if (!categoryId) {
      Alert.alert('Hata', 'Ana kategori seçilmelidir');
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        end_date: endDate ? new Date(endDate).toISOString() : null,
      };

      // Sadece seçilmiş kategorileri ekle
      if (secondaryCategoryId) {
        updateData.secondary_category_id = secondaryCategoryId;
      } else {
        updateData.secondary_category_id = null;
      }

      if (thirdCategoryId) {
        updateData.third_category_id = thirdCategoryId;
      } else {
        updateData.third_category_id = null;
      }

      const { error } = await adminService.updateQuestion(question.id, updateData);
      
      if (error) {
        Alert.alert('Hata', 'Soru güncellenirken bir hata oluştu');
        return;
      }

      Alert.alert('Başarılı', 'Soru başarıyla güncellendi');
      onSave();
      onClose();
    } catch (error) {
      console.error('Update question error:', error);
      Alert.alert('Hata', 'Soru güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryPicker = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    required: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerText}>
          {value ? categories.find(c => c.id === value)?.name || 'Kategori Seçin' : 'Kategori Seçin'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </View>
      <ScrollView style={styles.categoryList} nestedScrollEnabled>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              value === category.id && styles.selectedCategory
            ]}
            onPress={() => onChange(category.id)}
          >
            <Text style={[
              styles.categoryItemText,
              value === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
            {value === category.id && (
              <Ionicons name="checkmark" size={16} color="#432870" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (!question) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Soru Düzenle</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            style={styles.saveButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Soru Başlığı */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Soru Başlığı <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Soru başlığını girin"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Soru Açıklaması */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Açıklama</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Soru açıklamasını girin"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Ana Kategori */}
          {renderCategoryPicker('Ana Kategori', categoryId, setCategoryId, true)}

          {/* İkincil Kategori */}
          {renderCategoryPicker('İkincil Kategori', secondaryCategoryId, setSecondaryCategoryId)}

          {/* Üçüncül Kategori */}
          {renderCategoryPicker('Üçüncül Kategori', thirdCategoryId, setThirdCategoryId)}

          {/* Bitiş Tarihi */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bitiş Tarihi</Text>
            <TextInput
              style={styles.textInput}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#432870',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  categoryList: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedCategory: {
    backgroundColor: '#F3F4F6',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedCategoryText: {
    color: '#432870',
    fontWeight: '600',
  },
});
