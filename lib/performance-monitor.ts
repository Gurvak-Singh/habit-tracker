"use client";

// Simple performance monitoring utility
export class PerformanceMonitor {
  private static timings: Map<string, number> = new Map();
  
  static startTiming(label: string) {
    this.timings.set(`${label}_start`, performance.now());
  }
  
  static endTiming(label: string) {
    const startTime = this.timings.get(`${label}_start`);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.timings.delete(`${label}_start`);
      return duration;
    }
    return 0;
  }
  
  static measureRender(componentName: string, renderFn: () => React.ReactElement) {
    this.startTiming(`${componentName}_render`);
    const result = renderFn();
    
    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(() => {
      this.endTiming(`${componentName}_render`);
    });
    
    return result;
  }
  
  static logMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('🧠 Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      });
    }
  }
  
  static logNetworkTiming() {
    if ('getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];
        console.log('🌐 Page Load Timing:', {
          domContentLoaded: `${(entry.domContentLoadedEventEnd - entry.navigationStart).toFixed(2)}ms`,
          loadComplete: `${(entry.loadEventEnd - entry.navigationStart).toFixed(2)}ms`,
          firstPaint: entry.responseEnd - entry.navigationStart
        });
      }
    }
  }
}

// Hook for component performance monitoring
export function usePerformanceMonitor(componentName: string) {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Note: This hook would need React import to work
    // For now, just providing the structure
    console.log(`🔧 Performance monitoring initialized for: ${componentName}`);
  }
}