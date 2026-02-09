import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageHeaderProps } from '../types';

export function PageHeader({ onBack, onMenuToggle }: PageHeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="chevron-back" size={24} color="#F0F6FC" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.titleGradient}
                >
                    <Text style={styles.trophyIcon}>🏆</Text>
                    <Text style={styles.title}>Sıralama</Text>
                </LinearGradient>
            </View>

            <TouchableOpacity style={styles.menuButton} onPress={onMenuToggle}>
                <Ionicons name="menu" size={24} color="#F0F6FC" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#0D1117',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#30363D',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    titleGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    trophyIcon: {
        fontSize: 22,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0D1117',
        letterSpacing: 0.5,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#21262D',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#30363D',
    },
});
