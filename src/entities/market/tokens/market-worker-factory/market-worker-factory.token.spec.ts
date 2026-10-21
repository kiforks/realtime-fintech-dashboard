import { TestBed } from '@angular/core/testing';

import { MarketWorker } from '../../models';

import { MARKET_WORKER_FACTORY } from './market-worker-factory.token';

import type { Mock } from 'vitest';

describe('market worker factory', () => {
	let workerConstructor: Mock<(scriptUrl: URL, options: WorkerOptions) => void>;
	let marketWorkerFactory: () => MarketWorker;

	beforeEach(() => {
		workerConstructor = vi.fn<(scriptUrl: URL, options: WorkerOptions) => void>();
		vi.stubGlobal('Worker', workerConstructor);
		marketWorkerFactory = TestBed.inject(MARKET_WORKER_FACTORY);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should start the market producer as a module worker', () => {
		marketWorkerFactory();

		expect(workerConstructor).toHaveBeenCalledWith(expect.any(URL), { type: 'module' });
	});
});
