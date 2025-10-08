import * as crypto from 'crypto';

/**
 * Generates a unique registration code
 * Format: REG-YYYYMMDD-XXXXXX (where X is random alphanumeric)
 */
export const generateUniqueCode = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const dateStr = `${year}${month}${day}`;
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  return `REG-${dateStr}-${randomStr}`;
};

/**
 * Generates a payment transaction ID
 * Format: TXN-YYYYMMDD-HHMMSS-XXXXXX
 */
export const generateTransactionId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const dateTimeStr = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  return `TXN-${dateTimeStr}-${randomStr}`;
};

/**
 * Generates a session key for payment gateway
 */
export const generateSessionKey = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Validates registration code format
 */
export const validateRegistrationCode = (code: string): boolean => {
  const pattern = /^REG-\d{8}-[A-F0-9]{6}$/;
  return pattern.test(code);
};

/**
 * Validates transaction ID format
 */
export const validateTransactionId = (txnId: string): boolean => {
  const pattern = /^TXN-\d{8}-\d{6}-[A-F0-9]{6}$/;
  return pattern.test(txnId);
};