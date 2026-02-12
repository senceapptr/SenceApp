export type LeagueTicketPackageId = 'ticket_pack_1' | 'ticket_pack_3' | 'ticket_pack_5';

export interface LeagueTicketPackage {
  title: string;
  tickets: number;
  priceText: string;
  id: LeagueTicketPackageId;
}

export const LEAGUE_TICKET_PACKAGES: LeagueTicketPackage[] = [
  { id: 'ticket_pack_1', priceText: '₺39', tickets: 1, title: '1 Bilet' },
  { id: 'ticket_pack_3', priceText: '₺99', tickets: 3, title: '3 Bilet' },
  { id: 'ticket_pack_5', priceText: '₺149', tickets: 5, title: '5 Bilet' },
];

export const leagueTicketPurchaseService = {
  async purchasePackage(_packageId: LeagueTicketPackageId, _userId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      data: null,
      error: new Error('Ödeme sağlayıcısı henüz bağlı değil. Bu sürümde sadece satın alma akışı önizlemesi sunuluyor.'),
    };
  },
};
