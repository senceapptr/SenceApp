import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusBadgeColors } from '../../utils';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colors = getStatusBadgeColors(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.backgroundColor }]}>
      <View style={[styles.statusDot, { backgroundColor: colors.dotColor }]} />
      <Text style={[styles.statusText, { color: colors.textColor }]}>
        {colors.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});


