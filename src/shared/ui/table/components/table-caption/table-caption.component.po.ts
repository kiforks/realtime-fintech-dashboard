import { Locator, page } from 'vitest/browser';

export class TableCaptionComponentPO {
	public get caption(): Locator {
		return page.getByTestId('table-caption');
	}

	public get secondCaption(): Locator {
		return page.getByTestId('table-caption-second');
	}
}
