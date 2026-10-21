import { TestBed } from '@angular/core/testing';

import { FormErrorHostSpecComponent } from './form-error-host.spec.component';
import { FormErrorComponent } from './form-error.component';
import { FormErrorComponentPO } from './form-error.component.po';

describe(FormErrorComponent, () => {
	let formErrorPO: FormErrorComponentPO;

	beforeEach(() => {
		TestBed.createComponent(FormErrorHostSpecComponent);
		formErrorPO = new FormErrorComponentPO();
	});

	it('should announce its message to assistive technology as an alert', async () => {
		await expect.element(formErrorPO.error).toHaveTextContent('Enter an age from 18 to 99.');
		await expect.element(formErrorPO.error).toHaveAttribute('role', 'alert');
	});
});
