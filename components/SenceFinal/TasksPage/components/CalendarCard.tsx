import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ACCENT_DARK, PRIMARY_BLUE } from '../../LeaguePage/shared/theme';
import { CalendarCardProps } from '../types';

export function CalendarCard(props: CalendarCardProps) {
  const { monthNames, dayNames, currentMonth, currentYear, today, daysInMonth, firstDayOfMonth, loginDays } = props;

  const loginCount = loginDays.filter(day => day <= today).length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{monthNames[currentMonth]} {currentYear}</Text>
          </View>

          <View style={styles.loginBadge}>
            <Text style={styles.loginBadgeNumber}>{loginCount}</Text>
            <Text style={styles.loginBadgeDivider}>/</Text>
            <Text style={styles.loginBadgeMax}>{daysInMonth}</Text>
          </View>
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
              const isPastWithoutLogin = day < today && !hasLogin;

              return (
                <View key={day} style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayButton,
                      hasLogin && !isToday && styles.loggedDayButton,
                      isToday && styles.todayDayButton,
                      isToday && styles.todayButton,
                      isPastWithoutLogin && styles.missedDayButton,
                      isFuture && styles.futureDayButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        (hasLogin || isToday) && styles.loginDayText,
                        isPastWithoutLogin && styles.missedDayText,
                        isFuture && styles.futureDayText,
                      ]}
                    >
                      {day}
                    </Text>
                    {hasLogin && !isToday && <View style={styles.loginDot} />}
                  </View>
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
  container: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#141A24',
    borderColor: 'rgba(120, 148, 191, 0.24)',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  title: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
  },
  loginBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(37, 110, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(37, 110, 255, 0.28)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  loginBadgeNumber: {
    color: PRIMARY_BLUE,
    fontSize: 17,
    fontWeight: '900',
  },
  loginBadgeDivider: {
    color: '#7E96BD',
    fontSize: 12,
    marginHorizontal: 2,
    fontWeight: '600',
  },
  loginBadgeMax: {
    color: '#7E96BD',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarGrid: {
    backgroundColor: '#0F1726',
    borderColor: 'rgba(120, 148, 191, 0.18)',
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayNameText: {
    color: '#8898B4',
    fontSize: 11,
    fontWeight: '700',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#172235',
  },
  dayText: {
    color: '#A7B3C7',
    fontSize: 12,
    fontWeight: '600',
  },
  loggedDayButton: {
    backgroundColor: ACCENT_DARK,
    borderWidth: 1,
    borderColor: 'rgba(214, 228, 255, 0.22)',
  },
  todayDayButton: {
    backgroundColor: PRIMARY_BLUE,
    borderWidth: 1,
    borderColor: '#3D83FF',
  },
  todayButton: {
    borderWidth: 2,
    borderColor: '#BBD5FF',
  },
  loginDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loginDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 3,
  },
  missedDayButton: {
    backgroundColor: '#1E2738',
  },
  missedDayText: {
    color: '#6E7A8F',
  },
  futureDayButton: {
    backgroundColor: '#121A2B',
  },
  futureDayText: {
    color: '#667489',
  },
});
