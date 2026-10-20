import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardPageHarness } from './dashboard-page.component.harness';

import { MARKET_WORKER_FACTORY, MarketFeedService } from '~modules/market/entities';
import { InstrumentStatsMock, MarketWorkerMock } from '~modules/market/entities/testing';

const unavailableRow = (symbol: string): string[] => [symbol, '—', '—', '0', '—', '—'];

describe(DashboardPageComponent, () => {
	let worker: MarketWorkerMock;
	let harness: DashboardPageHarness;

	beforeEach(async () => {
		worker = new MarketWorkerMock();
		await TestBed.configureTestingModule({
			imports: [DashboardPageComponent],
			providers: [{ provide: MARKET_WORKER_FACTORY, useValue: () => worker }],
		}).compileComponents();
		harness = await TestbedHarnessEnvironment.harnessForFixture(
			TestBed.createComponent(DashboardPageComponent),
			DashboardPageHarness
		);
	});

	it('should show the running default producer with unavailable values and zero volume before data arrives', async () => {
		expect(await harness.titleText).toBe('Market dashboard');
		expect(await harness.statusText).toBe('Running');
		expect(await harness.rateText).toBe('5 instruments, 100 updates every 500 ms (200 updates/s)');
		expect(await harness.rows).toStrictEqual(['ALFA', 'BETA', 'GAMA', 'DELT', 'EPSI'].map(unavailableRow));
		expect(await harness.errorText).toBeNull();
	});

	it('should describe a single instrument and a single update in the singular', async () => {
		TestBed.inject(MarketFeedService).apply({ batchIntervalMs: 1000, instrumentCount: 1, updatesPerBatch: 1 });

		expect(await harness.rateText).toBe('1 instrument, 1 update every 1000 ms (1 update/s)');
	});

	it('should format prices as currency, volume with digit grouping and the imbalance as a signed ratio', async () => {
		worker.emit({
			runId: 1,
			stats: [new InstrumentStatsMock({ notionalCents: 40600000, volume: 4000 })],
			type: 'snapshot',
		});

		expect(await harness.rows).toStrictEqual([['ALFA', '$102.00', '$0.04', '4,000', '$101.50', '+0.20']]);
	});

	it('should pause and resume the producer', async () => {
		await harness.togglePause();

		expect(await harness.statusText).toBe('Paused');
		expect(await harness.toggleText).toBe('Resume');
		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'pause' });

		await harness.togglePause();

		expect(await harness.statusText).toBe('Running');
		expect(await harness.toggleText).toBe('Pause');
	});

	it('should explain a producer failure and disable pausing', async () => {
		worker.emit({ message: 'instrument count must be between 1 and 50, got 0', runId: 1, type: 'error' });

		expect(await harness.statusText).toBe('Failed');
		expect(await harness.errorText).toBe(
			'Market data producer stopped: instrument count must be between 1 and 50, got 0. Apply settings to restart.'
		);
		expect(await harness.isToggleDisabled).toBe(true);
	});
});
