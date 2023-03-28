import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from "./environments/environment";
import {enableProdMode} from "@angular/core";
import * as Sentry from "@sentry/angular-ivy";
import {BrowserTracing} from "@sentry/tracing";


Sentry.init({
  dsn: "https://55da8fee10eb45219882498888221bff@o1165930.ingest.sentry.io/4504915141459968",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  tracesSampleRate: 1.0,
});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
