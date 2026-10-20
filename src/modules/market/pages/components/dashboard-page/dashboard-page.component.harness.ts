import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { DashboardPageRowHarness } from './dashboard-page-row.harness';

export class DashboardPageHarness extends ComponentHarness {
	public static hostSelector = 'app-dashboard-page';

	public get titleElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="dashboard-page-title"]')();
	}

	public get titleText(): Promise<string> {
		return this.titleElement.then(title => title.text());
	}

	public get statusText(): Promise<string> {
		return this.locatorFor('[data-po="dashboard-page-status"]')().then(status => status.text());
	}

	public get rateText(): Promise<string> {
		return this.locatorFor('[data-po="dashboard-page-rate"]')().then(rate => rate.text());
	}

	public get toggleElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="dashboard-page-toggle"]')();
	}

	public get toggleText(): Promise<string> {
		return this.toggleElement.then(toggle => toggle.text());
	}

	public get isToggleDisabled(): Promise<boolean> {
		return this.toggleElement.then(toggle => toggle.getProperty<boolean>('disabled'));
	}

	public get errorText(): Promise<string | null> {
		return this.locatorForOptional('[data-po="dashboard-page-error"]')().then(error => error?.text() ?? null);
	}

	public get rows(): Promise<string[][]> {
		return this.locatorForAll(DashboardPageRowHarness)().then(rows => Promise.all(rows.map(row => row.cellTexts)));
	}

	public async togglePause(): Promise<void> {
		const toggle = await this.toggleElement;

		await toggle.click();
	}

	public static with(options: BaseHarnessFilters): HarnessPredicate<DashboardPageHarness> {
		return new HarnessPredicate(DashboardPageHarness, options);
	}
}
