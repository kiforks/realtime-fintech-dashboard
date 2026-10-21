import { Locator, page } from 'vitest/browser';

export class NavPO {
	public get list(): Locator {
		return page.getByTestId('nav-list');
	}

	public get currentLink(): Locator {
		return page.getByTestId('nav-current-link');
	}

	public get link(): Locator {
		return page.getByTestId('nav-link');
	}
}
