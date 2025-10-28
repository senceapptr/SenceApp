import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface URLImagePickerProps {
  onImageSelected: (imageUri: string) => void;
  title?: string;
  style?: any;
}

export function URLImagePicker({ 
  onImageSelected, 
  title = 'Fotoğraf URL\'si Ekle',
  style 
}: URLImagePickerProps) {
  const [showInput, setShowInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleURLSubmit = () => {
    if (!imageUrl.trim()) {
      Alert.alert('Hata', 'Lütfen geçerli bir URL girin');
      return;
    }

    // Basit URL validation
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
    if (!urlPattern.test(imageUrl)) {
      Alert.alert('Hata', 'Lütfen geçerli bir resim URL\'si girin (jpg, png, gif, webp)');
      return;
    }

    onImageSelected(imageUrl);
    setImageUrl('');
    setShowInput(false);
    Alert.alert('Başarılı', 'Fotoğraf URL\'si eklendi');
  };

  if (showInput) {
    return (
      <View style={[styles.inputContainer, style]}>
        <TextInput
          style={styles.urlInput}
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChangeText={setImageUrl}
          keyboardType="url"
          autoCapitalize="none"
        />
        <View style={styles.inputButtons}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowInput(false)}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleURLSubmit}
          >
            <Text style={styles.submitButtonText}>Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={() => setShowInput(true)}
    >
      <Ionicons name="link" size={20} color="white" />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#432870',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  urlInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  inputButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#432870',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
