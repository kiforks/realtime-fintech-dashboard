import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from '../components';
import { ButtonHostSpecComponent } from './components/button-host.spec.component';

import { ButtonPO } from './button.po';

describe(ButtonComponent, () => {
	let buttonPO: ButtonPO;

	beforeEach(() => {
		TestBed.createComponent(ButtonHostSpecComponent);
		buttonPO = new ButtonPO();
	});

	it('should render the secondary appearance when no appearance is given', async () => {
		await expect.element(buttonPO.secondary).toHaveTextContent('Pause');
		await expect.element(buttonPO.secondary).toHaveClass('secondary');
	});

	it('should render the primary appearance on request', async () => {
		await expect.element(buttonPO.primary).toHaveTextContent('Apply');
		await expect.element(buttonPO.primary).toHaveClass('primary');
	});
});
