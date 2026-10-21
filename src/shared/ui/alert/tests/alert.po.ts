import { Locator, page } from 'vitest/browser';

export class AlertPO {
	public get alert(): Locator {
		return page.getByTestId('alert');
	}
}
