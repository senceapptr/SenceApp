import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SubmitButtonProps {
  onPress: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  disabled,
  isSubmitting,
}) => {
  return (
    <TouchableOpacity
      style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ['#E5E7EB', '#E5E7EB'] : ['#432870', '#B29EFD']}
        style={styles.submitGradient}
      >
        {isSubmitting ? (
          <View style={styles.loadingContainer}>
            <View style={styles.spinner} />
            <Text style={styles.submitButtonTextDisabled}>Gönderiliyor...</Text>
          </View>
        ) : (
          <Text style={[styles.submitButtonText, disabled && styles.submitButtonTextDisabled]}>
            Soruyu Gönder
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  submitButtonTextDisabled: {
    color: '#6B7280',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: 10,
  },
});


