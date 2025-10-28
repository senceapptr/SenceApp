import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AdminStats } from '@/services/admin.service';

interface StatsCardProps {
  stats: AdminStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.totalUsers.toLocaleString('tr-TR'),
      icon: 'people',
      color: '#3B82F6',
      gradient: ['#3B82F6', '#1D4ED8'],
    },
    {
      title: 'Aktif Kullanıcı',
      value: stats.activeUsers.toLocaleString('tr-TR'),
      icon: 'people-circle',
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
    },
    {
      title: 'Toplam Soru',
      value: stats.totalQuestions.toLocaleString('tr-TR'),
      icon: 'help-circle',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      title: 'Bekleyen Soru',
      value: stats.pendingQuestions.toLocaleString('tr-TR'),
      icon: 'time',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
    },
    {
      title: 'Onaylanan Soru',
      value: stats.approvedQuestions.toLocaleString('tr-TR'),
      icon: 'checkmark-circle',
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
    },
    {
      title: 'Reddedilen Soru',
      value: stats.rejectedQuestions.toLocaleString('tr-TR'),
      icon: 'close-circle',
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      title: 'Toplam Tahmin',
      value: stats.totalPredictions.toLocaleString('tr-TR'),
      icon: 'trending-up',
      color: '#06B6D4',
      gradient: ['#06B6D4', '#0891B2'],
    },
    {
      title: 'Toplam Kupon',
      value: stats.totalCoupons.toLocaleString('tr-TR'),
      icon: 'gift',
      color: '#EC4899',
      gradient: ['#EC4899', '#DB2777'],
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Genel İstatistikler</Text>
        
        <View style={styles.statsGrid}>
          {statItems.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <LinearGradient
                colors={item.gradient}
                style={styles.statGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.statContent}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name={item.icon as any} size={24} color="white" />
                  </View>
                  
                  <View style={styles.statTextContainer}>
                    <Text style={styles.statValue}>{item.value}</Text>
                    <Text style={styles.statTitle}>{item.title}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Özet Kartı */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Özet</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Onay Oranı</Text>
              <Text style={styles.summaryValue}>
                {stats.totalQuestions > 0 
                  ? Math.round((stats.approvedQuestions / stats.totalQuestions) * 100)
                  : 0}%
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Red Oranı</Text>
              <Text style={styles.summaryValue}>
                {stats.totalQuestions > 0 
                  ? Math.round((stats.rejectedQuestions / stats.totalQuestions) * 100)
                  : 0}%
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Bekleyen Oranı</Text>
              <Text style={styles.summaryValue}>
                {stats.totalQuestions > 0 
                  ? Math.round((stats.pendingQuestions / stats.totalQuestions) * 100)
                  : 0}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryContent: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});
