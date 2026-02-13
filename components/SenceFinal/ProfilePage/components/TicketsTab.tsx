import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, ImageSourcePropType } from 'react-native';

import { Coupon } from '@/components/SenceFinal/CouponsPage/types';

import { TicketListItem } from './TicketListItem';

interface TicketsTabProps {
  tickets: Coupon[];
  onTicketPress: (ticket: Coupon) => void;
  onQuestionPress?: (questionId: string) => void;
}

type QuestionCardAnswer = 'EVET' | 'HAYIR';

interface TicketQuestionCard {
  id: string;
  ticket: Coupon;
  question: string;
  questionId: string;
  answer: QuestionCardAnswer;
  image: ImageSourcePropType;
}

// Mevcut ticket listesi korunur; yeni grid görünüm aktif.
const SHOW_LEGACY_TICKET_LIST = false;

const FALLBACK_QUESTION_IMAGE: ImageSourcePropType = require('../../../../assets/images/global_new.png');

const buildQuestionCards = (tickets: Coupon[]): TicketQuestionCard[] => {
  return tickets.reduce<TicketQuestionCard[]>((acc, ticket) => {
    (ticket.predictions || []).forEach((prediction, predictionIndex) => {
      const answer: QuestionCardAnswer = prediction.choice === 'yes' ? 'EVET' : 'HAYIR';
      const cardIdBase = prediction.id || prediction.questionId || `${ticket.id}-${predictionIndex}`;

      acc.push({
        answer,
        id: `${ticket.rawId}-${cardIdBase}-${predictionIndex}`,
        image: prediction.questionImage ? { uri: prediction.questionImage } : FALLBACK_QUESTION_IMAGE,
        question: prediction.question || 'Soru bilgisi bulunamadı',
        questionId: prediction.questionId || '',
        ticket,
      });
    });

    return acc;
  }, []);
};

export const TicketsTab: React.FC<TicketsTabProps> = ({ onQuestionPress, onTicketPress, tickets }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="ticket-outline" size={32} color="#30363D" />
        </View>
        <Text style={styles.emptyTitle}>Henüz Ticket Yok</Text>
        <Text style={styles.emptyText}>Oluşturduğun ticketlar burada listelenecek.</Text>
      </View>
    );
  }

  if (SHOW_LEGACY_TICKET_LIST) {
    return (
      <View style={styles.container}>
        {tickets.map(ticket => (
          <TicketListItem key={ticket.id} ticket={ticket} onPress={() => onTicketPress(ticket)} />
        ))}
      </View>
    );
  }

  const questionCards = buildQuestionCards(tickets);

  if (questionCards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="images-outline" size={32} color="#30363D" />
        </View>
        <Text style={styles.emptyTitle}>Henüz Soru Yok</Text>
        <Text style={styles.emptyText}>Kuponlarına eklediğin sorular burada kare kartlar halinde gösterilecek.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.questionsGrid}>
        {questionCards.map(card => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.88}
            onPress={() => {
              if (card.questionId && onQuestionPress) {
                onQuestionPress(card.questionId);
                return;
              }

              onTicketPress(card.ticket);
            }}
            style={styles.questionCardWrapper}
          >
            <ImageBackground source={card.image} style={styles.questionCard} imageStyle={styles.questionCardImage}>
              <View style={styles.cardTopRow}>
                <View
                  style={[styles.answerBadge, card.answer === 'EVET' ? styles.answerYesBadge : styles.answerNoBadge]}
                >
                  <Text style={styles.answerBadgeText}>{card.answer}</Text>
                </View>
              </View>

              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.62)', 'rgba(0,0,0,0.95)']}
                locations={[0, 0.42, 0.76, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.cardBottomOverlay}
              >
                <Text numberOfLines={2} style={styles.questionTitle}>
                  {card.question}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  answerBadge: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  answerBadgeText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  answerNoBadge: {
    backgroundColor: '#FF453A',
    borderColor: 'rgba(255, 69, 58, 0.9)',
  },
  answerYesBadge: {
    backgroundColor: '#22C55E',
    borderColor: 'rgba(34, 197, 94, 0.9)',
  },
  cardBottomOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  cardTopRow: {
    alignItems: 'flex-start',
    padding: 6,
  },
  container: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyText: {
    color: '#8B949E',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#F0F6FC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(48, 54, 61, 0.5)',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  questionCard: {
    flex: 1,
    justifyContent: 'space-between',
  },
  questionCardImage: {
    borderRadius: 14,
  },
  questionCardWrapper: {
    aspectRatio: 1,
    backgroundColor: '#161B22',
    borderColor: 'rgba(240, 246, 252, 0.12)',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
    overflow: 'hidden',
    width: '32%',
  },
  questionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  questionTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
});
