import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from "./environments/environment";
import {enableProdMode} from "@angular/core";
import * as Sentry from "@sentry/angular-ivy";
import {BrowserTracing} from "@sentry/tracing";


Sentry.init({
  dsn: "https://55da8fee10eb45219882498888221bff@o1165930.ingest.sentry.io/4504915141459968",

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  tracesSampleRate: 0.5,


  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
    new Sentry.Replay()
  ],

});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
