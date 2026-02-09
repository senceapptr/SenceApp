
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Coupon } from '@/components/SenceFinal/CouponsPage/types';

interface TicketListItemProps {
    ticket: Coupon;
    onPress: (ticket: Coupon) => void;
}

export const TicketListItem: React.FC<TicketListItemProps> = ({ ticket, onPress }) => {
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'won': return { color: '#10B981', label: 'KAZANDI', icon: 'checkmark-circle' };
            case 'lost': return { color: '#EF4444', label: 'KAYBETTİ', icon: 'close-circle' };
            case 'pending': return { color: '#F59E0B', label: 'BEKLİYOR', icon: 'time' };
            default: return { color: '#6B7280', label: 'BİLİNMİYOR', icon: 'help-circle' };
        }
    };

    const status = getStatusInfo(ticket.status);
    const displayId = ticket.display_id || (ticket.rawId ? ticket.rawId.slice(-6) : ticket.id.toString().slice(-6));

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(ticket)}
            style={[styles.container, { borderColor: status.color, shadowColor: status.color }]}
        >
            <LinearGradient
                colors={['#161B22', '#0D1117']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.iconBox, { backgroundColor: status.color + '20' }]}>
                                <Ionicons name="ticket-outline" size={20} color={status.color} />
                            </View>
                            <Text style={styles.ticketId}>#{displayId}</Text>
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: status.color + '15', borderColor: status.color + '30' }]}>
                            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Yatırım</Text>
                            <Text style={styles.statValue}>{ticket.investmentAmount || 0}</Text>
                        </View>

                        <View style={styles.verticalDivider} />

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Oran</Text>
                            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{ticket.totalOdds.toFixed(2)}x</Text>
                        </View>

                        <View style={styles.verticalDivider} />

                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Kazanç</Text>
                            <Text style={[styles.statValue, { color: '#10B981' }]}>
                                {ticket.potentialEarnings.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 2.5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 0,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticketId: {
        color: '#F0F6FC',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    statLabel: {
        color: '#8B949E',
        fontSize: 11,
        marginBottom: 4,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    statValue: {
        color: '#F0F6FC',
        fontSize: 15,
        fontWeight: '700',
    },
});
