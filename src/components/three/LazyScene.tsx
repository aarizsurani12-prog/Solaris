"use client";

import dynamic from "next/dynamic";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "../ErrorBoundary";

const Scene = dynamic(() => import("./Scene").then((m) => ({ default: m.Scene })), {
  ssr: false,
});

export const LazyScene = ({
  children,
  ...props
}: {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-cosmic-900">
          <div className="w-8 h-8 border border-white/20 rounded-full animate-pulse" />
        </div>
      }>
        <Scene {...props}>{children}</Scene>
      </Suspense>
    </ErrorBoundary>
  );
};
