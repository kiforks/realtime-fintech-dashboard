import { TestBed } from '@angular/core/testing';

import { TableHostSpecComponent } from './components/table-host.spec.component';

import { TablePO } from './table.po';

describe('table', () => {
	let tablePO: TablePO;

	beforeEach(() => {
		TestBed.createComponent(TableHostSpecComponent);
		tablePO = new TablePO();
	});

	it('should make the scrolling region reachable by keyboard and name it after the table caption', async () => {
		await expect.element(tablePO.scroll).toHaveAttribute('tabindex', '0');
		await expect.element(tablePO.scroll).toHaveAccessibleName('Prices of the day');
	});

	it('should leave a region without a caption unnamed', async () => {
		await expect.element(tablePO.scrollWithoutCaption).not.toHaveAttribute('aria-labelledby');
	});

	it('should give every caption its own id', async () => {
		await expect.element(tablePO.caption).toHaveAttribute('id', 'app-table-caption-1');
		await expect.element(tablePO.secondCaption).toHaveAttribute('id', 'app-table-caption-2');
	});

	it('should align numeric headers and cells to the end and text ones to the start', async () => {
		await expect.element(tablePO.numericHeader).toHaveStyle({ textAlign: 'end' });
		await expect.element(tablePO.numericCell).toHaveStyle({ textAlign: 'end' });
		await expect.element(tablePO.textHeader).toHaveStyle({ textAlign: 'start' });
		await expect.element(tablePO.textCell).toHaveStyle({ textAlign: 'start' });
	});
});
