import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PredictionCard3 } from './QuestionCardDesign';
import { useTheme } from '../contexts/ThemeContext';

interface QuestionCardDesignPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export function QuestionCardDesignPage({ onBack, onMenuToggle }: QuestionCardDesignPageProps) {
  const { theme, isDarkMode } = useTheme();

  // Sample questions for demonstration
  const sampleQuestions = [
    {
      id: 1,
      title: "Tesla 2024 yılı sonuna kadar $300'ı aşacak mı?",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      totalVotes: 2847,
      timeLeft: "3 gün 12 saat",
      yesPercentage: 42,
      category: "Teknoloji & Finans",
      isPremium: false,
    },
    {
      id: 2,
      title: "Bitcoin 2024 sonunda 100.000 doları aşacak mı?",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
      totalVotes: 15600,
      timeLeft: "5 gün 8 saat",
      yesPercentage: 68,
      category: "Kripto",
      isPremium: true,
    },
    {
      id: 3,
      title: "Apple Vision Pro 2024'te Türkiye'ye gelecek mi?",
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop",
      totalVotes: 8920,
      timeLeft: "1 gün 8 saat",
      yesPercentage: 35,
      category: "Teknoloji",
      isPremium: false,
    },
    {
      id: 4,
      title: "Galatasaray bu sezon şampiyon olacak mı?",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
      totalVotes: 44500,
      timeLeft: "2 gün 18 saat",
      yesPercentage: 55,
      category: "Spor",
      isPremium: false,
    },
  ];

  const handleVote = (questionId: number, vote: 'yes' | 'no') => {
    console.log(`Voted ${vote} on question ${questionId}`);
    // Handle vote logic here
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "light-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={isDarkMode 
          ? [theme.background, theme.surface, theme.surfaceElevated]
          : ['#F8F9FA', '#F1F5F9', '#E5E7EB']
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={[styles.menuButton, { 
              backgroundColor: isDarkMode ? theme.surfaceElevated : 'rgba(255,255,255,0.95)',
              borderColor: isDarkMode ? theme.border : 'rgba(0,0,0,0.05)',
            }]}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <View style={styles.hamburgerIcon}>
              <View style={[styles.hamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
            </View>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Soru Kartları
          </Text>

          <TouchableOpacity 
            style={[styles.backButton, { 
              backgroundColor: isDarkMode ? theme.surfaceElevated : 'rgba(255,255,255,0.95)',
              borderColor: isDarkMode ? theme.border : 'rgba(0,0,0,0.05)',
            }]}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={isDarkMode ? theme.textPrimary : '#1F2937'} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Örnek Soru Kartları
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Farklı tasarım örneklerini inceleyin
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {sampleQuestions.map((question, index) => (
            <View key={question.id} style={styles.cardWrapper}>
              <PredictionCard3
                question={question}
                onVote={handleVote}
              />
              {question.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PREMIUMzort</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  hamburgerIcon: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 18,
    height: 2.5,
    backgroundColor: '#1F2937',
    borderRadius: 1.25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  cardWrapper: {
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bottomSpacer: {
    height: 40,
  },
});

