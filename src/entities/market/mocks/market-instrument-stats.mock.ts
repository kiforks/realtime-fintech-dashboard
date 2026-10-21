import { MarketInstrumentStats } from '../models';

export abstract class MarketInstrumentStatsMock {
	public static create(data?: Partial<MarketInstrumentStats>): MarketInstrumentStats {
		return {
			askCents: 10200,
			askQuantity: 400,
			bidCents: 10196,
			bidQuantity: 600,
			lastPriceCents: 10200,
			notionalCents: 406000,
			symbol: 'ALFA',
			volume: 40,
			...data,
		};
	}

	public static empty(symbol: string): MarketInstrumentStats {
		return {
			askCents: null,
			askQuantity: null,
			bidCents: null,
			bidQuantity: null,
			lastPriceCents: null,
			notionalCents: 0,
			symbol,
			volume: 0,
		};
	}
}
