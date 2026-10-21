import { TestBed } from '@angular/core/testing';

import { TableHeaderCellHostSpecComponent } from './table-header-cell-host.spec.component';
import { TableHeaderCellComponent } from './table-header-cell.component';
import { TableHeaderCellComponentPO } from './table-header-cell.component.po';

describe(TableHeaderCellComponent, () => {
	let tableHeaderCellPO: TableHeaderCellComponentPO;

	beforeEach(() => {
		TestBed.createComponent(TableHeaderCellHostSpecComponent);
		tableHeaderCellPO = new TableHeaderCellComponentPO();
	});

	it('should align a numeric header to the end and a text one to the start', async () => {
		await expect.element(tableHeaderCellPO.numeric).toHaveStyle({ textAlign: 'end' });
		await expect.element(tableHeaderCellPO.text).toHaveStyle({ textAlign: 'start' });
	});
});
