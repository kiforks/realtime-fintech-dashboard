import { MarketBatchGenerator } from '../models';

import { MarketBatchMock } from './market-batch.mock';
import { MarketUpdateMock } from './market-update.mock';

import type { Mock } from 'vitest';

export class MarketBatchGeneratorMock implements MarketBatchGenerator {
	public readonly free = vi.fn<() => void>();
	public readonly nextBatch: Mock<(size: number) => Uint32Array>;

	constructor(nextBatch = (): Uint32Array => MarketBatchMock.encode([new MarketUpdateMock()])) {
		this.nextBatch = vi.fn(nextBatch);
	}
}
