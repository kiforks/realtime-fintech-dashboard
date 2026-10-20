import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

export class RootHarness extends ComponentHarness {
	public static hostSelector = 'app-root';

	public get currentLinkElement(): Promise<TestElement> {
		return this.locatorFor('[aria-current="page"]')();
	}

	public get currentLinkText(): Promise<string> {
		return this.currentLinkElement.then(link => link.text());
	}

	public get dashboardLinkElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="root-dashboard-link"]')();
	}

	public get settingsLinkElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="root-settings-link"]')();
	}

	public async openDashboard(): Promise<void> {
		const dashboardLink = await this.dashboardLinkElement;

		await dashboardLink.click();
	}

	public async openSettings(): Promise<void> {
		const settingsLink = await this.settingsLinkElement;

		await settingsLink.click();
	}

	public static with(options: BaseHarnessFilters): HarnessPredicate<RootHarness> {
		return new HarnessPredicate(RootHarness, options);
	}
}
