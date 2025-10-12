import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Tab {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialTab?: string;
  style?: any;
}

function Tabs({ tabs, initialTab, style }: TabsProps) {
  const [active, setActive] = React.useState(initialTab || tabs[0]?.key);
  const currentTab = tabs.find((t) => t.key === active);
  return (
    <View style={style}>
      <View style={styles.tabList}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabTrigger, active === tab.key && styles.tabActive]}
            onPress={() => setActive(tab.key)}
          >
            <Text style={[styles.tabText, active === tab.key && styles.tabTextActive]}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabContent}>{currentTab?.content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    marginBottom: 8,
    padding: 2,
  },
  tabTrigger: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 14,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#222',
  },
  tabContent: {
    padding: 8,
  },
});

export { Tabs };
