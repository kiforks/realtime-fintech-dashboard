import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { RootComponent } from './root.component';
import { RootHarness } from './root.component.harness';
import { DashboardPageHarness, SettingsPageHarness } from '~modules/market/pages/testing';
import { ROOT_ROUTES } from '../../root.routes';

describe(RootComponent, () => {
	let fixture: ComponentFixture<RootComponent>;
	let harness: RootHarness;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RootComponent],
			providers: [provideRouter(ROOT_ROUTES)],
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

	it('should return to the dashboard from the settings page', async () => {
		await harness.openSettings();
		await harness.openDashboard();

		const dashboardPage = await loader.getHarness(DashboardPageHarness);

		expect(await harness.currentLinkText).toBe('Dashboard');
		expect(await dashboardPage.titleText).toBe('Market dashboard');
	});

	it('should redirect an unknown address to the dashboard', async () => {
		await TestBed.inject(Router).navigateByUrl('/unknown');

		expect(await harness.currentLinkText).toBe('Dashboard');
	});
});
