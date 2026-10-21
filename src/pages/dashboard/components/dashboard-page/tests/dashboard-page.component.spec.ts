import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { DashboardPageComponent } from '../dashboard-page.component';
import { DashboardPageComponentPO } from './dashboard-page.component.po';

import { MarketFeedService } from '~/entities/market';
import {
	MARKET_WORKER_FACTORY,
	MarketFeedSettingsMock,
	MarketInstrumentStatsMock,
	MarketWorkerMock,
} from '~/entities/market/testing';

const CAPTION = 'Metrics since the current run started. A dash means the value cannot be calculated yet.';

describe(DashboardPageComponent, () => {
	let worker: MarketWorkerMock;
	let marketFeedService: MarketFeedService;
	let dashboardPagePO: DashboardPageComponentPO;

	beforeEach(() => {
		worker = new MarketWorkerMock();
		TestBed.configureTestingModule({
			imports: [DashboardPageComponent],
			providers: [MockProvider(MARKET_WORKER_FACTORY, () => worker, 'useValue')],
		});
		marketFeedService = TestBed.inject(MarketFeedService);
		marketFeedService.start();
		TestBed.createComponent(DashboardPageComponent);
		dashboardPagePO = new DashboardPageComponentPO();
	});

	it('should show the running default producer before data arrives', async () => {
		await expect.element(dashboardPagePO.title).toHaveTextContent('Market dashboard');
		await expect.element(dashboardPagePO.status).toHaveTextContent('Running');
		await expect
			.element(dashboardPagePO.rate)
			.toHaveTextContent('5 instruments, 100 updates every 500 ms (200 updates/s)');
		await expect.element(dashboardPagePO.error).not.toBeInTheDocument();
	});

	it('should list every instrument with unavailable values and zero volume before data arrives', async () => {
		await expect
			.poll(() => dashboardPagePO.rowTexts)
			.toStrictEqual(['ALFA', 'BETA', 'GAMA', 'DELT', 'EPSI'].map(symbol => [symbol, '—', '—', '0', '—', '—']));
	});

	it('should let keyboard users reach the scrolling metrics table by its caption', async () => {
		await expect.element(dashboardPagePO.caption).toHaveTextContent(CAPTION);
		await expect.element(dashboardPagePO.table).toHaveAccessibleName(CAPTION);
		await expect.element(dashboardPagePO.table).toHaveAttribute('tabindex', '0');
	});

	it('should describe a single instrument and a single update in the singular', async () => {
		marketFeedService.apply(
			MarketFeedSettingsMock.create({ batchIntervalMs: 1000, instrumentCount: 1, updatesPerBatch: 1 })
		);

		await expect.element(dashboardPagePO.rate).toHaveTextContent('1 instrument, 1 update every 1000 ms (1 update/s)');
	});

	it('should format prices as currency, volume with digit grouping and the imbalance as a signed ratio', async () => {
		worker.emit({
			runId: 1,
			stats: [MarketInstrumentStatsMock.create({ notionalCents: 40600000, volume: 4000 })],
			type: 'snapshot',
		});

		await expect
			.poll(() => dashboardPagePO.rowTexts)
			.toStrictEqual([['ALFA', '$102.00', '$0.04', '4,000', '$101.50', '+0.20']]);
	});

	it('should pause and resume the producer', async () => {
		await dashboardPagePO.togglePause();

		await expect.element(dashboardPagePO.status).toHaveTextContent('Paused');
		await expect.element(dashboardPagePO.toggle).toHaveTextContent('Resume');
		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'pause' });

		await dashboardPagePO.togglePause();

		await expect.element(dashboardPagePO.status).toHaveTextContent('Running');
		await expect.element(dashboardPagePO.toggle).toHaveTextContent('Pause');
		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'resume' });
	});

	it('should explain a producer failure and disable pausing', async () => {
		worker.emit({ message: 'instrument count must be between 1 and 50, got 0', runId: 1, type: 'error' });

		await expect.element(dashboardPagePO.status).toHaveTextContent('Failed');
		await expect
			.element(dashboardPagePO.error)
			.toHaveTextContent(
				'Market data producer stopped: instrument count must be between 1 and 50, got 0. Apply settings to restart.'
			);
		await expect.element(dashboardPagePO.error).toHaveAttribute('role', 'alert');
		await expect.element(dashboardPagePO.toggle).toBeDisabled();
	});
});
