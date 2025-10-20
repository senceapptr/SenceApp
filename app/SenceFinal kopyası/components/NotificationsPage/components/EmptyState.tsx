import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmptyStateProps } from '../types';

export const EmptyState: React.FC<EmptyStateProps> = ({ variant = 'page' }) => {
  const isModal = variant === 'modal';

  return (
    <View style={isModal ? styles.modalEmptyState : styles.pageEmptyState}>
      <View style={isModal ? styles.modalEmptyIcon : styles.pageEmptyIcon}>
        <Text style={isModal ? styles.modalEmptyEmoji : styles.pageEmptyEmoji}>🔔</Text>
      </View>
      <Text style={isModal ? styles.modalEmptyTitle : styles.pageEmptyTitle}>
        Henüz Bildirim Yok
      </Text>
      <Text style={isModal ? styles.modalEmptyMessage : styles.pageEmptyMessage}>
        {isModal 
          ? 'Tahmin yaptıkça buraya bildirimler gelecek.'
          : 'Tahmin yaptıkça, liga katıldıkça ve sosyal etkileşimlerde bulundukça buraya bildirimler gelecek.'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Modal Empty State
  modalEmptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  modalEmptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalEmptyEmoji: {
    fontSize: 24,
  },
  modalEmptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  modalEmptyMessage: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
    textAlign: 'center',
  },
  
  // Page Empty State
  pageEmptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  pageEmptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageEmptyEmoji: {
    fontSize: 32,
  },
  pageEmptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 16,
  },
  pageEmptyMessage: {
    fontSize: 16,
    color: '#202020',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});


