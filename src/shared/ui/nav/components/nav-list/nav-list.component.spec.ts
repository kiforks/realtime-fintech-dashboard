import { TestBed } from '@angular/core/testing';

import { NavListHostSpecComponent } from './nav-list-host.spec.component';
import { NavListComponent } from './nav-list.component';
import { NavListComponentPO } from './nav-list.component.po';

describe(NavListComponent, () => {
	let navListPO: NavListComponentPO;

	beforeEach(() => {
		TestBed.createComponent(NavListHostSpecComponent);
		navListPO = new NavListComponentPO();
	});

	it('should keep the list semantics of an unstyled list', async () => {
		await expect.element(navListPO.list).toHaveAttribute('role', 'list');
	});
});
