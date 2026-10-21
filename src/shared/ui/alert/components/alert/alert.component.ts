import { Component } from '@angular/core';

@Component({
	selector: 'p[appAlert]',
	template: '<ng-content />',
	styleUrl: './alert.component.scss',
	host: { role: 'alert' },
})
export class AlertComponent {}
