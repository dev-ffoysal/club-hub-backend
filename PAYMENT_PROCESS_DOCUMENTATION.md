# Payment Process Documentation

## Overview

This document explains the complete payment process for both **Club Registration** and **Event Registration** (including public user registration) in the system. The implementation uses AmarPay as the payment gateway with unified callback handling and comprehensive email notifications.

## Architecture Overview

### Key Components

1. **AmarPay Service** (`src/services/amarPayService.ts`)
   - Handles payment initiation, verification, and callback processing
   - Supports both club and event registration types

2. **Payment Callback Handler** (`src/services/paymentCallbackHandler.ts`)
   - Unified handler that routes payment callbacks to appropriate services
   - Automatic registration type detection

3. **Email Services**
   - `src/services/eventRegistrationEmailService.ts` - Event registration emails
   - `src/services/clubRegistrationEmailService.ts` - Club registration emails

4. **Registration Services**
   - `src/app/modules/eventRegistration/eventRegistration.service.ts`
   - `src/app/modules/clubregistration/clubregistration.service.ts`

## Payment Flow Diagrams

### 1. Club Registration Payment Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│ Club Registration│───▶│   AmarPay       │
│   Club Join     │    │   Service        │    │   Service       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Create Registration│    │ Initiate Payment│
                       │ Record (PENDING)   │    │ (opt_d = 'club')│
                       └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Send Initial     │    │ Redirect User   │
                       │ Confirmation     │    │ to Payment Page │
                       └──────────────────┘    └─────────────────┘
```

### 2. Event Registration Payment Flow (Registered User)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Registered User │───▶│ Event Registration│───▶│   AmarPay       │
│ Event Join      │    │   Service        │    │   Service       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Create Registration│    │ Initiate Payment│
                       │ Record (PENDING)   │    │(opt_d = 'event')│
                       └──────────────────┘    └─────────────────┘
```

### 3. Event Registration Payment Flow (Public User)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Public User   │───▶│ Event Registration│───▶│   AmarPay       │
│   Event Join    │    │   Service        │    │   Service       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Create Registration│    │ Initiate Payment│
                       │ with Public Info   │    │(opt_d = 'event')│
                       │ (PENDING)          │    │                 │
                       └──────────────────┘    └─────────────────┘
