import { Routes } from '@angular/router';

import { DashboardPageComponent } from '~/pages/dashboard';
import { SettingsPageComponent } from '~/pages/settings';

import { AppRouteConfig } from '~/shared/configs';

export const ROOT_ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: AppRouteConfig.Dashboard },
	{ path: AppRouteConfig.Dashboard, component: DashboardPageComponent },
	{ path: AppRouteConfig.Settings, component: SettingsPageComponent },
	{ path: '**', redirectTo: AppRouteConfig.Dashboard },
];
