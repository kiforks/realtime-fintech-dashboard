export interface InstrumentMetrics {
	imbalance: number | null;
	lastPriceCents: number | null;
	spreadCents: number | null;
	symbol: string;
	volume: number;
	vwapCents: number | null;
}
