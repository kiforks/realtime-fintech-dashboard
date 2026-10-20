import { UpdatesPerSecondPipe } from './updates-per-second.pipe';

describe(UpdatesPerSecondPipe, () => {
	it.each([
		{ batchIntervalMs: 500, updatesPerBatch: 100, updatesPerSecond: 200 },
		{ batchIntervalMs: 50, updatesPerBatch: 1000, updatesPerSecond: 20000 },
		{ batchIntervalMs: 2000, updatesPerBatch: 1, updatesPerSecond: 0.5 },
	])(
		'should report $updatesPerSecond updates per second for $updatesPerBatch updates every $batchIntervalMs ms',
		({ batchIntervalMs, updatesPerBatch, updatesPerSecond }) => {
			expect(new UpdatesPerSecondPipe().transform({ batchIntervalMs, instrumentCount: 5, updatesPerBatch })).toBe(
				updatesPerSecond
			);
		}
	);
});
