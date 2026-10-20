import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MarketFeedService } from '~/entities/market';
import { ROOT_ROUTES } from '~pages';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(ROOT_ROUTES),
		provideAppInitializer(() => {
			inject(MarketFeedService);
		}),
	],
};
