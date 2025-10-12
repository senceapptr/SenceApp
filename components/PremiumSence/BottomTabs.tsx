import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const tabs = [
  { id: 'home', label: 'Home', icon: (props: any) => <Ionicons name="home-outline" {...props} /> },
  { id: 'swipe', label: 'Predict', icon: (props: any) => <MaterialCommunityIcons name="flash" {...props} /> },
  { id: 'search', label: 'Search', icon: (props: any) => <Ionicons name="search-outline" {...props} /> },
  { id: 'predictions', label: 'My Bets', icon: (props: any) => <FontAwesome name="bullseye" {...props} /> },
  { id: 'league', label: 'League', icon: (props: any) => <FontAwesome name="trophy" {...props} /> },
];

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              activeOpacity={0.85}
            >
              <View style={styles.iconBox}>
                {tab.icon({
                  size: 22,
                  color: isActive ? '#7C3AED' : '#9ca3af',
                })}
                {isActive && tab.id === 'swipe' && (
                  <View style={styles.pulseDot} />
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F3F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 420,
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: '#EDE7F6',
    transform: [{ scale: 1.05 }],
  },
  iconBox: {
    position: 'relative',
    marginBottom: 2,
  },
  pulseDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    backgroundColor: '#F59E42',
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#7C3AED',
  },
});