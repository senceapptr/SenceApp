import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SidebarItem {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  style?: any;
}

function Sidebar({ items, style }: SidebarProps) {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.label + idx}
          style={styles.item}
          onPress={item.onPress}
        >
          {item.icon && <Feather name={item.icon} size={20} style={styles.icon} />}
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 8,
    color: '#2563eb',
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
});

export { Sidebar };
