import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsPageHarness } from './settings-page.component.harness';

describe(SettingsPageComponent, () => {
	let harness: SettingsPageHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({ imports: [SettingsPageComponent] }).compileComponents();
		harness = await TestbedHarnessEnvironment.harnessForFixture(
			TestBed.createComponent(SettingsPageComponent),
			SettingsPageHarness
		);
	});

	it('should show the page title', async () => {
		await expect(harness.titleText).resolves.toBe('Producer settings');
	});
});
