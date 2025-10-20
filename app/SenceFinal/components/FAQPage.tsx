import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: 'Tahmin nasıl yapılır?',
    answer: 'Anasayfada veya Keşfet sekmesinde istediğin soruyu seç, EVET veya HAYIR butonlarından birine tıkla. Tahminler kuponuna eklenecektir.',
    category: 'Tahminler'
  },
  {
    id: 2,
    question: 'Kredi nasıl kazanılır?',
    answer: 'Günlük görevleri tamamlayarak, doğru tahminlerle, liglerde başarılı olarak ve özel etkinliklere katılarak kredi kazanabilirsin.',
    category: 'Krediler'
  },
  {
    id: 3,
    question: 'Liglerden nasıl çıkabilirim?',
    answer: 'Ligler sekmesinde, Ligim kısmından ligini seç ve "Ligden Ayrıl" butonuna tıkla. Dikkat: Ayrıldığında lig puanların sıfırlanacak.',
    category: 'Ligler'
  },
  {
    id: 4,
    question: 'Kuponda yer alan tahmin değiştirilebilir mi?',
    answer: 'Evet, kuponuna eklediğin bir tahmin üzerine tekrar tıklayarak EVET veya HAYIR seçeneğini değiştirebilirsin.',
    category: 'Kuponlar'
  },
  {
    id: 5,
    question: 'Kazanılan krediler ne zaman hesaba geçer?',
    answer: 'Tahmin sonuçları açıklandığında kazandığın krediler otomatik olarak hesabına geçer. Bu genellikle sorunun bitiş süresinden sonra 1-2 saat içinde gerçekleşir.',
    category: 'Krediler'
  },
  {
    id: 6,
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Ayarlar sayfasının en altında "Hesabı Sil" seçeneği bulunur. Dikkat: Bu işlem geri alınamaz ve tüm verileriniz silinir.',
    category: 'Hesap'
  },
  {
    id: 7,
    question: 'Lig oluşturmak ücretsiz mi?',
    answer: 'Evet, lig oluşturmak tamamen ücretsizdir. İstersen giriş için kredi gereksinimi koyabilir veya ücretsiz bırakabilirsin.',
    category: 'Ligler'
  },
  {
    id: 8,
    question: 'Karanlık mod nasıl açılır?',
    answer: 'Ayarlar > Görünüm > Karanlık Mod toggle\'ını aktif et. Sistem ayarını takip edebilir veya manuel olarak açıp kapatabilirsin.',
    category: 'Ayarlar'
  },
];

export function FAQPage({ onBack }: FAQPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredFAQs = FAQ_DATA.filter(faq => 
    searchQuery === '' || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
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
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sıkça Sorulan Sorular</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.emoji}>❓</Text>
          <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>
            Cevapları Hemen Bul
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search" size={20} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Ara..."
              placeholderTextColor={theme.textMuted}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
            {filteredFAQs.length} sonuç bulundu
          </Text>

          {filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={[
                styles.faqCard,
                { backgroundColor: theme.surface, borderColor: theme.border }
              ]}
              onPress={() => toggleExpand(faq.id)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqQuestion}>
                  <Text style={[styles.categoryBadge, { color: theme.primary }]}>
                    {faq.category}
                  </Text>
                  <Text style={[styles.questionText, { color: theme.textPrimary }]}>
                    {faq.question}
                  </Text>
                </View>
                <Ionicons 
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.textMuted} 
                />
              </View>
              
              {expandedId === faq.id && (
                <View style={[styles.faqAnswer, { borderTopColor: theme.border }]}>
                  <Text style={[styles.answerText, { color: theme.textSecondary }]}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {filteredFAQs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Aradığınız soru bulunamadı
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 32,
    paddingBottom: 24,
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
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  faqContainer: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 40,
  },
  resultCount: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  faqCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#432870',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  faqAnswer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  answerText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});


