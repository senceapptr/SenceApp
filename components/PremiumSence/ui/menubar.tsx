import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MenuItem {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}

interface MenubarProps {
  items: MenuItem[];
  style?: any;
}

function Menubar({ items, style }: MenubarProps) {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.label + idx}
          style={styles.item}
          onPress={item.onPress}
        >
          {item.icon && <Feather name={item.icon} size={18} style={styles.icon} />}
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 4,
    marginVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 6,
    color: '#2563eb',
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
});

export { Menubar };
