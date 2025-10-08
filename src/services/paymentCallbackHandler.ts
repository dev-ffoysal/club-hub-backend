import { StatusCodes } from 'http-status-codes';
import ApiError from '../errors/ApiError';
import { EventRegistrationService } from '../app/modules/eventRegistration/eventRegistration.service';
import { ClubregistrationServices } from '../app/modules/clubregistration/clubregistration.service';

/**
 * Unified payment callback handler that routes payments to the correct registration type
 */
class PaymentCallbackHandler {
  /**
   * Process payment success callback
   * Routes to appropriate service based on registration type in callback data
   */
  async processSuccessCallback(callbackData: any) {
    try {
      // Extract registration type from callback data (stored in opt_d)
      const registrationType = callbackData.opt_d;
      
      if (!registrationType) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration type not found in callback data');
      }

      switch (registrationType) {
        case 'event':
          return await EventRegistrationService.processPaymentSuccess(callbackData);
        
        case 'club':
          return await ClubregistrationServices.processPaymentSuccess(callbackData);
        
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, `Unknown registration type: ${registrationType}`);
      }
    } catch (error) {
      console.error('Payment success callback processing failed:', error);
      throw error;
    }
  }

  /**
   * Process payment failure callback
   * Routes to appropriate service based on registration type in callback data
   */
  async processFailureCallback(callbackData: any) {
    try {
      // Extract registration type from callback data (stored in opt_d)
      const registrationType = callbackData.opt_d;
      
      if (!registrationType) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration type not found in callback data');
      }

      switch (registrationType) {
        case 'event':
          return await EventRegistrationService.processPaymentFailure(callbackData);
        
        case 'club':
          return await ClubregistrationServices.processPaymentFailure(callbackData);
        
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, `Unknown registration type: ${registrationType}`);
      }
    } catch (error) {
      console.error('Payment failure callback processing failed:', error);
      throw error;
    }
  }

  /**
   * Get registration type from transaction ID
   * This is a fallback method if registration type is not in callback data
   */
  async getRegistrationTypeFromTransactionId(transactionId: string): Promise<'event' | 'club' | null> {
    try {
      // First check if it's an event registration
      const { EventRegistration } = await import('../app/modules/eventRegistration/eventRegistration.model');
      const eventRegistration = await EventRegistration.findOne({
        'paymentInfo.transactionId': transactionId
      });
      
      if (eventRegistration) {
        return 'event';
      }

      // Then check if it's a club registration
      const { Clubregistration } = await import('../app/modules/clubregistration/clubregistration.model');
      const clubRegistration = await Clubregistration.findOne({
        'paymentInfo.transactionId': transactionId
      });
      
      if (clubRegistration) {
        return 'club';
      }

      return null;
    } catch (error) {
      console.error('Error determining registration type:', error);
      return null;
    }
  }

  /**
   * Process callback with automatic type detection
   * Uses transaction ID to determine registration type if not provided in callback
   */
  async processCallbackWithAutoDetection(callbackData: any, isSuccess: boolean) {
    let registrationType = callbackData.opt_d;
    
    // If registration type is not in callback data, try to detect it
    if (!registrationType && callbackData.mer_txnid) {
      registrationType = await this.getRegistrationTypeFromTransactionId(callbackData.mer_txnid);
    }
    
    if (!registrationType) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Unable to determine registration type');
    }

    // Add registration type to callback data for consistency
    callbackData.opt_d = registrationType;

    if (isSuccess) {
      return await this.processSuccessCallback(callbackData);
    } else {
      return await this.processFailureCallback(callbackData);
    }
  }
}

export const paymentCallbackHandler = new PaymentCallbackHandler();
export { PaymentCallbackHandler };