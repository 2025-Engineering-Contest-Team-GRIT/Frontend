'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class CSRErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error; reset: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CSR Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error, reset }: { error?: Error; reset: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
    <div className="text-red-500 text-5xl mb-4">⚠️</div>
    <h2 className="text-xl font-semibold text-slate-800 mb-2">오류가 발생했습니다</h2>
    <p className="text-slate-600 mb-4">
      {error?.message || "페이지를 불러오는 중 문제가 발생했습니다."}
    </p>
    <div className="space-x-3">
      <button 
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        다시 시도
      </button>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        페이지 새로고침
      </button>
    </div>
  </div>
);

// Hook for handling async errors in components
export const useErrorHandler = () => {
  return React.useCallback((error: Error) => {
    console.error('Async error occurred:', error);
    // You could also throw the error to be caught by the error boundary
    throw error;
  }, []);
};