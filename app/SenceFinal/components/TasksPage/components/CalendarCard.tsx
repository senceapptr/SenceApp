import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarCardProps } from '../types';

export function CalendarCard(props: CalendarCardProps) {
  const { monthNames, dayNames, currentMonth, currentYear, today, daysInMonth, firstDayOfMonth, loginDays } = props;
  return (
    <View style={styles.calendarSection}>
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <View>
            <Text style={styles.calendarTitle}>📅 {monthNames[currentMonth]} {currentYear}</Text>
            <Text style={styles.calendarSubtitle}>Aylık giriş takibin</Text>
          </View>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.loginBadge}>
            <Text style={styles.loginBadgeNumber}>{loginDays.filter(day => day <= today).length}</Text>
            <Text style={styles.loginBadgeText}>gün giriş</Text>
          </LinearGradient>
        </View>

        <View style={styles.calendarGrid}>
          <View style={styles.dayNamesRow}>
            {dayNames.map((day, index) => (
              <View key={index} style={styles.dayNameCell}>
                <Text style={styles.dayNameText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({ length: firstDayOfMonth }, (_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const isToday = day === today;
              const hasLogin = loginDays.includes(day) && day <= today;
              const isFuture = day > today;
              return (
                <View key={day} style={styles.dayCell}>
                  {isToday ? (
                    <LinearGradient colors={["#10B981", "#059669"]} style={[styles.dayButton, styles.todayButton]}>
                      <Text style={styles.todayText}>{day}</Text>
                      <View style={styles.todayBadge}><Text style={styles.todayBadgeText}>⭐</Text></View>
                    </LinearGradient>
                  ) : hasLogin ? (
                    <View style={[styles.dayButton, styles.loginDayButton]}>
                      <Text style={styles.loginDayText}>{day}</Text>
                      <View style={styles.checkBadge}><Text style={styles.checkBadgeText}>✓</Text></View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarSection: { padding: 16 },
  calendarCard: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#30363D',
    padding: 24,
  },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  calendarTitle: { fontSize: 18, fontWeight: '900', color: '#10B981', marginBottom: 4 },
  calendarSubtitle: { fontSize: 14, fontWeight: '500', color: '#8B949E' },
  loginBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  loginBadgeNumber: { fontSize: 18, fontWeight: '900', color: 'white' },
  loginBadgeText: { fontSize: 12, fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' },
  calendarGrid: { backgroundColor: '#21262D', borderRadius: 16, padding: 16, marginBottom: 16 },
  dayNamesRow: { flexDirection: 'row', marginBottom: 12 },
  dayNameCell: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  dayNameText: { fontSize: 14, fontWeight: '900', color: '#10B981' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, padding: 2 },
  dayButton: { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  todayButton: { transform: [{ scale: 1.1 }] },
  todayText: { fontSize: 14, fontWeight: '700', color: 'white' },
  todayBadge: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, backgroundColor: 'white', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  todayBadgeText: { fontSize: 8 },
  loginDayButton: { backgroundColor: '#10B981' },
  loginDayText: { fontSize: 14, fontWeight: '700', color: 'white' },
  checkBadge: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, backgroundColor: '#059669', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkBadgeText: { fontSize: 8, color: 'white' },
  futureDayButton: { backgroundColor: '#21262D', borderWidth: 1, borderColor: '#30363D' },
  futureDayText: { fontSize: 14, fontWeight: '700', color: '#8B949E' },
  normalDayButton: { backgroundColor: '#21262D', borderWidth: 1, borderColor: '#30363D' },
  normalDayText: { fontSize: 14, fontWeight: '700', color: '#8B949E' },
  dayText: { fontSize: 14, fontWeight: '700' },
});







