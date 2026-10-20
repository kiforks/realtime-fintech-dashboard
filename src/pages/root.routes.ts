import { Routes } from '@angular/router';

import { DashboardPageComponent, MarketRouteConfig, SettingsPageComponent } from '~modules/market/pages';

export const ROOT_ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: MarketRouteConfig.Dashboard },
	{ path: MarketRouteConfig.Dashboard, component: DashboardPageComponent },
	{ path: MarketRouteConfig.Settings, component: SettingsPageComponent },
	{ path: '**', redirectTo: MarketRouteConfig.Dashboard },
];
