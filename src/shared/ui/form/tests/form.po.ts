import { Locator, page, userEvent } from 'vitest/browser';

export class FormPO {
	public get age(): Locator {
		return page.getByTestId('form-age');
	}

	public get ageError(): Locator {
		return page.getByTestId('form-age-error');
	}

	public async fillAge(value: string): Promise<void> {
		await this.age.fill(value);
	}

	public async leaveAge(): Promise<void> {
		await userEvent.tab();
	}
}
