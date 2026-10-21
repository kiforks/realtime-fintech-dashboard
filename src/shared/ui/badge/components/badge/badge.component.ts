import { Component } from '@angular/core';

@Component({
	selector: 'output[appBadge]',
	template: '<ng-content />',
	styleUrl: './badge.component.scss',
})
export class BadgeComponent {}
