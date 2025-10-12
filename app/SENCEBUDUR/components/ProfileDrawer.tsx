import React from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onNotifications: () => void;
  onWriteQuestion: () => void;
  onMarket: () => void;
  onLogout: () => void;
  hasNotifications: boolean;
}

export function ProfileDrawer({
  isOpen,
  onClose,
  onProfileClick,
  onEditProfile,
  onSettings,
  onNotifications,
  onWriteQuestion,
  onMarket,
  onLogout,
  hasNotifications
}: ProfileDrawerProps) {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View style={{
          position: 'absolute',
          top: 60,
          right: 20,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          minWidth: 200,
        }}>
          {/* Profile Info */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#F2F3F5',
              marginBottom: 8,
              borderRadius: 8,
            }}
            onPress={() => {
              onClose();
              onProfileClick();
            }}
            activeOpacity={0.7}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#432870',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#202020',
              }}>
                @mehmet_k
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#666'
              }}>
                1250 kredi
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
          
          {/* Menu Items */}
          <View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
              onPress={() => {
                onClose();
                onNotifications();
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#432870',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="notifications" size={14} color="white" />
              </View>
              <Text style={{
                fontSize: 14,
                color: '#202020',
                flex: 1
              }}>
                Bildirimler
              </Text>
              {hasNotifications && (
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#FF4444',
                }} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
                              onPress={() => {
                  onClose();
                  onMarket();
                }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#432870',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="bag" size={14} color="white" />
              </View>
              <Text style={{
                fontSize: 14,
                color: '#202020',
                flex: 1
              }}>
                Market
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
              onPress={() => {
                onClose();
                onWriteQuestion();
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#432870',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="create" size={14} color="white" />
              </View>
              <Text style={{
                fontSize: 14,
                color: '#202020',
                flex: 1
              }}>
                Soru Yaz
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
              onPress={() => {
                onClose();
                onEditProfile();
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#432870',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="person" size={14} color="white" />
              </View>
              <Text style={{
                fontSize: 14,
                color: '#202020',
                flex: 1
              }}>
                Profili Düzenle
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
              onPress={() => {
                onClose();
                onSettings();
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#432870',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="settings" size={14} color="white" />
              </View>
              <Text style={{
                fontSize: 14,
                color: '#202020',
                flex: 1
              }}>
                Ayarlar
              </Text>
            </TouchableOpacity>
            
            <View style={{
              height: 1,
              backgroundColor: '#F2F3F5',
              marginVertical: 8
            }} />
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
              onPress={() => {
                onClose();
                onLogout();
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#DC2626',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <Ionicons name="log-out" size={14} color="white" />
              </View>
              <Text style={{
                fontSize: 14,
                color: '#DC2626',
                flex: 1
              }}>
                Çıkış Yap
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 