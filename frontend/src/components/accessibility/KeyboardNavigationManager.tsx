'use client';

import React, { useEffect, useCallback } from 'react';

interface KeyboardNavigationManagerProps {
  children: React.ReactNode;
}

const KeyboardNavigationManager: React.FC<KeyboardNavigationManagerProps> = ({ children }) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip links (Ctrl/Cmd + /)
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const skipLink = document.getElementById('skip-to-main');
      if (skipLink) {
        skipLink.focus();
      }
    }
    
    // Escape key handling
    if (e.key === 'Escape') {
      // Close modals, dropdowns, etc.
      document.dispatchEvent(new CustomEvent('escape-pressed'));
      
      // Close any open menus
      const openMenus = document.querySelectorAll('[aria-expanded="true"]');
      openMenus.forEach(menu => {
        if (menu instanceof HTMLElement) {
          menu.setAttribute('aria-expanded', 'false');
          menu.blur();
        }
      });
    }
    
    // Arrow key navigation for menus
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const currentElement = document.activeElement;
      const navigationContainer = currentElement?.closest('[role="menu"], [role="menubar"], [role="tablist"]');
      
      if (navigationContainer) {
        e.preventDefault();
        handleArrowNavigation(e.key, navigationContainer);
      }
    }

    // Tab navigation enhancement
    if (e.key === 'Tab') {
      // Ensure focus is visible
      document.body.classList.add('keyboard-navigation');
    }
  }, []);

  const handleArrowNavigation = (key: string, container: Element) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);
    let nextIndex = currentIndex;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % focusableElements.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        break;
    }

    const nextElement = focusableElements[nextIndex] as HTMLElement;
    if (nextElement) {
      nextElement.focus();
    }
  };

  const handleMouseDown = useCallback(() => {
    // Remove keyboard navigation class when using mouse
    document.body.classList.remove('keyboard-navigation');
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return <>{children}</>;
};

export default KeyboardNavigationManager;
