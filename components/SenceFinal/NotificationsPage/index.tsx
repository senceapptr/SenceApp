// =====================================================
// NOTIFICATIONS PAGE
// =====================================================

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNotifications } from './hooks';
import { NotificationsPageProps } from './types';
import { EmptyState } from './components/EmptyState';
import { FilterTabs } from './components/FilterTabs';
import { PageHeader } from './components/PageHeader';
import { NotificationsList } from './components/NotificationsList';

export function NotificationsPage(props: NotificationsPageProps) {
  const { isOpen = true, onBack, onClose, onNavigateToPage, onOpenQuestionDetail } = props;
  const {
    activeFilter,
    deleteNotification,
    errorMessage,
    isAuthenticated,
    loading,
    markAllAsRead,
    notifications,
    onPressNotification,
    onRefresh,
    refreshing,
    setActiveFilter,
    undoCandidate,
    undoDeleteNotification,
    unreadCount,
  } = useNotifications({
    onNavigateToPage,
    onOpenQuestionDetail,
  });

  const showError = Boolean(errorMessage) && notifications.length === 0;

  const renderBodyContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#3D83FF" size="large" />
          <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <EmptyState message="Bildirimleri görüntülemek için hesabına giriş yap." title="Bildirimler için giriş yap" />
      );
    }

    if (showError) {
      return <EmptyState message={errorMessage || ''} title="Bildirimler yüklenemedi" />;
    }

    if (notifications.length === 0) {
      return (
        <EmptyState
          message="Yeni gelişmeler, kazançlar ve güncellemeler burada görünecek."
          title="Henüz bildirim yok"
        />
      );
    }

    return (
      <NotificationsList
        notifications={notifications}
        onDelete={deleteNotification}
        onPress={onPressNotification}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  };

  const screenContent = (
    <View style={styles.content}>
      <PageHeader
        applyTopInset={!onClose}
        onBack={onClose ? undefined : onBack}
        onClose={onClose}
        onMarkAllRead={markAllAsRead}
        unreadCount={unreadCount}
      />

      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} unreadCount={unreadCount} />
      {renderBodyContent()}

      {undoCandidate && (
        <View style={styles.undoBarWrap}>
          <View style={styles.undoBar}>
            <Text numberOfLines={1} style={styles.undoText}>
              Bildirim silindi
            </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={undoDeleteNotification} style={styles.undoButton}>
              <Text style={styles.undoButtonText}>Geri Al</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  if (onClose) {
    return (
      <Modal animationType="slide" onRequestClose={onClose} transparent visible={isOpen}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>{screenContent}</View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <StatusBar backgroundColor="#0D1117" barStyle="light-content" />
      {screenContent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0D1117',
    borderColor: '#30363D',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  safeArea: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  undoBar: {
    alignItems: 'center',
    backgroundColor: '#1A2230',
    borderColor: '#4766A2',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  undoBarWrap: {
    bottom: 16,
    left: 20,
    position: 'absolute',
    right: 20,
  },
  undoButton: {
    justifyContent: 'center',
    marginLeft: 12,
    minHeight: 36,
    paddingHorizontal: 8,
  },
  undoButtonText: {
    color: '#8BB8FF',
    fontSize: 14,
    fontWeight: '700',
  },
  undoText: {
    color: '#F0F6FC',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
