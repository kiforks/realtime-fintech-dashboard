import { MarketGeneratorFactory } from './market-generator.factory';
import { MarketBatchGenerator, MarketUpdate } from '../../models';

import { MarketFeedSettingsConfig, MarketUpdateLayoutConfig } from '../../configs';
import { MarketBatchMock, MarketUpdateMock } from '../../mocks';

const SEED = 42;
const MAX_TRADE_QUANTITY = 100;

const breaksAnInvariant = (
	{ askCents, bidCents, instrument, priceCents, tradeQuantity }: MarketUpdate,
	instrumentCount: number
): boolean => {
	const hasValidInstrument = instrument < instrumentCount;
	const hasPositiveBid = bidCents > 0;
	const hasBidBelowAsk = bidCents < askCents;
	const tradesAtAQuote = priceCents === bidCents || priceCents === askCents;
	const hasValidTradeQuantity = tradeQuantity >= 1 && tradeQuantity <= MAX_TRADE_QUANTITY;

	return !(hasValidInstrument && hasPositiveBid && hasBidBelowAsk && tradesAtAQuote && hasValidTradeQuantity);
};

describe(MarketGeneratorFactory, () => {
	let instrumentCount: number;
	let generator: MarketBatchGenerator;

	beforeEach(() => {
		instrumentCount = MarketFeedSettingsConfig.Ranges.instrumentCount.max;
		generator = MarketGeneratorFactory.create(instrumentCount, SEED);
	});

	afterEach(() => {
		generator.free();
	});

	it('should return exactly the requested number of updates in each batch', () => {
		const lengths = [0, 1, 1000].map(size => generator.nextBatch(size).length);

		expect(lengths).toStrictEqual([0, MarketUpdateLayoutConfig.Stride, 1000 * MarketUpdateLayoutConfig.Stride]);
	});

	it('should keep the bid positive and below the ask and trade at one of the quotes', () => {
		const updates = MarketBatchMock.decode(generator.nextBatch(10_000));
		const violations = updates.filter(update => breaksAnInvariant(update, instrumentCount));

		expect(violations).toStrictEqual([]);
	});

	it('should produce the known first updates of a fixed seed in the agreed field layout', () => {
		expect(generator.nextBatch(2)).toStrictEqual(
			MarketBatchMock.encode([
				MarketUpdateMock.create({
					askCents: 29339,
					askQuantity: 599,
					bidCents: 29330,
					bidQuantity: 537,
					instrument: 10,
					priceCents: 29330,
					tradeQuantity: 86,
				}),
				MarketUpdateMock.create({
					askCents: 35431,
					askQuantity: 821,
					bidCents: 35411,
					bidQuantity: 1008,
					instrument: 30,
					priceCents: 35431,
					tradeQuantity: 80,
				}),
			])
		);
	});

	it('should reject an instrument count outside the allowed range', () => {
		expect(() => MarketGeneratorFactory.create(0, SEED)).toThrow('instrument count must be between 1 and 50, got 0');
		expect(() => MarketGeneratorFactory.create(instrumentCount + 1, SEED)).toThrow(
			'instrument count must be between 1 and 50, got 51'
		);
	});
});
