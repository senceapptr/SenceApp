import * as React from "react";
import { Text, StyleSheet, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: TextStyle;
}

function Badge({ children, variant = 'default', style }: BadgeProps) {
  return (
    <Text style={[styles.base, styles[variant], style]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginRight: 4,
    marginBottom: 4,
  },
  default: {
    backgroundColor: '#2563eb', // bg-primary
    borderColor: 'transparent',
    color: '#fff', // text-primary-foreground
  },
  secondary: {
    backgroundColor: '#f3f4f6', // bg-secondary
    borderColor: 'transparent',
    color: '#222', // text-secondary-foreground
  },
  destructive: {
    backgroundColor: '#ef4444', // bg-destructive
    borderColor: 'transparent',
    color: '#fff',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#222',
    color: '#222',
  },
});

export { Badge };
