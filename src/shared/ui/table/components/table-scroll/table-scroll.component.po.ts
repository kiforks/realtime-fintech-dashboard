import { Locator, page } from 'vitest/browser';

export class TableScrollComponentPO {
	public get scroll(): Locator {
		return page.getByTestId('table-scroll');
	}

	public get scrollWithoutCaption(): Locator {
		return page.getByTestId('table-scroll-without-caption');
	}
}
