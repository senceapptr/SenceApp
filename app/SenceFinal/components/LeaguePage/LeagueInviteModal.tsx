import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Clipboard,
  Image,
} from 'react-native';
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
  const [activeTab, setActiveTab] = useState<'invite' | 'pending'>('invite');
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const leagueLink = `https://sence.app/league/${leagueId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(leagueLink)}`;

  const handleCopyLink = async () => {
    try {
      await Clipboard.setString(leagueLink);
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <LinearGradient
            colors={['#432870', '#5a3a8f', '#c61585']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.leagueIcon}>
              <Text style={styles.leagueIconText}>🏆</Text>
            </View>

            <Text style={styles.leagueTitle}>{leagueName}</Text>

            <View style={styles.leagueStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>👥 {memberCount} Üye</Text>
              </View>
                  {isPrivate && (
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>🔒 Özel</Text>
                </View>
              )}
            </View>
          </LinearGradient>

              {/* Tabs (if admin) */}
              {isAdmin && pendingRequests.length > 0 && (
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'invite' && styles.activeTab]}
                onPress={() => setActiveTab('invite')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'invite' && styles.activeTabText]}>
                    Davet Et
                </Text>
                    {activeTab === 'invite' && (
                  <LinearGradient
                    colors={['#432870', '#c61585']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabIndicator}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                onPress={() => setActiveTab('pending')}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                    Bekleyen İstekler
                  </Text>
                    {pendingRequests.length > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{pendingRequests.length}</Text>
                    </View>
                  )}
                </View>
                    {activeTab === 'pending' && (
                  <LinearGradient
                    colors={['#432870', '#c61585']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabIndicator}
                  />
                )}
              </TouchableOpacity>
            </View>
              )}

              {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={styles.body}>
              {(isAdmin && pendingRequests.length > 0) ? (
                activeTab === 'invite' ? (
                <View style={styles.inviteTab}>
                      {/* QR Code Section */}
                  <View style={styles.qrSection}>
                    <Text style={styles.sectionTitle}>QR Kod ile Davet Et</Text>
                        
                        {!qrGenerated ? (
                      <TouchableOpacity
                        style={styles.qrGenerateButton}
                        onPress={handleGenerateQR}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#432870', '#c61585']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.qrGenerateGradient}
                        >
                          <Ionicons name="qr-code" size={24} color="white" />
                          <Text style={styles.qrGenerateText}>QR Kod Oluştur</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qrCodeContainer}>
                        <View style={styles.qrCodeWrapper}>
                          <Image 
                            source={{ uri: qrCodeUrl }} 
                            style={styles.qrCodeImage}
                            resizeMode="contain"
                          />
                        </View>
                        <Text style={styles.qrCodeSubtext}>
                              QR kodu taratarak ligine katılabilirler
                        </Text>
                      </View>
                        )}
                  </View>

                      {/* Link Section */}
                  <View style={styles.linkSection}>
                    <Text style={styles.sectionTitle}>Link ile Davet Et</Text>
                    
                    <View style={styles.linkDisplay}>
                      <View style={styles.linkTextContainer}>
                        <Text style={styles.linkText} numberOfLines={1}>
                              {leagueLink}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.copyButton, copied && styles.copiedButton]}
                        onPress={handleCopyLink}
                        activeOpacity={0.8}
                          >
                            {copied ? (
                          <>
                            <Ionicons name="checkmark" size={16} color="white" />
                            <Text style={styles.copyButtonText}>Kopyalandı</Text>
                          </>
                        ) : (
                          <Text style={styles.copyButtonText}>Kopyala</Text>
                        )}
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={handleShare}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#c61585', '#ff1a8c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shareGradient}
                      >
                        <Ionicons name="share-social" size={20} color="white" />
                        <Text style={styles.shareText}>Paylaş</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.pendingTab}>
                      {pendingRequests.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateIcon}>📭</Text>
                      <Text style={styles.emptyStateText}>Bekleyen istek yok</Text>
                    </View>
                      ) : (
                        pendingRequests.map((request, index) => (
                      <View key={request.userId} style={styles.requestCard}>
                        <View style={styles.requestHeader}>
                          <Image
                            source={{ uri: request.avatar }}
                            style={styles.requestAvatar}
                          />
                          <View style={styles.requestInfo}>
                            <Text style={styles.requestUsername}>{request.username}</Text>
                            <Text style={styles.requestDate}>{request.requestDate}</Text>
                            <View style={styles.requestStats}>
                              <View style={styles.requestStatBadge}>
                                <Text style={styles.requestStatText}>
                                  🎯 {request.predictionCount} tahmin
                                </Text>
                              </View>
                              <View style={[styles.requestStatBadge, styles.requestStatBadgeSuccess]}>
                                <Text style={[styles.requestStatText, styles.requestStatTextSuccess]}>
                                  ✅ %{request.accuracy} başarı
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.requestActions}>
                          <TouchableOpacity
                            style={styles.approveButton}
                            onPress={() => onApproveRequest?.(request.userId)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.approveButtonText}>✓ Onayla</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => onRejectRequest?.(request.userId)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.rejectButtonText}>✕ Reddet</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
                )
              ) : (
                // No tabs, just show invite content
                <View style={styles.inviteTab}>
                  {/* QR Code Section */}
                  <View style={styles.qrSection}>
                    <Text style={styles.sectionTitle}>QR Kod ile Davet Et</Text>
                    
                    {!qrGenerated ? (
                      <TouchableOpacity
                        style={styles.qrGenerateButton}
                        onPress={handleGenerateQR}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#432870', '#c61585']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.qrGenerateGradient}
                        >
                          <Ionicons name="qr-code" size={24} color="white" />
                          <Text style={styles.qrGenerateText}>QR Kod Oluştur</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qrCodeContainer}>
                        <View style={styles.qrCodeWrapper}>
                          <Image 
                            source={{ uri: qrCodeUrl }} 
                            style={styles.qrCodeImage}
                            resizeMode="contain"
                          />
                        </View>
                        <Text style={styles.qrCodeSubtext}>
                          QR kodu taratarak ligine katılabilirler
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Link Section */}
                  <View style={styles.linkSection}>
                    <Text style={styles.sectionTitle}>Link ile Davet Et</Text>
                    
                    <View style={styles.linkDisplay}>
                      <View style={styles.linkTextContainer}>
                        <Text style={styles.linkText} numberOfLines={1}>
                          {leagueLink}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.copyButton, copied && styles.copiedButton]}
                        onPress={handleCopyLink}
                        activeOpacity={0.8}
                      >
                        {copied ? (
                          <>
                            <Ionicons name="checkmark" size={16} color="white" />
                            <Text style={styles.copyButtonText}>Kopyalandı</Text>
                          </>
                        ) : (
                          <Text style={styles.copyButtonText}>Kopyala</Text>
                        )}
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={handleShare}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#c61585', '#ff1a8c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shareGradient}
                      >
                        <Ionicons name="share-social" size={20} color="white" />
                        <Text style={styles.shareText}>Paylaş</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '100%',
    height: '76%',
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingTop: 24,
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leagueIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  leagueIconText: {
    fontSize: 40,
  },
  leagueTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  leagueStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  statBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeTab: {},
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(32, 32, 32, 0.6)',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#432870',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#c61585',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  scrollView: {
    flex: 1,
  },
  body: {
    padding: 24,
  },
  inviteTab: {},
  description: {
    textAlign: 'center',
    color: 'rgba(32, 32, 32, 0.7)',
    fontSize: 14,
    marginBottom: 24,
  },
  qrSection: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.1)',
  },
  sectionTitle: {
    color: '#432870',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  qrGenerateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  qrGenerateGradient: {
    paddingVertical: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrGenerateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeWrapper: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrCodeImage: {
    width: 192,
    height: 192,
  },
  qrCodeSubtext: {
    color: 'rgba(32, 32, 32, 0.6)',
    fontSize: 12,
    textAlign: 'center',
  },
  linkSection: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.1)',
  },
  linkDisplay: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2F3F5',
    gap: 8,
  },
  linkTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  linkText: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    backgroundColor: '#432870',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copiedButton: {
    backgroundColor: '#34C759',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  leagueInfo: {
    backgroundColor: 'rgba(67, 40, 112, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(198, 21, 133, 0.1)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoTitle: {
    color: '#432870',
    fontSize: 16,
    fontWeight: '700',
  },
  infoContent: {},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    color: 'rgba(32, 32, 32, 0.6)',
    fontSize: 14,
  },
  infoValue: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '700',
  },
  infoNote: {
    color: 'rgba(32, 32, 32, 0.6)',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  pendingTab: {},
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateText: {
    color: 'rgba(32, 32, 32, 0.6)',
    fontSize: 16,
    fontWeight: '500',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  requestHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  requestAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#432870',
  },
  requestInfo: {
    flex: 1,
  },
  requestUsername: {
    color: '#202020',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  requestDate: {
    color: 'rgba(32, 32, 32, 0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  requestStats: {
    flexDirection: 'row',
    gap: 8,
  },
  requestStatBadge: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requestStatBadgeSuccess: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  requestStatText: {
    color: '#432870',
    fontSize: 12,
    fontWeight: '700',
  },
  requestStatTextSuccess: {
    color: '#34C759',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
