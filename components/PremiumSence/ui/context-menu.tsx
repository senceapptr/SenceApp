import * as React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ContextMenuItem {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  destructive?: boolean;
}

interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  style?: any;
}

function ContextMenu({ trigger, items, style }: ContextMenuProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <TouchableOpacity onLongPress={() => setVisible(true)}>{trigger}</TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.menu, style]}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={item.label + idx}
                style={[styles.item, item.destructive && styles.destructive]}
                onPress={() => {
                  setVisible(false);
                  item.onPress && item.onPress();
                }}
              >
                {item.icon && <Feather name={item.icon} size={18} style={styles.icon} />}
                <Text style={[styles.label, item.destructive && styles.destructiveLabel]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancel} onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 12,
    minHeight: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  icon: {
    marginRight: 8,
    color: '#2563eb',
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
  destructive: {
    backgroundColor: '#fee2e2',
  },
  destructiveLabel: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  cancel: {
    marginTop: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  cancelText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export { ContextMenu };
