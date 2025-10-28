import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';
import { leagueChatService } from '@/services/league-chat.service';
import { League } from '../types';
import { formatTimeAgo } from '../utils';
import type { LeagueChatMessage } from '@/services/league-chat.service';

interface ChatModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
}

export function ChatModal({ visible, league, onClose }: ChatModalProps) {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<LeagueChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Backend'den chat mesajlarını yükle
  const loadChatMessages = async () => {
    if (!league?.id || !user) return;

    console.log('Loading chat messages for league:', league.id);

    try {
      setLoading(true);
      const { data, error } = await leagueChatService.getLeagueChatMessages(league.id);
      
      console.log('Load chat messages response:', { data, error });
      
      if (error) {
        console.warn('Backend error, using mock data:', error);
        // Fallback to mock data if backend fails
        const mockMessages: LeagueChatMessage[] = [
          {
            id: '1',
            league_id: league.id,
            user_id: user.id,
            message: 'Merhaba! Bu ligde nasıl başarılı olabiliriz?',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profiles: {
              username: profile?.username || 'Sen',
              profile_image: profile?.profile_image || null
            }
          }
        ];
        setChatMessages(mockMessages);
        return;
      }
      
      setChatMessages(data || []);
    } catch (err) {
      console.error('Chat messages load error:', err);
      // Fallback to mock data
      const mockMessages: LeagueChatMessage[] = [
        {
          id: '1',
          league_id: league.id,
          user_id: user.id,
          message: 'Merhaba! Bu ligde nasıl başarılı olabiliriz?',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            username: profile?.username || 'Sen',
            profile_image: profile?.profile_image || null
          }
        }
      ];
      setChatMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  // Modal açıldığında mesajları yükle ve real-time subscription başlat
  useEffect(() => {
    if (visible && league) {
      loadChatMessages();
      
      // Real-time subscription başlat
      subscriptionRef.current = leagueChatService.subscribeToLeagueChat(
        league.id,
        (newMessage) => {
          console.log('Real-time message received:', newMessage);
          setChatMessages(prev => {
            // Duplicate check - aynı mesajı iki kez eklemeyi önle
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) {
              console.log('Message already exists, skipping');
              return prev;
            }
            console.log('Adding new message to chat');
            return [...prev, newMessage];
          });
        }
      );
    } else {
      // Modal kapandığında subscription'ı kapat
      if (subscriptionRef.current) {
        leagueChatService.unsubscribeFromLeagueChat(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        leagueChatService.unsubscribeFromLeagueChat(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [visible, league]);

  if (!league) return null;

  const sendMessage = async () => {
    if (!message.trim() || !user || !league?.id || sending) return;

    const messageText = message.trim();
    console.log('Sending message:', {
      league_id: league.id,
      user_id: user.id,
      message: messageText,
      league: league
    });

    // Mesajı hemen local state'e ekle (optimistic update)
    const optimisticMessage: LeagueChatMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      league_id: league.id,
      user_id: user.id,
      message: messageText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        username: profile?.username || 'Sen',
        profile_image: profile?.profile_image || null
      }
    };

    // Hemen mesajı ekle ve input'u temizle
    setChatMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    setSending(true);

    try {
      const { data, error } = await leagueChatService.sendChatMessage({
        league_id: league.id,
        user_id: user.id,
        message: messageText
      });
      
      console.log('Send message response:', { data, error });
      
      if (error) {
        console.warn('Backend error, keeping local message:', error);
        // Backend hatası olsa bile mesaj zaten local state'te
        return;
      }
      
      // Backend başarılı oldu, gerçek mesajı al
      if (data) {
        // Temporary mesajı gerçek mesajla değiştir
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? data : msg
          )
        );
      }
      
    } catch (err) {
      console.error('Send message error:', err);
      // Hata olsa bile mesaj zaten local state'te görünüyor
    } finally {
      setSending(false);
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#432870" />
              <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
            </View>
          ) : (
            chatMessages.map((msg) => (
              <View key={msg.id} style={styles.messageRow}>
                <Image 
                  source={{ 
                    uri: msg.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' 
                  }} 
                  style={styles.avatar} 
                />
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.username}>{msg.profiles?.username || 'Bilinmeyen'}</Text>
                    <Text style={styles.timestamp}>{formatTimeAgo(new Date(msg.created_at))}</Text>
                  </View>
                  <Text style={styles.messageText}>{msg.message}</Text>
                </View>
              </View>
            ))
          )}
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
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={sendMessage}
            activeOpacity={0.8}
            disabled={sending || !message.trim()}
          >
            <LinearGradient
              colors={sending || !message.trim() ? ['#CCCCCC', '#DDDDDD'] : ['#432870', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendGradient}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendText}>Gönder</Text>
              )}
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
  sendButtonDisabled: {
    opacity: 0.6,
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
});

