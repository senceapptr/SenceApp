import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { optionsData } from '../../utils';

export const OptionsInfo: React.FC = () => {
  return (
    <View style={styles.optionsInfo}>
      <View style={styles.optionsHeader}>
        <Text style={styles.optionsTitle}>Seçenekler</Text>
      </View>
      <View style={styles.optionsList}>
        {optionsData.map((option, index) => (
          <View key={index} style={styles.optionItem}>
            <View style={[styles.optionDot, { backgroundColor: option.color }]} />
            <Text style={styles.optionText}>
              <Text style={styles.optionBold}>{option.label}</Text> - {option.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsInfo: {
    backgroundColor: 'rgba(30, 64, 175, 0.14)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
  optionsHeader: {
    marginBottom: 12,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DBEAFE',
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    color: '#BFDBFE',
    flex: 1,
  },
  optionBold: {
    fontWeight: '700',
    color: '#F8FAFC',
  },
});

