import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

type SettingsPageField = 'batch-interval' | 'instrument-count' | 'updates-per-batch';

export class SettingsPageHarness extends ComponentHarness {
	public static hostSelector = 'app-settings-page';

	public get titleElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="settings-page-title"]')();
	}

	public get titleText(): Promise<string> {
		return this.titleElement.then(title => title.text());
	}

	public get applyElement(): Promise<TestElement> {
		return this.locatorFor('[data-po="settings-page-apply"]')();
	}

	public async fieldValue(field: SettingsPageField): Promise<string> {
		const input = await this.locatorFor(`[data-po="settings-page-${field}"]`)();

		return input.getProperty<string>('value');
	}

	public async isFieldInvalid(field: SettingsPageField): Promise<boolean> {
		const input = await this.locatorFor(`[data-po="settings-page-${field}"]`)();
		const ariaInvalid = await input.getAttribute('aria-invalid');

		return ariaInvalid === 'true';
	}

	public async errorText(field: SettingsPageField): Promise<string | null> {
		const input = await this.locatorFor(`[data-po="settings-page-${field}"]`)();
		const describedBy = await input.getAttribute('aria-describedby');
		const error = await this.locatorForOptional(
			`[data-po="settings-page-${field}-error"][id="${describedBy ?? ''}"][role="alert"]`
		)();

		return error === null ? null : error.text();
	}

	public async clear(field: SettingsPageField): Promise<void> {
		const input = await this.locatorFor(`[data-po="settings-page-${field}"]`)();

		await input.clear();
		await input.blur();
	}

	public async fill(field: SettingsPageField, value: string): Promise<void> {
		const input = await this.locatorFor(`[data-po="settings-page-${field}"]`)();

		await input.clear();
		await input.sendKeys(value);
		await input.blur();
	}

	public async apply(): Promise<void> {
		const applyButton = await this.applyElement;

		await applyButton.click();
	}

	public static with(options: BaseHarnessFilters): HarnessPredicate<SettingsPageHarness> {
		return new HarnessPredicate(SettingsPageHarness, options);
	}
}
