import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { League } from '../types';
import { mockChatMessages, formatTimeAgo } from '../utils';

interface ChatModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
}

export function ChatModal({ visible, league, onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');

  if (!league) return null;

  const sendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#432870', '#5A3A8B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>💬 Sohbet</Text>
            <Text style={styles.headerSubtitle}>{league.name}</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.messages} showsVerticalScrollIndicator={false}>
          {mockChatMessages.map((msg) => (
            <View key={msg.id} style={styles.messageRow}>
              <Image source={{ uri: msg.avatar }} style={styles.avatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.username}>{msg.username}</Text>
                  <Text style={styles.timestamp}>{formatTimeAgo(msg.timestamp)}</Text>
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mesajını yaz..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="rgba(32, 32, 32, 0.5)"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#432870', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendGradient}
            >
              <Text style={styles.sendText}>Gönder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messages: {
    flex: 1,
    padding: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
  },
  messageText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#F2F3F5',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#202020',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sendText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

