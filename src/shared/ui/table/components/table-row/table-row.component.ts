import { Component } from '@angular/core';

@Component({
	selector: 'tr[appTableRow]',
	template: '<ng-content />',
	styleUrl: './table-row.component.scss',
})
export class TableRowComponent {}
