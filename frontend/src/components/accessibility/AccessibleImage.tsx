'use client';

import React from 'react';

interface AccessibleImageProps {
  src: string;
  alt: string;
  decorative?: boolean;
  longDescription?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  decorative = false,
  longDescription = null,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
}) => {
  return (
    <div className="accessible-image">
      <img
        src={src}
        alt={decorative ? '' : alt}
        role={decorative ? 'presentation' : 'img'}
        aria-describedby={longDescription ? 'long-desc' : undefined}
        className={className}
        width={width}
        height={height}
        loading={loading}
        style={priority ? { priority: 'high' } as any : undefined}
      />
      {longDescription && (
        <div id="long-desc" className="sr-only">
          {longDescription}
        </div>
      )}
    </div>
  );
};

export default AccessibleImage;
