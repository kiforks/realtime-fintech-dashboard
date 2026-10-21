import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app.config';

import { AppRootComponent } from './components';

bootstrapApplication(AppRootComponent, appConfig).catch((error: unknown) => {
	console.error(error);
});
