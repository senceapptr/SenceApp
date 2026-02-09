import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Image,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface LeagueInviteModalProps {
  visible: boolean;
  onClose: () => void;
  leagueName: string;
  leagueId: string;
  leagueDescription?: string;
  memberCount: number;
  isPrivate: boolean;
  isAdmin?: boolean;
  pendingRequests?: PendingRequest[];
  onApproveRequest?: (userId: string) => void;
  onRejectRequest?: (userId: string) => void;
}

interface PendingRequest {
  userId: string;
  username: string;
  avatar: string;
  requestDate: string;
  predictionCount: number;
  accuracy: number;
}

export function LeagueInviteModal({
  visible,
  onClose,
  leagueName,
  leagueId,
  leagueDescription = 'Heyecanlı tahminler ve rekabet seni bekliyor!',
  memberCount,
  isPrivate,
  isAdmin = false,
  pendingRequests = [],
  onApproveRequest,
  onRejectRequest
}: LeagueInviteModalProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'invite' | 'pending'>('invite');
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const leagueLink = `https://sence.app/league/${leagueId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(leagueLink)}&bgcolor=0D1117&color=FFFFFF`;

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(leagueLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${leagueName} - Sence`,
        message: `${leagueName} ligine katıl! ${leagueDescription}\n\n${leagueLink}`,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const hasPendingRequests = isAdmin && pendingRequests.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      presentationStyle="fullScreen"
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
            <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Davet Et</Text>
              <Text style={styles.headerSubtitle}>{leagueName}</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* League Info Card */}
          <View style={styles.leagueCard}>
            <View style={styles.leagueIconContainer}>
              <Text style={styles.leagueIconText}>🏆</Text>
            </View>
            <View style={styles.leagueInfo}>
              <Text style={styles.leagueName} numberOfLines={1}>{leagueName}</Text>
              <View style={styles.leagueBadges}>
                <View style={styles.badge}>
                  <Ionicons name="people" size={14} color="#10B981" />
                  <Text style={styles.badgeText}>{memberCount} Üye</Text>
                </View>
                {isPrivate && (
                  <View style={[styles.badge, styles.privateBadge]}>
                    <Ionicons name="lock-closed" size={12} color="#F59E0B" />
                    <Text style={[styles.badgeText, { color: '#F59E0B' }]}>Özel</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Tabs (if admin with pending requests) */}
          {hasPendingRequests && (
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'invite' && styles.tabActive]}
                onPress={() => setActiveTab('invite')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="share-social"
                  size={18}
                  color={activeTab === 'invite' ? '#10B981' : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.tabText, activeTab === 'invite' && styles.tabTextActive]}>
                  Davet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
                onPress={() => setActiveTab('pending')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="time"
                  size={18}
                  color={activeTab === 'pending' ? '#10B981' : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
                  Bekleyen
                </Text>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{pendingRequests.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {(!hasPendingRequests || activeTab === 'invite') ? (
              <>
                {/* QR Code Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="qr-code" size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>QR Kod</Text>
                  </View>

                  {!qrGenerated ? (
                    <TouchableOpacity
                      style={styles.generateQrButton}
                      onPress={handleGenerateQR}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.generateQrGradient}
                      >
                        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                        <Text style={styles.generateQrText}>QR Kod Oluştur</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qrContainer}>
                      <Image
                        source={{ uri: qrCodeUrl }}
                        style={styles.qrImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.qrHint}>QR kodu taratarak lige katılabilirler</Text>
                    </View>
                  )}
                </View>

                {/* Link Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="link" size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Davet Linki</Text>
                  </View>

                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText} numberOfLines={1}>{leagueLink}</Text>
                    <TouchableOpacity
                      style={[styles.copyButton, copied && styles.copyButtonSuccess]}
                      onPress={handleCopyLink}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={copied ? "checkmark" : "copy"}
                        size={18}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Share Button */}
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shareGradient}
                  >
                    <Ionicons name="share-social" size={22} color="#FFFFFF" />
                    <Text style={styles.shareText}>Paylaş</Text>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              /* Pending Requests Tab */
              <View style={styles.pendingContainer}>
                {pendingRequests.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={styles.emptyText}>Bekleyen istek yok</Text>
                  </View>
                ) : (
                  pendingRequests.map((request) => (
                    <View key={request.userId} style={styles.requestCard}>
                      <Image
                        source={{ uri: request.avatar }}
                        style={styles.requestAvatar}
                      />
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestName}>{request.username}</Text>
                        <Text style={styles.requestDate}>{request.requestDate}</Text>
                        <View style={styles.requestStats}>
                          <Text style={styles.requestStat}>🎯 {request.predictionCount}</Text>
                          <Text style={[styles.requestStat, { color: '#10B981' }]}>
                            ✓ %{request.accuracy}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.requestActions}>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() => onApproveRequest?.(request.userId)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() => onRejectRequest?.(request.userId)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="close" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  leagueIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  leagueIconText: {
    fontSize: 28,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  leagueBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privateBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  tabTextActive: {
    color: '#10B981',
  },
  tabBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  generateQrButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateQrGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  generateQrText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'monospace',
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyButtonSuccess: {
    backgroundColor: '#059669',
  },
  shareButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  shareText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  pendingContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  requestAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  requestStats: {
    flexDirection: 'row',
    gap: 10,
  },
  requestStat: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
