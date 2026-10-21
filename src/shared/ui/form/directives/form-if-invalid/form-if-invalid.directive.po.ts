import { Locator, page, userEvent } from 'vitest/browser';

export class FormIfInvalidDirectivePO {
	public get input(): Locator {
		return page.getByTestId('form-if-invalid-input');
	}

	public get error(): Locator {
		return page.getByTestId('form-if-invalid-error');
	}

	public async fill(value: string): Promise<void> {
		await this.input.fill(value);
	}

	public async leave(): Promise<void> {
		await userEvent.tab();
	}
}
