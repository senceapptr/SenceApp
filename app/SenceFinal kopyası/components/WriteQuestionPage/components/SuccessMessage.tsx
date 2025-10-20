import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SuccessMessageProps {
  visible: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.successMessage}>
      <Text style={styles.successIcon}>✅</Text>
      <Text style={styles.successText}>Sorun başarıyla gönderildi!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  successMessage: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  successIcon: {
    fontSize: 20,
  },
  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});


