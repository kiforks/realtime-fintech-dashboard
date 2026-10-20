import { TestBed } from '@angular/core/testing';

import { MarketFeedService } from './market-feed.service';
import { ProducerStatus } from '../../enums';
import { MarketWorker, ProducerSettings } from '../../models';

import { ProducerSettingsConfig } from '../../configs';
import { InstrumentStatsMock, MarketWorkerMock } from '../../mocks';
import { MARKET_WORKER_FACTORY } from '../../tokens';

import type { Mock } from 'vitest';

const appliedSettings: ProducerSettings = { batchIntervalMs: 50, instrumentCount: 2, updatesPerBatch: 1000 };

const emptyMetrics = (symbol: string) => ({
	imbalance: null,
	lastPriceCents: null,
	spreadCents: null,
	symbol,
	volume: 0,
	vwapCents: null,
});

const workedExampleMetrics = {
	imbalance: 0.2,
	lastPriceCents: 10200,
	spreadCents: 4,
	symbol: 'ALFA',
	volume: 40,
	vwapCents: 10150,
};

describe(MarketFeedService, () => {
	let worker: MarketWorkerMock;
	let replacementWorker: MarketWorkerMock;
	let workerFactory: Mock<() => MarketWorker>;
	let marketFeedService: MarketFeedService;

	beforeEach(() => {
		worker = new MarketWorkerMock();
		replacementWorker = new MarketWorkerMock();
		workerFactory = vi.fn<() => MarketWorker>().mockReturnValueOnce(worker).mockReturnValueOnce(replacementWorker);
		TestBed.configureTestingModule({ providers: [{ provide: MARKET_WORKER_FACTORY, useValue: workerFactory }] });
		marketFeedService = TestBed.inject(MarketFeedService);
	});

	it('should start the default run with unavailable values when created', () => {
		expect(workerFactory).toHaveBeenCalledTimes(1);
		expect(worker.postMessage).toHaveBeenCalledWith({
			runId: 1,
			settings: ProducerSettingsConfig.Defaults,
			type: 'start',
		});
		expect(marketFeedService.status()).toBe(ProducerStatus.Running);
		expect(marketFeedService.rows()).toStrictEqual(['ALFA', 'BETA', 'GAMA', 'DELT', 'EPSI'].map(emptyMetrics));
	});

	it('should show the metrics of the current run', () => {
		worker.emit({ runId: 1, stats: [new InstrumentStatsMock()], type: 'snapshot' });

		expect(marketFeedService.rows()).toStrictEqual([workedExampleMetrics]);
	});

	it('should clear the values and start a new run with the applied settings', () => {
		worker.emit({ runId: 1, stats: [new InstrumentStatsMock()], type: 'snapshot' });
		marketFeedService.apply(appliedSettings);

		expect(worker.postMessage).toHaveBeenLastCalledWith({ runId: 2, settings: appliedSettings, type: 'start' });
		expect(marketFeedService.settings()).toStrictEqual(appliedSettings);
		expect(marketFeedService.rows()).toStrictEqual([emptyMetrics('ALFA'), emptyMetrics('BETA')]);
	});

	it('should ignore results that arrive from a previous run', () => {
		marketFeedService.apply(appliedSettings);
		worker.emit({ runId: 1, stats: [new InstrumentStatsMock()], type: 'snapshot' });
		worker.emit({ message: 'instrument count must be between 1 and 50, got 0', runId: 1, type: 'error' });

		expect(marketFeedService.rows()).toStrictEqual([emptyMetrics('ALFA'), emptyMetrics('BETA')]);
		expect(marketFeedService.status()).toBe(ProducerStatus.Running);
		expect(marketFeedService.errorMessage()).toBeNull();
	});

	it('should pause and resume the producer while keeping the current values', () => {
		worker.emit({ runId: 1, stats: [new InstrumentStatsMock()], type: 'snapshot' });
		marketFeedService.togglePause();

		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'pause' });
		expect(marketFeedService.status()).toBe(ProducerStatus.Paused);
		expect(marketFeedService.rows()).toStrictEqual([workedExampleMetrics]);

		marketFeedService.togglePause();

		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'resume' });
		expect(marketFeedService.status()).toBe(ProducerStatus.Running);
	});

	it('should start generating again when settings are applied while paused', () => {
		marketFeedService.togglePause();
		marketFeedService.apply(appliedSettings);

		expect(worker.postMessage).toHaveBeenLastCalledWith({ runId: 2, settings: appliedSettings, type: 'start' });
		expect(marketFeedService.status()).toBe(ProducerStatus.Running);
	});

	it('should report a producer error of the current run and stop reacting to pause', () => {
		worker.emit({ message: 'instrument count must be between 1 and 50, got 0', runId: 1, type: 'error' });
		marketFeedService.togglePause();

		expect(marketFeedService.status()).toBe(ProducerStatus.Failed);
		expect(marketFeedService.errorMessage()).toBe('instrument count must be between 1 and 50, got 0');
		expect(worker.postMessage).toHaveBeenCalledTimes(1);
	});

	it('should stop and explain the failure when the worker crashes', () => {
		worker.crash('Failed to fetch the worker script');

		expect(worker.terminate).toHaveBeenCalledTimes(1);
		expect(marketFeedService.status()).toBe(ProducerStatus.Failed);
		expect(marketFeedService.errorMessage()).toBe('The market data worker stopped unexpectedly');
	});

	it('should start a new worker on the next apply after a crash', () => {
		worker.crash('Failed to fetch the worker script');
		marketFeedService.apply(appliedSettings);

		expect(workerFactory).toHaveBeenCalledTimes(2);
		expect(replacementWorker.postMessage).toHaveBeenCalledWith({ runId: 2, settings: appliedSettings, type: 'start' });
		expect(marketFeedService.status()).toBe(ProducerStatus.Running);
	});

	it('should terminate the worker when the application is destroyed', () => {
		TestBed.resetTestingModule();

		expect(worker.terminate).toHaveBeenCalledTimes(1);
	});
});
