import { Component } from '@angular/core';

@Component({
	selector: 'p[appAlert]',
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
	host: { role: 'alert' },
})
export class AlertComponent {}
