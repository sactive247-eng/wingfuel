import React from 'react';

export const FALLBACK_AVIATION_IMAGE = '/assets/fallback-aviation.svg';
export const FALLBACK_LOGO_IMAGE = '/assets/fallback-logo.svg';
export const WINGFUEL_LOGO_PATH = '/assets/aistudio/WingFuel_Orbit_Logo_e3f91314.png';
export const DEFAULT_AVIATION_HERO_IMAGE =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80';

/**
 * Ensures image paths are absolute (http/https/data) or relative to the public root (/).
 * Converts legacy `/src/assets/...` or bare relative paths into safe fallback-ready paths.
 */
export function resolvePublicImagePath(
  src?: string | null,
  fallback: string = FALLBACK_AVIATION_IMAGE
): string {
  if (!src || !src.trim()) return fallback;
  const trimmed = src.trim();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // Legacy /src/assets paths do not exist in Vite production builds
  if (trimmed.startsWith('/src/') || trimmed.startsWith('src/')) {
    return fallback;
  }

  // Normalize relative paths to the public root
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\.?\//, '')}`;
}

export function createImageErrorHandler(fallback: string = FALLBACK_AVIATION_IMAGE) {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === 'true') return;
    img.dataset.fallbackApplied = 'true';
    img.onerror = null;
    img.src = fallback;
  };
}
