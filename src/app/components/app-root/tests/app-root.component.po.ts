import { Locator, page } from 'vitest/browser';

export class AppRootComponentPO {
	public get dashboardLink(): Locator {
		return page.getByTestId('app-root-dashboard-link');
	}

	public get settingsLink(): Locator {
		return page.getByTestId('app-root-settings-link');
	}

	public async openDashboard(): Promise<void> {
		await this.dashboardLink.click();
	}

	public async openSettings(): Promise<void> {
		await this.settingsLink.click();
	}
}
