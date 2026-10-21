import { Routes } from '@angular/router';

import { DashboardPageComponent } from '~/pages/dashboard';

import { AppRouteConfig } from '~/shared/configs';

export const APP_ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: AppRouteConfig.Dashboard },
	{
		path: AppRouteConfig.Dashboard,
		component: DashboardPageComponent,
		title: () => $localize`Market dashboard · Realtime Fintech Dashboard`,
	},
	{
		path: AppRouteConfig.Settings,
		loadComponent: () => import('~/pages/settings').then(({ SettingsPageComponent }) => SettingsPageComponent),
		title: () => $localize`Producer settings · Realtime Fintech Dashboard`,
	},
	{ path: '**', redirectTo: AppRouteConfig.Dashboard },
];
