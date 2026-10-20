import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export class DashboardPageRowHarness extends ComponentHarness {
	public static hostSelector = '[data-po="dashboard-page-row"]';

	public get cellTexts(): Promise<string[]> {
		return this.locatorForAll('th, td')().then(cells => Promise.all(cells.map(cell => cell.text())));
	}

	public static with(options: BaseHarnessFilters): HarnessPredicate<DashboardPageRowHarness> {
		return new HarnessPredicate(DashboardPageRowHarness, options);
	}
}
