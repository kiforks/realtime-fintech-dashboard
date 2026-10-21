import { TestBed } from '@angular/core/testing';

import { AlertComponent } from '../components';
import { AlertHostSpecComponent } from './components/alert-host.spec.component';

import { AlertPO } from './alert.po';

describe(AlertComponent, () => {
	let alertPO: AlertPO;

	beforeEach(() => {
		TestBed.createComponent(AlertHostSpecComponent);
		alertPO = new AlertPO();
	});

	it('should announce its message to assistive technology as an alert', async () => {
		await expect.element(alertPO.alert).toHaveTextContent('The feed stopped.');
		await expect.element(alertPO.alert).toHaveAttribute('role', 'alert');
	});
});
