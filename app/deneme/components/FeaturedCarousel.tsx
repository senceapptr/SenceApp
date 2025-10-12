import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';

export default function FeaturedCarousel() {
  const featuredItems = [
    {
      id: 1,
      title: "Lakers playoff'lara kalabilecek mi?",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      yesPercentage: 65,
      votes: "15,2K oy",
    },
    {
      id: 2,
      title: "Bitcoin 100.000$ geçecek mi?",
      image: "https://images.unsplash.com/photo-1518544866273-fc7986c2da2c?w=800&h=600&fit=crop",
      yesPercentage: 72,
      votes: "22,1K oy",
    },
    {
      id: 3,
      title: "Tesla yeni model açıklayacak mı?",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
      yesPercentage: 58,
      votes: "8,7K oy",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Öne Çıkanlar</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {featuredItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.cardStats}>
                <Text style={styles.percentage}>{item.yesPercentage}%</Text>
                <Text style={styles.votes}>{item.votes}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  votes: {
    fontSize: 12,
    color: '#666',
  },
});
