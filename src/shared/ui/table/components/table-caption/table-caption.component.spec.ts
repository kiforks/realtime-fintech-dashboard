import { TestBed } from '@angular/core/testing';

import { TableCaptionHostSpecComponent } from './table-caption-host.spec.component';
import { TableCaptionComponent } from './table-caption.component';
import { TableCaptionComponentPO } from './table-caption.component.po';

describe(TableCaptionComponent, () => {
	let tableCaptionPO: TableCaptionComponentPO;

	beforeEach(() => {
		TestBed.createComponent(TableCaptionHostSpecComponent);
		tableCaptionPO = new TableCaptionComponentPO();
	});

	it('should give every caption its own id', async () => {
		await expect.element(tableCaptionPO.caption).toHaveAttribute('id', 'app-table-caption-1');
		await expect.element(tableCaptionPO.secondCaption).toHaveAttribute('id', 'app-table-caption-2');
	});
});
