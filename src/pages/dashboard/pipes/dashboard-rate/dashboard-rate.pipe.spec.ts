import { DashboardRatePipe } from './dashboard-rate.pipe';

import { MarketFeedSettingsMock } from '~/entities/market/testing';

describe(DashboardRatePipe, () => {
	it.each([
		{ batchIntervalMs: 500, updatesPerBatch: 100, updatesPerSecond: 200 },
		{ batchIntervalMs: 50, updatesPerBatch: 1000, updatesPerSecond: 20000 },
		{ batchIntervalMs: 2000, updatesPerBatch: 1, updatesPerSecond: 0.5 },
	])(
		'should report $updatesPerSecond updates per second for $updatesPerBatch updates every $batchIntervalMs ms',
		({ batchIntervalMs, updatesPerBatch, updatesPerSecond }) => {
			const settings = MarketFeedSettingsMock.create({ batchIntervalMs, updatesPerBatch });

			expect(new DashboardRatePipe().transform(settings)).toBe(updatesPerSecond);
		}
	);
});
