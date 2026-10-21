import { Locator, page } from 'vitest/browser';

export class TableHeaderCellComponentPO {
	public get text(): Locator {
		return page.getByTestId('table-header-cell-text');
	}

	public get numeric(): Locator {
		return page.getByTestId('table-header-cell-numeric');
	}
}
