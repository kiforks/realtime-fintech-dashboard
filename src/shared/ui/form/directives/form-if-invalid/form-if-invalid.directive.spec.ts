import { TestBed } from '@angular/core/testing';

import { FormIfInvalidHostSpecComponent } from './form-if-invalid-host.spec.component';
import { FormIfInvalidDirective } from './form-if-invalid.directive';
import { FormIfInvalidDirectivePO } from './form-if-invalid.directive.po';

describe(FormIfInvalidDirective, () => {
	let formIfInvalidPO: FormIfInvalidDirectivePO;

	beforeEach(() => {
		TestBed.createComponent(FormIfInvalidHostSpecComponent);
		formIfInvalidPO = new FormIfInvalidDirectivePO();
	});

	it('should render nothing for a valid field', async () => {
		await expect.element(formIfInvalidPO.error).not.toBeInTheDocument();
	});

	it('should wait until the user leaves an invalid field and render it with the field state', async () => {
		await formIfInvalidPO.fill('7');

		await expect.element(formIfInvalidPO.error).not.toBeInTheDocument();

		await formIfInvalidPO.leave();

		await expect.element(formIfInvalidPO.error).toHaveTextContent('Enter an age from 18 to 99.');
	});

	it('should remove the view once the value is fixed', async () => {
		await formIfInvalidPO.fill('120');
		await formIfInvalidPO.leave();
		await formIfInvalidPO.fill('40');

		await expect.element(formIfInvalidPO.error).not.toBeInTheDocument();
	});
});
