import { SettingsPageFieldPO } from './settings-page-field.po';

import { Locator, page } from 'vitest/browser';

export class SettingsPageComponentPO {
	public get title(): Locator {
		return page.getByTestId('settings-page-title');
	}

	public get instrumentCount(): SettingsPageFieldPO {
		return new SettingsPageFieldPO('settings-page-instrument-count');
	}

	public get updatesPerBatch(): SettingsPageFieldPO {
		return new SettingsPageFieldPO('settings-page-updates-per-batch');
	}

	public get batchInterval(): SettingsPageFieldPO {
		return new SettingsPageFieldPO('settings-page-batch-interval');
	}

	public get applyButton(): Locator {
		return page.getByTestId('settings-page-apply');
	}

	public async apply(): Promise<void> {
		await this.applyButton.click();
	}
}
