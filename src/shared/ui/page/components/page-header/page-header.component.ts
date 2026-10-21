import { Component } from '@angular/core';

@Component({
	selector: 'header[appPageHeader]',
	template: '<ng-content />',
	styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {}
