import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { League } from '../types';
import { resolveLeagueIcon } from './leagueIcons';
import { ACCENT_DARK, PRIMARY_BLUE } from './theme';
import { formatLeagueRemaining } from '../utils/timeRemaining';

const CARD_CONTENT_PADDING = 20;

const PRIMARY_CTA_EDGE_GAP = CARD_CONTENT_PADDING;
const PRIMARY_CTA_SHELL_GAP = 1;
const PRIMARY_CTA_OUTER_RADIUS = PRIMARY_CTA_EDGE_GAP;
const PRIMARY_CTA_INNER_RADIUS = PRIMARY_CTA_OUTER_RADIUS - PRIMARY_CTA_SHELL_GAP;

const SECONDARY_CTA_EDGE_GAP = CARD_CONTENT_PADDING;
const SECONDARY_CTA_SHELL_GAP = 1;
const SECONDARY_CTA_OUTER_RADIUS = SECONDARY_CTA_EDGE_GAP;
const SECONDARY_CTA_INNER_RADIUS = SECONDARY_CTA_OUTER_RADIUS - SECONDARY_CTA_SHELL_GAP;

const INFO_BOX_SHELL_GAP = 1;
const INFO_BOX_OUTER_RADIUS = SECONDARY_CTA_OUTER_RADIUS;
const INFO_BOX_INNER_RADIUS = INFO_BOX_OUTER_RADIUS - INFO_BOX_SHELL_GAP;

interface LeagueCardProps {
  league: League;
  nowTick: number;
  isMyLeague?: boolean;
  onCardPress: (league: League) => void;
  onJoinPress?: (league: League) => void;
  onChatPress?: (league: League) => void;
  onQuestionsPress?: (league: League) => void;
  onLeaderboardPress?: (league: League) => void;
}

