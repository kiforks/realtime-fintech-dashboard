import { MarketGeneratorFactory } from './market-generator.factory';
import { MarketBatchGenerator, MarketUpdate } from '../../models';

import { MarketFeedSettingsConfig, MarketUpdateLayoutConfig } from '../../configs';
import { MarketBatchMock, MarketUpdateMock } from '../../mocks';

const SEED = 42;

const breaksAnInvariant = (
	{ askCents, bidCents, instrument, priceCents, tradeQuantity }: MarketUpdate,
	instrumentCount: number
): boolean => {
	const hasValidInstrument = instrument < instrumentCount;
	const hasBidInRange = bidCents > 0 && bidCents <= 100_000;
	const hasBidBelowAsk = bidCents < askCents;
	const tradesAtAQuote = priceCents === bidCents || priceCents === askCents;
	const hasValidTradeQuantity = tradeQuantity >= 1 && tradeQuantity <= 100;

	return !(hasValidInstrument && hasBidInRange && hasBidBelowAsk && tradesAtAQuote && hasValidTradeQuantity);
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

	it.each([1, 1000])('should return exactly %i updates when asked for %i', size => {
		expect(generator.nextBatch(size)).toHaveLength(size * MarketUpdateLayoutConfig.Stride);
	});

	it('should keep the bid in range and below the ask and trade at one of the quotes', () => {
		const updates = Array.from({ length: 10 }, () => MarketBatchMock.decode(generator.nextBatch(1000))).flat();
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

	it('should reject a batch size outside the allowed range', () => {
		expect(() => generator.nextBatch(0)).toThrow('batch size must be between 1 and 1000, got 0');
		expect(() => generator.nextBatch(1001)).toThrow('batch size must be between 1 and 1000, got 1001');
	});

	it('should reject an instrument count outside the allowed range', () => {
		expect(() => MarketGeneratorFactory.create(0, SEED)).toThrow('instrument count must be between 1 and 50, got 0');
		expect(() => MarketGeneratorFactory.create(instrumentCount + 1, SEED)).toThrow(
			'instrument count must be between 1 and 50, got 51'
		);
	});
});
