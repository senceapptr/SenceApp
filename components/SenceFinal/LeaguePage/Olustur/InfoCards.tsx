import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function InfoCards() {
  const infoItems = [
    {
      gradient: ['#256EFF', '#256EFF'],
      emoji: '🎯',
      title: 'Özelleştirilebilir',
      description: 'Kategorileri, kuralları ve ödül sistemini sen belirle'
    },
    {
      gradient: ['#256EFF', '#353831'],
      emoji: '👥',
      title: 'Arkadaşlarınla Özel',
      description: 'Public veya private lig seçenekleri'
    },
    {
      gradient: ['#256EFF', '#256EFF'],
      emoji: '💰',
      title: 'Ödül Havuzu',
      description: 'Katılım ücretlerinden oluşan büyük ödüller'
    }
  ];

  return (
    <View style={styles.container}>
      {infoItems.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={item.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.icon}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
            </LinearGradient>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#8B949E',
  },
});

