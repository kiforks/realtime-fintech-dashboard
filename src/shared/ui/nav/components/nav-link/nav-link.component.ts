import { Component } from '@angular/core';

@Component({
	selector: 'a[appNavLink]',
	template: '<ng-content />',
	styleUrl: './nav-link.component.scss',
})
export class NavLinkComponent {}
