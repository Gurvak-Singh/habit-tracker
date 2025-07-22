"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';

// Generic lazy loading hook with pagination
export function useLazyLoading<T>(
  items: T[],
  options: {
    pageSize?: number;
    initialPages?: number;
    loadMoreThreshold?: number;
  } = {}
) {
  const {
    pageSize = 20,
    initialPages = 1,
    loadMoreThreshold = 5
  } = options;

  const [loadedPages, setLoadedPages] = useState(initialPages);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate visible items based on loaded pages
  const visibleItems = useMemo(() => {
    return items.slice(0, loadedPages * pageSize);
  }, [items, loadedPages, pageSize]);

  const hasMore = visibleItems.length < items.length;
  const totalPages = Math.ceil(items.length / pageSize);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoadedPages(prev => Math.min(prev + 1, totalPages));
      setIsLoading(false);
    }, 200);
  }, [hasMore, isLoading, totalPages]);

  // Check if we should auto-load more based on threshold
  const shouldLoadMore = useCallback((index: number) => {
    return index >= visibleItems.length - loadMoreThreshold;
  }, [visibleItems.length, loadMoreThreshold]);

  // Reset when items change
  useEffect(() => {
    setLoadedPages(initialPages);
  }, [items.length, initialPages]);

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    shouldLoadMore,
    totalPages,
    currentPage: loadedPages,
    totalItems: items.length,
    visibleCount: visibleItems.length
  };
}

// Infinite scroll hook for automatic loading
export function useInfiniteScroll<T>(
  items: T[],
  options: {
    pageSize?: number;
    rootMargin?: string;
    threshold?: number;
  } = {}
) {
  const {
    pageSize = 20,
    rootMargin = '100px',
    threshold = 0.1
  } = options;

  const lazyLoading = useLazyLoading(items, { pageSize });
  const [sentinelRef, setSentinelRef] = useState<HTMLElement | null>(null);

  // Set up intersection observer for automatic loading
  useEffect(() => {
    if (!sentinelRef || !lazyLoading.hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && lazyLoading.hasMore && !lazyLoading.isLoading) {
          lazyLoading.loadMore();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(sentinelRef);

    return () => observer.disconnect();
  }, [sentinelRef, lazyLoading.hasMore, lazyLoading.isLoading, lazyLoading.loadMore, rootMargin, threshold]);

  return {
    ...lazyLoading,
    sentinelRef: setSentinelRef
  };
}

// Hook for lazy loading with search and filtering
export function useLazyLoadingWithFilter<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean,
  searchQuery: string = '',
  options: {
    pageSize?: number;
    debounceMs?: number;
    minSearchLength?: number;
  } = {}
) {
  const {
    pageSize = 20,
    debounceMs = 300,
    minSearchLength = 2
  } = options;

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minSearchLength) {
      return items;
    }
    return items.filter(item => filterFn(item, debouncedQuery));
  }, [items, debouncedQuery, filterFn, minSearchLength]);

  const lazyLoading = useLazyLoading(filteredItems, { pageSize });

  return {
    ...lazyLoading,
    searchQuery: debouncedQuery,
    isFiltering: debouncedQuery.length >= minSearchLength,
    filteredCount: filteredItems.length,
    originalCount: items.length
  };
}

// Lazy loading manager for complex data structures
export class LazyLoadingManager<T> {
  private items: T[] = [];
  private pageSize: number;
  private loadedPages: number = 1;
  private listeners: Set<() => void> = new Set();

  constructor(pageSize: number = 20) {
    this.pageSize = pageSize;
  }

  setItems(items: T[]) {
    this.items = items;
    this.loadedPages = 1;
    this.notifyListeners();
  }

  getVisibleItems(): T[] {
    return this.items.slice(0, this.loadedPages * this.pageSize);
  }

  hasMore(): boolean {
    return this.getVisibleItems().length < this.items.length;
  }

  loadMore(): void {
    if (this.hasMore()) {
      this.loadedPages++;
      this.notifyListeners();
    }
  }

