import { TestBed } from '@angular/core/testing';

import { FormHostSpecComponent } from './components/form-host.spec.component';

import { FormPO } from './form.po';

describe('form', () => {
	let formPO: FormPO;

	beforeEach(() => {
		TestBed.createComponent(FormHostSpecComponent);
		formPO = new FormPO();
	});

	it('should label the input and keep a valid field free of errors', async () => {
		await expect.element(formPO.age).toHaveAccessibleName('Age');
		await expect.element(formPO.age).toHaveAttribute('aria-invalid', 'false');
		await expect.element(formPO.age).not.toHaveAttribute('aria-describedby');
		await expect.element(formPO.ageError).not.toBeInTheDocument();
	});

	it('should wait until the user leaves an invalid field before showing its error', async () => {
		await formPO.fillAge('7');

		await expect.element(formPO.ageError).not.toBeInTheDocument();

		await formPO.leaveAge();

		await expect.element(formPO.ageError).toHaveTextContent('Enter an age from 18 to 99.');
		await expect.element(formPO.ageError).toHaveAttribute('role', 'alert');
	});

	it('should mark the invalid input and describe it with its error', async () => {
		await formPO.fillAge('120');
		await formPO.leaveAge();

		await expect.element(formPO.age).toHaveAttribute('aria-invalid', 'true');
		await expect.element(formPO.age).toHaveAccessibleDescription('Enter an age from 18 to 99.');
	});

	it('should remove the error once the value is fixed', async () => {
		await formPO.fillAge('120');
		await formPO.leaveAge();
		await formPO.fillAge('40');

		await expect.element(formPO.ageError).not.toBeInTheDocument();
		await expect.element(formPO.age).not.toHaveAttribute('aria-describedby');
	});
});
