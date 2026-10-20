import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AppRouteConfig } from '~/shared/configs';

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './root.component.html',
	styleUrl: './root.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
	protected readonly routes = AppRouteConfig;
}
