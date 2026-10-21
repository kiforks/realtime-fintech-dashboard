import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AppRouteConfig } from '~/shared/configs';
import { NavLinkComponent, NavListComponent } from '~/shared/ui/nav';

@Component({
	selector: 'app-root',
	imports: [NavLinkComponent, NavListComponent, RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './app-root.component.html',
	styleUrl: './app-root.component.scss',
})
export class AppRootComponent {
	protected readonly routes = AppRouteConfig;
}
