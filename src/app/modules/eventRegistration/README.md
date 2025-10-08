# Event Registration System

A comprehensive event registration and payment system built with Node.js, Express, MongoDB, and AmarPay payment gateway integration.

## Features

### User Types
- **Registered Users**: Existing users with accounts can register directly
- **Public Users**: Non-registered users can register by providing basic information

### Registration Flow
1. **Event Selection**: Users select an event to register for
2. **User Information**: Public users provide name, email, phone, and optional student ID
3. **Payment Processing**: Integration with AmarPay payment gateway
4. **Confirmation**: Unique registration code generation and email notification
5. **Verification**: Event organizers can verify registrations using unique codes

### Payment Integration
- **AmarPay Gateway**: Secure payment processing
- **Multiple Payment Methods**: Card, mobile banking support
- **Real-time Callbacks**: Success and failure handling
- **Transaction Tracking**: Complete payment audit trail

## API Endpoints

### Public Routes
```
POST /api/v1/event-registration/public/register
POST /api/v1/event-registration/verify
POST /api/v1/event-registration/payment/success
POST /api/v1/event-registration/payment/failure
```

### Authenticated User Routes
```
POST /api/v1/event-registration/register
GET /api/v1/event-registration/my-registrations
PATCH /api/v1/event-registration/:id/cancel
```

### Admin Routes
```
GET /api/v1/event-registration/
GET /api/v1/event-registration/:id
PATCH /api/v1/event-registration/:id
POST /api/v1/event-registration/:id/resend-email
```

### Event Organizer Routes
```
GET /api/v1/event-registration/event/:eventId
GET /api/v1/event-registration/event/:eventId/stats
```

## Environment Variables

Add the following to your `.env` file:

```env
# AmarPay Configuration
AMARPAY_STORE_ID=your-amarpay-store-id
AMARPAY_SIGNATURE_KEY=your-amarpay-signature-key
AMARPAY_ENVIRONMENT=sandbox
```

## Database Schema

### Event Registration Model
- **event**: Reference to Event model
- **user**: Reference to User model (for registered users)
- **publicUserInfo**: Embedded document for public users
- **userType**: REGISTERED | PUBLIC
- **registrationCode**: Unique verification code
- **registrationStatus**: PENDING | PAID | CONFIRMED | CANCELLED | REFUNDED
- **paymentStatus**: PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED
- **paymentInfo**: Payment details and transaction information
- **emailSent**: Email notification status

## Usage Examples

### Register Existing User
```javascript
POST /api/v1/event-registration/register
Authorization: Bearer <token>

{
  "eventId": "64a1b2c3d4e5f6789012345",
  "successUrl": "https://frontend.com/payment/success",
  "failUrl": "https://frontend.com/payment/fail",
  "cancelUrl": "https://frontend.com/payment/cancel"
}
```

### Register Public User
```javascript
POST /api/v1/event-registration/public/register

{
  "eventId": "64a1b2c3d4e5f6789012345",
  "publicUserInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+8801234567890",
    "studentId": "CSE2021001"
  },
  "successUrl": "https://frontend.com/payment/success",
  "failUrl": "https://frontend.com/payment/fail",
  "cancelUrl": "https://frontend.com/payment/cancel"
}
```

### Verify Registration
```javascript
POST /api/v1/event-registration/verify

{
  "registrationCode": "REG-20240115-ABC123"
}
```

## Email Notifications

The system sends automated emails for:
- **Registration Confirmation**: After successful payment
- **Payment Confirmation**: Transaction details
- **Cancellation Notice**: When registration is cancelled

## Security Features

- **Input Validation**: Comprehensive Zod schema validation
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control
- **Payment Security**: AmarPay signature verification
- **Data Sanitization**: Mongoose schema validation

## Error Handling

- **Validation Errors**: Detailed field-level error messages
- **Payment Failures**: Graceful handling with user feedback
- **Database Errors**: Transaction rollback and error logging
- **Network Issues**: Retry mechanisms for external API calls

## Monitoring and Logging

- **Registration Tracking**: Complete audit trail
- **Payment Monitoring**: Transaction status tracking
- **Email Delivery**: Notification status logging
- **Error Logging**: Comprehensive error tracking

## Testing

The system includes validation for:
- Event capacity limits
- Registration deadlines
- Duplicate registrations
- Payment verification
- Email delivery confirmation

## Integration Notes

### Frontend Integration
1. Implement payment redirect handling
2. Handle success/failure callbacks
3. Display registration codes to users
4. Provide verification interface for organizers

### AmarPay Integration
1. Configure store credentials
2. Set up webhook endpoints
3. Implement signature verification
4. Handle payment status updates

## Support

For issues or questions regarding the event registration system, please refer to the API documentation or contact the development team.