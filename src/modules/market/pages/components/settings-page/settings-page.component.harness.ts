import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

export class SettingsPageHarness extends ComponentHarness {
	public static hostSelector = 'app-settings-page';

	public get titleElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="settings-page-title"]')();
	}

	public get titleText(): Promise<string> {
		return this.titleElement.then(title => title.text());
	}

	public static with(options: BaseHarnessFilters): HarnessPredicate<SettingsPageHarness> {
		return new HarnessPredicate(SettingsPageHarness, options);
	}
}
