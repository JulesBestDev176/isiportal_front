/**
 * API Helper utilities for consistent error handling and data processing
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Safely processes API response data
 */
export const processApiResponse = <T = any>(data: any, defaultValue: T, successMessage: string): ApiResponse<T> => {
  // Si data est déjà un tableau, le retourner directement
  if (Array.isArray(data)) {
    return {
      success: true,
      data: data as T,
      message: successMessage
    };
  }
  
  // Si data a une structure {success, data, message}, extraire data
  if (data && typeof data === 'object' && 'data' in data) {
    let extractedData = data.data;
    
    // Si data.data est une structure paginée Laravel, extraire data.data.data
    if (extractedData && typeof extractedData === 'object' && 'data' in extractedData && Array.isArray(extractedData.data)) {
      extractedData = extractedData.data;
    }
    
    return {
      success: data.success !== false,
      data: extractedData || defaultValue,
      message: data.message || successMessage
    };
  }
  
  return {
    success: true,
    data: data || defaultValue,
    message: successMessage
  };
};

/**
 * Creates error response
 */
export const createErrorResponse = <T = any>(error: any, defaultValue: T): ApiResponse<T> => {
  return {
    success: false,
    data: defaultValue,
    message: error instanceof Error ? error.message : 'Erreur inconnue'
  };
};

/**
 * Safe API call wrapper
 */
export const safeApiCall = async <T = any>(
  apiCall: () => Promise<Response>,
  defaultValue: T,
  successMessage: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return processApiResponse(data, defaultValue, successMessage);
  } catch (error) {
    console.error('API call failed:', error);
    return createErrorResponse(error, defaultValue);
  }
};

/**
 * Gets authorization headers
 */
export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};