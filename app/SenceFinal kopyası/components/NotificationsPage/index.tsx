import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
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
            
            <NotificationsList
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              variant="modal"
            />
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
      
      <NotificationsList
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        variant="page"
      />
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
});


