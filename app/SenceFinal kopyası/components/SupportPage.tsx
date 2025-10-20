import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface SupportPageProps {
  onBack: () => void;
}

const SUPPORT_CATEGORIES = [
  { id: 'technical', label: 'Teknik Sorun', icon: '🔧' },
  { id: 'account', label: 'Hesap Sorunu', icon: '👤' },
  { id: 'payment', label: 'Ödeme & Kredi', icon: '💳' },
  { id: 'prediction', label: 'Tahmin Sorunu', icon: '🎯' },
  { id: 'league', label: 'Lig Sorunu', icon: '🏆' },
  { id: 'other', label: 'Diğer', icon: '📋' },
];

export function SupportPage({ onBack }: SupportPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Hata', 'Lütfen bir konu seçin.');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Hata', 'Lütfen bir konu başlığı girin.');
      return;
    }
    if (!message.trim() || message.length < 20) {
      Alert.alert('Hata', 'Lütfen en az 20 karakter mesaj girin.');
      return;
    }

    // In real app, send email via API
    const categoryLabel = SUPPORT_CATEGORIES.find(c => c.id === selectedCategory)?.label;
    console.log('Sending support email:', { category: categoryLabel, subject, message });

    Alert.alert(
      '✅ Gönderildi',
      'Destek talebiniz alındı. En kısa sürede size dönüş yapacağız.',
      [{ text: 'Tamam', onPress: onBack }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={theme.background} 
        />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backButton, { backgroundColor: theme.hover }]}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Destek</Text>
          
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.emoji}>🎧</Text>
            <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>
              Size nasıl yardımcı olabiliriz?
            </Text>
            <Text style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
              Sorunuzu detaylı anlatın, size en kısa sürede dönüş yapalım
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Konu Kategorisi *
              </Text>
              <View style={styles.categoriesGrid}>
                {SUPPORT_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      { 
                        backgroundColor: theme.surface,
                        borderColor: selectedCategory === category.id ? theme.primary : theme.border
                      },
                      selectedCategory === category.id && styles.selectedCategory
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryLabel,
                      { color: selectedCategory === category.id ? theme.primary : theme.textSecondary }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Subject */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Konu Başlığı *
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Sorunuzu kısaca özetleyin"
                  placeholderTextColor={theme.textMuted}
                  maxLength={100}
                />
              </View>
              <Text style={[styles.charCount, { color: theme.textMuted }]}>
                {subject.length}/100
              </Text>
            </View>

            {/* Message */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Mesaj İçeriği *
              </Text>
              <View style={[styles.textAreaContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.textArea, { color: theme.textPrimary }]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={8}
                  maxLength={1000}
                />
              </View>
              <Text style={[styles.charCount, { color: theme.textMuted }]}>
                {message.length}/1000 (min. 20 karakter)
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                style={styles.submitGradient}
              >
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.submitText}>Destek Talebi Gönder</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Info Box */}
            <View style={[styles.infoBox, { backgroundColor: theme.hover, borderColor: theme.border }]}>
              <Ionicons name="time-outline" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Destek ekibimiz ortalama 24 saat içinde geri dönüş yapıyor
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  headerInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtext: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 24,
    paddingBottom: 40,
  },
  section: {},
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  selectedCategory: {
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 16,
    color: '#111827',
  },
  textAreaContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  textArea: {
    fontSize: 16,
    color: '#111827',
    minHeight: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
});

