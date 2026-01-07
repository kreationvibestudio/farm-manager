/**
 * Secure error handling utility
 * Prevents information disclosure in production
 */

export function sanitizeError(error: unknown): { message: string; details?: string } {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (error instanceof Error) {
    return {
      message: isDevelopment ? error.message : 'An error occurred. Please try again.',
      details: isDevelopment ? error.stack : undefined
    };
  }
  
  if (typeof error === 'string') {
    // Don't expose internal error strings in production
    return {
      message: isDevelopment ? error : 'An error occurred. Please try again.'
    };
  }
  
  return {
    message: 'An unexpected error occurred. Please try again.'
  };
}

export function createErrorResponse(error: unknown, status: number = 500) {
  const sanitized = sanitizeError(error);
  
  return {
    error: sanitized.message,
    ...(sanitized.details && { details: sanitized.details })
  };
}
