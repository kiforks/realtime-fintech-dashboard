import { Locator, page, userEvent } from 'vitest/browser';

export class FormInputComponentPO {
	public get input(): Locator {
		return page.getByTestId('form-input');
	}

	public async fill(value: string): Promise<void> {
		await this.input.fill(value);
	}

	public async focus(): Promise<void> {
		await this.input.click();
	}

	public async leave(): Promise<void> {
		await userEvent.tab();
	}
}
