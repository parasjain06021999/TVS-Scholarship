'use client';

import { useState, useEffect, useCallback } from 'react';

// MANDATORY: Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

// MANDATORY: Responsive hook
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < BREAKPOINTS.mobile : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.tablet : false,
    isLargeDesktop: typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.desktop : false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
        isLargeDesktop: width >= BREAKPOINTS.desktop,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// MANDATORY: Responsive component wrapper
interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  mobile,
  tablet,
  desktop,
  className = "",
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getContent = () => {
    if (isMobile && mobile) return mobile;
    if (isTablet && tablet) return tablet;
    if (isDesktop && desktop) return desktop;
    return children;
  };

  return (
    <div className={className}>
      {getContent()}
    </div>
  );
};

// MANDATORY: Responsive grid hook
export const useResponsiveGrid = (items: any[], defaultColumns: number = 1) => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const getColumns = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    if (isLargeDesktop) return 4;
    return defaultColumns;
  }, [isMobile, isTablet, isDesktop, isLargeDesktop, defaultColumns]);

  const columns = getColumns();
  const itemsPerPage = columns * 2; // Show 2 rows by default

  return {
    columns,
    itemsPerPage,
    gridCols: `grid-cols-${columns}`,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};

// MANDATORY: Responsive spacing hook
export const useResponsiveSpacing = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    padding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
    margin: isMobile ? 'm-4' : isTablet ? 'm-6' : 'm-8',
    gap: isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-8',
    spaceY: isMobile ? 'space-y-4' : isTablet ? 'space-y-6' : 'space-y-8',
    spaceX: isMobile ? 'space-x-4' : isTablet ? 'space-x-6' : 'space-x-8',
  };
};

// MANDATORY: Responsive typography hook
export const useResponsiveTypography = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    h1: isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl',
    h2: isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl',
    h3: isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl',
    h4: isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl',
    body: isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg',
    caption: isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base',
  };
};

// MANDATORY: Touch detection hook
export const useTouchDetection = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return isTouch;
};

// MANDATORY: Responsive layout hook
export const useResponsiveLayout = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const isTouch = useTouchDetection();

  return {
    // Layout classes
    container: isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8',
    maxWidth: isMobile ? 'max-w-full' : isTablet ? 'max-w-4xl' : 'max-w-6xl',
    
    // Grid layouts
    gridCols: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3',
    gridCols2: isMobile ? 'grid-cols-1' : 'grid-cols-2',
    gridCols4: isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4',
    
    // Flex layouts
    flexDirection: isMobile ? 'flex-col' : 'flex-row',
    flexWrap: isMobile ? 'flex-wrap' : 'flex-nowrap',
    
    // Spacing
    padding: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8',
    margin: isMobile ? 'm-4' : isTablet ? 'm-6' : 'm-8',
    gap: isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-8',
    
    // Touch-specific
    touchTarget: isTouch ? 'min-h-[44px] min-w-[44px]' : '',
    hoverEffect: isTouch ? '' : 'hover:shadow-lg hover:scale-105',
    
    // Breakpoint flags
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
  };
};

// MANDATORY: Responsive image hook
export const useResponsiveImage = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    // Image sizes
    hero: isMobile ? { width: 400, height: 300 } : isTablet ? { width: 800, height: 600 } : { width: 1200, height: 800 },
    card: isMobile ? { width: 300, height: 200 } : isTablet ? { width: 400, height: 300 } : { width: 500, height: 400 },
    avatar: isMobile ? { width: 40, height: 40 } : isTablet ? { width: 48, height: 48 } : { width: 56, height: 56 },
    
    // Image classes
    rounded: isMobile ? 'rounded-lg' : 'rounded-xl',
    shadow: isMobile ? 'shadow-md' : 'shadow-lg',
  };
};

// MANDATORY: Responsive navigation hook
export const useResponsiveNavigation = () => {
  const { isMobile, isTablet } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return {
    isMobile,
    isTablet,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    showMobileMenu: isMobile || isTablet,
    showDesktopMenu: !isMobile && !isTablet,
  };
};

// MANDATORY: Responsive form hook
export const useResponsiveForm = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    // Form layouts
    formGrid: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3',
    formSpacing: isMobile ? 'space-y-4' : isTablet ? 'space-y-6' : 'space-y-8',
    
    // Input sizes
    inputSize: isMobile ? 'text-base' : 'text-lg', // Prevent zoom on iOS
    buttonSize: isMobile ? 'py-3 px-6' : 'py-2 px-4',
    
    // Form sections
    sectionSpacing: isMobile ? 'space-y-6' : 'space-y-8',
    fieldSpacing: isMobile ? 'space-y-4' : 'space-y-6',
    
    // Labels
    labelSize: isMobile ? 'text-sm' : 'text-base',
    
    // Breakpoint flags
    isMobile,
    isTablet,
    isDesktop,
  };
};

// MANDATORY: Responsive table hook
export const useResponsiveTable = () => {
  const { isMobile, isTablet } = useResponsive();

  return {
    // Table layouts
    tableLayout: isMobile ? 'block' : 'table',
    tableWrapper: isMobile ? 'overflow-x-auto' : '',
    
    // Column visibility
    showAllColumns: !isMobile,
    showEssentialColumns: isMobile,
    
    // Pagination
    itemsPerPage: isMobile ? 5 : isTablet ? 10 : 20,
    
    // Mobile card layout
    useCardLayout: isMobile,
    
    // Breakpoint flags
    isMobile,
    isTablet,
  };
};
