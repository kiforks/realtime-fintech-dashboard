import { Component } from '@angular/core';

import { NavLinkComponent, NavListComponent } from '../../components';

@Component({
	selector: 'app-nav-host-spec',
	imports: [NavLinkComponent, NavListComponent],
	template: `
		<nav aria-label="Main">
			<ul appNavList data-po="nav-list">
				<li><a appNavLink aria-current="page" href="#dashboard" data-po="nav-current-link">Dashboard</a></li>

				<li><a appNavLink href="#settings" data-po="nav-link">Settings</a></li>
			</ul>
		</nav>
	`,
})
export class NavHostSpecComponent {}