export function LeagueCard({
  isMyLeague = false,
  league,
  nowTick,
  onCardPress,
  onChatPress,
  onJoinPress,
  onLeaderboardPress,
  onQuestionsPress,
}: LeagueCardProps) {
  const remainingText = formatLeagueRemaining(league.endDateISO, nowTick);
  const resolvedIcon = resolveLeagueIcon(league.leagueIconName, league.leagueIconColor);
  const isJoinCompleted = league.status === 'completed';
  const isAlreadyJoined = !isMyLeague && league.isJoined;
  const joinCostText = league.joinCost > 0 ? `${league.joinCost.toLocaleString('tr-TR')} kredi` : 'Ücretsiz';
  const participantsText = `${league.participants} katılımcı`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        (league.isFeatured || (isMyLeague && league.status === 'active')) && styles.featuredCard,
        league.status === 'completed' && styles.completedCard,
      ]}
      onPress={() => onCardPress(league)}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrap, { backgroundColor: resolvedIcon.color }]}>
            <Ionicons name={resolvedIcon.name} size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {league.name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={15} color="#A7B7D8" />
            <Text style={styles.metaText}>{participantsText}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color="#A7B7D8" />
            <Text style={styles.metaText} numberOfLines={1}>
              {remainingText}
            </Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.infoBoxOuter}>
            <View style={styles.infoBoxInner}>
              <Text style={styles.infoLabel}>Katılım</Text>
              <Text style={styles.infoValue}>{joinCostText}</Text>
            </View>
          </View>
          <View style={styles.infoBoxOuter}>
            <View style={styles.infoBoxInner}>
              <Text style={styles.infoLabel}>Güncel Ödül</Text>
              <Text style={styles.infoValue}>{league.prize}</Text>
            </View>
          </View>
        </View>

        {!isMyLeague ? (
          isAlreadyJoined ? (
            <View style={styles.joinedButtonOuter}>
              <View style={styles.joinedButtonInner}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#D6E4FF" />
                <Text style={styles.joinedButtonText}>Katıldın</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.joinButtonWrapper}
              onPress={e => {
                e.stopPropagation();
                onJoinPress?.(league);
              }}
              disabled={isJoinCompleted}
              activeOpacity={0.8}
            >
              <View style={[styles.joinButtonOuter, isJoinCompleted && styles.joinButtonOuterDisabled]}>
                <View style={[styles.joinButtonInner, isJoinCompleted && styles.joinButtonInnerDisabled]}>
                  <Ionicons name={isJoinCompleted ? 'time-outline' : 'rocket-outline'} size={18} color="#FFFFFF" />
                  <Text style={styles.joinText}>{isJoinCompleted ? 'Süre Doldu' : 'Lige Katıl'}</Text>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.9)" />
                </View>
              </View>
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.myLeagueActions}>
            <TouchableOpacity
              style={styles.raceButtonOuter}
              onPress={e => {
                e.stopPropagation();
                onQuestionsPress?.(league);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.raceButtonInner}>
                <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
                <Text style={styles.raceButtonText}>Yarış!</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={e => {
                e.stopPropagation();
                onLeaderboardPress?.(league);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonInner}>
                <Ionicons name="trophy-outline" size={16} color="#F0F6FC" />
                <Text style={styles.actionButtonText}>Sıralama</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chatActionButtonOuter}
              onPress={e => {
                e.stopPropagation();
                onChatPress?.(league);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.chatActionButtonInner}>
                <Ionicons name="chatbubble-outline" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: '#30363D',
    borderRadius: SECONDARY_CTA_OUTER_RADIUS,
    padding: SECONDARY_CTA_SHELL_GAP,
    flex: 1,
  },
  actionButtonInner: {
    alignItems: 'center',
    backgroundColor: '#21262D',
    borderRadius: SECONDARY_CTA_INNER_RADIUS,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#F0F6FC',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#161B22',
    borderColor: 'rgba(47,79,140,0.35)',
    borderRadius: 24,
    borderWidth: 1.5,
    elevation: 8,
    marginBottom: 16,
    minHeight: 252,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  chatActionButtonOuter: {
    backgroundColor: '#4766A2',
    borderRadius: SECONDARY_CTA_OUTER_RADIUS,
    padding: SECONDARY_CTA_SHELL_GAP,
  },
  chatActionButtonInner: {
    alignItems: 'center',
    backgroundColor: ACCENT_DARK,
    borderRadius: SECONDARY_CTA_INNER_RADIUS,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  completedCard: {
    opacity: 0.6,
  },
  content: {
    padding: CARD_CONTENT_PADDING,
  },
  featuredCard: {
    borderColor: PRIMARY_BLUE,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  infoBoxInner: {
    backgroundColor: 'rgba(47,79,140,0.16)',
    borderRadius: INFO_BOX_INNER_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoBoxOuter: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(47,79,140,0.35)',
    borderRadius: INFO_BOX_OUTER_RADIUS,
    borderWidth: INFO_BOX_SHELL_GAP,
    flex: 1,
    overflow: 'hidden',
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#F0F6FC',
    fontSize: 15,
    fontWeight: '800',
  },
  joinButtonInner: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: PRIMARY_CTA_INNER_RADIUS,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  joinButtonInnerDisabled: {
    backgroundColor: '#334155',
  },
  joinButtonOuter: {
    backgroundColor: '#3D83FF',
    borderRadius: PRIMARY_CTA_OUTER_RADIUS,
    padding: PRIMARY_CTA_SHELL_GAP,
  },
  joinButtonOuterDisabled: {
    backgroundColor: '#334155',
    opacity: 0.78,
  },
  joinButtonWrapper: {
    borderRadius: PRIMARY_CTA_OUTER_RADIUS,
    marginTop: 14,
    overflow: 'hidden',
  },
  joinedButtonInner: {
    alignItems: 'center',
    backgroundColor: '#2F4F8C',
    borderRadius: PRIMARY_CTA_INNER_RADIUS,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  joinedButtonOuter: {
    backgroundColor: 'rgba(214,228,255,0.2)',
    borderRadius: PRIMARY_CTA_OUTER_RADIUS,
    marginTop: 14,
    padding: PRIMARY_CTA_SHELL_GAP,
  },
  joinedButtonText: {
    color: '#D6E4FF',
    fontSize: 15,
    fontWeight: '800',
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  metaRow: {
    gap: 8,
  },
  metaText: {
    color: '#A7B7D8',
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  myLeagueActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  raceButtonInner: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: SECONDARY_CTA_INNER_RADIUS,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  raceButtonOuter: {
    backgroundColor: '#3D83FF',
    borderRadius: SECONDARY_CTA_OUTER_RADIUS,
    flex: 1,
    padding: SECONDARY_CTA_SHELL_GAP,
  },
  raceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    color: '#F0F6FC',
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
});
