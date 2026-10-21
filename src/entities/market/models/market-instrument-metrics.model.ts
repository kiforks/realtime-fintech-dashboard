export interface MarketInstrumentMetrics {
	readonly imbalance: number | null;
	readonly lastPriceCents: number | null;
	readonly spreadCents: number | null;
	readonly symbol: string;
	readonly volume: number;
	readonly vwapCents: number | null;
}
