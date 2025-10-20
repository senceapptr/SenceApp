import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '../types';
import { getBadgeColors } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BadgesTabProps {
  badges: Badge[];
}

export const BadgesTab: React.FC<BadgesTabProps> = ({ badges }) => {
  const renderBadgeItem = (badge: Badge) => {
    const [color1, color2] = getBadgeColors(badge.rarity, badge.earned);
    
    return (
      <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeCardDisabled]}>
        <LinearGradient
          colors={[color1, color2]}
          style={styles.badgeGradient}
        >
          <Text style={styles.badgeIcon}>{badge.icon}</Text>
          <Text style={[styles.badgeName, !badge.earned && styles.badgeNameDisabled]}>
            {badge.name}
          </Text>
          <Text style={[styles.badgeDescription, !badge.earned && styles.badgeDescriptionDisabled]}>
            {badge.description}
          </Text>
          {badge.rarity === 'legendary' && (
            <View style={styles.legendaryBadge}>
              <Text style={styles.legendaryText}>Efsanevi</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.badgesGrid}>
      {badges.map(renderBadgeItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  badgeCardDisabled: {
    opacity: 0.5,
  },
  badgeGradient: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'rgba(67,40,112,0.2)',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeNameDisabled: {
    color: 'rgba(32,32,32,0.4)',
  },
  badgeDescription: {
    fontSize: 12,
    color: 'rgba(32,32,32,0.6)',
    textAlign: 'center',
  },
  badgeDescriptionDisabled: {
    color: 'rgba(32,32,32,0.3)',
  },
  legendaryBadge: {
    backgroundColor: 'rgba(178,158,253,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  legendaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#432870',
  },
});


