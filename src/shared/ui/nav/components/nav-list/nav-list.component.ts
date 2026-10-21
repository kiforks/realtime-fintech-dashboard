import { Component } from '@angular/core';

@Component({
	selector: 'ul[appNavList]',
	template: '<ng-content />',
	styleUrl: './nav-list.component.scss',
	host: { role: 'list' },
})
export class NavListComponent {}
