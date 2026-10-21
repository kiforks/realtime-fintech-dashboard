import { Component } from '@angular/core';

@Component({
	selector: '[appNavList]',
	templateUrl: './nav-list.component.html',
	styleUrl: './nav-list.component.scss',
	host: { role: 'list' },
})
export class NavListComponent {}
