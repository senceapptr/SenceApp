import React from 'react';
import { View, TextInput, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';

interface CommentInputProps {
  theme: Theme;
  avatarUri: string;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export function CommentInput({ theme, avatarUri, value, onChangeText, onSend, disabled }: CommentInputProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          backgroundColor: theme.surfaceCard,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <Image source={{ uri: avatarUri }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Yorumunuzu yazın..."
            placeholderTextColor={theme.textMuted + 'AA'}
            style={{
              flex: 1,
              backgroundColor: theme.background,
              borderRadius: 12,
              padding: 12,
              fontSize: 14,
              color: theme.textPrimary,
              minHeight: 80,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: theme.border,
            }}
            multiline
            numberOfLines={3}
          />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity
            style={{ borderRadius: 12, overflow: 'hidden', opacity: disabled ? 0.5 : 1 }}
            onPress={onSend}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <LinearGradient colors={[theme.accent, theme.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10, gap: 8 }}>
              <Ionicons name="send" size={16} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Gönder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
