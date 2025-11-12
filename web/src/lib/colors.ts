// Color constants for the PrepMe application

export const colors = {
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

// Helper function to get a category color by index
export const getCategoryColor = (index: number) => {
  return colors.categoryColors[index % colors.categoryColors.length];
};

// Helper function to generate a color from a string (for consistent category colors)
export const getColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.categoryColors.length;
  return colors.categoryColors[index];
};
