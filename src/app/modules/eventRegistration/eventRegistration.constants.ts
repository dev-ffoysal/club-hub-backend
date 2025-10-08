import { REGISTRATION_STATUS, PAYMENT_STATUS, USER_TYPE } from './eventRegistration.interface';

export const eventRegistrationFilterables = [
  'searchTerm',
  'event',
  'user',
  'userType',
  'registrationStatus',
  'paymentStatus',
  'registrationCode',
  'startDate',
  'endDate'
];

export const eventRegistrationSearchableFields = [
  'registrationCode',
  'publicUserInfo.name',
  'publicUserInfo.email',
  'publicUserInfo.phone',
  'publicUserInfo.studentId',
  'notes'
];

// Helper function to check if two sets are equal
export const areSetsEqual = <T>(a: Set<T>, b: Set<T>): boolean => {
  return a.size === b.size && [...a].every(value => b.has(value));
};

// Helper function to check if registration is active
export const isRegistrationActive = (status: REGISTRATION_STATUS): boolean => {
  return [REGISTRATION_STATUS.PAID, REGISTRATION_STATUS.CONFIRMED].includes(status);
};

// Helper function to check if payment is successful
export const isPaymentSuccessful = (status: PAYMENT_STATUS): boolean => {
  return status === PAYMENT_STATUS.COMPLETED;
};

// Helper function to get user display name
export const getUserDisplayName = (registration: any): string => {
  if (registration.userType === USER_TYPE.REGISTERED && registration.user) {
    return registration.user.name || registration.user.email;
  }
  if (registration.userType === USER_TYPE.PUBLIC && registration.publicUserInfo) {
    return registration.publicUserInfo.name;
  }
  return 'Unknown User';
};

// Helper function to get user email
export const getUserEmail = (registration: any): string => {
  if (registration.userType === USER_TYPE.REGISTERED && registration.user) {
    return registration.user.email;
  }
  if (registration.userType === USER_TYPE.PUBLIC && registration.publicUserInfo) {
    return registration.publicUserInfo.email;
  }
  return '';
};

// AmarPay configuration constants
export const AMARPAY_CONFIG = {
  SANDBOX_URL: 'https://sandbox.aamarpay.com',
  LIVE_URL: 'https://secure.aamarpay.com',
  INITIATE_ENDPOINT: '/jsonpost.php',
  VERIFY_ENDPOINT: '/api/v1/trxcheck/request.php',
  CURRENCY: 'BDT',
  SUCCESS_URL_SUFFIX: '/payment/success',
  FAIL_URL_SUFFIX: '/payment/fail',
  CANCEL_URL_SUFFIX: '/payment/cancel',
  IPN_URL_SUFFIX: '/payment/ipn'
};

// Email template constants
export const EMAIL_TEMPLATES = {
  REGISTRATION_SUCCESS: 'registration_success',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  REGISTRATION_CANCELLED: 'registration_cancelled',
  REFUND_PROCESSED: 'refund_processed'
};

// Registration limits
export const REGISTRATION_LIMITS = {
  MAX_REGISTRATIONS_PER_USER: 1, // Per event
  REGISTRATION_DEADLINE_HOURS: 24, // Hours before event
  PAYMENT_TIMEOUT_MINUTES: 30 // Minutes to complete payment
};