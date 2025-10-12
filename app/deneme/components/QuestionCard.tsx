import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';

interface QuestionCardProps {
  title: string;
  image: string;
  yesPercentage: number;
  votes: string;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  onVote: () => void;
}

export default function QuestionCard({
  title,
  image,
  yesPercentage,
  votes,
  timeLeft,
  yesOdds,
  noOdds,
  onVote
}: QuestionCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onVote}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Evet</Text>
            <Text style={styles.statValue}>{yesPercentage}%</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Hayır</Text>
            <Text style={styles.statValue}>{100 - yesPercentage}%</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.voteInfo}>
            <Text style={styles.votes}>{votes}</Text>
            <Text style={styles.timeLeft}>{timeLeft}</Text>
          </View>
          
          <View style={styles.odds}>
            <View style={styles.oddButton}>
              <Text style={styles.oddLabel}>Evet</Text>
              <Text style={styles.oddValue}>{yesOdds}</Text>
            </View>
            <View style={styles.oddButton}>
              <Text style={styles.oddLabel}>Hayır</Text>
              <Text style={styles.oddValue}>{noOdds}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteInfo: {
    flex: 1,
  },
  votes: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  timeLeft: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  odds: {
    flexDirection: 'row',
    gap: 8,
  },
  oddButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  oddLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  oddValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
