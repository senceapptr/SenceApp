import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MenuItem as MenuItemType } from '../types';
import { MenuItemAnimation } from '../types';

interface MenuItemProps {
  item: MenuItemType;
  animation: MenuItemAnimation;
  onPress: () => void;
}

export function MenuItem({ item, animation, onPress }: MenuItemProps) {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation.opacity,
          transform: [
            { translateX: animation.translateX },
            { scale: animation.scale },
          ],
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.item,
          item.highlight && styles.itemHighlight
        ]}
        onPress={onPress}>
        <Text style={[
          styles.text,
          item.highlight && styles.textHighlight
        ]}>
          {item.title}
        </Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  itemHighlight: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  textHighlight: {
    fontWeight: '700',
    fontSize: 18,
  },
  arrow: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
  },
});



