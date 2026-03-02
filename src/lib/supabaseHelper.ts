import { supabase } from './supabase';
import type { AuthError } from '@supabase/supabase-js';

/**
 * Helper to check if an error is a network/fetch error
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const errorString = error.toString().toLowerCase();
  const errorMessage = error.message?.toLowerCase() || '';
  const errorName = error.name?.toLowerCase() || '';
  
  return (
    errorString.includes('failed to fetch') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') ||
    errorName.includes('authretryablefetcherror') ||
    errorName.includes('fetch')
  );
}

/**
 * Helper to get a user-friendly error message
 */
export function getErrorMessage(error: any): string {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Test Supabase connection with timeout
 */
export async function testSupabaseConnection(timeoutMs: number = 10000): Promise<{
  connected: boolean;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const { error } = await supabase.auth.getSession();
    clearTimeout(timeoutId);
    
    if (error) {
      return {
        connected: false,
        error: getErrorMessage(error),
      };
    }
    
    return { connected: true };
  } catch (err) {
    return {
      connected: false,
      error: getErrorMessage(err),
    };
  }
}

/**
 * Retry helper for Supabase operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on non-network errors
      if (!isNetworkError(error)) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}