  reset(): void {
    this.loadedPages = 1;
    this.notifyListeners();
  }

  getStats() {
    return {
      totalItems: this.items.length,
      visibleItems: this.getVisibleItems().length,
      loadedPages: this.loadedPages,
      totalPages: Math.ceil(this.items.length / this.pageSize),
      hasMore: this.hasMore()
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Virtual scrolling utilities for very large datasets
export interface VirtualScrollOptions {
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  overscan?: number;
  scrollElement?: HTMLElement;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    scrollElement
  } = options;

  const [scrollTop, setScrollTop] = useState(0);

  const isFixedHeight = typeof itemHeight === 'number';
  const fixedItemHeight = isFixedHeight ? itemHeight as number : 0;

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    if (isFixedHeight) {
      const startIndex = Math.floor(scrollTop / fixedItemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / fixedItemHeight) + overscan,
        items.length
      );
      
      return {
        start: Math.max(0, startIndex - overscan),
        end: endIndex,
        offsetY: Math.max(0, startIndex - overscan) * fixedItemHeight
      };
    } else {
      // For dynamic heights, we'd need to implement a more complex calculation
      // This is a simplified version
      return {
        start: 0,
        end: Math.min(items.length, 50), // Fallback to showing first 50 items
        offsetY: 0
      };
    }
  }, [scrollTop, containerHeight, items.length, isFixedHeight, fixedItemHeight, overscan]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  const totalHeight = isFixedHeight
    ? items.length * fixedItemHeight
    : items.length * 50; // Fallback estimation

  // Handle scroll events
  useEffect(() => {
    const element = scrollElement || window;
    
    const handleScroll = () => {
      const scrollY = scrollElement ? scrollElement.scrollTop : window.scrollY;
      setScrollTop(scrollY);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [scrollElement]);

  return {
    visibleItems,
    visibleRange,
    totalHeight,
    offsetY: visibleRange.offsetY,
    scrollTop
  };
}

// Lazy image loading hook
export function useLazyImage(src: string, options: {
  rootMargin?: string;
  threshold?: number;
  placeholder?: string;
} = {}) {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    placeholder = ''
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imgRef[0]) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(imgRef[0]);
    return () => observer.disconnect();
  }, [imgRef[0], rootMargin, threshold]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError('Failed to load image');
      img.src = src;
    }
  }, [isInView, src]);

  return {
    src: isLoaded ? src : placeholder,
    isLoaded,
    isInView,
    error,
    ref: imgRef[1]
  };
}

// Batch loading utility for API calls
export class BatchLoader<K, V> {
  private batchSize: number;
  private maxWaitTime: number;
  private loader: (keys: K[]) => Promise<Map<K, V>>;
  private queue: Array<{
    key: K;
    resolve: (value: V | undefined) => void;
    reject: (error: Error) => void;
  }> = [];
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(
    loader: (keys: K[]) => Promise<Map<K, V>>,
    options: {
      batchSize?: number;
      maxWaitTime?: number;
    } = {}
  ) {
    this.loader = loader;
    this.batchSize = options.batchSize || 10;
    this.maxWaitTime = options.maxWaitTime || 100;
  }

  load(key: K): Promise<V | undefined> {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (this.timeoutId === null) {
        this.timeoutId = setTimeout(() => this.flush(), this.maxWaitTime);
      }
    });
  }

  private async flush(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const currentQueue = this.queue.splice(0, this.batchSize);
    if (currentQueue.length === 0) return;

    try {
      const keys = currentQueue.map(item => item.key);
      const results = await this.loader(keys);

      currentQueue.forEach(({ key, resolve }) => {
        resolve(results.get(key));
      });
    } catch (error) {
      currentQueue.forEach(({ reject }) => {
        reject(error as Error);
      });
    }
  }
}

export default {
  useLazyLoading,
  useInfiniteScroll,
  useLazyLoadingWithFilter,
  LazyLoadingManager,
  useVirtualScroll,
  useLazyImage,
  BatchLoader
};