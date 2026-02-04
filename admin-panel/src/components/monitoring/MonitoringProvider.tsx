import React, { useEffect, useState } from 'react';

/**
 * MonitoringProvider lazy-loads Sentry and wraps the application in an ErrorBoundary
 * once the SDK is initialized. This minimizes the initial bundle size.
 */
export const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [SentryModule, setSentryModule] = useState<any>(null);

  useEffect(() => {
    // Delay monitoring initialization until after the main thread is free
    const timer = setTimeout(() => {
      import('@/lib/monitoring').then((mod) => {
        mod.initMonitoring();
        setSentryModule(mod.Sentry);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!SentryModule) {
    return <>{children}</>;
  }

  const { ErrorBoundary } = SentryModule;

  return (
    <ErrorBoundary 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              The application encountered an unexpected error. Our team has been notified.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
