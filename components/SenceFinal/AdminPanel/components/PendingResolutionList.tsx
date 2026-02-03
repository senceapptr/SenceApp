import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PendingResolutionQuestion } from '@/services/admin.service';

interface PendingResolutionListProps {
  questions: PendingResolutionQuestion[];
  onResolve: (questionId: string, result: 'yes' | 'no', adminNote?: string) => void | Promise<void>;
}

export function PendingResolutionList({
  questions,
  onResolve,
}: PendingResolutionListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const handleResolveAction = async (questionId: string, result: 'yes' | 'no') => {
    const note = noteInputs[questionId]?.trim();
    setProcessingId(questionId);
    try {
      await Promise.resolve(onResolve(questionId, result, note || undefined));
      setNoteInputs((prev) => ({ ...prev, [questionId]: '' }));
    } finally {
      setProcessingId(null);
    }
  };

  const truncate = (str: string | null | undefined, max: number) => {
    if (!str) return '';
    return str.length <= max ? str : str.slice(0, max) + '…';
  };

  if (questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-done-circle" size={64} color="#10B981" />
        <Text style={styles.emptyTitle}>Sonuç Onayı Bekleyen Soru Yok</Text>
        <Text style={styles.emptySubtitle}>
          Süresi biten ve admin onayı bekleyen soru bulunmuyor. RSS/AI önerisi geldiğinde burada listelenecek.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Sonuç Onayı Bekleyen Sorular ({questions.length})</Text>
        <View style={styles.questionsList}>
          {questions.map((question) => {
            const isProcessing = processingId === question.id;
            const suggestedLabel = question.suggested_result === 'yes' ? 'Evet' : question.suggested_result === 'no' ? 'Hayır' : '—';
            const sourceLabel = question.suggested_result_source
              ? question.suggested_result_source === 'rss'
                ? 'RSS'
                : 'AI'
              : '—';
            const sourceDetail = truncate(question.suggested_result_source_detail, 80);
            const isExpired = new Date(question.end_date) <= new Date();
            const isStillActive = question.status === 'active' && !isExpired;

            // Highlight color based on suggestion
            const suggestionColor = question.suggested_result === 'yes' ? '#10B981' : question.suggested_result === 'no' ? '#EF4444' : '#6B7280';

            return (
              <View key={question.id} style={styles.card}>
                {question.image_url ? (
                  <Image source={{ uri: question.image_url }} style={styles.cardImage} />
                ) : null}
                <View style={styles.cardContent}>
                  {isStillActive ? (
                    <View style={styles.statusBadgeActive}>
                      <Text style={styles.statusBadgeActiveText}>Süre dolmadı — ön onay verilebilir</Text>
                    </View>
                  ) : (
                    <View style={styles.statusBadgeClosed}>
                      <Text style={styles.statusBadgeClosedText}>Süre doldu — sonuç kesinleştirilmeli</Text>
                    </View>
                  )}
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {question.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>
                        Bitiş: {new Date(question.end_date).toLocaleString('tr-TR')}
                      </Text>
                    </View>
                    {question.category_name ? (
                      <Text style={styles.categoryBadge}>{question.category_name}</Text>
                    ) : null}
                  </View>

                  {/* Suggestion Info */}
                  <View style={[styles.suggestionBox, { borderColor: suggestionColor }]}>
                    <Text style={[styles.suggestionTitle, { color: suggestionColor }]}>
                      Önerilen Sonuç: {suggestedLabel.toUpperCase()}
                    </Text>
                    <View style={styles.sourceRow}>
                      <Ionicons name="logo-rss" size={14} color="#6B7280" />
                      <Text style={styles.sourceText} numberOfLines={2}>
                        {(() => {
                          try {
                            const parsed = JSON.parse(question.suggested_result_source_detail || '{}');
                            return parsed.text || question.suggested_result_source_detail || 'Detay yok';
                          } catch (e) {
                            return question.suggested_result_source_detail || 'Detay yok';
                          }
                        })()}
                      </Text>
                      <Text style={styles.sourceTypeLabel}>{sourceLabel}</Text>
                    </View>
                  </View>

                  {question.result ? (
                    <View style={[styles.preApprovedBadge, !isStillActive && { backgroundColor: '#F0FDF4', borderColor: '#4ADE80' }]}>
                      <Text style={styles.preApprovedText}>
                        Admin Kararı: {question.result === 'yes' ? 'Evet' : 'Hayır'}{' '}
                        {isStillActive
                          ? '— (Süre bitince otomatik sonuçlanacak)'
                          : '— (Sistem tarafından finalize edilecek)'}
                      </Text>
                    </View>
                  ) : null}

                  <TextInput
                    style={styles.noteInput}
                    placeholder="Admin notu (opsiyonel)"
                    placeholderTextColor="#9CA3AF"
                    value={noteInputs[question.id] ?? ''}
                    onChangeText={(text) =>
                      setNoteInputs((prev) => ({ ...prev, [question.id]: text }))
                    }
                  />

                  <View style={styles.actionsRow}>
                    {/* YES BUTTON */}
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        styles.btnYes,
                        question.suggested_result === 'yes' && styles.btnHighlight
                      ]}
                      onPress={() => handleResolveAction(question.id, 'yes')}
                      disabled={isProcessing}
                    >
                      {isProcessing && processingId === question.id ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Ionicons name="thumbs-up" size={20} color="#fff" />
                          <Text style={styles.actionBtnText}>EVET</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    {/* NO BUTTON */}
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        styles.btnNo,
                        question.suggested_result === 'no' && styles.btnHighlight
                      ]}
                      onPress={() => handleResolveAction(question.id, 'no')}
                      disabled={isProcessing}
                    >
                      {isProcessing && processingId === question.id ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Ionicons name="thumbs-down" size={20} color="#fff" />
                          <Text style={styles.actionBtnText}>HAYIR</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { // Add or merge with existing styles
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: { // Add or merge
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  questionsList: { // Add or merge
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  statusBadgeActiveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  statusBadgeClosed: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusBadgeClosedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryBadge: {
    fontSize: 12,
    color: '#432870',
    fontWeight: '600',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  btnYes: {
    backgroundColor: '#10B981', // green-500
  },
  btnNo: {
    backgroundColor: '#EF4444', // red-500
  },
  btnHighlight: {
    borderWidth: 2,
    borderColor: '#F59E0B', // amber-500
    shadowColor: '#F59E0B',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
    transform: [{ scale: 1.02 }]
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  suggestionBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  sourceText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  preApprovedBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  preApprovedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  sourceTypeLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
