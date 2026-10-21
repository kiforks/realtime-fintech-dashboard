export interface MarketInstrumentStats {
	askCents: number | null;
	askQuantity: number | null;
	bidCents: number | null;
	bidQuantity: number | null;
	lastPriceCents: number | null;
	notionalCents: number;
	symbol: string;
	volume: number;
}
