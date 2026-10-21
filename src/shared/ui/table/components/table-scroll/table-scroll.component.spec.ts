import { TestBed } from '@angular/core/testing';

import { TableScrollHostSpecComponent } from './table-scroll-host.spec.component';
import { TableScrollComponent } from './table-scroll.component';
import { TableScrollComponentPO } from './table-scroll.component.po';

describe(TableScrollComponent, () => {
	let tableScrollPO: TableScrollComponentPO;

	beforeEach(() => {
		TestBed.createComponent(TableScrollHostSpecComponent);
		tableScrollPO = new TableScrollComponentPO();
	});

	it('should make the scrolling region reachable by keyboard and name it after the table caption', async () => {
		await expect.element(tableScrollPO.scroll).toHaveAttribute('tabindex', '0');
		await expect.element(tableScrollPO.scroll).toHaveAccessibleName('Prices of the day');
	});

	it('should leave a region without a caption unnamed', async () => {
		await expect.element(tableScrollPO.scrollWithoutCaption).not.toHaveAttribute('aria-labelledby');
	});
});
