import { Locator, page, userEvent } from 'vitest/browser';

export class AppRootComponentPO {
	public get content(): Locator {
		return page.getByTestId('app-root-content');
	}

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

	public async openSettingsWithKeyboard(): Promise<void> {
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard('{Enter}');
	}
}
