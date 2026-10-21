import { Locator, page } from 'vitest/browser';

export class TableCellComponentPO {
	public get text(): Locator {
		return page.getByTestId('table-cell-text');
	}

	public get numeric(): Locator {
		return page.getByTestId('table-cell-numeric');
	}
}
