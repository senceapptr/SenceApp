import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomTabsProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function BottomTabs({ currentPage, onPageChange }: BottomTabsProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Ana Sayfa',
      icon: 'home' as const
    },
    {
      id: 'search',
      label: 'Keşfet',
      icon: 'search' as const
    },
    {
      id: 'my-bets',
      label: 'Kuponlarım',
      icon: 'document-text' as const
    },
    {
      id: 'league',
      label: 'Ligler',
      icon: 'trophy' as const
    }
  ];

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopWidth: 2,
      borderTopColor: '#F2F3F5',
      paddingBottom: 34, // Safe area for iPhone
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 8
      }}>
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onPageChange(tab.id)}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 16,
                backgroundColor: isActive ? '#432870' : 'transparent',
                transform: isActive ? [{ scale: 1.05 }] : [{ scale: 1 }],
                shadowColor: isActive ? '#432870' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isActive ? 0.3 : 0,
                shadowRadius: 8,
                elevation: isActive ? 8 : 0
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={isActive ? 'white' : 'rgba(32, 32, 32, 0.7)'}
              />
              <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: isActive ? 'white' : 'rgba(32, 32, 32, 0.7)',
                marginTop: 4
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
} 