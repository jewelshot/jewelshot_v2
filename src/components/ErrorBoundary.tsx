/**
 * Error Boundary
 * React error boundary for graceful error handling
 */

'use client';

import { Component, type ReactNode } from 'react';
import { Button } from './atoms/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-6">
          <div className="max-w-md text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                <svg
                  className="h-10 w-10 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-3 text-2xl font-bold text-white">Something went wrong</h1>

            {/* Description */}
            <p className="mb-6 text-gray-400">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {/* Error Details (dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-left">
                <p className="mb-2 text-sm font-medium text-red-400">Error Details:</p>
                <p className="text-xs text-red-300">{this.state.error.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button variant="primary" fullWidth onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
