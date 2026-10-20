import { MarketUpdate } from '../../models';

import { MarketUpdateLayoutConfig } from '../../configs';
import { MarketBatchMock } from '../../mocks';

import { initSync, MarketGenerator } from '~wasm/market_generator';
import marketGeneratorBytes from '~wasm/market_generator_bg.wasm';

const SEED = 42;
const INSTRUMENT_COUNT = 50;
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

	it('should repeat the same batch for the same seed', () => {
		const twin = new MarketGenerator(INSTRUMENT_COUNT, SEED);
		const batch = generator.nextBatch(100);
		const twinBatch = twin.nextBatch(100);

		twin.free();

		expect(batch).toStrictEqual(twinBatch);
	});

	it('should reject an instrument count outside the allowed range', () => {
		expect(() => new MarketGenerator(0, SEED)).toThrow('instrument count must be between 1 and 50, got 0');
		expect(() => new MarketGenerator(INSTRUMENT_COUNT + 1, SEED)).toThrow(
			'instrument count must be between 1 and 50, got 51'
		);
	});
});
