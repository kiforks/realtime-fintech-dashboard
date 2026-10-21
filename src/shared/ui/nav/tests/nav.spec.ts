import { TestBed } from '@angular/core/testing';

import { NavHostSpecComponent } from './components/nav-host.spec.component';

import { NavPO } from './nav.po';

describe('nav', () => {
	let navPO: NavPO;

	beforeEach(() => {
		TestBed.createComponent(NavHostSpecComponent);
		navPO = new NavPO();
	});

	it('should keep the list semantics of an unstyled list', async () => {
		await expect.element(navPO.list).toHaveAttribute('role', 'list');
	});

	it('should mark the current page by more than its colour', async () => {
		await expect.element(navPO.currentLink).toHaveStyle({ fontWeight: '600' });
		await expect.element(navPO.link).not.toHaveStyle({ fontWeight: '600' });
	});
});
