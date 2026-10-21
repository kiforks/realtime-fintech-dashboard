import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './routes';

import { MarketFeedService } from '~/entities/market';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(APP_ROUTES),
		provideAppInitializer(() => {
			inject(MarketFeedService).start();
		}),
	],
};