```

## Detailed Payment Process

### Phase 1: Payment Initiation

#### Club Registration

1. **User Request**: User submits club registration request
2. **Validation**: System validates club availability and user eligibility
3. **Registration Creation**: 
   ```typescript
   // Create registration record with PENDING status
   const registration = await Clubregistration.create({
     club: clubId,
     member: userId,
     status: CLUB_REGISTRATION_STATUS.PENDING,
     paymentStatus: PAYMENT_STATUS.PENDING,
     paymentInfo: {
       amount: club.membershipFee,
       currency: 'BDT',
       method: PAYMENT_METHOD.AMARPAY,
       transactionId: generatedTransactionId
     }
   });
   ```
4. **Payment Initiation**: Call AmarPay service with club-specific data
   ```typescript
   const paymentRequest: IAmarPayPaymentRequest = {
     clubId: clubId,
     userId: userId,
     amount: club.membershipFee,
     currency: 'BDT',
     successUrl: `${config.frontend_url}/payment/success`,
     failUrl: `${config.frontend_url}/payment/fail`,
     cancelUrl: `${config.frontend_url}/payment/cancel`
   };
   ```
5. **Email Notification**: Send initial registration confirmation email

#### Event Registration (Registered User)

1. **User Request**: Authenticated user requests event registration
2. **Validation**: Check event availability, registration limits, and deadlines
3. **Registration Creation**:
   ```typescript
   const registration = await EventRegistration.create({
     event: eventId,
     user: userId,
     userType: USER_TYPE.REGISTERED,
     registrationStatus: REGISTRATION_STATUS.PENDING,
     paymentStatus: PAYMENT_STATUS.PENDING,
     paymentInfo: {
       amount: event.registrationFee,
       currency: 'BDT',
       method: PAYMENT_METHOD.AMARPAY,
       transactionId: generatedTransactionId
     }
   });
   ```
4. **Payment Initiation**: Call AmarPay service with event-specific data

#### Event Registration (Public User)

1. **Public User Request**: Non-authenticated user provides registration details
2. **Validation**: Validate provided information and event availability
3. **Registration Creation**:
   ```typescript
   const registration = await EventRegistration.create({
     event: eventId,
     userType: USER_TYPE.PUBLIC,
     publicUserInfo: {
       name: userData.name,
       email: userData.email,
       phone: userData.phone,
       studentId: userData.studentId
     },
     registrationStatus: REGISTRATION_STATUS.PENDING,
     paymentStatus: PAYMENT_STATUS.PENDING
   });
   ```
4. **Payment Initiation**: Call AmarPay service with public user data

### Phase 2: AmarPay Processing

#### Payment Payload Structure

```typescript
const paymentPayload = {
  store_id: config.storeId,
  tran_id: transactionId,
  success_url: paymentData.successUrl,
  fail_url: paymentData.failUrl,
  cancel_url: paymentData.cancelUrl,
  amount: paymentData.amount.toString(),
  currency: 'BDT',
  signature_key: config.signatureKey,
  desc: isClubRegistration 
    ? `Club Registration Payment - Club ID: ${paymentData.clubId}`
    : `Event Registration Payment - Event ID: ${paymentData.eventId}`,
  cus_name: paymentData.publicUserInfo?.name || 'Registered User',
  cus_email: paymentData.publicUserInfo?.email || 'user@example.com',
  cus_phone: paymentData.publicUserInfo?.phone || '01700000000',
  // ... other customer details
  opt_a: referenceId, // Store event/club ID
  opt_b: paymentData.userId || '', // Store user ID if available
  opt_c: paymentData.publicUserInfo ? JSON.stringify(paymentData.publicUserInfo) : '',
  opt_d: isClubRegistration ? 'club' : 'event' // Registration type identifier
};
```

### Phase 3: Payment Callback Processing

#### Unified Callback Handler

The system uses a unified callback handler that automatically routes payments based on registration type:

```typescript
// Payment Callback Handler routes based on opt_d field
switch (registrationType) {
  case 'event':
    return await EventRegistrationService.processPaymentSuccess(callbackData);
  case 'club':
    return await ClubregistrationServices.processPaymentSuccess(callbackData);
  default:
    throw new ApiError(StatusCodes.BAD_REQUEST, `Unknown registration type: ${registrationType}`);
}
```

#### Success Callback Processing

**For Club Registration:**

1. **Find Registration**: Locate registration by transaction ID
2. **Verify Payment**: Validate payment with AmarPay
3. **Update Status**: 
   ```typescript
   await Clubregistration.findByIdAndUpdate(registration._id, {
     paymentStatus: PAYMENT_STATUS.COMPLETED,
     status: CLUB_REGISTRATION_STATUS.APPROVED,
     'paymentInfo.gatewayResponse': paymentVerification.gatewayResponse,
     'paymentInfo.processedAt': new Date().toISOString()
   });
   ```
4. **Send Email**: Send payment confirmation email with club details
5. **Return Response**: Provide success response to user

**For Event Registration:**

1. **Find Registration**: Locate registration by transaction ID
2. **Verify Payment**: Validate payment with AmarPay
3. **Update Status**:
   ```typescript
   await EventRegistration.findByIdAndUpdate(registration._id, {
     paymentStatus: PAYMENT_STATUS.COMPLETED,
     registrationStatus: REGISTRATION_STATUS.CONFIRMED,
     confirmedAt: new Date(),
     'paymentInfo.gatewayResponse': paymentVerification.gatewayResponse
   });
   ```
4. **Update Event**: Increment participant count
5. **Send Email**: Send payment confirmation email with event details
6. **Mark Email Sent**: Update registration record

#### Failure Callback Processing

**For Club Registration:**

1. **Find Registration**: Locate registration by transaction ID
2. **Process Failure**: Handle failure response from AmarPay
3. **Update Status**:
   ```typescript
   await Clubregistration.findByIdAndUpdate(registration._id, {
     paymentStatus: PAYMENT_STATUS.FAILED,
     status: CLUB_REGISTRATION_STATUS.REJECTED,
     'paymentInfo.gatewayResponse': paymentResult.gatewayResponse
   });
   ```
4. **Send Email**: Send payment failure notification with retry instructions

**For Event Registration:**

1. **Find Registration**: Locate registration by transaction ID
2. **Process Failure**: Handle failure response from AmarPay
3. **Update Status**:
   ```typescript
   await EventRegistration.findByIdAndUpdate(registration._id, {
     paymentStatus: PAYMENT_STATUS.FAILED,
     registrationStatus: REGISTRATION_STATUS.CANCELLED,
     cancelledAt: new Date()
   });
   ```
4. **Send Email**: Send cancellation notification with failure reason

## Email Notification System

### Club Registration Emails

1. **Registration Confirmation**: Sent immediately after registration creation
2. **Payment Success**: Detailed confirmation with club information and membership details
3. **Payment Failure**: Failure notification with retry instructions and support contact

### Event Registration Emails

1. **Registration Confirmation**: Sent immediately after registration creation
2. **Payment Success**: Detailed confirmation with event information and QR code
3. **Payment Failure/Cancellation**: Failure notification with event details and retry options

### Email Template Features

- **Responsive HTML Design**: Mobile-friendly email templates
- **Dynamic Content**: Personalized with user and registration details
- **Branding**: Consistent with application branding
- **Action Items**: Clear next steps and contact information
- **Error Handling**: Graceful fallback if email sending fails

## API Endpoints

### Club Registration

```
POST /api/v1/clubregistrations
- Create club registration and initiate payment

