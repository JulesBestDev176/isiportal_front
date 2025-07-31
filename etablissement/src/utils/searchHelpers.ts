/**
 * Search and filter helper utilities
 */

/**
 * Safely converts a value to lowercase string for search
 */
export const safeToLowerCase = (value: any): string => {
  try {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value).toLowerCase();
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value).toLowerCase();
    }
    
    return String(value).toLowerCase();
  } catch {
    return '';
  }
};

/**
 * Safely performs a search match
 */
export const safeSearchMatch = (searchTerm: string, ...values: any[]): boolean => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return true;
    }
    
    const lowerSearchTerm = safeToLowerCase(searchTerm);
    
    return values.some(value => {
      try {
        const lowerValue = safeToLowerCase(value);
        return lowerValue.includes(lowerSearchTerm);
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
};

/**
 * Safely filters an array based on search criteria
 */
export const safeFilter = <T>(
  items: T[],
  searchTerm: string,
  getSearchableValues: (item: T) => any[]
): T[] => {
  if (!Array.isArray(items)) {
    return [];
  }
  
  if (!searchTerm || searchTerm.trim() === '') {
    return items;
  }
  
  return items.filter(item => {
    try {
      const searchableValues = getSearchableValues(item);
      return safeSearchMatch(searchTerm, ...searchableValues);
    } catch (error) {
      console.warn('Error filtering item:', error);
      return false;
    }
  });
};