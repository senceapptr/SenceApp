import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivitiesSectionProps {
  isDarkMode: boolean;
  theme: any;
  onChallengePress: () => void;
  onTasksPress: () => void;
  onWriteQuestionPress: () => void;
}

export function ActivitiesSection({ 
  isDarkMode, 
  theme, 
  onChallengePress, 
  onTasksPress,
  onWriteQuestionPress
}: ActivitiesSectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Günlük Aktiviteler</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[
            styles.button,
            { 
              backgroundColor: isDarkMode ? theme.surfaceCard : '#F6F7F9', 
              borderColor: isDarkMode ? theme.border : '#E5E7EB', 
              shadowColor: isDarkMode ? 'transparent' : '#000' 
            }
          ]}
          onPress={onChallengePress}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="trophy" size={30} color="#10B981" />
          </View>
          <Text style={[styles.buttonTitle, styles.challengeTitle]}>Challenge</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button,
            { 
              backgroundColor: isDarkMode ? theme.surfaceCard : '#F6F7F9', 
              borderColor: isDarkMode ? theme.border : '#E5E7EB', 
              shadowColor: isDarkMode ? 'transparent' : '#000' 
            }
          ]}
          onPress={onTasksPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="checkmark-done" size={30} color="#F97316" />
          </View>
          <Text style={[styles.buttonTitle, styles.tasksTitle]}>Görevler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button,
            { 
              backgroundColor: isDarkMode ? theme.surfaceCard : '#F6F7F9', 
              borderColor: isDarkMode ? theme.border : '#E5E7EB', 
              shadowColor: isDarkMode ? 'transparent' : '#000' 
            }
          ]}
          onPress={onWriteQuestionPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="color-wand" size={30} color="#8B5CF6" />
          </View>
          <Text style={[styles.buttonTitle, styles.writeTitle]}>Soru Yaz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432870',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  iconWrapper: {
    marginBottom: 6,
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  challengeTitle: { color: '#10B981' },
  tasksTitle: { color: '#F97316' },
  writeTitle: { color: '#8B5CF6' },
});



