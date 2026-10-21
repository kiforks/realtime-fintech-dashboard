import { Component, input } from '@angular/core';

import { TableCellType } from '../../models';

@Component({
	selector: '[appTableCell]',
	templateUrl: './table-cell.component.html',
	styleUrl: './table-cell.component.scss',
	host: { '[class]': 'type()' },
})
export class TableCellComponent {
	public readonly type = input.required<TableCellType, TableCellType | ''>({
		alias: 'appTableCell',
		transform: type => (type === '' ? 'text' : type),
	});
}
