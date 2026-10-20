import { InstrumentMetrics, InstrumentStats } from '../../models';

import { InstrumentConfig, MarketUpdateLayoutConfig } from '../../configs';

const toImbalance = (bidQuantity: number | null, askQuantity: number | null): number | null => {
	const hasBook = bidQuantity !== null && askQuantity !== null;
	const depth = hasBook ? bidQuantity + askQuantity : 0;

	return hasBook && depth > 0 ? (bidQuantity - askQuantity) / depth : null;
};

export abstract class MarketMetricsHelper {
	public static empty(instrumentCount: number): InstrumentStats[] {
		return InstrumentConfig.Symbols.slice(0, instrumentCount).map(symbol => ({
			askCents: null,
			askQuantity: null,
			bidCents: null,
			bidQuantity: null,
			lastPriceCents: null,
			notionalCents: 0,
			symbol,
			volume: 0,
		}));
	}

	public static accumulate(stats: readonly InstrumentStats[], batch: Uint32Array): InstrumentStats[] {
		const accumulated = stats.map(instrumentStats => ({ ...instrumentStats }));

		for (let offset = 0; offset < batch.length; offset += MarketUpdateLayoutConfig.Stride) {
			const instrumentStats = accumulated[batch[offset + MarketUpdateLayoutConfig.Instrument]];
			const priceCents = batch[offset + MarketUpdateLayoutConfig.PriceCents];
			const tradeQuantity = batch[offset + MarketUpdateLayoutConfig.TradeQuantity];

			instrumentStats.askCents = batch[offset + MarketUpdateLayoutConfig.AskCents];
			instrumentStats.askQuantity = batch[offset + MarketUpdateLayoutConfig.AskQuantity];
			instrumentStats.bidCents = batch[offset + MarketUpdateLayoutConfig.BidCents];
			instrumentStats.bidQuantity = batch[offset + MarketUpdateLayoutConfig.BidQuantity];
			instrumentStats.lastPriceCents = priceCents;
			instrumentStats.notionalCents += priceCents * tradeQuantity;
			instrumentStats.volume += tradeQuantity;
		}

		return accumulated;
	}

	public static toMetrics(stats: InstrumentStats): InstrumentMetrics {
		const { askCents, askQuantity, bidCents, bidQuantity, lastPriceCents, notionalCents, symbol, volume } = stats;
		const hasQuote = askCents !== null && bidCents !== null;
		const hasTrades = volume > 0;

		return {
			imbalance: toImbalance(bidQuantity, askQuantity),
			lastPriceCents,
			spreadCents: hasQuote ? askCents - bidCents : null,
			symbol,
			volume,
			vwapCents: hasTrades ? notionalCents / volume : null,
		};
	}
}
