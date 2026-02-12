import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import type { LeagueChatMessage } from '@/services/league-chat.service';

import { useAuth } from '@/contexts/AuthContext';
import { leagueChatService } from '@/services/league-chat.service';

import { League } from '../types';
import { formatTimeAgo } from '../utils';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  league: League | null;
}

export function ChatModal({ league, onClose, visible }: ChatModalProps) {
  const { profile, user } = useAuth();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<LeagueChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const subscriptionRef = useRef<any>(null);

  // Backend'den chat mesajlarını yükle
  const loadChatMessages = useCallback(async () => {
    if (!league?.id || !user) return;

    try {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await leagueChatService.getLeagueChatMessages(league.id);

      if (error) {
        console.error('Chat messages load error:', error);
        setChatMessages([]);
        setLoadError('Mesajlar yüklenemedi');
        return;
      }

      setChatMessages(data || []);
    } catch (err) {
      console.error('Chat messages load error:', err);
      setChatMessages([]);
      setLoadError('Mesajlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  }, [league?.id, user]);

  // Modal açıldığında mesajları yükle ve real-time subscription başlat
  useEffect(() => {
    if (visible && league) {
      loadChatMessages();

      // Real-time subscription başlat
      subscriptionRef.current = leagueChatService.subscribeToLeagueChat(league.id, newMessage => {
        setChatMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
        // Auto-scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
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
  }, [visible, league, loadChatMessages]);

  if (!league) return null;

  const sendMessage = async () => {
    if (!message.trim() || !user || !league?.id || sending) return;

    const messageText = message.trim();

    // Optimistic update
    const optimisticMessage: LeagueChatMessage = {
      created_at: new Date().toISOString(),
      id: `temp-${Date.now()}`,
      league_id: league.id,
      message: messageText,
      profiles: {
        profile_image: profile?.profile_image || null,
        username: profile?.username || 'Sen',
      },
      updated_at: new Date().toISOString(),
      user_id: user.id,
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
        message: messageText,
        user_id: user.id,
      });

      if (error) {
        console.warn('Backend error:', error);
        setChatMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        return;
      }

      if (data) {
        setChatMessages(prev => prev.map(msg => (msg.id === optimisticMessage.id ? data : msg)));
      }
    } catch (err) {
      console.error('Send message error:', err);
      setChatMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
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
            <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{league.name}</Text>
              <Text style={styles.headerSubtitle}>{chatMessages.length} mesaj</Text>
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
                  <ActivityIndicator size="large" color="#256EFF" />
                  <Text style={styles.loadingText}>Mesajlar yükleniyor...</Text>
                </View>
              ) : loadError ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={34} color="#EF4444" />
                  <Text style={styles.errorTitle}>Mesajlar yüklenemedi</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={loadChatMessages} activeOpacity={0.8}>
                    <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                  </TouchableOpacity>
                </View>
              ) : chatMessages.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>💬</Text>
                  <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
                  <Text style={styles.emptySubtitle}>İlk mesajı sen yaz!</Text>
                </View>
              ) : (
                chatMessages.map(msg => {
                  const isOwn = isOwnMessage(msg);
                  return (
                    <View
                      key={msg.id}
                      style={[styles.messageRow, isOwn ? styles.messageRowOwn : styles.messageRowOther]}
                    >
                      {/* Avatar (only for others) */}
                      {!isOwn && (
                        <Image
                          source={{
                            uri:
                              msg.profiles?.profile_image ||
                              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
                          }}
                          style={styles.avatar}
                        />
                      )}

                      <View style={[styles.messageBubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
                        {/* Username for others */}
                        {!isOwn && <Text style={styles.bubbleUsername}>{msg.profiles?.username || 'Bilinmeyen'}</Text>}

                        <Text style={[styles.bubbleText, isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther]}>
                          {msg.message}
                        </Text>

                        <Text style={[styles.bubbleTime, isOwn ? styles.bubbleTimeOwn : styles.bubbleTimeOther]}>
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
                style={[styles.sendButton, (!message.trim() || sending) && styles.sendButtonDisabled]}
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
  avatar: {
    borderRadius: 16,
    height: 32,
    marginRight: 10,
    width: 32,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  bubbleOther: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
  },
  bubbleOwn: {
    backgroundColor: '#256EFF',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextOther: {
    color: '#FFFFFF',
  },
  bubbleTextOwn: {
    color: '#FFFFFF',
  },
  bubbleTime: {
    alignSelf: 'flex-end',
    fontSize: 11,
    marginTop: 4,
  },
  bubbleTimeOther: {
    color: 'rgba(255,255,255,0.4)',
  },
  bubbleTimeOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  bubbleUsername: {
    color: '#256EFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: 44,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
  },
  inputContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#0D1117',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#256EFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  messageBubble: {
    borderRadius: 20,
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  messageRowOwn: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messages: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  modalBackground: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(37,110,255,0.16)',
    borderColor: 'rgba(37,110,255,0.4)',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#256EFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#256EFF',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
