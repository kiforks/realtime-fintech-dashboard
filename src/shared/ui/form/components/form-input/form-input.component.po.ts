import { Locator, page, userEvent } from 'vitest/browser';

export class FormInputComponentPO {
	public get input(): Locator {
		return page.getByTestId('form-input');
	}

	public async fill(value: string): Promise<void> {
		await this.input.fill(value);
	}

	public async focusWithKeyboard(): Promise<void> {
		await userEvent.tab();
	}

	public async leave(): Promise<void> {
		await userEvent.tab();
	}
}
