'use client';

import React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a 
        id="skip-to-main"
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-blue-600 text-white p-4"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-32 z-50 bg-blue-600 text-white p-4"
      >
        Skip to navigation
      </a>
      <a 
        href="#footer" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-64 z-50 bg-blue-600 text-white p-4"
      >
        Skip to footer
      </a>
    </div>
  );
};

export default SkipLinks;
