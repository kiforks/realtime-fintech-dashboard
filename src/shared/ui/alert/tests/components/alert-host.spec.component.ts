import { Component } from '@angular/core';

import { AlertComponent } from '../../components';

@Component({
	selector: 'app-alert-host-spec',
	imports: [AlertComponent],
	template: '<p appAlert data-po="alert">The feed stopped.</p>',
})
export class AlertHostSpecComponent {}
