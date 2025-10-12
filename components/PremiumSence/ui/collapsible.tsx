import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  style?: any;
}

function Collapsible({ title, children, style }: CollapsibleProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen((o) => !o)}>
        <Text style={styles.title}>{title}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#2563eb" />
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

export { Collapsible };
