import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles = {
  default: {
    backgroundColor: '#7C3AED',
  },
  destructive: {
    backgroundColor: '#EF4444',
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondary: {
    backgroundColor: '#EDE7F6',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
};

const sizeStyles = {
  default: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  lg: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};

export function Button({
  children,
  onPress,
  disabled,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});
