import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { League, User } from '../types';

interface JoinConfirmModalProps {
  visible: boolean;
  league: League | null;
  currentUser: User;
  onClose: () => void;
  onConfirm: () => void;
}

export function JoinConfirmModal({ visible, league, currentUser, onClose, onConfirm }: JoinConfirmModalProps) {
  if (!league) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LinearGradient
            colors={['#432870', '#5A3A8B', '#B29EFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.headerIcon}>🏆</Text>
            <Text style={styles.headerTitle}>Lige Katıl</Text>
            <Text style={styles.headerSubtitle}>{league.name}</Text>
          </LinearGradient>

          <View style={styles.body}>
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Katılım Ücreti:</Text>
                <Text style={styles.detailValue}>{league.joinCost} kredi</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mevcut Kredin:</Text>
                <Text style={styles.detailValueMain}>
                  {currentUser.credits.toLocaleString('tr-TR')} kredi
                </Text>
              </View>
              <View style={[styles.detailRow, styles.detailRowBorder]}>
                <Text style={styles.detailLabelBold}>Kalacak:</Text>
                <Text style={styles.detailValueRemaining}>
                  {(currentUser.credits - league.joinCost).toLocaleString('tr-TR')} kredi
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
                disabled={currentUser.credits < league.joinCost}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmText}>Katıl</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  body: {
    padding: 24,
  },
  details: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailRowBorder: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#FFFFFF',
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  detailValueMain: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  detailLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  detailValueRemaining: {
    fontSize: 18,
    fontWeight: '900',
    color: '#34C759',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

