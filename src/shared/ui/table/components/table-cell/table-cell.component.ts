import { Component, input } from '@angular/core';

import { TableCellType } from '../../models';

@Component({
	selector: 'td[appTableCell], th[appTableCell]',
	templateUrl: './table-cell.component.html',
	styleUrl: './table-cell.component.scss',
	host: { '[class]': 'type()' },
})
export class TableCellComponent {
	public readonly type = input<TableCellType, TableCellType | ''>('text', {
		alias: 'appTableCell',
		transform: type => (type === '' ? 'text' : type),
	});
}
