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
  Dimensions,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WriteQuestionPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

interface SubmittedQuestion {
  id: number;
  title: string;
  description: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
}

export function WriteQuestionPage({ onBack, onMenuToggle }: WriteQuestionPageProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'status'>('write');
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock submitted questions data
  const [submittedQuestions] = useState<SubmittedQuestion[]>([
    {
      id: 1,
      title: "2024 yılında Türkiye'de elektrikli araç satışları %50 artacak mı?",
      description: "Türkiye'de elektrikli araç pazarının büyüme trendi devam edecek mi?",
      endDate: "2024-12-31",
      status: 'approved',
      submittedAt: "2024-01-15"
    },
    {
      id: 2,
      title: "ChatGPT-5 2024 yılında çıkacak mı?",
      description: "OpenAI'ın yeni modeli bu yıl piyasaya çıkacak mı?",
      endDate: "2024-12-31",
      status: 'pending',
      submittedAt: "2024-01-20"
    },
    {
      id: 3,
      title: "Bitcoin 2024'te 100.000$ seviyesini görecek mi?",
      description: "Kripto para piyasasındaki gelişmeler",
      endDate: "2024-12-31",
      status: 'rejected',
      submittedAt: "2024-01-10",
      rejectionReason: "Soru çok spekülatiif ve belirsiz kriterler içeriyor."
    }
  ]);

  const handleSubmit = async () => {
    if (!question.trim() || !description.trim() || !endDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setQuestion('');
      setDescription('');
      setEndDate('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <View style={styles.statusBadgeApproved}>
            <View style={styles.statusDotApproved} />
            <Text style={styles.statusTextApproved}>Onaylandı</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={styles.statusBadgePending}>
            <View style={styles.statusDotPending} />
            <Text style={styles.statusTextPending}>Bekliyor</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={styles.statusBadgeRejected}>
            <View style={styles.statusDotRejected} />
            <Text style={styles.statusTextRejected}>Reddedildi</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#202020" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Soru Yaz</Text>
          <Text style={styles.headerSubtitle}>Toplulukla paylaşmak istediğin soruları yaz</Text>
        </View>
        
        <TouchableOpacity onPress={onMenuToggle} style={styles.headerButton} activeOpacity={0.7}>
          <View style={styles.hamburgerIcon}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            onPress={() => setActiveTab('write')}
            style={[styles.tab, activeTab === 'write' && styles.activeTab]}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>✍️</Text>
            <Text style={[styles.tabText, activeTab === 'write' && styles.activeTabText]}>
              Soru Yaz
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('status')}
            style={[styles.tab, activeTab === 'status' && styles.activeTab]}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>📋</Text>
            <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>
              Durumlar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Message */}
      {showSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successText}>Sorun başarıyla gönderildi!</Text>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'write' ? (
          <View style={styles.writeTabContent}>
            {/* Write Question Form */}
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
                    onChangeText={setQuestion}
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
                    onChangeText={setDescription}
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
                    onChangeText={setEndDate}
                  />
                </View>

                {/* Options Info */}
                <View style={styles.optionsInfo}>
                  <View style={styles.optionsHeader}>
                    <Text style={styles.optionsIcon}>🎯</Text>
                    <Text style={styles.optionsTitle}>Seçenekler</Text>
                  </View>
                  <View style={styles.optionsList}>
                    <View style={styles.optionItem}>
                      <View style={styles.optionDotYes} />
                      <Text style={styles.optionText}>
                        <Text style={styles.optionBold}>EVET</Text> - Sorunuzun gerçekleşeceğini düşünenler
                      </Text>
                    </View>
                    <View style={styles.optionItem}>
                      <View style={styles.optionDotNo} />
                      <Text style={styles.optionText}>
                        <Text style={styles.optionBold}>HAYIR</Text> - Sorunuzun gerçekleşmeyeceğini düşünenler
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Guidelines */}
            <View style={styles.guidelinesCard}>
              <LinearGradient
                colors={['rgba(67,40,112,0.1)', 'rgba(178,158,253,0.1)']}
                style={styles.guidelinesGradient}
              >
                <View style={styles.guidelinesHeader}>
                  <Text style={styles.guidelinesIcon}>📋</Text>
                  <Text style={styles.guidelinesTitle}>Soru Yazım Kuralları</Text>
                </View>
                <View style={styles.guidelinesList}>
                  <View style={styles.guidelineItem}>
                    <Text style={styles.guidelineBullet}>•</Text>
                    <Text style={styles.guidelineText}>Sorular net ve anlaşılır olmalı</Text>
                  </View>
                  <View style={styles.guidelineItem}>
                    <Text style={styles.guidelineBullet}>•</Text>
                    <Text style={styles.guidelineText}>Ölçülebilir ve doğrulanabilir kriterler içermeli</Text>
                  </View>
                  <View style={styles.guidelineItem}>
                    <Text style={styles.guidelineBullet}>•</Text>
                    <Text style={styles.guidelineText}>Küfür, hakaret ve uygunsuz içerik yasak</Text>
                  </View>
                  <View style={styles.guidelineItem}>
                    <Text style={styles.guidelineBullet}>•</Text>
                    <Text style={styles.guidelineText}>Soruların bitiş tarihi en az 1 hafta olmalı</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!question.trim() || !description.trim() || !endDate || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!question.trim() || !description.trim() || !endDate || isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  !question.trim() || !description.trim() || !endDate || isSubmitting
                    ? ['#E5E7EB', '#E5E7EB']
                    : ['#432870', '#B29EFD']
                }
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.spinner} />
                    <Text style={styles.submitButtonTextDisabled}>Gönderiliyor...</Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.submitButtonText,
                      (!question.trim() || !description.trim() || !endDate) && styles.submitButtonTextDisabled,
                    ]}
                  >
                    Soruyu Gönder
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusTabContent}>
            {/* Status Tab */}
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Gönderdiğin Sorular</Text>
              
              {submittedQuestions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📝</Text>
                  <Text style={styles.emptyTitle}>Henüz soru göndermemişsin</Text>
                  <Text style={styles.emptySubtitle}>İlk sorununu yazmak için "Soru Yaz" sekmesine geç</Text>
                </View>
              ) : (
                <View style={styles.questionsList}>
                  {submittedQuestions.map((q) => (
                    <View key={q.id} style={styles.questionCard}>
                      <View style={styles.questionHeader}>
                        <View style={styles.questionContent}>
                          <Text style={styles.questionTitle}>{q.title}</Text>
                          <Text style={styles.questionDescription}>{q.description}</Text>
                        </View>
                        <View style={styles.questionStatus}>
                          {getStatusBadge(q.status)}
                        </View>
                      </View>
                      
                      <View style={styles.questionFooter}>
                        <Text style={styles.questionDate}>Gönderilme: {formatDate(q.submittedAt)}</Text>
                        <Text style={styles.questionDate}>Bitiş: {formatDate(q.endDate)}</Text>
                      </View>
                      
                      {q.status === 'rejected' && q.rejectionReason && (
                        <View style={styles.rejectionContainer}>
                          <Text style={styles.rejectionTitle}>Red Sebebi:</Text>
                          <Text style={styles.rejectionText}>{q.rejectionReason}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
    marginTop: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#202020',
    borderRadius: 1.25,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabsWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F2F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#432870',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(32,32,32,0.7)',
  },
  activeTabText: {
    color: 'white',
  },
  successMessage: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  successIcon: {
    fontSize: 20,
  },
  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  writeTabContent: {
    gap: 24,
  },
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
  optionsInfo: {
    backgroundColor: 'rgba(67,40,112,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(67,40,112,0.2)',
  },
  optionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  optionsIcon: {
    fontSize: 18,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionDotYes: {
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  optionDotNo: {
    width: 12,
    height: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.8)',
    flex: 1,
  },
  optionBold: {
    fontWeight: '700',
  },
  guidelinesCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  guidelinesGradient: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(67,40,112,0.2)',
    borderRadius: 24,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  guidelinesIcon: {
    fontSize: 20,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guidelineBullet: {
    fontSize: 16,
    color: '#432870',
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.8)',
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  submitButtonTextDisabled: {
    color: '#6B7280',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: 10,
  },
  statusTabContent: {
    gap: 16,
  },
  statusCard: {
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
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
    textAlign: 'center',
  },
  questionsList: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'white',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionContent: {
    flex: 1,
    marginRight: 12,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
    lineHeight: 22,
  },
  questionDescription: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
    lineHeight: 20,
  },
  questionStatus: {
    alignItems: 'flex-end',
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionDate: {
    fontSize: 12,
    color: 'rgba(32,32,32,0.5)',
  },
  rejectionContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
  statusBadgeApproved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDotApproved: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  statusTextApproved: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  statusBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDotPending: {
    width: 8,
    height: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  statusTextPending: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  statusBadgeRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDotRejected: {
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  statusTextRejected: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
});
