import { Routes } from '@angular/router';

import { DashboardPageComponent, SettingsPageComponent } from '~modules/market/pages';

import { AppRouteConfig } from '~/shared/configs';

export const ROOT_ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: AppRouteConfig.Dashboard },
	{ path: AppRouteConfig.Dashboard, component: DashboardPageComponent },
	{ path: AppRouteConfig.Settings, component: SettingsPageComponent },
	{ path: '**', redirectTo: AppRouteConfig.Dashboard },
];
