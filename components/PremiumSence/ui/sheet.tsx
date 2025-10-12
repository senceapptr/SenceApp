"use client";

import * as React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  side?: 'bottom' | 'right' | 'left' | 'top';
  style?: any;
}

function Sheet({ visible, onClose, children, title, description, side = 'right', style }: SheetProps) {
  const window = Dimensions.get('window');
  const getPositionStyle = () => {
    switch (side) {
      case 'bottom':
        return { justifyContent: 'flex-end', alignItems: 'center' };
      case 'top':
        return { justifyContent: 'flex-start', alignItems: 'center' };
      case 'left':
        return { justifyContent: 'center', alignItems: 'flex-start' };
      case 'right':
      default:
        return { justifyContent: 'center', alignItems: 'flex-end' };
    }
  };
  const getSheetStyle = () => {
    switch (side) {
      case 'bottom':
      case 'top':
        return { width: '100%', height: window.height * 0.5 };
      case 'left':
      case 'right':
      default:
        return { width: window.width * 0.8, height: '100%' };
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, getPositionStyle()]}> 
        <View style={[styles.sheet, getSheetStyle(), style]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.close}>
              <Feather name="x" size={22} color="#888" />
            </TouchableOpacity>
          </View>
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    minHeight: 180,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  close: {
    padding: 4,
  },
  description: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
});

export { Sheet };
