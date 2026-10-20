import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MarketRouteConfig } from '~modules/market/pages';

@Component({
	selector: 'app-root',
	imports: [RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './root.component.html',
	styleUrl: './root.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
	protected readonly routes = MarketRouteConfig;
}
