import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsPageHarness } from './settings-page.component.harness';

import { MARKET_WORKER_FACTORY, MarketFeedService } from '~modules/market/entities';
import { MarketWorkerMock } from '~modules/market/entities/testing';
import type { MockInstance } from 'vitest';

describe(SettingsPageComponent, () => {
	let worker: MarketWorkerMock;
	let navigate: MockInstance<Router['navigate']>;
	let harness: SettingsPageHarness;

	beforeEach(async () => {
		worker = new MarketWorkerMock();
		await TestBed.configureTestingModule({
			imports: [SettingsPageComponent],
			providers: [provideRouter([]), { provide: MARKET_WORKER_FACTORY, useValue: () => worker }],
		}).compileComponents();
		navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
		harness = await TestbedHarnessEnvironment.harnessForFixture(
			TestBed.createComponent(SettingsPageComponent),
			SettingsPageHarness
		);
	});

	it('should open with the default settings of the first run', async () => {
		expect(await harness.titleText).toBe('Producer settings');
		expect(await harness.fieldValue('instrument-count')).toBe('5');
		expect(await harness.fieldValue('updates-per-batch')).toBe('100');
		expect(await harness.fieldValue('batch-interval')).toBe('500');
	});

	it('should open again with the settings of the run applied last', async () => {
		TestBed.inject(MarketFeedService).apply({ batchIntervalMs: 50, instrumentCount: 10, updatesPerBatch: 1000 });

		const reopenedHarness = await TestbedHarnessEnvironment.harnessForFixture(
			TestBed.createComponent(SettingsPageComponent),
			SettingsPageHarness
		);

		expect(await reopenedHarness.fieldValue('instrument-count')).toBe('10');
		expect(await reopenedHarness.fieldValue('updates-per-batch')).toBe('1000');
		expect(await reopenedHarness.fieldValue('batch-interval')).toBe('50');
	});

	it('should leave the producer untouched while the form is edited', async () => {
		await harness.fill('instrument-count', '10');

		expect(worker.postMessage).toHaveBeenCalledTimes(1);
		expect(await harness.errorText('instrument-count')).toBeNull();
		expect(await harness.isFieldInvalid('instrument-count')).toBe(false);
	});

	it.each([
		{ error: 'Enter a whole number from 1 to 50.', field: 'instrument-count', value: '0' },
		{ error: 'Enter a whole number from 1 to 50.', field: 'instrument-count', value: '51' },
		{ error: 'Enter a whole number from 1 to 50.', field: 'instrument-count', value: '2.5' },
		{ error: 'Enter a whole number from 1 to 1000.', field: 'updates-per-batch', value: '1001' },
		{ error: 'Enter a whole number from 50 to 2000.', field: 'batch-interval', value: '49' },
	] as const)(
		'should reject "$value" for the $field field and keep the current run',
		async ({ error, field, value }) => {
			await harness.fill(field, value);
			await harness.apply();

			expect(await harness.errorText(field)).toBe(error);
			expect(await harness.isFieldInvalid(field)).toBe(true);
			expect(worker.postMessage).toHaveBeenCalledTimes(1);
			expect(navigate).not.toHaveBeenCalled();
		}
	);

	it('should require a value before applying', async () => {
		await harness.clear('instrument-count');
		await harness.apply();

		expect(await harness.errorText('instrument-count')).toBe('Enter a whole number from 1 to 50.');
		expect(worker.postMessage).toHaveBeenCalledTimes(1);
	});

	it('should start a new run with the applied settings and open the dashboard', async () => {
		await harness.fill('instrument-count', '50');
		await harness.fill('updates-per-batch', '1000');
		await harness.fill('batch-interval', '50');
		await harness.apply();

		expect(worker.postMessage).toHaveBeenLastCalledWith({
			runId: 2,
			settings: { batchIntervalMs: 50, instrumentCount: 50, updatesPerBatch: 1000 },
			type: 'start',
		});
		expect(navigate).toHaveBeenCalledWith(['/', 'dashboard']);
	});

	it('should accept the smallest allowed values', async () => {
		await harness.fill('instrument-count', '1');
		await harness.fill('updates-per-batch', '1');
		await harness.fill('batch-interval', '2000');
		await harness.apply();

		expect(worker.postMessage).toHaveBeenLastCalledWith({
			runId: 2,
			settings: { batchIntervalMs: 2000, instrumentCount: 1, updatesPerBatch: 1 },
			type: 'start',
		});
	});
});
