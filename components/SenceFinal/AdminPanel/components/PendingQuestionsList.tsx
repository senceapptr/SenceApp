import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PendingQuestion } from '@/services/admin.service';
import { ImagePicker } from '@/components/ImagePicker';

interface PendingQuestionsListProps {
  questions: PendingQuestion[];
  onApprove: (questionId: string) => void;
  onReject: (questionId: string) => void;
  onUpdateImage?: (questionId: string, imageUrl: string) => void;
  onEdit?: (question: PendingQuestion) => void;
}

export function PendingQuestionsList({ questions, onApprove, onReject, onUpdateImage, onEdit }: PendingQuestionsListProps) {
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
        <Text style={styles.emptyTitle}>Tüm Sorular İncelenmiş</Text>
        <Text style={styles.emptySubtitle}>
          Şu anda bekleyen soru bulunmuyor. Yeni sorular geldiğinde burada görünecek.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>
          Bekleyen Sorular ({questions.length})
        </Text>
        
        <View style={styles.questionsList}>
          {questions.map((question) => (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {question.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.username}>@{question.username}</Text>
                    <Text style={styles.fullName}>{question.full_name}</Text>
                  </View>
                </View>
                
                <Text style={styles.date}>
                  {new Date(question.created_at).toLocaleDateString('tr-TR')}
                </Text>
              </View>

              <View style={styles.questionContent}>
                <Text style={styles.questionTitle}>{question.title}</Text>
                <Text style={styles.questionDescription} numberOfLines={3}>
                  {question.description}
                </Text>
                
                {/* Kategoriler ve Bitiş Tarihi */}
                <View style={styles.questionMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="folder" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>
                      Ana: {question.category_name}
                    </Text>
                  </View>
                  {question.secondary_category_name && (
                    <View style={styles.metaItem}>
                      <Ionicons name="folder-outline" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>
                        İkincil: {question.secondary_category_name}
                      </Text>
                    </View>
                  )}
                  {question.third_category_name && (
                    <View style={styles.metaItem}>
                      <Ionicons name="folder-outline" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>
                        Üçüncül: {question.third_category_name}
                      </Text>
                    </View>
                  )}
                  {question.end_date && (
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>
                        {new Date(question.end_date).toLocaleDateString('tr-TR')}
                      </Text>
                    </View>
                  )}
                  {question.yes_odds && question.no_odds && (
                    <View style={styles.oddsContainer}>
                      <Text style={styles.oddsText}>
                        Evet: {question.yes_odds}x | Hayır: {question.no_odds}x
                      </Text>
                    </View>
                  )}
                </View>

                {/* Soru Görseli */}
                {question.image_url ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: question.image_url }} style={styles.questionImage} />
                  </View>
                ) : (
                  <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>Görsel Yok</Text>
                    <ImagePicker
                      onImageSelected={(imageUri) => {
                        if (onUpdateImage) {
                          setUploadingImages(prev => new Set(prev).add(question.id));
                          onUpdateImage(question.id, imageUri);
                          setUploadingImages(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(question.id);
                            return newSet;
                          });
                        }
                      }}
                      userId="admin" // Admin için
                      uploadType="question"
                      title="Görsel Ekle"
                      style={styles.addImageButton}
                    />
                  </View>
                )}
                
                {question.categories.length > 0 && (
                  <View style={styles.categoriesContainer}>
                    {question.categories.map((category, index) => (
                      <View key={index} style={styles.categoryTag}>
                        <Text style={styles.categoryText}>{category}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => onEdit?.(question)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create" size={20} color="#432870" />
                  <Text style={styles.editButtonText}>Düzenle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => onReject(question.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={20} color="white" />
                  <Text style={styles.rejectButtonText}>Reddet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => onApprove(question.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.approveGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.approveButtonText}>Onayla</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  questionsList: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#432870',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    gap: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  fullName: {
    fontSize: 12,
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  questionContent: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
  },
  questionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#432870',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  approveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  questionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  oddsContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  oddsText: {
    fontSize: 11,
    color: '#432870',
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 12,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  noImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  noImageText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  addImageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#432870',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  editButtonText: {
    color: '#432870',
    fontSize: 16,
    fontWeight: '600',
  },
});
