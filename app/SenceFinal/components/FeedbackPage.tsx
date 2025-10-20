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

interface FeedbackPageProps {
  onBack: () => void;
}

const FEEDBACK_TYPES = [
  { id: 'suggestion', label: 'Öneri', icon: '💡', color: '#F59E0B' },
  { id: 'bug', label: 'Hata Bildirimi', icon: '🐛', color: '#EF4444' },
  { id: 'feature', label: 'Özellik İsteği', icon: '✨', color: '#8B5CF6' },
  { id: 'improvement', label: 'İyileştirme', icon: '🚀', color: '#10B981' },
  { id: 'compliment', label: 'Teşekkür', icon: '❤️', color: '#EC4899' },
  { id: 'other', label: 'Diğer', icon: '📝', color: '#6B7280' },
];

export function FeedbackPage({ onBack }: FeedbackPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [selectedType, setSelectedType] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Hata', 'Lütfen bir geri bildirim türü seçin.');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Hata', 'Lütfen bir konu başlığı girin.');
      return;
    }
    if (!feedback.trim() || feedback.length < 10) {
      Alert.alert('Hata', 'Lütfen en az 10 karakter geri bildirim girin.');
      return;
    }

    const typeLabel = FEEDBACK_TYPES.find(t => t.id === selectedType)?.label;
    console.log('Sending feedback email:', { type: typeLabel, subject, feedback });

    Alert.alert(
      '✅ Gönderildi',
      'Geri bildiriminiz için teşekkürler! Önerileriniz bizim için çok değerli.',
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
          
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Geri Bildirim</Text>
          
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.emoji}>💬</Text>
            <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>
              Fikirlerinizi Paylaşın
            </Text>
            <Text style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
              Önerileriniz Sence'i daha iyi yapmamıza yardımcı oluyor
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Feedback Type */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Geri Bildirim Türü *
              </Text>
              <View style={styles.typesGrid}>
                {FEEDBACK_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      { 
                        backgroundColor: theme.surface,
                        borderColor: selectedType === type.id ? type.color : theme.border
                      },
                      selectedType === type.id && { borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedType(type.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={[
                      styles.typeLabel,
                      { color: selectedType === type.id ? type.color : theme.textSecondary }
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Subject */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Başlık *
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Geri bildiriminizi özetleyin"
                  placeholderTextColor={theme.textMuted}
                  maxLength={80}
                />
              </View>
              <Text style={[styles.charCount, { color: theme.textMuted }]}>
                {subject.length}/80
              </Text>
            </View>

            {/* Feedback */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Geri Bildiriminiz *
              </Text>
              <View style={[styles.textAreaContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.textArea, { color: theme.textPrimary }]}
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder="Düşüncelerinizi detaylı bir şekilde paylaşın..."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={8}
                  maxLength={800}
                />
              </View>
              <Text style={[styles.charCount, { color: theme.textMuted }]}>
                {feedback.length}/800 (min. 10 karakter)
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
                <Ionicons name="paper-plane" size={20} color="white" />
                <Text style={styles.submitText}>Geri Bildirimi Gönder</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Info Box */}
            <View style={[styles.infoBox, { backgroundColor: theme.hover, borderColor: theme.border }]}>
              <Text style={styles.infoEmoji}>💜</Text>
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Her geri bildirim bizim için değerlidir. Teşekkür ederiz!
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
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '31%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  typeIcon: {
    fontSize: 24,
  },
  typeLabel: {
    fontSize: 11,
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
  infoEmoji: {
    fontSize: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
});


