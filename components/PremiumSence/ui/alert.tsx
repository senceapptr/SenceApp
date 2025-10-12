import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  style?: ViewStyle;
}

function Alert({ children, variant = 'default', style }: AlertProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>{children}</View>
  );
}

interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}
function AlertTitle({ children, style }: AlertTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}
function AlertDescription({ children, style }: AlertDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
  },
  default: {
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
  },
  destructive: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#222',
  },
  description: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
});

export { Alert, AlertTitle, AlertDescription };
