import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ROOT_ROUTES } from './routes';

import { MarketFeedService } from '~/entities/market';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(ROOT_ROUTES),
		provideAppInitializer(() => {
			inject(MarketFeedService);
		}),
	],
};
