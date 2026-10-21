import { Locator, page } from 'vitest/browser';

export class AlertComponentPO {
	public get alert(): Locator {
		return page.getByTestId('alert');
	}
}
