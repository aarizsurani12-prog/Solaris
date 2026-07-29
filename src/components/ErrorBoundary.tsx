"use client";

import { Component, type ReactNode, type ComponentType } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error!} />;
      }
      return (
        <div className="flex h-screen items-center justify-center bg-cosmic-900 text-white/40 text-sm">
          3D rendering unavailable
        </div>
      );
    }
    return this.props.children;
  }
}
