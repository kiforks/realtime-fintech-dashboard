import { TestBed } from '@angular/core/testing';

import { NavLinkHostSpecComponent } from './nav-link-host.spec.component';
import { NavLinkComponent } from './nav-link.component';
import { NavLinkComponentPO } from './nav-link.component.po';

describe(NavLinkComponent, () => {
	let navLinkPO: NavLinkComponentPO;

	beforeEach(() => {
		TestBed.createComponent(NavLinkHostSpecComponent);
		navLinkPO = new NavLinkComponentPO();
	});

	it('should mark the current page by more than its colour', async () => {
		await expect.element(navLinkPO.current).toHaveStyle({ fontWeight: '600' });
		await expect.element(navLinkPO.link).not.toHaveStyle({ fontWeight: '600' });
	});
});
