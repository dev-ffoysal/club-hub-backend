import { emailHelper } from '../helpers/emailHelper';
import { IEventRegistration } from '../app/modules/eventRegistration/eventRegistration.interface';
import { IEvent } from '../app/modules/event/event.interface';
import { EMAIL_TEMPLATES } from '../app/modules/eventRegistration/eventRegistration.constants';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

interface RegistrationEmailData {
  registration: IEventRegistration;
  event: IEvent;
  userEmail: string;
  userName: string;
}

class EventRegistrationEmailService {
  /**
   * Send registration confirmation email
   */
  async sendRegistrationConfirmation(data: RegistrationEmailData): Promise<void> {
    try {
      const { registration, event, userEmail, userName } = data;
      
      const emailData = {
        to: userEmail,
        subject: EMAIL_TEMPLATES.REGISTRATION_SUCCESS.replace('{eventTitle}', event.title),
        html: this.generateRegistrationConfirmationHTML({
          userName,
          eventTitle: event.title,
          eventDate: new Date(event.startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          eventTime: new Date(event.startDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          eventLocation: event.location,
          registrationCode: registration.registrationCode,
          paymentAmount: registration.paymentInfo?.amount || 0,
          paymentCurrency: registration.paymentInfo?.currency || 'BDT',
          transactionId: registration.paymentInfo?.transactionId || 'N/A'
        })
      };

      await emailHelper.sendEmail(emailData);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to send registration confirmation email: ${error.message}`
      );
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(data: RegistrationEmailData): Promise<void> {
    try {
      const { registration, event, userEmail, userName } = data;
      
      const emailData = {
        to: userEmail,
        subject: EMAIL_TEMPLATES.PAYMENT_CONFIRMATION.replace('{eventTitle}', event.title),
        html: this.generatePaymentConfirmationHTML({
          userName,
          eventTitle: event.title,
          registrationCode: registration.registrationCode,
          paymentAmount: registration.paymentInfo?.amount || 0,
          paymentCurrency: registration.paymentInfo?.currency || 'BDT',
          transactionId: registration.paymentInfo?.transactionId || 'N/A',
          paymentDate: registration.paymentInfo?.processedAt 
            ? new Date(registration.paymentInfo.processedAt).toLocaleDateString()
            : new Date().toLocaleDateString()
        })
      };

      await emailHelper.sendEmail(emailData);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to send payment confirmation email: ${error.message}`
      );
    }
  }

  /**
   * Send registration cancellation email
   */
  async sendRegistrationCancellation(data: RegistrationEmailData & { reason?: string }): Promise<void> {
    try {
      const { registration, event, userEmail, userName, reason } = data;
      
      const emailData = {
        to: userEmail,
        subject: EMAIL_TEMPLATES.REGISTRATION_CANCELLED.replace('{eventTitle}', event.title),
        html: this.generateCancellationHTML({
          userName,
          eventTitle: event.title,
          registrationCode: registration.registrationCode,
          reason: reason || 'No reason provided',
          refundInfo: 'If you made a payment, refund will be processed within 7-10 business days.'
        })
      };

      await emailHelper.sendEmail(emailData);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to send cancellation email: ${error.message}`
      );
    }
  }

  /**
   * Generate registration confirmation HTML
   */
  private generateRegistrationConfirmationHTML(data: {
    userName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    registrationCode: string;
    paymentAmount: number;
    paymentCurrency: string;
    transactionId: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .registration-code { background: #e8f5e8; border: 2px solid #4caf50; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .code { font-size: 24px; font-weight: bold; color: #2e7d32; letter-spacing: 2px; }
          .event-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .payment-details { background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px; border: 1px solid #ffeaa7; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .important { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Registration Confirmed!</h1>
          <p>Thank you for registering for our event</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${data.userName}</strong>,</p>
          
          <p>Your registration for <strong>${data.eventTitle}</strong> has been successfully confirmed!</p>
          
          <div class="registration-code">
            <h3>Your Registration Code</h3>
            <div class="code">${data.registrationCode}</div>
            <p class="important">⚠️ Please save this code - you'll need it for event entry!</p>
          </div>
          
          <div class="event-details">
            <h3>📅 Event Details</h3>
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Time:</strong> ${data.eventTime}</p>
            <p><strong>Location:</strong> ${data.eventLocation}</p>
          </div>
          
          <div class="payment-details">
            <h3>💳 Payment Information</h3>
            <p><strong>Amount Paid:</strong> ${data.paymentAmount} ${data.paymentCurrency}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Payment Status:</strong> ✅ Confirmed</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <h3>📋 Important Instructions</h3>
            <ul>
              <li>Bring your registration code to the event</li>
              <li>Arrive at least 15 minutes before the event starts</li>
              <li>Keep this email for your records</li>
              <li>Contact the organizer if you have any questions</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>If you have any questions, please contact the event organizer.</p>
          <p><small>This is an automated email. Please do not reply to this message.</small></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate payment confirmation HTML
   */
  private generatePaymentConfirmationHTML(data: {
    userName: string;
    eventTitle: string;
    registrationCode: string;
    paymentAmount: number;
    paymentCurrency: string;
    transactionId: string;
    paymentDate: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-success { background: #e8f5e8; border: 2px solid #4caf50; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .amount { font-size: 28px; font-weight: bold; color: #2e7d32; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Payment Successful!</h1>
          <p>Your payment has been processed successfully</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${data.userName}</strong>,</p>
          
          <div class="payment-success">
            <h3>Payment Confirmed</h3>
            <div class="amount">${data.paymentAmount} ${data.paymentCurrency}</div>
            <p>for <strong>${data.eventTitle}</strong></p>
          </div>
          
          <div class="details">
            <h3>Payment Details</h3>
            <p><strong>Registration Code:</strong> ${data.registrationCode}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
            <p><strong>Amount:</strong> ${data.paymentAmount} ${data.paymentCurrency}</p>
          </div>
          
          <p>Your registration is now complete. Please keep this email as proof of payment.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for your payment!</p>
          <p><small>This is an automated email. Please do not reply to this message.</small></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate cancellation HTML
   */
  private generateCancellationHTML(data: {
    userName: string;
    eventTitle: string;
    registrationCode: string;
    reason: string;
    refundInfo: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .cancellation-notice { background: #ffebee; border: 2px solid #f44336; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❌ Registration Cancelled</h1>
          <p>Your event registration has been cancelled</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${data.userName}</strong>,</p>
          
          <div class="cancellation-notice">
            <h3>Registration Cancelled</h3>
            <p>Your registration for <strong>${data.eventTitle}</strong> has been cancelled.</p>
            <p><strong>Registration Code:</strong> ${data.registrationCode}</p>
          </div>
          
          <div class="details">
            <h3>Cancellation Details</h3>
            <p><strong>Reason:</strong> ${data.reason}</p>
            <p><strong>Refund Information:</strong> ${data.refundInfo}</p>
          </div>
          
          <p>We're sorry to see you go. If you have any questions about this cancellation, please contact the event organizer.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for your understanding.</p>
          <p><small>This is an automated email. Please do not reply to this message.</small></p>
        </div>
      </body>
      </html>
    `;
  }
}

export const eventRegistrationEmailService = new EventRegistrationEmailService();