// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://462a3bd6c9bcb4597d87da5eacc5411d@o4509518726037504.ingest.us.sentry.io/4509694686855168",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Set environment
  environment: process.env.NODE_ENV || 'development',

  // Configure beforeSend to filter out certain errors
  beforeSend(event, hint) {
    // Don't send errors in development unless explicitly testing
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
      return null;
    }
    return event;
  },
});
