import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CalendarCardProps } from '../types';

export function CalendarCard(props: CalendarCardProps) {
  const { monthNames, dayNames, currentMonth, currentYear, today, daysInMonth, firstDayOfMonth, loginDays } = props;

  const loginCount = loginDays.filter(day => day <= today).length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#161B22', '#0D1117']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={styles.title}>{monthNames[currentMonth]} {currentYear}</Text>
              <Text style={styles.subtitle}>Aylık giriş takibin</Text>
            </View>
          </View>

          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.loginBadge}
          >
            <Text style={styles.loginBadgeNumber}>{loginCount}</Text>
            <Text style={styles.loginBadgeText}>gün</Text>
          </LinearGradient>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((day, index) => (
              <View key={index} style={styles.dayNameCell}>
                <Text style={styles.dayNameText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {/* Empty cells for first week offset */}
            {Array.from({ length: firstDayOfMonth }, (_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}

            {/* Actual days */}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const isToday = day === today;
              const hasLogin = loginDays.includes(day) && day <= today;
              const isFuture = day > today;
              const isPast = day < today && !hasLogin;

              return (
                <View key={day} style={styles.dayCell}>
                  {isToday ? (
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={[styles.dayButton, styles.todayButton]}
                    >
                      <Text style={styles.todayText}>{day}</Text>
                      <View style={styles.todayIndicator} />
                    </LinearGradient>
                  ) : hasLogin ? (
                    <View style={[styles.dayButton, styles.loginDayButton]}>
                      <Text style={styles.loginDayText}>{day}</Text>
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={8} color="white" />
                      </View>
                    </View>
                  ) : isPast ? (
                    <View style={[styles.dayButton, styles.missedDayButton]}>
                      <Text style={styles.missedDayText}>{day}</Text>
                    </View>
                  ) : (
                    <View style={[styles.dayButton, isFuture ? styles.futureDayButton : styles.normalDayButton]}>
                      <Text style={[styles.dayText, isFuture ? styles.futureDayText : styles.normalDayText]}>{day}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Giriş yapıldı</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Kaçırıldı</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#30363D' }]} />
            <Text style={styles.legendText}>Gelecek</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#30363D',
    padding: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F0F6FC',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8B949E',
  },
  loginBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  loginBadgeNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  loginBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  calendarGrid: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B949E',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayButton: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  todayText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  loginDayButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  loginDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  checkBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missedDayButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  missedDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  futureDayButton: {
    backgroundColor: '#21262D',
  },
  futureDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  normalDayButton: {
    backgroundColor: '#21262D',
  },
  normalDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B949E',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#8B949E',
    fontWeight: '500',
  },
});
