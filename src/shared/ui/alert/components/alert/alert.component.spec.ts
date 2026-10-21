import { TestBed } from '@angular/core/testing';

import { AlertHostSpecComponent } from './alert-host.spec.component';
import { AlertComponent } from './alert.component';
import { AlertComponentPO } from './alert.component.po';

describe(AlertComponent, () => {
	let alertPO: AlertComponentPO;

	beforeEach(() => {
		TestBed.createComponent(AlertHostSpecComponent);
		alertPO = new AlertComponentPO();
	});

	it('should announce its message to assistive technology as an alert', async () => {
		await expect.element(alertPO.alert).toHaveTextContent('The feed stopped.');
		await expect.element(alertPO.alert).toHaveAttribute('role', 'alert');
	});
});
