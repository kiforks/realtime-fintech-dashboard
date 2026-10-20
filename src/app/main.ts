import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app.config';

import { RootComponent } from './components';

bootstrapApplication(RootComponent, appConfig).catch((error: unknown) => {
	console.error(error);
});
