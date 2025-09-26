'use client';

import { useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { ActionButton } from './components/ActionButton';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <AppShell title="Something went wrong">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-text-secondary">
            We encountered an unexpected error. Don't worry, your progress is saved.
          </p>
        </div>

        <div className="space-y-3">
          <ActionButton
            onClick={reset}
            variant="primary"
            className="w-full"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </ActionButton>
          
          <ActionButton
            onClick={() => window.location.href = '/'}
            variant="secondary"
            className="w-full"
          >
            Go Home
          </ActionButton>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="glass-card p-4 rounded-lg text-left">
            <h3 className="font-medium text-text-primary mb-2">Error Details:</h3>
            <pre className="text-xs text-text-secondary overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </AppShell>
  );
}
