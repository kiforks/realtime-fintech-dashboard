import { Locator, page, userEvent } from 'vitest/browser';

export class SettingsPageFieldPO {
	constructor(private readonly _testId: string) {}

	public get input(): Locator {
		return page.getByTestId(this._testId);
	}

	public get error(): Locator {
		return page.getByTestId(`${this._testId}-error`);
	}

	public async fill(value: string): Promise<void> {
		await this.input.fill(value);
		await userEvent.tab();
	}

	public async clear(): Promise<void> {
		await this.input.clear();
		await userEvent.tab();
	}
}
