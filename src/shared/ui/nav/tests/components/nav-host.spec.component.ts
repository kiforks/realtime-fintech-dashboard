import { Component } from '@angular/core';

import { NavLinkComponent, NavListComponent } from '../../components';

@Component({
	selector: 'app-nav-host-spec',
	imports: [NavLinkComponent, NavListComponent],
	templateUrl: './nav-host.spec.component.html',
})
export class NavHostSpecComponent {}
