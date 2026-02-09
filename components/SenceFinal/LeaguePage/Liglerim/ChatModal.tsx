import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/contexts/AuthContext';
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
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<LeagueChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const subscriptionRef = useRef<any>(null);

  // Backend'den chat mesajlarını yükle
  const loadChatMessages = async () => {
    if (!league?.id || !user) return;

    try {
      setLoading(true);
      const { data, error } = await leagueChatService.getLeagueChatMessages(league.id);

      if (error) {
        console.warn('Backend error, using mock data:', error);
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
          setChatMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
          // Auto-scroll to bottom
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      );
    } else {
      if (subscriptionRef.current) {
        leagueChatService.unsubscribeFromLeagueChat(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }

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

    // Optimistic update
    const optimisticMessage: LeagueChatMessage = {
      id: `temp-${Date.now()}`,
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

    setChatMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    setSending(true);

    // Auto-scroll
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const { data, error } = await leagueChatService.sendChatMessage({
        league_id: league.id,
        user_id: user.id,
        message: messageText
      });

      if (error) {
        console.warn('Backend error:', error);
        return;
      }

      if (data) {
        setChatMessages(prev =>
          prev.map(msg =>
            msg.id === optimisticMessage.id ? data : msg
          )
        );
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const isOwnMessage = (msg: LeagueChatMessage) => msg.user_id === user?.id;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
      presentationStyle="fullScreen"
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          {/* Modern Header */}
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{league.name}</Text>
              <Text style={styles.headerSubtitle}>
                {chatMessages.length} mesaj
              </Text>
            </View>

            <View style={styles.headerPlaceholder} />
          </View>

          {/* Messages */}
          <KeyboardAvoidingView
            style={styles.messagesContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.messages}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
                </View>
              ) : chatMessages.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>💬</Text>
                  <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
                  <Text style={styles.emptySubtitle}>İlk mesajı sen yaz!</Text>
                </View>
              ) : (
                chatMessages.map((msg) => {
                  const isOwn = isOwnMessage(msg);
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageRow,
                        isOwn ? styles.messageRowOwn : styles.messageRowOther
                      ]}
                    >
                      {/* Avatar (only for others) */}
                      {!isOwn && (
                        <Image
                          source={{
                            uri: msg.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
                          }}
                          style={styles.avatar}
                        />
                      )}

                      <View style={[
                        styles.messageBubble,
                        isOwn ? styles.bubbleOwn : styles.bubbleOther
                      ]}>
                        {/* Username for others */}
                        {!isOwn && (
                          <Text style={styles.bubbleUsername}>
                            {msg.profiles?.username || 'Bilinmeyen'}
                          </Text>
                        )}

                        <Text style={[
                          styles.bubbleText,
                          isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther
                        ]}>
                          {msg.message}
                        </Text>

                        <Text style={[
                          styles.bubbleTime,
                          isOwn ? styles.bubbleTimeOwn : styles.bubbleTimeOther
                        ]}>
                          {formatTimeAgo(new Date(msg.created_at))}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Modern Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Mesajını yaz..."
                  value={message}
                  onChangeText={setMessage}
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  multiline
                  maxLength={500}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!message.trim() || sending) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                activeOpacity={0.8}
                disabled={sending || !message.trim()}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 44,
  },
  messagesContainer: {
    flex: 1,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  messageRowOwn: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  bubbleOwn: {
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
  },
  bubbleUsername: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextOwn: {
    color: '#FFFFFF',
  },
  bubbleTextOther: {
    color: '#FFFFFF',
  },
  bubbleTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  bubbleTimeOther: {
    color: 'rgba(255,255,255,0.4)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0D1117',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
