import { MarketUpdate } from '../../models';

import { MarketUpdateLayoutConfig, ProducerSettingsConfig } from '../../configs';
import { MarketBatchMock, MarketUpdateMock } from '../../mocks';

import { initSync, MarketGenerator } from '~wasm/market_generator';
import marketGeneratorBytes from '~wasm/market_generator_bg.wasm';

const SEED = 42;
const INSTRUMENT_COUNT = ProducerSettingsConfig.InstrumentCount.max;
const MAX_TRADE_QUANTITY = 100;

const breaksAnInvariant = (update: MarketUpdate): boolean => {
	const hasValidInstrument = update.instrument < INSTRUMENT_COUNT;
	const hasPositiveBid = update.bidCents > 0;
	const hasBidBelowAsk = update.bidCents < update.askCents;
	const tradesAtAQuote = update.priceCents === update.bidCents || update.priceCents === update.askCents;
	const hasValidTradeQuantity = update.tradeQuantity >= 1 && update.tradeQuantity <= MAX_TRADE_QUANTITY;

	return !(hasValidInstrument && hasPositiveBid && hasBidBelowAsk && tradesAtAQuote && hasValidTradeQuantity);
};

describe(MarketGenerator, () => {
	let generator: MarketGenerator;

	beforeAll(() => {
		initSync({ module: marketGeneratorBytes });
	});

	beforeEach(() => {
		generator = new MarketGenerator(INSTRUMENT_COUNT, SEED);
	});

	afterEach(() => {
		generator.free();
	});

	it('should return exactly the requested number of updates in each batch', () => {
		const lengths = [0, 1, 1000].map(size => generator.nextBatch(size).length);

		expect(lengths).toStrictEqual([0, MarketUpdateLayoutConfig.Stride, 1000 * MarketUpdateLayoutConfig.Stride]);
	});

	it('should keep the bid positive and below the ask and trade at one of the quotes', () => {
		const violations = MarketBatchMock.decode(generator.nextBatch(10_000)).filter(update => breaksAnInvariant(update));

		expect(violations).toStrictEqual([]);
	});

	it('should produce the known first updates of a fixed seed in the agreed field layout', () => {
		expect(generator.nextBatch(2)).toStrictEqual(
			MarketBatchMock.encode([
				new MarketUpdateMock({
					askCents: 29339,
					askQuantity: 599,
					bidCents: 29330,
					bidQuantity: 537,
					instrument: 10,
					priceCents: 29330,
					tradeQuantity: 86,
				}),
				new MarketUpdateMock({
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
		expect(() => new MarketGenerator(0, SEED)).toThrow('instrument count must be between 1 and 50, got 0');
		expect(() => new MarketGenerator(INSTRUMENT_COUNT + 1, SEED)).toThrow(
			'instrument count must be between 1 and 50, got 51'
		);
	});
});
