import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

declare global {
	interface Window { cordova: any; }
}

/*
if (window.cordova) {
	const onDeviceReady = () => {
		platformBrowserDynamic().bootstrapModule(AppModule);
	};
	document.addEventListener('deviceready', onDeviceReady, false);
} else {
	platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));  
}
*/
const onDeviceReady = () => {
	platformBrowserDynamic().bootstrapModule(AppModule);
};
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('DOMContentLoaded', onDeviceReady, false);