POST /api/v1/clubregistrations/payment/success
- Handle payment success callback

POST /api/v1/clubregistrations/payment/failure
- Handle payment failure callback
```

### Event Registration

```
POST /api/v1/event-registrations/registered-user
- Create registration for authenticated user

POST /api/v1/event-registrations/public-user
- Create registration for public user

POST /api/v1/event-registrations/payment/success
- Handle payment success callback

POST /api/v1/event-registrations/payment/failure
- Handle payment failure callback
```

### Unified Payment Callbacks

```
POST /api/v1/payments/callback/success
- Unified success callback handler

POST /api/v1/payments/callback/failure
- Unified failure callback handler

POST /api/v1/payments/callback/cancel
- Unified cancel callback handler
```

## Error Handling

### Payment Errors

1. **Network Errors**: Retry mechanism with exponential backoff
2. **Validation Errors**: Clear error messages returned to user
3. **Gateway Errors**: Proper error mapping from AmarPay responses
4. **Database Errors**: Transaction rollback and error logging

### Email Errors

1. **SMTP Errors**: Logged but don't affect payment processing
2. **Template Errors**: Fallback to basic text emails
3. **Recipient Errors**: Logged for manual follow-up

## Security Considerations

1. **Signature Validation**: All AmarPay callbacks are signature-validated
2. **HTTPS Only**: All payment URLs use HTTPS
3. **Data Encryption**: Sensitive data encrypted in transit and at rest
4. **Input Validation**: All inputs validated using Zod schemas
5. **Rate Limiting**: API endpoints protected against abuse

## Monitoring and Logging

1. **Payment Tracking**: All payment attempts logged with unique transaction IDs
2. **Error Logging**: Comprehensive error logging for debugging
3. **Performance Monitoring**: Payment processing time tracking
4. **Email Delivery**: Email sending success/failure tracking

## Configuration

### Environment Variables

```env
# AmarPay Configuration
AMARPAY_STORE_ID=your_store_id
AMARPAY_SIGNATURE_KEY=your_signature_key
AMARPAY_ENVIRONMENT=sandbox # or 'live'

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Application URLs
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

## Testing

### Payment Testing

1. **Sandbox Environment**: Use AmarPay sandbox for testing
2. **Mock Payments**: Test with mock payment data
3. **Callback Testing**: Test success/failure scenarios
4. **Email Testing**: Verify email delivery in test environment

### Test Scenarios

1. **Successful Payment Flow**: End-to-end success testing
2. **Failed Payment Flow**: Various failure scenarios
3. **Network Interruption**: Handle network failures gracefully
4. **Concurrent Registrations**: Test race conditions
5. **Email Delivery**: Test email sending under various conditions

## Troubleshooting

### Common Issues

1. **Payment Not Processing**: Check AmarPay configuration and network connectivity
2. **Emails Not Sending**: Verify SMTP configuration and email templates
3. **Callback Failures**: Check signature validation and endpoint accessibility
4. **Registration Status Issues**: Verify database transactions and status updates

### Debug Steps

1. **Check Logs**: Review application logs for error details
2. **Verify Configuration**: Ensure all environment variables are set
3. **Test Connectivity**: Verify AmarPay and SMTP connectivity
4. **Database Check**: Verify registration records and status

## Future Enhancements

1. **Multiple Payment Gateways**: Support for additional payment providers
2. **Partial Payments**: Support for installment payments
3. **Refund Processing**: Automated refund handling
4. **Payment Analytics**: Detailed payment reporting and analytics
5. **Mobile Payments**: Enhanced mobile payment experience

This documentation provides a comprehensive overview of the payment process implementation. For specific implementation details, refer to the respective service files and their inline documentation.