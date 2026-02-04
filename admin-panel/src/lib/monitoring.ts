import * as Sentry from '@sentry/react';

export const initMonitoring = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      enabled: true,
      environment: import.meta.env.MODE,
      // Lower sample rate for production to minimize performance overhead
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
    });
  }
};

export const setUser = (userId: string, email?: string) => {
  if (Sentry.getCurrentHub()?.getClient()) {
    Sentry.setUser({ id: userId, email });
  }
};

export { Sentry };
