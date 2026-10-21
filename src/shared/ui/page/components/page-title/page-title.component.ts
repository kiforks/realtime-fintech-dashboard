import { Component } from '@angular/core';

@Component({
	selector: 'h1[appPageTitle]',
	template: '<ng-content />',
	styleUrl: './page-title.component.scss',
})
export class PageTitleComponent {}
