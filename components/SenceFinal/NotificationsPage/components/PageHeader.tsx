// =====================================================
// PAGE HEADER
// =====================================================

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PageHeaderProps {
  onBack?: () => void;
  unreadCount: number;
  onClose?: () => void;
  applyTopInset?: boolean;
  onMarkAllRead?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  applyTopInset = true,
  onBack,
  onClose,
  onMarkAllRead,
  unreadCount,
}) => {
  const insets = useSafeAreaInsets();
  const showLeftAction = onBack || onClose;
  const safeTopPadding = applyTopInset ? insets.top + 6 : 10;

  return (
    <View style={[styles.container, { paddingTop: safeTopPadding }]}>
      <View style={styles.row}>
        {showLeftAction ? (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={onBack || onClose}
            style={styles.iconButton}
          >
            <Ionicons color="#F0F6FC" name={onBack ? 'chevron-back' : 'close'} size={22} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleWrap}>
          <Text numberOfLines={1} style={styles.title}>
            Bildirimler
          </Text>
        </View>

        {unreadCount > 0 && onMarkAllRead ? (
          <TouchableOpacity activeOpacity={0.8} onPress={onMarkAllRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Tümünü Oku</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
    borderBottomColor: '#262C36',
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#21262D',
    borderColor: '#30363D',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  markAllButton: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 88,
  },
  markAllText: {
    color: '#8BB8FF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  placeholder: {
    minWidth: 40,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: '#F0F6FC',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  titleWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
  },
});
