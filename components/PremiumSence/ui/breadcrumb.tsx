import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  style?: any;
}

function Breadcrumb({ items, style }: BreadcrumbProps) {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, idx) => (
        <React.Fragment key={item.label + idx}>
          {idx > 0 && (
            <Feather name="chevron-right" size={16} style={styles.separator} />
          )}
          {item.isCurrent ? (
            <Text style={[styles.label, styles.current]}>{item.label}</Text>
          ) : (
            <TouchableOpacity onPress={item.onPress}>
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
    color: '#2563eb',
    marginHorizontal: 2,
  },
  current: {
    color: '#222',
    fontWeight: 'bold',
  },
  separator: {
    color: '#888',
    marginHorizontal: 2,
  },
});

export { Breadcrumb };
