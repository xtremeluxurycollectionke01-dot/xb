/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints
 */

/*export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
}

/**
 * Success response helper
 *
export function successResponse<T>(data: T, message?: string, meta?: any): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta
  };
  
  return Response.json(body, { status: 200 });
}

/**
 * Created response helper (201)
 *
export function createdResponse<T>(data: T, message?: string): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message: message || 'Created successfully'
  };
  
  return Response.json(body, { status: 201 });
}

/**
 * Error response helper
 *
export function errorResponse(error: string, status: number = 400): Response {
  const body: ApiResponse = {
    success: false,
    error
  };
  
  return Response.json(body, { status });
}

/**
 * Common error responses
 *
export const errors = {
  unauthorized: () => errorResponse('Unauthorized', 401),
  forbidden: () => errorResponse('Forbidden', 403),
  notFound: (resource: string = 'Resource') => errorResponse(`${resource} not found`, 404),
  badRequest: (message: string = 'Bad request') => errorResponse(message, 400),
  serverError: () => errorResponse('Internal server error', 500),
  validationError: (message: string) => errorResponse(message, 422),
  tooManyRequests: () => errorResponse('Too many requests', 429),
  conflict: (message: string) => errorResponse(message, 409)
};*/


/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, message?: string, meta?: any): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta
  };
  
  return Response.json(body, { status: 200 });
}

/**
 * Created response helper (201)
 */
export function createdResponse<T>(data: T, message?: string): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message: message || 'Created successfully'
  };
  
  return Response.json(body, { status: 201 });
}

/**
 * Error response helper
 */
export function errorResponse(error: string, status: number = 400): Response {
  const body: ApiResponse = {
    success: false,
    error
  };
  
  return Response.json(body, { status });
}

/**
 * Common error responses
 */
export const errors = {
  unauthorized: () => errorResponse('Unauthorized', 401),
  
  // Updated: forbidden now accepts optional message
  forbidden: (message: string = 'Forbidden') => errorResponse(message, 403),
  
  notFound: (resource: string = 'Resource') => errorResponse(`${resource} not found`, 404),
  badRequest: (message: string = 'Bad request') => errorResponse(message, 400),
  serverError: () => errorResponse('Internal server error', 500),
  validationError: (message: string) => errorResponse(message, 422),
  tooManyRequests: () => errorResponse('Too many requests', 429),
  conflict: (message: string) => errorResponse(message, 409)
};