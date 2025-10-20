import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface PendingRequest {
  userId: string;
  username: string;
  avatar: string;
  requestDate: string;
  predictionCount: number;
  accuracy: number;
  bio?: string;
}

interface LeagueAdminApprovalPageProps {
  onBack: () => void;
  leagueName: string;
  pendingRequests: PendingRequest[];
  onApproveRequest: (userId: string) => void;
  onRejectRequest: (userId: string) => void;
}

export function LeagueAdminApprovalPage({
  onBack,
  leagueName,
  pendingRequests: initialRequests,
  onApproveRequest,
  onRejectRequest
}: LeagueAdminApprovalPageProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'low'>('all');

  const handleApprove = (userId: string) => {
    setRequests(prev => prev.filter(r => r.userId !== userId));
    onApproveRequest(userId);
  };

  const handleReject = (userId: string) => {
    setRequests(prev => prev.filter(r => r.userId !== userId));
    onRejectRequest(userId);
  };

  const filteredRequests = requests.filter(request => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return request.accuracy >= 70;
    if (selectedFilter === 'low') return request.accuracy < 70;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#202020" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Katılma İstekleri</Text>
            <Text style={styles.headerSubtitle}>{leagueName}</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('all')}
            activeOpacity={0.7}
          >
            {selectedFilter === 'all' ? (
              <LinearGradient
                colors={['#432870', '#c61585']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterButtonGradient}
              >
                <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>
                  Tümü ({requests.length})
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.filterButtonText}>Tümü ({requests.length})</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'high' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('high')}
            activeOpacity={0.7}
          >
            {selectedFilter === 'high' ? (
              <LinearGradient
                colors={['#34C759', '#2ba84a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterButtonGradient}
              >
                <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>
                  Yüksek Başarı
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.filterButtonText}>Yüksek Başarı</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'low' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('low')}
            activeOpacity={0.7}
          >
            {selectedFilter === 'low' ? (
              <LinearGradient
                colors={['#FF9500', '#ff8000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.filterButtonGradient}
              >
                <Text style={[styles.filterButtonText, styles.filterButtonTextActive]}>
                  Düşük Başarı
                </Text>
              </LinearGradient>
            ) : (
              <Text style={styles.filterButtonText}>Düşük Başarı</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateIconText}>📭</Text>
              </View>
              <Text style={styles.emptyStateTitle}>Bekleyen İstek Yok</Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedFilter === 'all' 
                  ? 'Şu an için katılım isteği bulunmuyor'
                  : 'Bu filtre için istek bulunmuyor'}
              </Text>
            </View>
          ) : (
            filteredRequests.map((request, index) => (
              <View key={request.userId} style={styles.requestCard}>
                {/* User Info */}
                <View style={styles.cardContent}>
                  <View style={styles.userSection}>
                    {/* Avatar with Badge */}
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: request.avatar }}
                        style={styles.avatar}
                      />
                      <View style={[
                        styles.accuracyBadge,
                        request.accuracy >= 70 
                          ? styles.accuracyBadgeHigh 
                          : request.accuracy >= 50
                          ? styles.accuracyBadgeMedium
                          : styles.accuracyBadgeLow
                      ]}>
                        <Text style={styles.accuracyBadgeText}>{request.accuracy}%</Text>
                      </View>
                    </View>

                    {/* User Details */}
                    <View style={styles.userDetails}>
                      <Text style={styles.username}>{request.username}</Text>
                      <Text style={styles.requestDate}>📅 {request.requestDate}</Text>
                      {request.bio && (
                        <Text style={styles.bio}>"{request.bio}"</Text>
                      )}
                    </View>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <LinearGradient
                        colors={['rgba(67, 40, 112, 0.1)', 'rgba(198, 21, 133, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCardGradient}
                      >
                        <View style={styles.statHeader}>
                          <Text style={styles.statIcon}>🎯</Text>
                          <Text style={[styles.statValue, { color: '#432870' }]}>
                            {request.predictionCount}
                          </Text>
                        </View>
                        <Text style={styles.statLabel}>Toplam Tahmin</Text>
                      </LinearGradient>
                    </View>

                    <View style={styles.statCard}>
                      <LinearGradient
                        colors={['rgba(52, 199, 89, 0.1)', 'rgba(43, 168, 74, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCardGradient}
                      >
                        <View style={styles.statHeader}>
                          <Text style={styles.statIcon}>✅</Text>
                          <Text style={[styles.statValue, { color: '#34C759' }]}>
                            %{request.accuracy}
                          </Text>
                        </View>
                        <Text style={styles.statLabel}>Başarı Oranı</Text>
                      </LinearGradient>
                    </View>
                  </View>

                  {/* Performance Indicator */}
                  <View style={styles.performanceSection}>
                    <View style={styles.performanceHeader}>
                      <Text style={styles.performanceLabel}>Performans Seviyesi</Text>
                      <Text style={styles.performanceValue}>
                        {request.accuracy >= 70 ? 'Yüksek' : request.accuracy >= 50 ? 'Orta' : 'Düşük'}
                      </Text>
                    </View>
                    <View style={styles.performanceBarBg}>
                      <View 
                        style={[
                          styles.performanceBarFill,
                          { width: `${request.accuracy}%` },
                          request.accuracy >= 70 
                            ? styles.performanceBarHigh
                            : request.accuracy >= 50
                            ? styles.performanceBarMedium
                            : styles.performanceBarLow
                        ]}
                      />
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(request.userId)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#34C759', '#2ba84a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionButtonGradient}
                      >
                        <Ionicons name="checkmark" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Onayla</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(request.userId)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FF3B30', '#e6352a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionButtonGradient}
                      >
                        <Ionicons name="close" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Reddet</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Summary */}
      {filteredRequests.length > 0 && (
        <SafeAreaView edges={['bottom']} style={styles.bottomSummary}>
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['rgba(67, 40, 112, 0.1)', 'rgba(198, 21, 133, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.summaryGradient}
            >
              <View>
                <Text style={styles.summaryCount}>{filteredRequests.length} İstek</Text>
                <Text style={styles.summarySubtitle}>Onay bekliyor</Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryLabel}>Ortalama Başarı</Text>
                <Text style={styles.summaryAverage}>
                  %{Math.round(filteredRequests.reduce((sum, r) => sum + r.accuracy, 0) / filteredRequests.length)}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  headerSpacer: {
    width: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterButtonActive: {
    backgroundColor: 'transparent',
  },
  filterButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(32, 32, 32, 0.6)',
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonTextActive: {
    color: 'white',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateIconText: {
    fontSize: 50,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.6)',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  userSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#432870',
  },
  accuracyBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accuracyBadgeHigh: {
    backgroundColor: '#34C759',
  },
  accuracyBadgeMedium: {
    backgroundColor: '#FF9500',
  },
  accuracyBadgeLow: {
    backgroundColor: '#FF3B30',
  },
  accuracyBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.6)',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  performanceSection: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  performanceBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceBarHigh: {
    backgroundColor: '#34C759',
  },
  performanceBarMedium: {
    backgroundColor: '#FF9500',
  },
  performanceBarLow: {
    backgroundColor: '#FF3B30',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rejectButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSummary: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F2F3F5',
  },
  summaryCard: {
    padding: 16,
  },
  summaryGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.6)',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  summaryAverage: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
});
