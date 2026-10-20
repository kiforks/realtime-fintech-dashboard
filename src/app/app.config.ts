import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ROOT_ROUTES } from '~pages';

export const appConfig: ApplicationConfig = {
	providers: [provideBrowserGlobalErrorListeners(), provideRouter(ROOT_ROUTES)],
};
