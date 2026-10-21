import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { MarketFeedService } from './market-feed.service';
import { MarketFeedStatus } from '../../enums';
import { MarketFeedSettings, MarketWorker } from '../../models';

import { MarketFeedSettingsConfig } from '../../configs';
import {
	MarketFeedSettingsMock,
	MarketInstrumentMetricsMock,
	MarketInstrumentStatsMock,
	MarketWorkerMock,
} from '../../mocks';
import { MARKET_WORKER_FACTORY } from '../../tokens';

import type { Mock } from 'vitest';

describe(MarketFeedService, () => {
	let worker: MarketWorkerMock;
	let replacementWorker: MarketWorkerMock;
	let workerFactory: Mock<() => MarketWorker>;
	let appliedSettings: MarketFeedSettings;
	let marketFeedService: MarketFeedService;

	beforeEach(() => {
		worker = new MarketWorkerMock();
		replacementWorker = new MarketWorkerMock();
		workerFactory = vi.fn<() => MarketWorker>().mockReturnValueOnce(worker).mockReturnValueOnce(replacementWorker);
		appliedSettings = MarketFeedSettingsMock.create({ batchIntervalMs: 50, updatesPerBatch: 1000 });
		TestBed.configureTestingModule({ providers: [MockProvider(MARKET_WORKER_FACTORY, workerFactory)] });
		marketFeedService = TestBed.inject(MarketFeedService);
	});

	it('should not start a worker before the feed is started', () => {
		expect(workerFactory).not.toHaveBeenCalled();
		expect(marketFeedService.rows()).toStrictEqual([]);
	});

	describe('after start', () => {
		beforeEach(() => {
			marketFeedService.start();
		});

		it('should start the default run with unavailable values', () => {
			expect(workerFactory).toHaveBeenCalledTimes(1);
			expect(worker.postMessage).toHaveBeenCalledWith({
				runId: 1,
				settings: MarketFeedSettingsConfig.Defaults,
				type: 'start',
			});
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Running);
			expect(marketFeedService.rows()).toStrictEqual(
				['ALFA', 'BETA', 'GAMA', 'DELT', 'EPSI'].map(symbol => MarketInstrumentMetricsMock.empty(symbol))
			);
		});

		it('should show the metrics of the current run', () => {
			worker.emit({ runId: 1, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });

			expect(marketFeedService.rows()).toStrictEqual([MarketInstrumentMetricsMock.create()]);
		});

		it('should clear the values and start a new run with the applied settings', () => {
			worker.emit({ runId: 1, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });
			marketFeedService.apply(appliedSettings);

			expect(worker.postMessage).toHaveBeenLastCalledWith({ runId: 2, settings: appliedSettings, type: 'start' });
			expect(marketFeedService.settings()).toStrictEqual(appliedSettings);
			expect(marketFeedService.rows()).toStrictEqual([
				MarketInstrumentMetricsMock.empty('ALFA'),
				MarketInstrumentMetricsMock.empty('BETA'),
			]);
		});

		it('should ignore results that arrive from a previous run', () => {
			marketFeedService.apply(appliedSettings);
			worker.emit({ runId: 1, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });
			worker.emit({ message: 'instrument count must be between 1 and 50, got 0', runId: 1, type: 'error' });

			expect(marketFeedService.rows()).toStrictEqual([
				MarketInstrumentMetricsMock.empty('ALFA'),
				MarketInstrumentMetricsMock.empty('BETA'),
			]);
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Running);
			expect(marketFeedService.errorMessage()).toBeNull();
		});

		it('should show the results of the new run once settings are applied', () => {
			marketFeedService.apply(appliedSettings);
			worker.emit({ runId: 2, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });

			expect(marketFeedService.rows()).toStrictEqual([MarketInstrumentMetricsMock.create()]);
		});

		it('should pause and resume the producer while keeping the current values', () => {
			worker.emit({ runId: 1, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });
			marketFeedService.togglePause();

			expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'pause' });
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Paused);
			expect(marketFeedService.rows()).toStrictEqual([MarketInstrumentMetricsMock.create()]);

			marketFeedService.togglePause();

			expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'resume' });
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Running);
		});

		it('should show new results again after resuming', () => {
			marketFeedService.togglePause();
			marketFeedService.togglePause();
			worker.emit({
				runId: 1,
				stats: [MarketInstrumentStatsMock.create({ notionalCents: 812000, volume: 80 })],
				type: 'snapshot',
			});

			expect(marketFeedService.rows()).toStrictEqual([MarketInstrumentMetricsMock.create({ volume: 80 })]);
		});

		it('should tell whether the feed is paused', () => {
			marketFeedService.togglePause();

			expect(marketFeedService.isPaused()).toBe(true);

			marketFeedService.togglePause();

			expect(marketFeedService.isPaused()).toBe(false);
		});

		it('should keep the paused values when a snapshot posted before the pause arrives late', () => {
			worker.emit({ runId: 1, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });
			marketFeedService.togglePause();
			worker.emit({ runId: 1, stats: [MarketInstrumentStatsMock.create({ volume: 80 })], type: 'snapshot' });

			expect(marketFeedService.rows()).toStrictEqual([MarketInstrumentMetricsMock.create()]);
		});

		it('should start generating again when settings are applied while paused', () => {
			marketFeedService.togglePause();
			marketFeedService.apply(appliedSettings);

			expect(worker.postMessage).toHaveBeenLastCalledWith({ runId: 2, settings: appliedSettings, type: 'start' });
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Running);
		});

		it('should report a producer error of the current run, release the worker and stop reacting to pause', () => {
			worker.emit({ message: 'instrument count must be between 1 and 50, got 0', runId: 1, type: 'error' });
			marketFeedService.togglePause();

			expect(marketFeedService.status()).toBe(MarketFeedStatus.Failed);
			expect(marketFeedService.canTogglePause()).toBe(false);
			expect(marketFeedService.errorMessage()).toBe('instrument count must be between 1 and 50, got 0');
			expect(worker.terminate).toHaveBeenCalledTimes(1);
			expect(worker.postMessage).toHaveBeenCalledTimes(1);
		});

		it('should replace the worker after a producer error so the next run starts on a fresh one', () => {
			worker.emit({ message: 'memory access out of bounds', runId: 1, type: 'error' });
			marketFeedService.apply(appliedSettings);

			expect(worker.terminate).toHaveBeenCalledTimes(1);
			expect(workerFactory).toHaveBeenCalledTimes(2);
			expect(replacementWorker.postMessage).toHaveBeenCalledWith({
				runId: 2,
				settings: appliedSettings,
				type: 'start',
			});
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Running);
			expect(marketFeedService.canTogglePause()).toBe(true);
		});

		it('should show the results that the replacement worker sends', () => {
			worker.emit({ message: 'memory access out of bounds', runId: 1, type: 'error' });
			marketFeedService.apply(appliedSettings);
			replacementWorker.emit({ runId: 2, stats: [MarketInstrumentStatsMock.create()], type: 'snapshot' });

			expect(marketFeedService.rows()).toStrictEqual([MarketInstrumentMetricsMock.create()]);
		});

		it('should stop and explain the failure when the worker crashes', () => {
			worker.crash('Failed to fetch the worker script');

			expect(worker.terminate).toHaveBeenCalledTimes(1);
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Failed);
			expect(marketFeedService.errorMessage()).toBe('The market data worker stopped unexpectedly');
		});

		it('should start a new worker on the next apply after a crash', () => {
			worker.crash('Failed to fetch the worker script');
			marketFeedService.apply(appliedSettings);

			expect(workerFactory).toHaveBeenCalledTimes(2);
			expect(replacementWorker.postMessage).toHaveBeenCalledWith({
				runId: 2,
				settings: appliedSettings,
				type: 'start',
			});
			expect(marketFeedService.status()).toBe(MarketFeedStatus.Running);
			expect(marketFeedService.errorMessage()).toBeNull();
		});

		it('should terminate the worker when the application is destroyed', () => {
			TestBed.resetTestingModule();

			expect(worker.terminate).toHaveBeenCalledTimes(1);
		});
	});
});
