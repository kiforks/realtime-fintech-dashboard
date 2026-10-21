import { Locator, page } from 'vitest/browser';

export class ButtonComponentPO {
	public get secondary(): Locator {
		return page.getByTestId('button-secondary');
	}

	public get primary(): Locator {
		return page.getByTestId('button-primary');
	}

	public get link(): Locator {
		return page.getByTestId('button-link');
	}
}
