import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Share, Image } from 'react-native';

import { PRIMARY_BLUE } from './shared/theme';
import { resolveLeagueIcon } from './shared/leagueIcons';

interface LeagueInviteModalProps {
  visible: boolean;
  leagueId: string;
  isAdmin?: boolean;
  leagueName: string;
  isPrivate: boolean;
  onClose: () => void;
  memberCount: number;
  leagueIconName?: string;
  leagueIconColor?: string;
  leagueDescription?: string;
  pendingRequests?: PendingRequest[];
  onRejectRequest?: (userId: string) => void;
  onApproveRequest?: (userId: string) => void;
}

interface PendingRequest {
  userId: string;
  avatar: string;
  username: string;
  accuracy: number;
  requestDate: string;
  predictionCount: number;
}

export function LeagueInviteModal({
  isAdmin = false,
  isPrivate,
  leagueDescription = 'Heyecanlı tahminler ve rekabet seni bekliyor!',
  leagueIconColor,
  leagueIconName,
  leagueId,
  leagueName,
  memberCount,
  onApproveRequest,
  onClose,
  onRejectRequest,
  pendingRequests = [],
  visible,
}: LeagueInviteModalProps) {
  const insets = useSafeAreaInsets();
  const resolvedIcon = resolveLeagueIcon(leagueIconName, leagueIconColor);
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
        message: `${leagueName} ligine katıl! ${leagueDescription}\n\n${leagueLink}`,
        title: `${leagueName} - Sence`,
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
            <View style={[styles.leagueIconContainer, { backgroundColor: resolvedIcon.color }]}>
              <Ionicons name={resolvedIcon.name} size={28} color="#FFFFFF" />
            </View>
            <View style={styles.leagueInfo}>
              <Text style={styles.leagueName} numberOfLines={1}>
                {leagueName}
              </Text>
              <View style={styles.leagueBadges}>
                <View style={styles.badge}>
                  <Ionicons name="people" size={14} color={PRIMARY_BLUE} />
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
                  color={activeTab === 'invite' ? PRIMARY_BLUE : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.tabText, activeTab === 'invite' && styles.tabTextActive]}>Davet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
                onPress={() => setActiveTab('pending')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="time"
                  size={18}
                  color={activeTab === 'pending' ? PRIMARY_BLUE : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Bekleyen</Text>
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
            {!hasPendingRequests || activeTab === 'invite' ? (
              <>
                {/* QR Code Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="qr-code" size={20} color={PRIMARY_BLUE} />
                    <Text style={styles.sectionTitle}>QR Kod</Text>
                  </View>

                  {!qrGenerated ? (
                    <TouchableOpacity style={styles.generateQrButton} onPress={handleGenerateQR} activeOpacity={0.8}>
                      <LinearGradient colors={[PRIMARY_BLUE, PRIMARY_BLUE]} style={styles.generateQrGradient}>
                        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                        <Text style={styles.generateQrText}>QR Kod Oluştur</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qrContainer}>
                      <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} resizeMode="contain" />
                      <Text style={styles.qrHint}>QR kodu taratarak lige katılabilirler</Text>
                    </View>
                  )}
                </View>

                {/* Link Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="link" size={20} color={PRIMARY_BLUE} />
                    <Text style={styles.sectionTitle}>Davet Linki</Text>
                  </View>

                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText} numberOfLines={1}>
                      {leagueLink}
                    </Text>
                    <TouchableOpacity
                      style={[styles.copyButton, copied && styles.copyButtonSuccess]}
                      onPress={handleCopyLink}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={copied ? 'checkmark' : 'copy'} size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Share Button */}
                <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[PRIMARY_BLUE, PRIMARY_BLUE]}
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
                  pendingRequests.map(request => (
                    <View key={request.userId} style={styles.requestCard}>
                      <Image source={{ uri: request.avatar }} style={styles.requestAvatar} />
                      <View style={styles.requestInfo}>
                        <Text style={styles.requestName}>{request.username}</Text>
                        <Text style={styles.requestDate}>{request.requestDate}</Text>
                        <View style={styles.requestStats}>
                          <Text style={styles.requestStat}>🎯 {request.predictionCount}</Text>
                          <Text style={[styles.requestStat, { color: PRIMARY_BLUE }]}>✓ %{request.accuracy}</Text>
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
  approveBtn: {
    alignItems: 'center',
    backgroundColor: '#256EFF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#256EFF',
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  copyButton: {
    alignItems: 'center',
    backgroundColor: '#256EFF',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  copyButtonSuccess: {
    backgroundColor: '#256EFF',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
  },
  generateQrButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateQrGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  generateQrText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  leagueBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  leagueCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 16,
    padding: 16,
  },
  leagueIconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    marginRight: 14,
    width: 56,
  },
  leagueIconText: {
    fontSize: 28,
  },
  leagueInfo: {
    flex: 1,
  },
  leagueName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  linkContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  linkText: {
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  modalBackground: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  pendingContainer: {
    flex: 1,
  },
  privateBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  qrImage: {
    borderRadius: 12,
    height: 180,
    marginBottom: 12,
    width: 180,
  },
  rejectBtn: {
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestAvatar: {
    borderColor: 'rgba(37, 110, 255,0.3)',
    borderRadius: 24,
    borderWidth: 2,
    height: 48,
    marginRight: 12,
    width: 48,
  },
  requestCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 14,
  },
  requestDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 6,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  requestStat: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  requestStats: {
    flexDirection: 'row',
    gap: 10,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  shareButton: {
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
  },
  shareGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  shareText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  tab: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: 'rgba(37, 110, 255,0.15)',
  },
  tabBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  tabsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 4,
  },
  tabText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#256EFF',
  },
});
