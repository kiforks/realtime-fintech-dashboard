import { MarketUpdate } from '../models';

export class MarketUpdateMock implements MarketUpdate {
	public readonly askCents = 10200;
	public readonly askQuantity = 400;
	public readonly bidCents = 10196;
	public readonly bidQuantity = 600;
	public readonly instrument = 0;
	public readonly priceCents = 10200;
	public readonly tradeQuantity = 30;

	constructor(data?: Partial<MarketUpdate>) {
		Object.assign(this, data);
	}
}
