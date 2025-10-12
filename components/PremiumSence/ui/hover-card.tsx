import * as React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  style?: any;
}

function HoverCard({ trigger, content, style }: HoverCardProps) {
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
          <View style={[styles.card, style]}>
            {content}
            <TouchableOpacity style={styles.close} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Kapat</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    minWidth: 220,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  close: {
    marginTop: 12,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  closeText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

export { HoverCard };
