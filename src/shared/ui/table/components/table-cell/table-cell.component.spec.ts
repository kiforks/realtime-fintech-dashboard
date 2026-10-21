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

	it('should align cells by type and set header cells apart from body cells', async () => {
		await expect.element(tableCellPO.numeric).toHaveStyle({ textAlign: 'end' });
		await expect.element(tableCellPO.text).toHaveStyle({ textAlign: 'start' });
		await expect.element(tableCellPO.numericHeader).toHaveStyle({ textAlign: 'end' });
		await expect.element(tableCellPO.textHeader).toHaveStyle({ textAlign: 'start' });
		await expect.element(tableCellPO.textHeader).toHaveStyle({
			borderBottomStyle: 'solid',
			color: 'rgb(91, 102, 118)',
			fontSize: '13px',
			fontWeight: '600',
		});
		await expect.element(tableCellPO.text).toHaveStyle({ borderBottomStyle: 'none', fontSize: '15px' });
		await expect.element(tableCellPO.numeric).toHaveStyle({ borderBottomStyle: 'none', fontWeight: '400' });
	});
});
