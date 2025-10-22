import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { leaguesService } from '@/services';
import { User } from '../types';
import { CreateCard } from './CreateCard';
import { InfoCards } from './InfoCards';
import { CreateLeagueWizard } from './CreateLeagueWizard';

interface OlusturTabProps {
  currentUser: User;
  onSuccess: () => void;
}

export function OlusturTab({ currentUser, onSuccess }: OlusturTabProps) {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kendi Ligini Oluştur</Text>
        <Text style={styles.subtitle}>Arkadaşlarınla özel lig oluştur ve yarışın başlasın!</Text>
      </View>

      <CreateCard onCreatePress={() => setShowWizard(true)} />
      <InfoCards />

      {showWizard && (
        <CreateLeagueWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            onSuccess();
          }}
          currentUser={currentUser}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
  },
});

