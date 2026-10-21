import { InjectionToken } from '@angular/core';

import { MarketWorker } from '../../models';

export const MARKET_WORKER_FACTORY = new InjectionToken<() => MarketWorker>('MARKET_WORKER_FACTORY', {
	factory: () => () => new Worker(new URL('../../workers/market/market.worker', import.meta.url), { type: 'module' }),
});
