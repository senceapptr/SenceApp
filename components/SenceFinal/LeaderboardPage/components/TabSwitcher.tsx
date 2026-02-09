import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TabSwitcherProps, LeaderboardTab } from '../types';

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
    const tabs: { key: LeaderboardTab; label: string }[] = [
        { key: 'global', label: 'Global' },
        { key: 'friends', label: 'Arkadaşlar' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.tabsWrapper}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tabButton}
                            onPress={() => onTabChange(tab.key)}
                            activeOpacity={0.8}
                        >
                            {isActive ? (
                                <LinearGradient
                                    colors={['#10B981', '#059669']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.activeTab}
                                >
                                    <Text style={styles.activeTabText}>{tab.label}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.inactiveTab}>
                                    <Text style={styles.inactiveTabText}>{tab.label}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    tabsWrapper: {
        flexDirection: 'row',
        backgroundColor: '#161B22',
        borderRadius: 12,
        padding: 3,
        borderWidth: 1,
        borderColor: '#30363D',
    },
    tabButton: {
        flex: 1,
    },
    activeTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 9,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    inactiveTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 9,
    },
    activeTabText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    inactiveTabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B949E',
    },
});
