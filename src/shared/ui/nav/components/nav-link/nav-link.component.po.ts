import { Locator, page } from 'vitest/browser';

export class NavLinkComponentPO {
	public get current(): Locator {
		return page.getByTestId('nav-link-current');
	}

	public get link(): Locator {
		return page.getByTestId('nav-link');
	}
}
