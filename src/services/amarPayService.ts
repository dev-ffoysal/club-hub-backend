import axios from 'axios';
import crypto from 'crypto';
import config from '../config';
import { AMARPAY_CONFIG } from '../app/modules/eventRegistration/eventRegistration.constants';
import { IAmarPayPaymentRequest, IAmarPayResponse } from '../app/modules/eventRegistration/eventRegistration.interface';
import { generateTransactionId } from '../utils/codeGenerator';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

interface AmarPayConfig {
  storeId: string;
  signatureKey: string;
  environment: 'sandbox' | 'live';
}

class AmarPayService {
  private config: AmarPayConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      storeId: process.env.AMARPAY_STORE_ID || 'test_store',
      signatureKey: process.env.AMARPAY_SIGNATURE_KEY || 'test_signature',
      environment: (process.env.AMARPAY_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox'
    };
    
    this.baseUrl = this.config.environment === 'sandbox' 
      ? AMARPAY_CONFIG.SANDBOX_URL 
      : AMARPAY_CONFIG.LIVE_URL;
  }

  /**
   * Initiate payment with AmarPay
   */
  async initiatePayment(paymentData: IAmarPayPaymentRequest): Promise<IAmarPayResponse> {
    try {
      const transactionId = generateTransactionId();
      
      // Determine payment description and reference based on type
      const isClubRegistration = paymentData.clubId !== undefined;
      const description = isClubRegistration 
        ? `Club Registration Payment - Club ID: ${paymentData.clubId}`
        : `Event Registration Payment - Event ID: ${paymentData.eventId}`;
      
      const referenceId = isClubRegistration ? paymentData.clubId : paymentData.eventId;
      
      const paymentPayload = {
        store_id: this.config.storeId,
        tran_id: transactionId,
        success_url: paymentData.successUrl,
        fail_url: paymentData.failUrl,
        cancel_url: paymentData.cancelUrl,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency || AMARPAY_CONFIG.CURRENCY,
        signature_key: this.config.signatureKey,
        desc: description,
        cus_name: paymentData.publicUserInfo?.name || 'Registered User',
        cus_email: paymentData.publicUserInfo?.email || 'user@example.com',
        cus_add1: 'N/A',
        cus_add2: 'N/A',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: paymentData.publicUserInfo?.phone || '01700000000',
        type: 'json',
        opt_a: referenceId, // Store event/club ID for reference
        opt_b: paymentData.userId || '', // Store user ID if available
        opt_c: paymentData.publicUserInfo ? JSON.stringify(paymentData.publicUserInfo) : '', // Store public user info
        opt_d: isClubRegistration ? 'club' : 'event' // Store registration type
      };

      const response = await axios.post(
        `${this.baseUrl}${AMARPAY_CONFIG.INITIATE_ENDPOINT}`,
        paymentPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data.result !== 'true') {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Payment initiation failed: ${response.data.reason || 'Unknown error'}`
        );
      }

      return {
        result: response.data.result,
        payment_url: response.data.payment_url,
        session_key: response.data.session_key,
        amount: response.data.amount,
        currency: response.data.currency,
        desc: response.data.desc,
        mer_txnid: transactionId
      };
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `AmarPay service error: ${error.message}`
      );
    }
  }

  /**
   * Verify payment status with AmarPay
   */
  async verifyPayment(transactionId: string): Promise<any> {
    try {
      const verifyPayload = {
        store_id: this.config.storeId,
        signature_key: this.config.signatureKey,
        type: 'json',
        request_id: transactionId
      };

      const response = await axios.post(
        `${this.baseUrl}${AMARPAY_CONFIG.VERIFY_ENDPOINT}`,
        verifyPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Payment verification failed: ${error.message}`
      );
    }
  }

  /**
   * Validate payment callback signature
   */
  validateSignature(payload: any): boolean {
    try {
      // AmarPay doesn't use signature validation in the same way as some other gateways
      // Instead, we verify by calling their verification API
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Process payment success callback
   */
  async processSuccessCallback(callbackData: any): Promise<any> {
    try {
      // Verify the payment with AmarPay
      const verificationResult = await this.verifyPayment(callbackData.mer_txnid);
      
      if (verificationResult.pay_status === 'Successful') {
        return {
          isValid: true,
          transactionId: callbackData.mer_txnid,
          amount: parseFloat(callbackData.amount),
          currency: callbackData.currency,
          paymentTime: callbackData.pay_time,
          bankTransactionId: callbackData.bank_txn,
          cardType: callbackData.card_type,
          gatewayResponse: callbackData
        };
      } else {
        return {
          isValid: false,
          reason: verificationResult.failed_reason || 'Payment verification failed'
        };
      }
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Payment callback processing failed: ${error.message}`
      );
    }
  }

  /**
   * Process payment failure callback
   */
  processFailureCallback(callbackData: any): any {
    return {
      isValid: false,
      transactionId: callbackData.mer_txnid,
      reason: callbackData.failed_reason || 'Payment failed',
      gatewayResponse: callbackData
    };
  }

  /**
   * Generate refund request (if supported by AmarPay)
   */
  async initiateRefund(transactionId: string, amount: number, reason: string): Promise<any> {
    // Note: AmarPay refund process typically requires manual intervention
    // This is a placeholder for future implementation
    throw new ApiError(
      StatusCodes.NOT_IMPLEMENTED,
      'Refund functionality requires manual processing through AmarPay dashboard'
    );
  }
}

export const amarPayService = new AmarPayService();