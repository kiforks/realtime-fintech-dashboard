import { MarketUpdate } from '../models';

export abstract class MarketUpdateMock {
	public static create(data?: Partial<MarketUpdate>): MarketUpdate {
		return {
			askCents: 10200,
			askQuantity: 400,
			bidCents: 10196,
			bidQuantity: 600,
			instrument: 0,
			priceCents: 10200,
			tradeQuantity: 30,
			...data,
		};
	}
}
