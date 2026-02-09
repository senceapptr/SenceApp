// =====================================================
// NOTIFICATIONS PAGE - Main Component (Dark Theme)
// =====================================================

import React from 'react';
import { View, Modal, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'react-native';
import { NotificationsPageProps } from './types';
import { useNotifications } from './hooks';
import { PageHeader } from './components/PageHeader';
import { ModalHeader } from './components/ModalHeader';
import { FilterTabs } from './components/FilterTabs';
import { NotificationsList } from './components/NotificationsList';
import { LinearGradient } from 'expo-linear-gradient'; // For background

export function NotificationsPage({
  isOpen = true,
  onClose,
  onBack,
}: NotificationsPageProps) {
  const {
    notifications,
    activeFilter,
    setActiveFilter,
    loading,
    refreshing,
    onRefresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
    createTestNotifications // For testing
  } = useNotifications();

  // Loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#432870" />
      <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
    </View>
  );

  // Modal version
  if (onClose) {
    return (
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ModalHeader
              unreadCount={unreadCount}
              onClose={onClose}
              onMarkAllRead={markAllAsRead}
            />

            <View style={styles.darkBackground}>
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              {loading ? renderLoading() : (
                <NotificationsList
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  variant="modal"
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Full page version
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      <PageHeader
        unreadCount={unreadCount}
        onBack={onBack}
        onMarkAllRead={markAllAsRead}
      />

      <View style={{ flex: 1, backgroundColor: '#09090B' }}>
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {loading ? renderLoading() : (
          <NotificationsList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            variant="page"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full page styles
  container: {
    flex: 1,
    backgroundColor: '#09090B', // Dark background
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#09090B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  darkBackground: {
    flex: 1,
    backgroundColor: '#09090B',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#8B949E', // Gray text
  },
});
