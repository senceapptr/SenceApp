import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ToggleGroupItem {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  items: ToggleGroupItem[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  style?: any;
}

function ToggleGroup({ items, value, onChange, multiple = false, style }: ToggleGroupProps) {
  const handlePress = (val: string) => {
    if (multiple) {
      if (value.includes(val)) {
        onChange(value.filter(v => v !== val));
      } else {
        onChange([...value, val]);
      }
    } else {
      onChange([val]);
    }
  };
  return (
    <View style={[styles.group, style]}>
      {items.map(item => (
        <TouchableOpacity
          key={item.value}
          style={[styles.item, value.includes(item.value) && styles.active]}
          onPress={() => handlePress(item.value)}
        >
          <Text style={[styles.label, value.includes(item.value) && styles.activeLabel]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  active: {
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export { ToggleGroup };
