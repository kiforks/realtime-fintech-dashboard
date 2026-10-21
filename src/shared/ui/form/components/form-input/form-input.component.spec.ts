import { TestBed } from '@angular/core/testing';

import { FormInputHostSpecComponent } from './form-input-host.spec.component';
import { FormInputComponent } from './form-input.component';
import { FormInputComponentPO } from './form-input.component.po';

describe(FormInputComponent, () => {
	let formInputPO: FormInputComponentPO;

	beforeEach(() => {
		TestBed.createComponent(FormInputHostSpecComponent);
		formInputPO = new FormInputComponentPO();
	});

	it('should keep a valid input free of errors', async () => {
		await expect.element(formInputPO.input).toHaveAttribute('aria-invalid', 'false');
		await expect.element(formInputPO.input).not.toHaveAttribute('aria-describedby');
	});

	it('should mark the invalid input and describe it with its error once the user leaves it', async () => {
		await formInputPO.fill('120');

		await expect.element(formInputPO.input).toHaveAttribute('aria-invalid', 'false');

		await formInputPO.leave();

		await expect.element(formInputPO.input).toHaveAttribute('aria-invalid', 'true');
		await expect.element(formInputPO.input).toHaveAccessibleDescription('Enter an age from 18 to 99.');
	});

	it('should show the shared focus ring when focused', async () => {
		await formInputPO.focus();

		await expect.element(formInputPO.input).toHaveFocus();
		await expect.element(formInputPO.input).toHaveStyle({ outlineOffset: '2px', outlineStyle: 'solid' });
	});

	it('should drop the error description once the value is fixed', async () => {
		await formInputPO.fill('120');
		await formInputPO.leave();
		await formInputPO.fill('40');

		await expect.element(formInputPO.input).toHaveAttribute('aria-invalid', 'false');
		await expect.element(formInputPO.input).not.toHaveAttribute('aria-describedby');
	});
});
