import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { MarketFeedService } from '../../../services';
import { MarketFeedDirective } from '../market-feed.directive';
import { MarketFeedHostSpecComponent } from './components/market-feed-host.spec.component';
import { MarketFeedDirectivePO } from './market-feed.directive.po';

import { MarketWorkerMock } from '../../../mocks';
import { MARKET_WORKER_FACTORY } from '../../../tokens';

describe(MarketFeedDirective, () => {
	let worker: MarketWorkerMock;
	let marketFeedService: MarketFeedService;
	let marketFeedPO: MarketFeedDirectivePO;

	beforeEach(() => {
		worker = new MarketWorkerMock();
		TestBed.configureTestingModule({ providers: [MockProvider(MARKET_WORKER_FACTORY, () => worker, 'useValue')] });
		marketFeedService = TestBed.inject(MarketFeedService);
		marketFeedService.start();
		TestBed.createComponent(MarketFeedHostSpecComponent);
		marketFeedPO = new MarketFeedDirectivePO();
	});

	it('should give the template the live state of the market feed', async () => {
		await expect.element(marketFeedPO.status).toHaveTextContent('running');

		marketFeedService.togglePause();

		await expect.element(marketFeedPO.status).toHaveTextContent('paused');
	});

	it('should let the template act on the market feed', async () => {
		await marketFeedPO.toggle.click();

		await expect.element(marketFeedPO.status).toHaveTextContent('paused');
		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'pause' });
	});
});
