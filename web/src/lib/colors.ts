// Color constants for the PrepMe application

export const lightColors = {
  // Primary brand colors with gradient capability
  primary: {
    main: '#6366f1', // Indigo
    light: '#818cf8',
    lighter: '#a5b4fc',
    dark: '#4f46e5',
    darker: '#4338ca',
  },

  // Secondary accent colors
  secondary: {
    main: '#8b5cf6', // Purple
    light: '#a78bfa',
    dark: '#7c3aed',
  },

  // Semantic colors
  success: {
    main: '#10b981', // Green
    light: '#34d399',
    dark: '#059669',
    bg: '#d1fae5',
  },

  warning: {
    main: '#f59e0b', // Amber
    light: '#fbbf24',
    dark: '#d97706',
    bg: '#fef3c7',
  },

  error: {
    main: '#ef4444', // Red
    light: '#f87171',
    dark: '#dc2626',
    bg: '#fee2e2',
  },

  info: {
    main: '#3b82f6', // Blue
    light: '#60a5fa',
    dark: '#2563eb',
    bg: '#dbeafe',
  },

  // Category colors - vibrant palette
  categoryColors: [
    { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, // Amber
    { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' }, // Blue
    { bg: '#d1fae5', border: '#10b981', text: '#065f46' }, // Green
    { bg: '#fce7f3', border: '#ec4899', text: '#831843' }, // Pink
    { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6' }, // Purple
    { bg: '#fed7aa', border: '#f97316', text: '#7c2d12' }, // Orange
    { bg: '#ccfbf1', border: '#14b8a6', text: '#134e4a' }, // Teal
    { bg: '#fae8ff', border: '#d946ef', text: '#701a75' }, // Fuchsia
    { bg: '#e0e7ff', border: '#6366f1', text: '#312e81' }, // Indigo
    { bg: '#dcfce7', border: '#22c55e', text: '#14532d' }, // Lime
  ],

  // Neutral colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Gradient combinations
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    warm: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    cool: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
  },
};

// Dark mode color palette
export const darkColors = {
  // Primary brand colors with gradient capability
  primary: {
    main: '#818cf8', // Lighter indigo for dark mode
    light: '#a5b4fc',
    lighter: '#c7d2fe',
    dark: '#6366f1',
    darker: '#4f46e5',
  },

  // Secondary accent colors
  secondary: {
    main: '#a78bfa', // Lighter purple
    light: '#c4b5fd',
    dark: '#8b5cf6',
  },

  // Semantic colors
  success: {
    main: '#34d399', // Lighter green
    light: '#6ee7b7',
    dark: '#10b981',
    bg: '#065f46',
  },

  warning: {
    main: '#fbbf24', // Lighter amber
    light: '#fcd34d',
    dark: '#f59e0b',
    bg: '#78350f',
  },

  error: {
    main: '#f87171', // Lighter red
    light: '#fca5a5',
    dark: '#ef4444',
    bg: '#7f1d1d',
  },

  info: {
    main: '#60a5fa', // Lighter blue
    light: '#93c5fd',
    dark: '#3b82f6',
    bg: '#1e3a8a',
  },

  // Category colors - adjusted for dark mode
  categoryColors: [
    { bg: '#78350f', border: '#fbbf24', text: '#fef3c7' }, // Amber
    { bg: '#1e3a8a', border: '#60a5fa', text: '#dbeafe' }, // Blue
    { bg: '#065f46', border: '#34d399', text: '#d1fae5' }, // Green
    { bg: '#831843', border: '#f472b6', text: '#fce7f3' }, // Pink
    { bg: '#5b21b6', border: '#a78bfa', text: '#ede9fe' }, // Purple
    { bg: '#7c2d12', border: '#fb923c', text: '#fed7aa' }, // Orange
    { bg: '#134e4a', border: '#2dd4bf', text: '#ccfbf1' }, // Teal
    { bg: '#701a75', border: '#e879f9', text: '#fae8ff' }, // Fuchsia
    { bg: '#312e81', border: '#818cf8', text: '#e0e7ff' }, // Indigo
    { bg: '#14532d', border: '#4ade80', text: '#dcfce7' }, // Lime
  ],

  // Neutral colors (darker variants)
  neutral: {
    50: '#1f2937',
    100: '#374151',
    200: '#4b5563',
    300: '#6b7280',
    400: '#9ca3af',
    500: '#d1d5db',
    600: '#e5e7eb',
    700: '#f3f4f6',
    800: '#f9fafb',
    900: '#ffffff',
  },

  // Gradient combinations
  gradients: {
    primary: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
    warm: 'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)',
    cool: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
    success: 'linear-gradient(135deg, #34d399 0%, #2dd4bf 100%)',
    sunset: 'linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)',
  },
};

// Default to light colors for backward compatibility
export const colors = lightColors;

// Helper function to get a category color by index
export const getCategoryColor = (index: number, isDark = false) => {
  const palette = isDark ? darkColors : lightColors;
  return palette.categoryColors[index % palette.categoryColors.length];
};

// Helper function to generate a color from a string (for consistent category colors)
export const getColorFromString = (str: string, isDark = false) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palette = isDark ? darkColors : lightColors;
  const index = Math.abs(hash) % palette.categoryColors.length;
  return palette.categoryColors[index];
};

// Helper function to get the appropriate color palette based on theme
export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;
