import { MarketInstrumentMetrics } from '../models';

export abstract class MarketInstrumentMetricsMock {
	public static create(data?: Partial<MarketInstrumentMetrics>): MarketInstrumentMetrics {
		return {
			imbalance: 0.2,
			lastPriceCents: 10200,
			spreadCents: 4,
			symbol: 'ALFA',
			volume: 40,
			vwapCents: 10150,
			...data,
		};
	}

	public static empty(symbol: string): MarketInstrumentMetrics {
		return {
			imbalance: null,
			lastPriceCents: null,
			spreadCents: null,
			symbol,
			volume: 0,
			vwapCents: null,
		};
	}
}
