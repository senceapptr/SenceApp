import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, ImageSourcePropType } from 'react-native';

import { Coupon } from '@/components/SenceFinal/CouponsPage/types';

import { TicketListItem } from './TicketListItem';

interface TicketsTabProps {
  tickets: Coupon[];
  onTicketPress: (ticket: Coupon) => void;
}

type QuestionCardAnswer = 'EVET' | 'HAYIR';

interface TicketQuestionCard {
  id: string;
  ticket: Coupon;
  question: string;
  answer: QuestionCardAnswer;
  image: ImageSourcePropType;
}

// Mevcut ticket listesi korunur; yeni grid görünüm aktif.
const SHOW_LEGACY_TICKET_LIST = false;

const MOCK_IMAGES: ImageSourcePropType[] = [
  require('../../../../assets/images/global_new.png'),
  require('../../../../assets/images/spor_new.png'),
  require('../../../../assets/images/teknoloji_new.png'),
  require('../../../../assets/images/finans_new.png'),
  require('../../../../assets/images/politika_new.png'),
  require('../../../../assets/images/sinema_new.png'),
  require('../../../../assets/images/magazin_new.png'),
  require('../../../../assets/images/muzik_new.png'),
  require('../../../../assets/images/sosyal_medya_new.png'),
];

const MOCK_IMAGE_BY_CATEGORY: Record<string, ImageSourcePropType> = {
  finans: require('../../../../assets/images/finans_new.png'),
  genel: require('../../../../assets/images/global_new.png'),
  global: require('../../../../assets/images/global_new.png'),
  magazin: require('../../../../assets/images/magazin_new.png'),
  muzik: require('../../../../assets/images/muzik_new.png'),
  politika: require('../../../../assets/images/politika_new.png'),
  sinema: require('../../../../assets/images/sinema_new.png'),
  sosyal: require('../../../../assets/images/sosyal_medya_new.png'),
  'sosyal medya': require('../../../../assets/images/sosyal_medya_new.png'),
  spor: require('../../../../assets/images/spor_new.png'),
  teknoloji: require('../../../../assets/images/teknoloji_new.png'),
};

const normalizeCategory = (category?: string): string =>
  (category || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .trim();

const getMockImage = (category: string | undefined, index: number): ImageSourcePropType => {
  const normalized = normalizeCategory(category);
  return MOCK_IMAGE_BY_CATEGORY[normalized] || MOCK_IMAGES[index % MOCK_IMAGES.length];
};

const buildQuestionCards = (tickets: Coupon[]): TicketQuestionCard[] => {
  return tickets.reduce<TicketQuestionCard[]>((acc, ticket, ticketIndex) => {
    (ticket.predictions || []).forEach((prediction, predictionIndex) => {
      const answer: QuestionCardAnswer = prediction.choice === 'yes' ? 'EVET' : 'HAYIR';
      const cardIdBase = prediction.id || prediction.questionId || `${ticket.id}-${predictionIndex}`;

      acc.push({
        answer,
        id: `${ticket.rawId}-${cardIdBase}-${predictionIndex}`,
        image: getMockImage(prediction.category, ticketIndex + predictionIndex),
        question: prediction.question || 'Soru bilgisi bulunamadı',
        ticket,
      });
    });

    return acc;
  }, []);
};

export const TicketsTab: React.FC<TicketsTabProps> = ({ onTicketPress, tickets }) => {
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
            onPress={() => onTicketPress(card.ticket)}
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
                colors={['transparent', 'rgba(13,17,23,0.88)']}
                start={{ x: 0.5, y: 0.2 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.cardBottomOverlay}
              >
                <Text numberOfLines={2} style={styles.questionTitle}>
                  {card.question}
                </Text>
                <Text style={styles.answerLine}>Yanıt: {card.answer}</Text>
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
  answerLine: {
    color: 'rgba(240, 246, 252, 0.78)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  answerNoBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.24)',
    borderColor: 'rgba(239, 68, 68, 0.55)',
  },
  answerYesBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.24)',
    borderColor: 'rgba(16, 185, 129, 0.55)',
  },
  cardBottomOverlay: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 20,
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
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
});
