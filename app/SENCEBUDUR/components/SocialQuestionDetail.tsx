import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface SocialQuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function SocialQuestionDetail({ isOpen, onClose }: SocialQuestionDetailProps) {
  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          width: '100%',
          maxWidth: 400
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#202020',
            marginBottom: 16,
            textAlign: 'center'
          }}>
            Sosyal Soru Detayı
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#432870',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center'
            }}
            onPress={onClose}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Kapat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 