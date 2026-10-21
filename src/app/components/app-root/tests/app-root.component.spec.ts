import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';

import { AppRootComponent } from '../app-root.component';
import { AppRootComponentPO } from './app-root.component.po';
import { DashboardPageComponentPO } from '~/pages/dashboard/testing';
import { SettingsPageComponentPO } from '~/pages/settings/testing';
import { APP_ROUTES } from '../../../routes';

import { MarketFeedService } from '~/entities/market';
import { MARKET_WORKER_FACTORY, MarketWorker, MarketWorkerMock } from '~/entities/market/testing';
import type { Mock } from 'vitest';

describe(AppRootComponent, () => {
	let worker: MarketWorkerMock;
	let workerFactory: Mock<() => MarketWorker>;
	let marketFeedService: MarketFeedService;
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
			providers: [provideRouter(APP_ROUTES), MockProvider(MARKET_WORKER_FACTORY, workerFactory, 'useValue')],
		});
		marketFeedService = TestBed.inject(MarketFeedService);
		marketFeedService.start();
		router = TestBed.inject(Router);
		title = TestBed.inject(Title);
		TestBed.createComponent(AppRootComponent);
		await router.navigateByUrl('/');
		appRootPO = new AppRootComponentPO();
		dashboardPagePO = new DashboardPageComponentPO();
		settingsPagePO = new SettingsPageComponentPO();
	});

	it('should open the dashboard first and switch pages from the navigation', async () => {
		await expect.element(appRootPO.dashboardLink).toHaveAttribute('aria-current', 'page');
		await expect.element(dashboardPagePO.title).toHaveTextContent('Market dashboard');

		await appRootPO.openSettings();

		await expect.element(appRootPO.settingsLink).toHaveAttribute('aria-current', 'page');
		await expect.element(appRootPO.dashboardLink).not.toHaveAttribute('aria-current');
		await expect.element(settingsPagePO.title).toHaveTextContent('Producer settings');
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
