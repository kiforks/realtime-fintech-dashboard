import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { filter, skip } from 'rxjs';

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

	private readonly _content = viewChild.required<ElementRef<HTMLElement>>('content');
	private readonly _router = inject(Router);

	constructor() {
		this._setup();
	}

	private _setup(): void {
		this._router.events
			.pipe(
				filter(event => event instanceof NavigationEnd),
				skip(1),
				takeUntilDestroyed()
			)
			.subscribe(() => this._content().nativeElement.focus());
	}
}
