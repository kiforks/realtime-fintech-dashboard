import { InstrumentStats } from '../models';

export class InstrumentStatsMock implements InstrumentStats {
	public readonly askCents = 10200;
	public readonly askQuantity = 400;
	public readonly bidCents = 10196;
	public readonly bidQuantity = 600;
	public readonly lastPriceCents = 10200;
	public readonly notionalCents = 406000;
	public readonly symbol = 'ALFA';
	public readonly volume = 40;

	constructor(data?: Partial<InstrumentStats>) {
		Object.assign(this, data);
	}
}
