import { TestBed } from '@angular/core/testing';

import { TableCellHostSpecComponent } from './table-cell-host.spec.component';
import { TableCellComponent } from './table-cell.component';
import { TableCellComponentPO } from './table-cell.component.po';

describe(TableCellComponent, () => {
	let tableCellPO: TableCellComponentPO;

	beforeEach(() => {
		TestBed.createComponent(TableCellHostSpecComponent);
		tableCellPO = new TableCellComponentPO();
	});

	it('should align a numeric cell to the end and a text one to the start', async () => {
		await expect.element(tableCellPO.numeric).toHaveStyle({ textAlign: 'end' });
		await expect.element(tableCellPO.text).toHaveStyle({ textAlign: 'start' });
		await expect.element(tableCellPO.numericHeader).toHaveStyle({ textAlign: 'end' });
		await expect.element(tableCellPO.header).toHaveStyle({ textAlign: 'start' });
	});

	it('should set a header cell apart from a body cell', async () => {
		await expect.element(tableCellPO.header).toHaveStyle({ borderBottomStyle: 'solid', fontWeight: '600' });
		await expect.element(tableCellPO.numeric).toHaveStyle({ borderBottomStyle: 'none', fontWeight: '400' });
	});
});
