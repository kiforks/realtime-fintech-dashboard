import { MarketMetricsHelper } from './market-metrics.helper';

import { InstrumentStatsMock, MarketBatchMock, MarketUpdateMock } from '../../mocks';

const workedExampleBatch = MarketBatchMock.encode([
	new MarketUpdateMock({ askCents: 10000, bidCents: 9996, priceCents: 10000, tradeQuantity: 10 }),
	new MarketUpdateMock(),
]);

describe(MarketMetricsHelper, () => {
	describe('empty', () => {
		it('should start every instrument with unavailable quotes and zero totals', () => {
			expect(MarketMetricsHelper.empty(2)).toStrictEqual([
				{
					askCents: null,
					askQuantity: null,
					bidCents: null,
					bidQuantity: null,
					lastPriceCents: null,
					notionalCents: 0,
					symbol: 'ALFA',
					volume: 0,
				},
				{
					askCents: null,
					askQuantity: null,
					bidCents: null,
					bidQuantity: null,
					lastPriceCents: null,
					notionalCents: 0,
					symbol: 'BETA',
					volume: 0,
				},
			]);
		});

		it('should give each of the 50 instruments its own symbol', () => {
			const symbols = new Set(MarketMetricsHelper.empty(50).map(stats => stats.symbol));

			expect(symbols.size).toBe(50);
		});
	});

	describe('accumulate', () => {
		it('should keep the latest quote and count every trade of the worked example', () => {
			expect(MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(1), workedExampleBatch)).toStrictEqual([
				{
					askCents: 10200,
					askQuantity: 400,
					bidCents: 10196,
					bidQuantity: 600,
					lastPriceCents: 10200,
					notionalCents: 406000,
					symbol: 'ALFA',
					volume: 40,
				},
			]);
		});

		it('should keep the totals and quotes of each instrument apart when their trades interleave', () => {
			const interleavedBatch = MarketBatchMock.encode([
				new MarketUpdateMock({ askCents: 10000, bidCents: 9996, priceCents: 10000, tradeQuantity: 10 }),
				new MarketUpdateMock({
					askCents: 20000,
					askQuantity: 300,
					bidCents: 19990,
					bidQuantity: 100,
					instrument: 1,
					priceCents: 20000,
					tradeQuantity: 5,
				}),
				new MarketUpdateMock(),
			]);

			expect(MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(3), interleavedBatch)).toStrictEqual([
				{
					askCents: 10200,
					askQuantity: 400,
					bidCents: 10196,
					bidQuantity: 600,
					lastPriceCents: 10200,
					notionalCents: 406000,
					symbol: 'ALFA',
					volume: 40,
				},
				{
					askCents: 20000,
					askQuantity: 300,
					bidCents: 19990,
					bidQuantity: 100,
					lastPriceCents: 20000,
					notionalCents: 100000,
					symbol: 'BETA',
					volume: 5,
				},
				{
					askCents: null,
					askQuantity: null,
					bidCents: null,
					bidQuantity: null,
					lastPriceCents: null,
					notionalCents: 0,
					symbol: 'GAMA',
					volume: 0,
				},
			]);
		});

		it('should keep adding to the totals across batches', () => {
			const firstBatch = MarketBatchMock.encode([new MarketUpdateMock({ priceCents: 10000, tradeQuantity: 10 })]);
			const secondBatch = MarketBatchMock.encode([new MarketUpdateMock()]);
			const afterFirstBatch = MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(1), firstBatch);

			expect(MarketMetricsHelper.accumulate(afterFirstBatch, secondBatch)).toStrictEqual(
				MarketMetricsHelper.accumulate(MarketMetricsHelper.empty(1), workedExampleBatch)
			);
		});

		it('should not change the stats it receives', () => {
			const stats = MarketMetricsHelper.empty(1);

			MarketMetricsHelper.accumulate(stats, workedExampleBatch);

			expect(stats).toStrictEqual(MarketMetricsHelper.empty(1));
		});
	});

	describe('toMetrics', () => {
		it('should derive the metrics of the worked example', () => {
			expect(MarketMetricsHelper.toMetrics(new InstrumentStatsMock())).toStrictEqual({
				imbalance: 0.2,
				lastPriceCents: 10200,
				spreadCents: 4,
				symbol: 'ALFA',
				volume: 40,
				vwapCents: 10150,
			});
		});

		it('should report unavailable metrics and zero volume before any data arrives', () => {
			const [emptyStats] = MarketMetricsHelper.empty(1);

			expect(MarketMetricsHelper.toMetrics(emptyStats)).toStrictEqual({
				imbalance: null,
				lastPriceCents: null,
				spreadCents: null,
				symbol: 'ALFA',
				volume: 0,
				vwapCents: null,
			});
		});

		it('should report an unavailable imbalance when both sides of the book are empty', () => {
			const metrics = MarketMetricsHelper.toMetrics(new InstrumentStatsMock({ askQuantity: 0, bidQuantity: 0 }));

			expect(metrics.imbalance).toBeNull();
		});

		it.each([
			{ askQuantity: 400, bidQuantity: 0, imbalance: -1 },
			{ askQuantity: 0, bidQuantity: 600, imbalance: 1 },
		])(
			'should report an imbalance of $imbalance when only one side of the book has quantity',
			({ askQuantity, bidQuantity, imbalance }) => {
				const metrics = MarketMetricsHelper.toMetrics(new InstrumentStatsMock({ askQuantity, bidQuantity }));

				expect(metrics.imbalance).toBe(imbalance);
			}
		);
	});
});
