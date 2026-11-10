'use client';

import React from 'react';
import Image from 'next/image';

export function AgroControlLogo({
  variant = 'light',
  className = 'h-9 w-auto',
  width = 160,
  height = 38,
}: {
  variant?: 'light' | 'dark';
  className?: string;
  width?: number;
  height?: number;
}) {
  const isLight = variant === 'light';
  const logoSrc = isLight
    ? '/images/logo-white-transparent.png'
    : '/images/logo-green-transparent.png';

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="AgroControl"
        width={width}
        height={height}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
