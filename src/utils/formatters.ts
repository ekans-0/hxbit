/**
 * Utility functions for formatting numbers and data
 */

/**
 * Format a number to a maximum of 2 decimal places
 * @param num - The number to format
 * @returns The formatted number
 */
export function formatNumber(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * Format a number as a string with proper decimal places
 * @param num - The number to format
 * @param decimals - Maximum number of decimal places (default: 2)
 * @returns The formatted number as a string
 */
export function formatNumberString(num: number, decimals: number = 2): string {
  return formatNumber(num).toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Format large numbers with K, M, B suffixes
 * @param num - The number to format
 * @returns The formatted number with suffix
 */
export function formatLargeNumber(num: number): string {
  const formatted = formatNumber(num);
  
  if (formatted >= 1000000000) {
    return formatNumberString(formatted / 1000000000) + 'B';
  }
  if (formatted >= 1000000) {
    return formatNumberString(formatted / 1000000) + 'M';
  }
  if (formatted >= 1000) {
    return formatNumberString(formatted / 1000) + 'K';
  }
  
  return formatted.toString();
}

/**
 * Format XP values for display
 * @param xp - The XP value to format
 * @returns The formatted XP string
 */
export function formatXP(xp: number): string {
  return formatLargeNumber(xp);
}

/**
 * Format percentage values
 * @param value - The percentage value (0-100)
 * @returns The formatted percentage string
 */
export function formatPercentage(value: number): string {
  return formatNumberString(value, 1) + '%';
}

/**
 * Sanitize user input to prevent XSS
 * @param input - The input string to sanitize
 * @returns The sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Validate email format
 * @param email - The email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 * @param username - The username to validate
 * @returns Whether the username is valid
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Generate a secure random string
 * @param length - The length of the string
 * @returns A random string
 */
export function generateSecureId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}