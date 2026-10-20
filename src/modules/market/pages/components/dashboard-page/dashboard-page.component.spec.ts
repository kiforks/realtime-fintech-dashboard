import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardPageHarness } from './dashboard-page.component.harness';

describe(DashboardPageComponent, () => {
	let harness: DashboardPageHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [DashboardPageComponent] }).compileComponents();
		harness = await TestbedHarnessEnvironment.harnessForFixture(
			TestBed.createComponent(DashboardPageComponent),
			DashboardPageHarness
		);
	});

	it('should show the page title', async () => {
		expect(await harness.titleText).toBe('Market dashboard');
	});
});
