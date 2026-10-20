import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { RootComponent } from './root.component';
import { RootHarness } from './root.component.harness';
import { DashboardPageHarness } from '~/pages/dashboard/testing';
import { SettingsPageHarness } from '~/pages/settings/testing';
import { ROOT_ROUTES } from '../../routes';

import { MARKET_WORKER_FACTORY, MarketWorker, ProducerSettingsConfig } from '~/entities/market';
import { MarketWorkerMock } from '~/entities/market/testing';
import type { Mock } from 'vitest';

describe(RootComponent, () => {
	let fixture: ComponentFixture<RootComponent>;
	let harness: RootHarness;
	let loader: HarnessLoader;
	let worker: MarketWorkerMock;
	let workerFactory: Mock<() => MarketWorker>;

	beforeEach(async () => {
		worker = new MarketWorkerMock();
		workerFactory = vi.fn<() => MarketWorker>(() => worker);
		await TestBed.configureTestingModule({
			imports: [RootComponent],
			providers: [provideRouter(ROOT_ROUTES), { provide: MARKET_WORKER_FACTORY, useValue: workerFactory }],
		}).compileComponents();
		fixture = TestBed.createComponent(RootComponent);
		await TestBed.inject(Router).navigateByUrl('/');
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, RootHarness);
		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	it('should open the dashboard first and switch pages from the navigation', async () => {
		const dashboardPage = await loader.getHarness(DashboardPageHarness);

		expect(await harness.currentLinkText).toBe('Dashboard');
		expect(await dashboardPage.titleText).toBe('Market dashboard');

		await harness.openSettings();

		const settingsPage = await loader.getHarness(SettingsPageHarness);

		expect(await harness.currentLinkText).toBe('Settings');
		expect(await settingsPage.titleText).toBe('Producer settings');
	});

	it('should keep the paused run and a single producer while navigating between pages', async () => {
		const dashboardPage = await loader.getHarness(DashboardPageHarness);

		await dashboardPage.togglePause();
		await harness.openSettings();
		await harness.openDashboard();

		const returnedDashboardPage = await loader.getHarness(DashboardPageHarness);

		expect(await returnedDashboardPage.statusText).toBe('Paused');
		expect(workerFactory).toHaveBeenCalledTimes(1);
		expect(worker.postMessage).toHaveBeenNthCalledWith(1, {
			runId: 1,
			settings: ProducerSettingsConfig.Defaults,
			type: 'start',
		});
		expect(worker.postMessage).toHaveBeenNthCalledWith(2, { type: 'pause' });
		expect(worker.postMessage).toHaveBeenCalledTimes(2);
	});

	it('should redirect an unknown address to the dashboard', async () => {
		await TestBed.inject(Router).navigateByUrl('/unknown');

		expect(await harness.currentLinkText).toBe('Dashboard');
	});
});
