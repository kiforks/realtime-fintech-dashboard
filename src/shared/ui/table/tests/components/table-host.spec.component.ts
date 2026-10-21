import { Component } from '@angular/core';

import {
	TableCaptionComponent,
	TableCellComponent,
	TableComponent,
	TableHeaderCellComponent,
	TableRowComponent,
	TableScrollComponent,
} from '../../components';

@Component({
	selector: 'app-table-host-spec',
	imports: [
		TableCaptionComponent,
		TableCellComponent,
		TableComponent,
		TableHeaderCellComponent,
		TableRowComponent,
		TableScrollComponent,
	],
	templateUrl: './table-host.spec.component.html',
})
export class TableHostSpecComponent {}
