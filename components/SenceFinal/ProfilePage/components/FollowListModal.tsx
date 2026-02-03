import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export interface FollowUserItem {
  id: string;
  username: string;
  profile_image: string | null;
  full_name: string | null;
}

interface FollowListModalProps {
  visible: boolean;
  title: 'Takipçiler' | 'Takip Ettiklerim';
  items: FollowUserItem[];
  loading?: boolean;
  onClose: () => void;
  onUserPress?: (userId: string) => void;
}

export function FollowListModal({
  visible,
  title,
  items,
  loading,
  onClose,
  onUserPress,
}: FollowListModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={24} color="#8B949E" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color="#10B981" />
              </View>
            ) : items.length === 0 ? (
              <Text style={styles.emptyText}>
                {title === 'Takipçiler' ? 'Henüz takipçin yok.' : 'Henüz kimseyi takip etmiyorsun.'}
              </Text>
            ) : (
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => onUserPress?.(item.id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: item.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face' }}
                      style={styles.avatar}
                    />
                    <View style={styles.info}>
                      <Text style={styles.name}>{item.full_name || item.username || 'Kullanıcı'}</Text>
                      <Text style={styles.username}>@{item.username}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#8B949E" />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  safe: {
    maxHeight: '80%',
  },
  container: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: '#30363D',
    paddingBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#30363D',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  closeBtn: {
    padding: 4,
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8B949E',
    textAlign: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#21262D',
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  username: {
    fontSize: 13,
    color: '#8B949E',
    marginTop: 2,
  },
});
