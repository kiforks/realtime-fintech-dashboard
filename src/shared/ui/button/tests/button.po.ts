import { Locator, page } from 'vitest/browser';

export class ButtonPO {
	public get secondary(): Locator {
		return page.getByTestId('button-secondary');
	}

	public get primary(): Locator {
		return page.getByTestId('button-primary');
	}
}
