import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { MarketFeedService } from '../../services';
import { MarketFeedErrorHostSpecComponent } from './market-feed-error-host.spec.component';
import { MarketFeedErrorDirective } from './market-feed-error.directive';
import { MarketFeedErrorDirectivePO } from './market-feed-error.directive.po';

import { MarketFeedSettingsMock, MarketWorkerMock } from '../../mocks';
import { MARKET_WORKER_FACTORY } from '../../tokens';

describe(MarketFeedErrorDirective, () => {
	let worker: MarketWorkerMock;
	let marketFeedService: MarketFeedService;
	let marketFeedErrorPO: MarketFeedErrorDirectivePO;

	beforeEach(() => {
		worker = new MarketWorkerMock();
		TestBed.configureTestingModule({ providers: [MockProvider(MARKET_WORKER_FACTORY, () => worker, 'useValue')] });
		marketFeedService = TestBed.inject(MarketFeedService);
		marketFeedService.start();
		TestBed.createComponent(MarketFeedErrorHostSpecComponent);
		marketFeedErrorPO = new MarketFeedErrorDirectivePO();
	});

	it('should render nothing while the feed works', async () => {
		await expect.element(marketFeedErrorPO.error).not.toBeInTheDocument();
	});

	it('should render the failure message of the current run', async () => {
		worker.emit({ message: 'memory access out of bounds', runId: 1, type: 'error' });

		await expect.element(marketFeedErrorPO.error).toHaveTextContent('Stopped: memory access out of bounds');
	});

	it('should remove the failure message once a new run starts', async () => {
		worker.emit({ message: 'memory access out of bounds', runId: 1, type: 'error' });

		await expect.element(marketFeedErrorPO.error).toHaveTextContent('Stopped: memory access out of bounds');

		marketFeedService.apply(MarketFeedSettingsMock.create());

		await expect.element(marketFeedErrorPO.error).not.toBeInTheDocument();
	});
});
