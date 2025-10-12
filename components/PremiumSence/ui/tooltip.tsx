import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <TouchableOpacity
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.tooltipBox}>
            <Text style={styles.tooltipText}>{content}</Text>
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
  tooltipBox: {
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 8,
    maxWidth: 220,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
  },
});

export { Tooltip };
