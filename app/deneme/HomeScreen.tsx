import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Header } from './components/Header';
import FeaturedCarousel from './components/FeaturedCarousel';
import FilterPills from './components/FilterPills';
import QuestionCard from './components/QuestionCard';
// Eğer varsa: import BottomTabs from '../SenceHome3/components/BottomTabs';

const featuredQuestions = [
  {
    id: 1,
    title: "Lakers playoff'lara kalabilecek mi?",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
    yesPercentage: 65,
    votes: "15,2K oy",
    timeLeft: "14 saat kaldı",
    yesOdds: 1.45,
    noOdds: 2.80
  },
  {
    id: 2,
    title: "Bitcoin 100.000$ geçecek mi?",
    image: "https://images.unsplash.com/photo-1518544866273-fc7986c2da2c?w=800&h=600&fit=crop",
    yesPercentage: 72,
    votes: "22,1K oy",
    timeLeft: "3 gün kaldı",
    yesOdds: 1.35,
    noOdds: 3.10
  },
  {
    id: 3,
    title: "Tesla yeni model açıklayacak mı?",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
    yesPercentage: 58,
    votes: "8,7K oy",
    timeLeft: "1 gün kaldı",
    yesOdds: 1.65,
    noOdds: 2.25
  }
];

const questions = [
  {
    id: 4,
    title: "Apple VR gözlük fiyatını düşürecek mi?",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=600&fit=crop",
    yesPercentage: 43,
    votes: "12,5K oy",
    timeLeft: "5 gün kaldı",
    yesOdds: 2.15,
    noOdds: 1.70
  },
  // ... diğer sorular ...
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('ending-soon');
  // Diğer state'ler: modal/drawer, sayfa geçişi, vs.

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header onProfilePress={() => {}} onNotificationsPress={() => {}} notificationCount={3} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
          <FilterPills selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <FeaturedCarousel />
          <FilterPills selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <View style={{ marginTop: 16 }}>
            {featuredQuestions.concat(questions).map(q => (
              <QuestionCard
                key={q.id}
                title={q.title}
                image={q.image}
                yesPercentage={q.yesPercentage}
                votes={q.votes}
                timeLeft={q.timeLeft}
                yesOdds={q.yesOdds}
                noOdds={q.noOdds}
                onVote={() => {}}
              />
            ))}
          </View>
        </ScrollView>
        {/* Eğer varsa: <BottomTabs ... /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
}); 