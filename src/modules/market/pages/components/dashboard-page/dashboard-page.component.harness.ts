import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

export class DashboardPageHarness extends ComponentHarness {
	public static hostSelector = 'app-dashboard-page';

	public get titleElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="dashboard-page-title"]')();
	}

	public get titleText(): Promise<string> {
		return this.titleElement.then(title => title.text());
	}

	public static with(options: BaseHarnessFilters): HarnessPredicate<DashboardPageHarness> {
		return new HarnessPredicate(DashboardPageHarness, options);
	}
}
