"use client";

import { Skeleton } from "@qco/ui/components/skeleton";

interface CheckoutSectionSkeletonProps {
  title?: string;
  type: "contact" | "address" | "shipping" | "payment" | "legal" | "summary";
  className?: string;
}

export function CheckoutSectionSkeleton({
  title,
  type,
  className = "",
}: CheckoutSectionSkeletonProps) {
  const renderSection = () => {
    switch (type) {
      case "contact":
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full animate-pulse" />
              <Skeleton className="h-10 w-full animate-pulse" />
              <Skeleton className="h-10 w-full animate-pulse" />
              <Skeleton className="h-10 w-full animate-pulse" />
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 animate-pulse" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
              </div>
            </div>
          </div>
        );

      case "shipping":
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-44 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 space-y-3 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32 animate-pulse" />
                      <Skeleton className="h-4 w-48 animate-pulse" />
                    </div>
                    <Skeleton className="h-4 w-16 animate-pulse" />
                  </div>
                  <Skeleton className="h-4 w-24 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 animate-pulse" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-36 animate-pulse" />
                      <Skeleton className="h-4 w-48 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "legal":
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 animate-pulse" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded animate-pulse" />
                  <Skeleton className="h-4 w-64 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="border rounded-lg p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
            <Skeleton className="h-6 w-32 animate-pulse" />

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex space-x-3 animate-in fade-in duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Skeleton className="h-16 w-16 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full animate-pulse" />
                    <Skeleton className="h-4 w-24 animate-pulse" />
                    <Skeleton className="h-4 w-16 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 animate-pulse" />
                <Skeleton className="h-4 w-16 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 animate-pulse" />
                <Skeleton className="h-4 w-16 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 animate-pulse" />
                <Skeleton className="h-4 w-16 animate-pulse" />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16 animate-pulse" />
                <Skeleton className="h-6 w-20 animate-pulse" />
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-lg animate-pulse bg-gradient-to-r from-gray-200 to-gray-300" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`animate-in fade-in duration-500 ${className}`}>
      {title && <Skeleton className="h-6 w-48 mb-4 animate-pulse" />}
      {renderSection()}
    </div>
  );
}
