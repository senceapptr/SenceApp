
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Coupon } from '@/components/SenceFinal/CouponsPage/types';
import { TicketListItem } from './TicketListItem';
import { Ionicons } from '@expo/vector-icons';

interface TicketsTabProps {
    tickets: Coupon[];
    onTicketPress: (ticket: Coupon) => void;
}

export const TicketsTab: React.FC<TicketsTabProps> = ({ tickets, onTicketPress }) => {
    if (!tickets || tickets.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="ticket-outline" size={32} color="#30363D" />
                </View>
                <Text style={styles.emptyTitle}>Henüz Ticket Yok</Text>
                <Text style={styles.emptyText}>
                    Oluşturduğun ticketlar burada listelenecek.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {tickets.map((ticket) => (
                <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    onPress={() => onTicketPress(ticket)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(48, 54, 61, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F0F6FC',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#8B949E',
        textAlign: 'center',
        lineHeight: 20,
    },
});
