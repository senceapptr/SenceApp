// =====================================================
// NOTIFICATION CARD
// =====================================================

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NotificationCardProps } from '../types';
import { getNotificationConfig } from '../utils';

const HEX_COLOR_PATTERN = /^#?([0-9a-f]{6})$/i;

const toRgb = (hexColor: string) => {
  const match = HEX_COLOR_PATTERN.exec(hexColor.trim());
  if (!match) {
    return { b: 110, g: 110, r: 110 };
  }

  const normalized = match[1];
  return {
    b: parseInt(normalized.slice(4, 6), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    r: parseInt(normalized.slice(0, 2), 16),
  };
};

const getReadToneFromTint = (hexColor: string) => {
  const { b, g, r } = toRgb(hexColor);
  const luminance = r * 0.299 + g * 0.587 + b * 0.114;

  const desaturated = {
    b: Math.round(b * 0.12 + luminance * 0.88),
    g: Math.round(g * 0.12 + luminance * 0.88),
    r: Math.round(r * 0.12 + luminance * 0.88),
  };

  const background = {
    b: Math.round(desaturated.b * 0.18 + 12),
    g: Math.round(desaturated.g * 0.18 + 12),
    r: Math.round(desaturated.r * 0.18 + 12),
  };

  const border = {
    b: Math.round(desaturated.b * 0.28 + 20),
    g: Math.round(desaturated.g * 0.28 + 20),
    r: Math.round(desaturated.r * 0.28 + 20),
  };

  return {
    backgroundColor: `rgb(${background.r}, ${background.g}, ${background.b})`,
    borderColor: `rgb(${border.r}, ${border.g}, ${border.b})`,
  };
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
  const config = getNotificationConfig(notification.type);
  const isUnread = !notification.read;
  const readToneStyle = getReadToneFromTint(config.tintColor);
  const cardToneStyle = isUnread
    ? {
        backgroundColor: `${config.tintColor}2B`,
        borderColor: `${config.tintColor}B3`,
        shadowColor: config.tintColor,
      }
    : {
        ...readToneStyle,
        shadowColor: config.tintColor,
      };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(notification)}
      style={[styles.container, cardToneStyle, isUnread && styles.unreadContainer]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: `${config.tintColor}40`,
              borderColor: `${config.tintColor}CC`,
            },
          ]}
        >
          <Ionicons color={config.tintColor} name={config.iconName as any} size={24} />
        </View>

        <View style={styles.textContent}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={[styles.title, !isUnread && styles.readText]}>
              {notification.title}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>

          <Text numberOfLines={2} style={[styles.message, !isUnread && styles.readText]}>
            {notification.message}
          </Text>

          <Text style={styles.time}>{notification.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#253247',
    borderColor: '#5E7CA6',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 4,
    minHeight: 100,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.26,
    shadowRadius: 12,
  },
  content: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    marginTop: 1,
    width: 46,
  },
  message: {
    color: '#B1BAC4',
    fontSize: 14,
    lineHeight: 20,
  },
  readText: {
    color: '#8B949E',
  },
  textContent: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
    minHeight: 70,
  },
  time: {
    color: '#8B949E',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  title: {
    color: '#F0F6FC',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  unreadContainer: {
    borderWidth: 1.2,
  },
  unreadDot: {
    backgroundColor: '#3D83FF',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});
