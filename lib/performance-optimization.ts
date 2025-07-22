"use client";

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// React.memo with custom comparison
export function createMemoizedComponent<T extends React.ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
): T {
  return React.memo(Component, areEqual) as T;
}

// Deep comparison for React.memo
export function deepEqual(prevProps: any, nextProps: any): boolean {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

// Shallow comparison for React.memo
export function shallowEqual(prevProps: any, nextProps: any): boolean {
  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
}

// Custom hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for throttling functions
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useRef<T>();
  const lastExecTime = useRef<number>(0);

  return useMemo(() => {
    const throttled = ((...args: any[]) => {
      const now = Date.now();
      if (now - lastExecTime.current >= delay) {
        lastExecTime.current = now;
        return callback(...args);
      }
    }) as T;

    throttledCallback.current = throttled;
    return throttled;
  }, [callback, delay]);
}

// Optimized state updates with batching
export function useBatchedState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const pendingUpdates = useRef<Array<(prev: T) => T>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchedSetState = useCallback((updater: (prev: T) => T) => {
    pendingUpdates.current.push(updater);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(currentState => {
        return pendingUpdates.current.reduce((state, updater) => updater(state), currentState);
      });
      pendingUpdates.current = [];
      timeoutRef.current = null;
    }, 0);
  }, []);

  return [state, batchedSetState] as const;
}

// Memoization with cache size limit
export function useMemoWithLimit<T>(
  factory: () => T,
  deps: React.DependencyList,
  limit: number = 10
): T {
  const cache = useRef<Map<string, T>>(new Map());
  const keyOrder = useRef<string[]>([]);

  return useMemo(() => {
    const key = JSON.stringify(deps);
    
    if (cache.current.has(key)) {
      return cache.current.get(key)!;
    }

    const value = factory();
    
    // Add to cache
    cache.current.set(key, value);
    keyOrder.current.push(key);

    // Remove oldest entries if over limit
    while (keyOrder.current.length > limit) {
      const oldestKey = keyOrder.current.shift()!;
      cache.current.delete(oldestKey);
    }

    return value;
  }, deps);
}

// Optimized event handlers
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, deps) as T;
}

// Virtual scrolling optimization
export function useVirtualization<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length
  );

  const visibleItems = useMemo(() => {
    return items.slice(
      Math.max(0, visibleStart - overscan),
      visibleEnd
    );
  }, [items, visibleStart, visibleEnd, overscan]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.max(0, visibleStart - overscan) * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    visibleStart: Math.max(0, visibleStart - overscan),
    visibleEnd
  };
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current++;
    const endTime = performance.now();
    
    if (startTime.current > 0) {
      renderTimes.current.push(endTime - startTime.current);
      
      // Keep only last 10 render times
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift();
      }
    }
  });

  // Record start time before render
  startTime.current = performance.now();

  const getStats = useCallback(() => {
    const times = renderTimes.current;
    const avgRenderTime = times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length 
      : 0;
    
    return {
      componentName,
      renderCount: renderCount.current,
      avgRenderTime: Number(avgRenderTime.toFixed(2)),
      lastRenderTime: times.length > 0 ? Number(times[times.length - 1].toFixed(2)) : 0,
      renderTimes: [...times]
    };
  }, [componentName]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance Monitor] ${componentName}:`, getStats());
    }
  });

  return { getStats };
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(node);
    
    return () => observer.disconnect();
  }, [node, options]);

  const ref = useCallback((node: Element | null) => {
    setNode(node);
  }, []);

  return [ref, isIntersecting];
}

// Optimized context value to prevent unnecessary re-renders
export function useStableValue<T>(value: T): T {
  const ref = useRef<T>(value);
  
  // Only update if value has actually changed (shallow comparison)
  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
}

// Bundle size optimization utilities
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFn);
};

// Resource preloader
export class ResourcePreloader {
  private static loadedResources = new Set<string>();
  private static loadingPromises = new Map<string, Promise<any>>();

  static async preloadImage(src: string): Promise<void> {
    if (this.loadedResources.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedResources.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    
    try {
      await promise;
    } finally {
      this.loadingPromises.delete(src);
    }
  }

  static async preloadComponent<T>(
    importFn: () => Promise<{ default: T }>
  ): Promise<T> {
    const moduleKey = importFn.toString();
    
    if (this.loadingPromises.has(moduleKey)) {
      return this.loadingPromises.get(moduleKey);
    }

    const promise = importFn().then(module => module.default);
    this.loadingPromises.set(moduleKey, promise);
    
    try {
      return await promise;
    } finally {
      this.loadingPromises.delete(moduleKey);
    }
  }
}

// Memory leak prevention
export function useCleanup(cleanup: () => void) {
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
}

// Optimized list rendering
export function useOptimizedList<T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string | number,
  renderItem: (item: T, index: number) => React.ReactNode,
  maxVisibleItems: number = 50
) {
  const [startIndex, setStartIndex] = useState(0);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, startIndex + maxVisibleItems);
  }, [items, startIndex, maxVisibleItems]);

  const renderedItems = useMemo(() => {
    return visibleItems.map((item, index) => {
      const actualIndex = startIndex + index;
      const key = keyExtractor(item, actualIndex);
      return {
        key,
        component: renderItem(item, actualIndex)
      };
    });
  }, [visibleItems, startIndex, keyExtractor, renderItem]);

  return {
    renderedItems,
    totalItems: items.length,
    visibleCount: visibleItems.length,
    setStartIndex,
    hasMore: startIndex + maxVisibleItems < items.length
  };
}

// Performance debugging utilities
export const PerformanceProfiler = {
  measure: <T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T => {
    return ((...args: any[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    }) as T;
  },

  time: (name: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(name);
    }
  },

  timeEnd: (name: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(name);
    }
  }
};

export default {
  createMemoizedComponent,
  deepEqual,
  shallowEqual,
  useDebounce,
  useThrottle,
  useBatchedState,
  useMemoWithLimit,
  useOptimizedCallback,
  useVirtualization,
  usePerformanceMonitor,
  useIntersectionObserver,
  useStableValue,
  lazyImport,
  ResourcePreloader,
  useCleanup,
  useOptimizedList,
  PerformanceProfiler
};