import { emailHelper } from '../helpers/emailHelper';
import { IClubregistration } from '../app/modules/clubregistration/clubregistration.interface';
import { IUser } from '../app/modules/user/user.interface';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

interface ClubRegistrationEmailData {
  registration: IClubregistration;
  club: IUser;
  userEmail: string;
  userName: string;
}

class ClubRegistrationEmailService {
  /**
   * Send club registration confirmation email
   */
  async sendRegistrationConfirmation(data: ClubRegistrationEmailData): Promise<void> {
    try {
      const { registration, club, userEmail, userName } = data;
      
      const emailData = {
        to: userEmail,
        subject: `Club Registration Confirmed - ${club.clubName}`,
        html: this.generateRegistrationConfirmationHTML({
          userName,
          clubName: club.clubName || 'Club',
          clubTitle: club.clubTitle || '',
          clubPurpose: club.clubPurpose || '',
          registrationDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          paymentAmount: registration.paymentInfo?.amount || 0,
          paymentCurrency: registration.paymentInfo?.currency || 'BDT',
          transactionId: registration.paymentInfo?.transactionId || 'N/A',
          status: registration.status
        })
      };

     emailHelper.sendEmail(emailData);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to send club registration confirmation email: ${error.message}`
      );
    }
  }

  /**
   * Send payment confirmation email for club registration
   */
  async sendPaymentConfirmation(data: ClubRegistrationEmailData): Promise<void> {
    try {
      const { registration, club, userEmail, userName } = data;
      
      const emailData = {
        to: userEmail,
        subject: `Payment Confirmed - ${club.clubName} Registration`,
        html: this.generatePaymentConfirmationHTML({
          userName,
          clubName: club.clubName || 'Club',
          paymentAmount: registration.paymentInfo?.amount || 0,
          paymentCurrency: registration.paymentInfo?.currency || 'BDT',
          transactionId: registration.paymentInfo?.transactionId || 'N/A',
          paymentDate: registration.paymentInfo?.processedAt 
            ? new Date(registration.paymentInfo.processedAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          status: registration.status
        })
      };

     emailHelper.sendEmail(emailData);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to send club payment confirmation email: ${error.message}`
      );
    }
  }

  /**
   * Send payment failure email for club registration
   */
  async sendPaymentFailure(data: ClubRegistrationEmailData & { reason?: string }): Promise<void> {
    try {
      const { registration, club, userEmail, userName, reason } = data;
      
      const emailData = {
        to: userEmail,
        subject: `Payment Failed - ${club.clubName} Registration`,
        html: this.generatePaymentFailureHTML({
          userName,
          clubName: club.clubName || 'Club',
          paymentAmount: registration.paymentInfo?.amount || 0,
          paymentCurrency: registration.paymentInfo?.currency || 'BDT',
          transactionId: registration.paymentInfo?.transactionId || 'N/A',
          reason: reason || 'Payment processing failed',
          retryInstructions: 'Please contact the club administrator to retry your registration.'
        })
      };

     emailHelper.sendEmail(emailData);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to send club payment failure email: ${error.message}`
      );
    }
  }

  /**
   * Generate HTML for club registration confirmation email
   */
  private generateRegistrationConfirmationHTML(data: {
    userName: string;
    clubName: string;
    clubTitle: string;
    clubPurpose: string;
    registrationDate: string;
    paymentAmount: number;
    paymentCurrency: string;
    transactionId: string;
    status: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Club Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .success { color: #28a745; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Club Registration Confirmed!</h1>
          <p>Welcome to ${data.clubName}</p>
        </div>
        
        <div class="content">
          <p>Dear ${data.userName},</p>
          
          <p class="success">Congratulations! Your registration for ${data.clubName} has been successfully confirmed.</p>
          
          <div class="info-box">
            <h3>Club Information</h3>
            <p><strong>Club Name:</strong> ${data.clubName}</p>
            <p><strong>Club Title:</strong> ${data.clubTitle}</p>
            <p><strong>Purpose:</strong> ${data.clubPurpose}</p>
            <p><strong>Registration Date:</strong> ${data.registrationDate}</p>
            <p><strong>Status:</strong> <span class="success">${data.status.toUpperCase()}</span></p>
          </div>
          
          <div class="info-box">
            <h3>Payment Details</h3>
            <p><strong>Amount Paid:</strong> ${data.paymentAmount} ${data.paymentCurrency}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Payment Status:</strong> <span class="success">COMPLETED</span></p>
          </div>
          
          <p>You are now an official member of ${data.clubName}. You will receive further communications about club activities and events.</p>
          
          <p>If you have any questions, please contact the club administrators.</p>
          
          <p>Best regards,<br>The ${data.clubName} Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML for club payment confirmation email
   */
  private generatePaymentConfirmationHTML(data: {
    userName: string;
    clubName: string;
    paymentAmount: number;
    paymentCurrency: string;
    transactionId: string;
    paymentDate: string;
    status: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745; }
          .success { color: #28a745; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💳 Payment Confirmed!</h1>
          <p>Your payment for ${data.clubName} has been processed</p>
        </div>
        
        <div class="content">
          <p>Dear ${data.userName},</p>
          
          <p class="success">Your payment for ${data.clubName} registration has been successfully processed!</p>
          
          <div class="info-box">
            <h3>Payment Summary</h3>
            <p><strong>Club:</strong> ${data.clubName}</p>
            <p><strong>Amount:</strong> ${data.paymentAmount} ${data.paymentCurrency}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Payment Date:</strong> ${data.paymentDate}</p>
            <p><strong>Status:</strong> <span class="success">${data.status.toUpperCase()}</span></p>
          </div>
          
          <p>Your club registration is now complete and active. Welcome to ${data.clubName}!</p>
          
          <p>Keep this email as a receipt for your records.</p>
          
          <p>Best regards,<br>The ${data.clubName} Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML for club payment failure email
   */
  private generatePaymentFailureHTML(data: {
    userName: string;
    clubName: string;
    paymentAmount: number;
    paymentCurrency: string;
    transactionId: string;
    reason: string;
    retryInstructions: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #dc3545; }
          .error { color: #dc3545; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❌ Payment Failed</h1>
          <p>There was an issue processing your payment</p>
        </div>
        
        <div class="content">
          <p>Dear ${data.userName},</p>
          
          <p class="error">Unfortunately, your payment for ${data.clubName} registration could not be processed.</p>
          
          <div class="info-box">
            <h3>Payment Details</h3>
            <p><strong>Club:</strong> ${data.clubName}</p>
            <p><strong>Amount:</strong> ${data.paymentAmount} ${data.paymentCurrency}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Failure Reason:</strong> ${data.reason}</p>
            <p><strong>Status:</strong> <span class="error">FAILED</span></p>
          </div>
          
          <div class="info-box">
            <h3>Next Steps</h3>
            <p>${data.retryInstructions}</p>
            <p>If you continue to experience issues, please contact our support team with the transaction ID above.</p>
          </div>
          
          <p>We apologize for any inconvenience caused.</p>
          
          <p>Best regards,<br>The ${data.clubName} Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
      </html>
    `;
  }
}

export const clubRegistrationEmailService = new ClubRegistrationEmailService();