'use client';

import React, { useState, useCallback, memo, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';

// MANDATORY: Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          Failed to load image
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && placeholder === 'empty' && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// MANDATORY: Virtual scrolling for large lists
interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = memo(({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
  className = "",
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const containerHeight = containerRef.current.clientHeight;
        
        const newStartIndex = Math.floor(scrollTop / itemHeight);
        const newEndIndex = Math.min(
          newStartIndex + Math.ceil(containerHeight / itemHeight) + overscan,
          items.length
        );
        
        setStartIndex(newStartIndex);
        setEndIndex(newEndIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [itemHeight, items.length, overscan]);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div 
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

// MANDATORY: Memoized component for expensive operations
interface ApplicationCardProps {
  application: {
    id: string;
    studentName: string;
    scholarshipName: string;
    status: string;
    appliedDate: string;
    updatedAt: string;
  };
  onUpdate: (id: string, updates: any) => void;
  className?: string;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = memo(({
  application,
  onUpdate,
  className = "",
}) => {
  const handleStatusChange = useCallback((newStatus: string) => {
    onUpdate(application.id, { status: newStatus });
  }, [application.id, onUpdate]);

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {application.studentName}
          </h3>
          <p className="text-sm text-gray-600">
            {application.scholarshipName}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            application.status === 'approved' ? 'bg-success-100 text-success-800' :
            application.status === 'rejected' ? 'bg-error-100 text-error-800' :
            'bg-warning-100 text-warning-800'
          }`}>
            {application.status}
          </span>
          <button
            onClick={() => handleStatusChange('approved')}
            className="text-success-600 hover:text-success-800"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return prevProps.application.id === nextProps.application.id &&
         prevProps.application.updatedAt === nextProps.application.updatedAt;
});

ApplicationCard.displayName = 'ApplicationCard';

// MANDATORY: Lazy loading wrapper
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded" />,
  threshold = 0.1,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

// MANDATORY: Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
      
      // Log slow renders in production
      if (renderTime > 100) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
};

// MANDATORY: Debounced input hook
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// MANDATORY: Throttled scroll hook
export const useThrottledScroll = (callback: () => void, delay: number = 100) => {
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      if (Date.now() - lastRun.current >= delay) {
        callback();
        lastRun.current = Date.now();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, delay]);
};
