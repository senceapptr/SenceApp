import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'followers' | 'following' | 'activity';
}

export function FollowersModal({ isOpen, onClose, initialTab }: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mock data
  const followers = [
    { id: 1, username: 'ahmet_bey', name: 'Ahmet Demir', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', verified: true },
    { id: 2, username: 'zeynep_k', name: 'Zeynep Kılıç', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face', verified: false },
    { id: 3, username: 'crypto_king', name: 'Crypto King', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face', verified: true },
    { id: 4, username: 'spor_guru', name: 'Spor Guru', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', verified: false },
    { id: 5, username: 'tech_master', name: 'Tech Master', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', verified: true }
  ];

  const following = [
    { id: 1, username: 'prediction_pro', name: 'Prediction Pro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', verified: true },
    { id: 2, username: 'market_wizard', name: 'Market Wizard', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', verified: false },
    { id: 3, username: 'future_seer', name: 'Future Seer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face', verified: true }
  ];

  const activities = [
    { id: 1, user: 'ahmet_bey', action: '"Galatasaray şampiyonluk yaşayabilir mi?" tahminine', vote: 'Evet', time: '2 dk önce', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
    { id: 2, user: 'zeynep_k', action: '"Bitcoin 100K doları geçecek mi?" tahminine', vote: 'Hayır', time: '5 dk önce', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face' },
    { id: 3, user: 'crypto_king', action: '"Apple\'ın yeni ürünü başarılı olacak mı?" tahminine', vote: 'Evet', time: '12 dk önce', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face' },
    { id: 4, user: 'spor_guru', action: '"Fenerbahçe Avrupa\'da ilerleyecek mi?" tahminine', vote: 'Evet', time: '18 dk önce', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
    { id: 5, user: 'tech_master', action: '"Yapay zeka işsizliği artıracak mı?" tahminine', vote: 'Hayır', time: '25 dk önce', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
  ];

  if (!isOpen) return null;

  const UserItem = ({ user, showFollowButton = false }: { user: any; showFollowButton?: boolean }) => (
    <TouchableOpacity style={styles.userItem}>
      <View style={styles.userItemLeft}>
        <LinearGradient
          colors={['#432870', '#B29EFD']}
          style={styles.avatarGradient}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
        </LinearGradient>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color="white" />
              </View>
            )}
          </View>
          <Text style={styles.userHandle}>@{user.username}</Text>
        </View>
      </View>
      {showFollowButton && (
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Takip Et</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <TouchableOpacity style={styles.activityItem}>
      <LinearGradient
        colors={['#432870', '#B29EFD']}
        style={styles.activityAvatarGradient}
      >
        <View style={styles.activityAvatarContainer}>
          <Image source={{ uri: activity.avatar }} style={styles.activityAvatar} />
        </View>
      </LinearGradient>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.activityUser}>@{activity.user}</Text> {activity.action}{' '}
          <Text style={[styles.activityVote, { color: activity.vote === 'Evet' ? '#16a34a' : '#dc2626' }]}>
            {activity.vote}
          </Text> dedi.
        </Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View style={styles.modalContainer}>
          {/* Handle */}
          <View style={styles.handle}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sosyal</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#202020" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsBackground}>
              <TouchableOpacity
                onPress={() => setActiveTab('followers')}
                style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}>
                  Takipçiler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('following')}
                style={[styles.tab, activeTab === 'following' && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
                  Takip Edilenler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('activity')}
                style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
                  Hareketler
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'followers' && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>{followers.length} takipçi</Text>
                {followers.map((user) => (
                  <UserItem key={user.id} user={user} />
                ))}
              </View>
            )}

            {activeTab === 'following' && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>{following.length} takip edilen</Text>
                {following.map((user) => (
                  <UserItem key={user.id} user={user} showFollowButton />
                ))}
              </View>
            )}

            {activeTab === 'activity' && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>Son hareketler</Text>
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    overflow: 'hidden',
  },
  handle: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 6,
    backgroundColor: '#F2F3F5',
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabsBackground: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(32, 32, 32, 0.7)',
  },
  activeTabText: {
    color: '#432870',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    maxHeight: height * 0.5,
  },
  contentSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  userItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
  },
  avatarContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#432870',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHandle: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  followButton: {
    backgroundColor: '#432870',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activityAvatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
  },
  activityAvatarContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  activityAvatar: {
    width: '100%',
    height: '100%',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#202020',
    lineHeight: 20,
  },
  activityUser: {
    fontWeight: '700',
  },
  activityVote: {
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
    marginTop: 4,
  },
}); 