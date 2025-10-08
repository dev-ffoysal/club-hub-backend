import { Request, Response } from 'express';
import { PaymentServices } from './payment.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { paymentFilterables } from './payment.constants';
import { paginationFields } from '../../../interfaces/pagination';
import { paymentCallbackHandler } from '../../../services/paymentCallbackHandler';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const paymentData = req.body;

  const result = await PaymentServices.createPayment(
    req.user!,
    paymentData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const paymentData = req.body;

  const result = await PaymentServices.updatePayment(id, paymentData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment updated successfully',
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.getSinglePayment(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, paymentFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await PaymentServices.getAllPayments(
    req.user!,
    filterables,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.deletePayment(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment deleted successfully',
    data: result,
  });
});

/**
 * Unified payment callback handlers for both event and club registrations
 */
const paymentSuccessCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;
  
  try {
    const result = await paymentCallbackHandler.processCallbackWithAutoDetection(
      callbackData, 
      true // isSuccess = true
    );
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Payment processed successfully',
      data: result
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || 'Payment processing failed',
      data: null
    });
  }
});

const paymentFailureCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;
  
  try {
    const result = await paymentCallbackHandler.processCallbackWithAutoDetection(
      callbackData, 
      false // isSuccess = false
    );
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Payment failure processed successfully',
      data: result
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || 'Payment failure processing failed',
      data: null
    });
  }
});

const paymentCancelCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;
  
  try {
    // Treat cancel as failure
    const result = await paymentCallbackHandler.processCallbackWithAutoDetection(
      callbackData, 
      false // isSuccess = false
    );
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Payment cancellation processed successfully',
      data: result
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || 'Payment cancellation processing failed',
      data: null
    });
  }
});

export const PaymentController = {
  createPayment,
  updatePayment,
  getSinglePayment,
  getAllPayments,
  deletePayment,
  paymentSuccessCallback,
  paymentFailureCallback,
  paymentCancelCallback,
};