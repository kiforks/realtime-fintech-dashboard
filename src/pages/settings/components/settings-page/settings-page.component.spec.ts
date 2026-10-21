import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsPageComponentPO } from './settings-page.component.po';

import { MarketFeedService } from '~/entities/market';
import { MARKET_WORKER_FACTORY, MarketFeedSettingsMock, MarketWorkerMock } from '~/entities/market/testing';
import type { MockInstance } from 'vitest';

describe(SettingsPageComponent, () => {
	let worker: MarketWorkerMock;
	let marketFeedService: MarketFeedService;
	let router: Router;
	let navigate: MockInstance<Router['navigate']>;
	let fixture: ComponentFixture<SettingsPageComponent>;
	let settingsPagePO: SettingsPageComponentPO;

	beforeEach(() => {
		worker = new MarketWorkerMock();
		TestBed.configureTestingModule({
			imports: [SettingsPageComponent],
			providers: [provideRouter([]), MockProvider(MARKET_WORKER_FACTORY, () => worker, 'useValue')],
		});
		marketFeedService = TestBed.inject(MarketFeedService);
		marketFeedService.start();
		router = TestBed.inject(Router);
		navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
		fixture = TestBed.createComponent(SettingsPageComponent);
		settingsPagePO = new SettingsPageComponentPO();
	});

	it('should open with the default settings of the first run', async () => {
		await expect.element(settingsPagePO.title).toHaveTextContent('Producer settings');
		await expect.element(settingsPagePO.instrumentCount.input).toHaveValue(5);
		await expect.element(settingsPagePO.updatesPerBatch.input).toHaveValue(100);
		await expect.element(settingsPagePO.batchInterval.input).toHaveValue(500);
	});

	it('should label every field and mark it as a required whole number in its range', async () => {
		await expect.element(settingsPagePO.instrumentCount.input).toHaveAccessibleName('Instrument count');
		await expect.element(settingsPagePO.instrumentCount.input).toBeRequired();
		await expect.element(settingsPagePO.instrumentCount.input).toHaveAttribute('min', '1');
		await expect.element(settingsPagePO.instrumentCount.input).toHaveAttribute('max', '50');
		await expect.element(settingsPagePO.updatesPerBatch.input).toHaveAccessibleName('Updates per batch');
		await expect.element(settingsPagePO.batchInterval.input).toHaveAccessibleName('Batch interval, ms');
	});

	it('should open again with the settings of the run applied last', async () => {
		marketFeedService.apply(
			MarketFeedSettingsMock.create({ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: 1000 })
		);
		fixture.destroy();
		TestBed.createComponent(SettingsPageComponent);

		await expect.element(settingsPagePO.instrumentCount.input).toHaveValue(10);
		await expect.element(settingsPagePO.updatesPerBatch.input).toHaveValue(1000);
		await expect.element(settingsPagePO.batchInterval.input).toHaveValue(50);
	});

	it('should leave the producer untouched while the form is edited', async () => {
		await settingsPagePO.instrumentCount.fill('10');

		await expect.element(settingsPagePO.instrumentCount.error).not.toBeInTheDocument();
		await expect.element(settingsPagePO.instrumentCount.input).toHaveAttribute('aria-invalid', 'false');
		expect(worker.postMessage).toHaveBeenCalledTimes(1);
	});

	it.each([
		{ error: 'Enter a whole number from 1 to 50.', field: 'instrumentCount', value: '0' },
		{ error: 'Enter a whole number from 1 to 50.', field: 'instrumentCount', value: '51' },
		{ error: 'Enter a whole number from 1 to 50.', field: 'instrumentCount', value: '2.5' },
		{ error: 'Enter a whole number from 1 to 1000.', field: 'updatesPerBatch', value: '1001' },
		{ error: 'Enter a whole number from 50 to 2000.', field: 'batchInterval', value: '49' },
	] as const)(
		'should reject "$value" for the $field field and keep the current run',
		async ({ error, field, value }) => {
			const fieldPO = settingsPagePO[field];

			await fieldPO.fill(value);
			await settingsPagePO.apply();

			await expect.element(fieldPO.error).toHaveTextContent(error);
			await expect.element(fieldPO.input).toHaveAttribute('aria-invalid', 'true');
			await expect.element(fieldPO.input).toHaveAccessibleDescription(error);
			expect(worker.postMessage).toHaveBeenCalledTimes(1);
			expect(navigate).not.toHaveBeenCalled();
		}
	);

	it('should require a value before applying', async () => {
		await settingsPagePO.instrumentCount.clear();
		await settingsPagePO.apply();

		await expect.element(settingsPagePO.instrumentCount.error).toHaveTextContent('Enter a whole number from 1 to 50.');
		expect(worker.postMessage).toHaveBeenCalledTimes(1);
	});

	it('should start a new run with the applied settings and open the dashboard', async () => {
		await settingsPagePO.instrumentCount.fill('50');
		await settingsPagePO.updatesPerBatch.fill('1000');
		await settingsPagePO.batchInterval.fill('50');
		await settingsPagePO.apply();

		await vi.waitFor(() => {
			expect(navigate).toHaveBeenCalledWith(['/', 'dashboard']);
		});

		expect(worker.postMessage).toHaveBeenLastCalledWith({
			runId: 2,
			settings: { batchIntervalMs: 50, instrumentCount: 50, updatesPerBatch: 1000 },
			type: 'start',
		});
	});

	it('should accept one instrument, one update and the longest interval', async () => {
		await settingsPagePO.instrumentCount.fill('1');
		await settingsPagePO.updatesPerBatch.fill('1');
		await settingsPagePO.batchInterval.fill('2000');
		await settingsPagePO.apply();

		await vi.waitFor(() => {
			expect(worker.postMessage).toHaveBeenLastCalledWith({
				runId: 2,
				settings: { batchIntervalMs: 2000, instrumentCount: 1, updatesPerBatch: 1 },
				type: 'start',
			});
		});
	});
});
