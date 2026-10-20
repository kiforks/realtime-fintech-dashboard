import { MarketUpdate } from '../models';

import { MarketUpdateLayoutConfig } from '../configs';

export abstract class MarketBatchMock {
	public static encode(updates: readonly MarketUpdate[]): Uint32Array {
		const batch = new Uint32Array(updates.length * MarketUpdateLayoutConfig.Stride);

		updates.forEach((update, index) => {
			const offset = index * MarketUpdateLayoutConfig.Stride;

			batch[offset + MarketUpdateLayoutConfig.Instrument] = update.instrument;
			batch[offset + MarketUpdateLayoutConfig.PriceCents] = update.priceCents;
			batch[offset + MarketUpdateLayoutConfig.TradeQuantity] = update.tradeQuantity;
			batch[offset + MarketUpdateLayoutConfig.BidCents] = update.bidCents;
			batch[offset + MarketUpdateLayoutConfig.AskCents] = update.askCents;
			batch[offset + MarketUpdateLayoutConfig.BidQuantity] = update.bidQuantity;
			batch[offset + MarketUpdateLayoutConfig.AskQuantity] = update.askQuantity;
		});

		return batch;
	}

	public static decode(batch: Uint32Array): MarketUpdate[] {
		return Array.from({ length: batch.length / MarketUpdateLayoutConfig.Stride }, (_unused, index) => {
			const offset = index * MarketUpdateLayoutConfig.Stride;

			return {
				askCents: batch[offset + MarketUpdateLayoutConfig.AskCents],
				askQuantity: batch[offset + MarketUpdateLayoutConfig.AskQuantity],
				bidCents: batch[offset + MarketUpdateLayoutConfig.BidCents],
				bidQuantity: batch[offset + MarketUpdateLayoutConfig.BidQuantity],
				instrument: batch[offset + MarketUpdateLayoutConfig.Instrument],
				priceCents: batch[offset + MarketUpdateLayoutConfig.PriceCents],
				tradeQuantity: batch[offset + MarketUpdateLayoutConfig.TradeQuantity],
			};
		});
	}
}
