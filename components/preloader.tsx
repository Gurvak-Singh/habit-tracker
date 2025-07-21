"use client";

import { useEffect, useState } from 'react';

interface PreloaderProps {
  children: React.ReactNode;
}

export function Preloader({ children }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      try {
        // Preload fonts
        if ('fonts' in document) {
          await (document as any).fonts.ready;
        }

        // Small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.warn('Resource preloading failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadResources();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            TrackMyHabits
          </h2>
          <p className="text-slate-600 dark:text-slate-300 animate-pulse">
            Loading your habit tracker...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}