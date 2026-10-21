import { Locator, page } from 'vitest/browser';

export class TablePO {
	public get scroll(): Locator {
		return page.getByTestId('table-scroll');
	}

	public get scrollWithoutCaption(): Locator {
		return page.getByTestId('table-scroll-without-caption');
	}

	public get caption(): Locator {
		return page.getByTestId('table-caption');
	}

	public get secondCaption(): Locator {
		return page.getByTestId('table-second-caption');
	}

	public get textHeader(): Locator {
		return page.getByTestId('table-text-header');
	}

	public get numericHeader(): Locator {
		return page.getByTestId('table-numeric-header');
	}

	public get textCell(): Locator {
		return page.getByTestId('table-text-cell');
	}

	public get numericCell(): Locator {
		return page.getByTestId('table-numeric-cell');
	}
}
