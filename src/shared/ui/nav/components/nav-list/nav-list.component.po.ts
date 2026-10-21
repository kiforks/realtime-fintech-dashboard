import { Locator, page } from 'vitest/browser';

export class NavListComponentPO {
	public get list(): Locator {
		return page.getByTestId('nav-list');
	}
}
