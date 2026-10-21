import { Component, input } from '@angular/core';

import { TableCellType } from '../../models';

@Component({
	selector: '[appTableHeaderCell]',
	templateUrl: './table-header-cell.component.html',
	styleUrl: './table-header-cell.component.scss',
	host: { '[class]': 'type()' },
})
export class TableHeaderCellComponent {
	public readonly type = input<TableCellType, TableCellType | ''>('text', {
		alias: 'appTableHeaderCell',
		transform: type => (type === '' ? 'text' : type),
	});
}
