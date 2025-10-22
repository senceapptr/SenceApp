import React from 'react';
import { View, Modal, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'react-native';
import { NotificationsPageProps } from './types';
import { useNotifications } from './hooks';
import { PageHeader } from './components/PageHeader';
import { ModalHeader } from './components/ModalHeader';
import { NotificationsList } from './components/NotificationsList';

export function NotificationsPage({ 
  isOpen = true, 
  onClose, 
  onBack, 
  onMenuToggle 
}: NotificationsPageProps) {
  const {
    notifications,
    markAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
    loading,
    createTestNotifications,
    createMockTestNotifications,
  } = useNotifications();

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
              onClearAll={clearAll}
              onClose={onClose}
            />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#432870" />
                <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
              </View>
            ) : (
              <>
                {/* Test Butonları */}
                <View style={styles.testButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.testButton}
                    onPress={createTestNotifications}
                  >
                    <Text style={styles.testButtonText}>Backend Test</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.testButton, styles.mockTestButton]}
                    onPress={createMockTestNotifications}
                  >
                    <Text style={styles.testButtonText}>Mock Test</Text>
                  </TouchableOpacity>
                </View>
                
                <NotificationsList
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  variant="modal"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  // Full page version
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <PageHeader
        unreadCount={unreadCount}
        onBack={onBack}
        onMenuToggle={onMenuToggle}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#432870" />
          <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
        </View>
      ) : (
        <>
          {/* Test Butonları */}
          <View style={styles.testButtonsContainer}>
            <TouchableOpacity 
              style={styles.testButton}
              onPress={createTestNotifications}
            >
              <Text style={styles.testButtonText}>Backend Test</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.testButton, styles.mockTestButton]}
              onPress={createMockTestNotifications}
            >
              <Text style={styles.testButtonText}>Mock Test</Text>
            </TouchableOpacity>
          </View>
          
          <NotificationsList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            variant="page"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Full page styles
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
  },
  testButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  testButton: {
    backgroundColor: '#432870',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  mockTestButton: {
    backgroundColor: '#10B981',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


