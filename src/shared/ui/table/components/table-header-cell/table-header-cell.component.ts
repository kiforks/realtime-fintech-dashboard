import { Component, input } from '@angular/core';

import { TableCellType } from '../../models';

@Component({
	selector: 'th[appTableHeaderCell]',
	templateUrl: './table-header-cell.component.html',
	styleUrl: './table-header-cell.component.scss',
	host: { '[class.app-table-header-cell-numeric]': "type() === 'numeric'" },
})
export class TableHeaderCellComponent {
	public readonly type = input<TableCellType, TableCellType | ''>('text', {
		alias: 'appTableHeaderCell',
		transform: type => (type === '' ? 'text' : type),
	});
}
