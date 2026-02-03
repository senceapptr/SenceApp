import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ModalHeaderProps {
  unreadCount: number;
  onClearAll: () => void;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  unreadCount,
  onClearAll,
  onClose,
}) => {
  return (
    <>
      {/* Handle */}
      <View style={styles.modalHandle}>
        <View style={styles.handle} />
      </View>

      {/* Header */}
      <View style={styles.modalHeader}>
        <View style={styles.modalHeaderLeft}>
          <LinearGradient
            colors={['#432870', '#B29EFD']}
            style={styles.modalIcon}
          >
            <Ionicons name="notifications" size={24} color="white" />
          </LinearGradient>
          <View style={styles.modalHeaderInfo}>
            <Text style={styles.modalTitle}>Bildirimler</Text>
            {unreadCount > 0 && (
              <Text style={styles.modalUnreadCount}>{unreadCount} okunmamış</Text>
            )}
          </View>
        </View>

        <View style={styles.modalHeaderActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={onClearAll}
              style={styles.clearAllButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                style={styles.clearAllGradient}
              >
                <Text style={styles.clearAllText}>Tümünü Oku</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#202020" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalHandle: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalHeaderInfo: {},
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
  },
  modalUnreadCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432870',
    marginTop: 2,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearAllButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  clearAllGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


