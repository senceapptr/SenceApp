import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MenuItem as MenuItemType, PageType, MenuItemAnimation } from '../types';
import { MenuItem } from './MenuItem';

interface MenuItemsListProps {
  items: MenuItemType[];
  animations: MenuItemAnimation[];
  onItemPress: (page: PageType | null, title: string) => void;
}

export function MenuItemsList({ items, animations, onItemPress }: MenuItemsListProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          animation={animations[index]}
          onPress={() => onItemPress(item.page, item.title)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 20,
  },
});








