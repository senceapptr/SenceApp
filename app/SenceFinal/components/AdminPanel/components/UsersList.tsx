import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@/services/admin.service';

interface UsersListProps {
  users: User[];
  onBanToggle: (userId: string, isBanned: boolean) => void;
}

export function UsersList({ users, onBanToggle }: UsersListProps) {
  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people" size={64} color="#6B7280" />
        <Text style={styles.emptyTitle}>Kullanıcı Bulunamadı</Text>
        <Text style={styles.emptySubtitle}>
          Henüz kayıtlı kullanıcı bulunmuyor.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>
          Kullanıcılar ({users.length})
        </Text>
        
        <View style={styles.usersList}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.userDetails}>
                    <Text style={styles.username}>@{user.username}</Text>
                    <Text style={styles.fullName}>{user.full_name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                  </View>
                </View>

                <View style={styles.userStatus}>
                  {user.is_banned ? (
                    <View style={styles.bannedBadge}>
                      <Ionicons name="ban" size={16} color="#EF4444" />
                      <Text style={styles.bannedText}>Banlı</Text>
                    </View>
                  ) : (
                    <View style={styles.activeBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.activeText}>Aktif</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sorular</Text>
                  <Text style={styles.statValue}>{user.questions_count}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Tahminler</Text>
                  <Text style={styles.statValue}>{user.predictions_count}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Kayıt Tarihi</Text>
                  <Text style={styles.statValue}>
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    user.is_banned ? styles.activateButton : styles.banButton
                  ]}
                  onPress={() => onBanToggle(user.id, user.is_banned)}
                  activeOpacity={0.8}
                >
                  {user.is_banned ? (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Aktifleştir</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="ban" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Banla</Text>
                    </>
                  )}
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
  usersList: {
    gap: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#432870',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  fullName: {
    fontSize: 14,
    color: '#6B7280',
  },
  email: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  bannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  bannedText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  userActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  banButton: {
    backgroundColor: '#EF4444',
  },
  activateButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
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
});
