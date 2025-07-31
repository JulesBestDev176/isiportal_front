/**
 * Utility functions for safe rendering to prevent React Error #130
 */

/**
 * Safely converts any value to a string for React rendering
 * Prevents objects from being rendered as React children
 */
export const safeString = (value: any, fallback: string = ''): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    // For objects, return a safe fallback instead of trying to render them
    return fallback;
  }
  
  return String(value);
};

/**
 * Safely renders a number value
 */
export const safeNumber = (value: any, fallback: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  const parsed = parseFloat(value);
  if (!isNaN(parsed)) {
    return parsed;
  }
  
  return fallback;
};

/**
 * Safely renders an array length
 */
export const safeArrayLength = (value: any): number => {
  if (Array.isArray(value)) {
    return value.length;
  }
  return 0;
};

/**
 * Safely gets a property from an object
 */
export const safeProperty = (obj: any, property: string, fallback: any = ''): any => {
  if (obj && typeof obj === 'object' && property in obj) {
    return obj[property];
  }
  return fallback;
};

/**
 * Safely formats a date
 */
export const safeDate = (dateValue: any, fallback: string = 'Date inconnue'): string => {
  if (!dateValue) return fallback;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return fallback;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return fallback;
  }
};