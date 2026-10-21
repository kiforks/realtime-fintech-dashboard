import { MarketUpdate } from '../models';

import { MarketUpdateLayoutConfig } from '../configs';

export abstract class MarketBatchMock {
	public static encode(updates: readonly MarketUpdate[]): Uint32Array {
		const batch = new Uint32Array(updates.length * MarketUpdateLayoutConfig.Stride);

		updates.forEach(
			({ askCents, askQuantity, bidCents, bidQuantity, instrument, priceCents, tradeQuantity }, index) => {
				const offset = index * MarketUpdateLayoutConfig.Stride;

				batch[offset + MarketUpdateLayoutConfig.Instrument] = instrument;
				batch[offset + MarketUpdateLayoutConfig.PriceCents] = priceCents;
				batch[offset + MarketUpdateLayoutConfig.TradeQuantity] = tradeQuantity;
				batch[offset + MarketUpdateLayoutConfig.BidCents] = bidCents;
				batch[offset + MarketUpdateLayoutConfig.AskCents] = askCents;
				batch[offset + MarketUpdateLayoutConfig.BidQuantity] = bidQuantity;
				batch[offset + MarketUpdateLayoutConfig.AskQuantity] = askQuantity;
			}
		);

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
