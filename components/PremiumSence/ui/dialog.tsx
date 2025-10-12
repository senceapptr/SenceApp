"use client";

import * as React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';

const XIcon = (props: any) => <Feather name="x" {...props} />;

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Dialog({ visible, onClose, children }: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  style?: any;
  onClose?: () => void;
}
function DialogContent({ children, style, onClose }: DialogContentProps) {
  return (
    <View style={[styles.dialogContent, style]}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <XIcon size={24} color="#888" />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
}

function DialogHeader({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.dialogHeader, style]}>{children}</View>;
}

function DialogFooter({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.dialogFooter, style]}>{children}</View>;
}

function DialogTitle({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.dialogTitle, style]}>{children}</Text>;
}

function DialogDescription({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.dialogDescription, style]}>{children}</Text>;
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  dialogContent: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 8,
  },
  dialogHeader: {
    marginBottom: 12,
  },
  dialogFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  dialogDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
});
