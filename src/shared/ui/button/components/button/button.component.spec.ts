import { TestBed } from '@angular/core/testing';

import { ButtonHostSpecComponent } from './button-host.spec.component';
import { ButtonComponent } from './button.component';
import { ButtonComponentPO } from './button.component.po';

describe(ButtonComponent, () => {
	let buttonPO: ButtonComponentPO;

	beforeEach(() => {
		TestBed.createComponent(ButtonHostSpecComponent);
		buttonPO = new ButtonComponentPO();
	});

	it('should render the secondary appearance when no appearance is given', async () => {
		await expect.element(buttonPO.secondary).toHaveTextContent('Pause');
		await expect.element(buttonPO.secondary).toHaveClass('secondary');
	});

	it('should render the primary appearance on request', async () => {
		await expect.element(buttonPO.primary).toHaveTextContent('Apply');
		await expect.element(buttonPO.primary).toHaveClass('primary');
	});

	it('should render a link as a button', async () => {
		await expect.element(buttonPO.link).toHaveClass('secondary');
		await expect.element(buttonPO.link).toHaveStyle({ display: 'inline-block', textDecorationLine: 'none' });
	});
});
