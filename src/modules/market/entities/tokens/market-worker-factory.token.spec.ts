import { TestBed } from '@angular/core/testing';

import { MARKET_WORKER_FACTORY } from './market-worker-factory.token';

import type { Mock } from 'vitest';

describe('mARKET_WORKER_FACTORY', () => {
	let workerConstructor: Mock<(scriptUrl: URL, options: WorkerOptions) => void>;

	beforeEach(() => {
		workerConstructor = vi.fn<(scriptUrl: URL, options: WorkerOptions) => void>();
		vi.stubGlobal('Worker', workerConstructor);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should start the market producer as a module worker', () => {
		TestBed.inject(MARKET_WORKER_FACTORY)();

		expect(workerConstructor).toHaveBeenCalledWith(expect.any(URL), { type: 'module' });
	});
});
