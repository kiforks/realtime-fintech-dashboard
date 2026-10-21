import { MarketMetricsHelper } from './market-metrics.helper';

import { MarketFeedSettingsConfig } from '../../configs';
import { MarketBatchMock, MarketInstrumentMetricsMock, MarketInstrumentStatsMock, MarketUpdateMock } from '../../mocks';

describe(MarketMetricsHelper, () => {
	let workedExampleBatch: Uint32Array;

	beforeEach(() => {
		workedExampleBatch = MarketBatchMock.encode([
			MarketUpdateMock.create({
				askCents: 10000,
				askQuantity: 900,
				bidCents: 9996,
				bidQuantity: 100,
				priceCents: 10000,
				tradeQuantity: 10,
			}),
			MarketUpdateMock.create(),
		]);
	});

	describe('empty', () => {
		it('should start every instrument with unavailable quotes and zero totals', () => {
			expect(MarketMetricsHelper.empty(2)).toStrictEqual([
				MarketInstrumentStatsMock.empty('ALFA'),
				MarketInstrumentStatsMock.empty('BETA'),
			]);
		});

		it('should give every instrument the settings allow its own symbol', () => {
			const { max } = MarketFeedSettingsConfig.Ranges.instrumentCount;
			const symbols = new Set(MarketMetricsHelper.empty(max).map(({ symbol }) => symbol));

			expect(symbols.size).toBe(max);
		});
	});

	describe('accumulate', () => {
		it('should keep the latest quote and book and count every trade of the worked example', () => {
			expect(MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(1), workedExampleBatch)).toStrictEqual([
				MarketInstrumentStatsMock.create(),
			]);
		});

		it('should keep the totals and quotes of each instrument apart when their trades interleave', () => {
			const interleavedBatch = MarketBatchMock.encode([
				MarketUpdateMock.create({ askCents: 10000, bidCents: 9996, priceCents: 10000, tradeQuantity: 10 }),
				MarketUpdateMock.create({
					askCents: 20000,
					askQuantity: 300,
					bidCents: 19990,
					bidQuantity: 100,
					instrument: 1,
					priceCents: 20000,
					tradeQuantity: 5,
				}),
				MarketUpdateMock.create(),
			]);

			expect(MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(3), interleavedBatch)).toStrictEqual([
				MarketInstrumentStatsMock.create(),
				MarketInstrumentStatsMock.create({
					askCents: 20000,
					askQuantity: 300,
					bidCents: 19990,
					bidQuantity: 100,
					lastPriceCents: 20000,
					notionalCents: 100000,
					symbol: 'BETA',
					volume: 5,
				}),
				MarketInstrumentStatsMock.empty('GAMA'),
			]);
		});

		it('should keep adding to the totals across batches', () => {
			const firstBatch = MarketBatchMock.encode([MarketUpdateMock.create({ priceCents: 10000, tradeQuantity: 10 })]);
			const secondBatch = MarketBatchMock.encode([MarketUpdateMock.create()]);
			const afterFirstBatch = MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(1), firstBatch);

			expect(MarketMetricsHelper.accumulate(afterFirstBatch, secondBatch)).toStrictEqual([
				MarketInstrumentStatsMock.create(),
			]);
		});

		it('should not change the stats it receives', () => {
			const stats = MarketMetricsHelper.empty(1);

			MarketMetricsHelper.accumulate(stats, workedExampleBatch);

			expect(stats).toStrictEqual([MarketInstrumentStatsMock.empty('ALFA')]);
		});
	});

	describe('toMetrics', () => {
		it('should derive the metrics of the worked example', () => {
			expect(MarketMetricsHelper.toMetrics(MarketInstrumentStatsMock.create())).toStrictEqual(
				MarketInstrumentMetricsMock.create()
			);
		});

		it('should keep fractional cents in the VWAP for the display to round', () => {
			const stats = MarketInstrumentStatsMock.create({ notionalCents: 20001, volume: 2 });

			expect(MarketMetricsHelper.toMetrics(stats)).toStrictEqual(
				MarketInstrumentMetricsMock.create({ volume: 2, vwapCents: 10000.5 })
			);
		});

		it('should report unavailable metrics and zero volume before any data arrives', () => {
			expect(MarketMetricsHelper.toMetrics(MarketInstrumentStatsMock.empty('ALFA'))).toStrictEqual(
				MarketInstrumentMetricsMock.empty('ALFA')
			);
		});
	});

	describe('imbalance', () => {
		it.each([
			{ askQuantity: 400, bidQuantity: 600, imbalance: 0.2 },
			{ askQuantity: 400, bidQuantity: 0, imbalance: -1 },
			{ askQuantity: 0, bidQuantity: 600, imbalance: 1 },
		])(
			'should report an imbalance of $imbalance for $bidQuantity bid and $askQuantity ask',
			({ askQuantity, bidQuantity, imbalance }) => {
				expect(MarketMetricsHelper.imbalance(bidQuantity, askQuantity)).toBe(imbalance);
			}
		);

		it.each([
			{ askQuantity: 0, bidQuantity: 0 },
			{ askQuantity: null, bidQuantity: 600 },
			{ askQuantity: 400, bidQuantity: null },
		])(
			'should report an unavailable imbalance for $bidQuantity bid and $askQuantity ask',
			({ askQuantity, bidQuantity }) => {
				expect(MarketMetricsHelper.imbalance(bidQuantity, askQuantity)).toBeNull();
			}
		);
	});
});
