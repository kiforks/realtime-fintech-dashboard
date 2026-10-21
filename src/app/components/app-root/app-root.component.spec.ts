import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { appConfig } from '../../app.config';

import { AppRootComponent } from './app-root.component';
import { AppRootComponentPO } from './app-root.component.po';
import { DashboardPageComponentPO } from '~/pages/dashboard/testing';
import { SettingsPageComponentPO } from '~/pages/settings/testing';

import { MarketFeedSettingsConfig } from '~/entities/market';
import { MARKET_WORKER_FACTORY, MarketWorker, MarketWorkerMock } from '~/entities/market/testing';
import type { Mock } from 'vitest';

describe(AppRootComponent, () => {
	let worker: MarketWorkerMock;
	let workerFactory: Mock<() => MarketWorker>;
	let router: Router;
	let title: Title;
	let appRootPO: AppRootComponentPO;
	let dashboardPagePO: DashboardPageComponentPO;
	let settingsPagePO: SettingsPageComponentPO;

	beforeEach(async () => {
		worker = new MarketWorkerMock();
		workerFactory = vi.fn<() => MarketWorker>(() => worker);
		TestBed.configureTestingModule({
			imports: [AppRootComponent],
			providers: [...appConfig.providers, MockProvider(MARKET_WORKER_FACTORY, workerFactory, 'useValue')],
		});
		router = TestBed.inject(Router);
		title = TestBed.inject(Title);
		TestBed.createComponent(AppRootComponent);
		await router.navigateByUrl('/');
		appRootPO = new AppRootComponentPO();
		dashboardPagePO = new DashboardPageComponentPO();
		settingsPagePO = new SettingsPageComponentPO();
	});

	it('should start the default run when the app starts', () => {
		expect(worker.postMessage).toHaveBeenCalledExactlyOnceWith({
			runId: 1,
			settings: MarketFeedSettingsConfig.Defaults,
			type: 'start',
		});
	});

	it('should open the dashboard first and switch pages from the navigation', async () => {
		await expect.element(appRootPO.dashboardLink).toHaveAttribute('aria-current', 'page');
		await expect.element(dashboardPagePO.title).toHaveTextContent('Market dashboard');

		await appRootPO.openSettings();

		await expect.element(appRootPO.settingsLink).toHaveAttribute('aria-current', 'page');
		await expect.element(appRootPO.dashboardLink).not.toHaveAttribute('aria-current');
		await expect.element(settingsPagePO.title).toHaveTextContent('Producer settings');
	});

	it('should leave focus alone on the first page and move it to the page content after each navigation', async () => {
		await expect.element(appRootPO.content).not.toHaveFocus();

		await appRootPO.openSettingsWithKeyboard();

		await expect.element(appRootPO.content).toHaveFocus();
		await expect.element(appRootPO.content).toHaveStyle({ outlineStyle: 'none' });

		await settingsPagePO.apply();

		await expect.element(dashboardPagePO.title).toHaveTextContent('Market dashboard');
		await expect.element(appRootPO.content).toHaveFocus();
	});

	it('should name every page in the document title', async () => {
		await expect.poll(() => title.getTitle()).toBe('Market dashboard · Realtime Fintech Dashboard');

		await appRootPO.openSettings();

		await expect.poll(() => title.getTitle()).toBe('Producer settings · Realtime Fintech Dashboard');
	});

	it('should keep the paused run and a single producer while navigating between pages', async () => {
		await dashboardPagePO.togglePause();
		await appRootPO.openSettings();

		await expect.element(settingsPagePO.title).toBeInTheDocument();

		await appRootPO.openDashboard();

		await expect.element(dashboardPagePO.status).toHaveTextContent('Paused');
		expect(workerFactory).toHaveBeenCalledTimes(1);
		expect(worker.postMessage).toHaveBeenCalledTimes(2);
		expect(worker.postMessage).toHaveBeenLastCalledWith({ type: 'pause' });
	});

	it('should redirect an unknown address to the dashboard', async () => {
		await router.navigateByUrl('/unknown');

		await expect.element(appRootPO.dashboardLink).toHaveAttribute('aria-current', 'page');
		await expect.element(dashboardPagePO.title).toHaveTextContent('Market dashboard');
	});
});
