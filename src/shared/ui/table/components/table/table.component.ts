import { Component } from '@angular/core';

@Component({
	selector: 'table[appTable]',
	template: '<ng-content />',
	styleUrl: './table.component.scss',
})
export class TableComponent {}
