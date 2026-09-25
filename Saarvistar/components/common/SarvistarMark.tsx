import React from 'react';
import Image from 'next/image';

interface SarvistarMarkProps {
  className?: string;
  size?: number | string;
}

export function SarvistarMark({ className = 'w-6 h-6', size }: SarvistarMarkProps) {
  const dimension = size ? Number(size) : undefined;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden rounded-sm transition-transform duration-700 hover:rotate-45 ${className}`}
      style={dimension ? { width: dimension, height: dimension } : undefined}
    >
      <Image
        src="/logo.jpg"
        alt="Sarvistar Logo"
        width={dimension ?? 40}
        height={dimension ?? 40}
        className="object-contain w-full h-full"
        priority
      />
    </span>
  );
}
