import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { EventRegistrationService } from './eventRegistration.service';

import { IEventRegistration, PAYMENT_STATUS, REGISTRATION_STATUS, USER_TYPE } from './eventRegistration.interface';
import { eventRegistrationFilterables } from './eventRegistration.constants';
import { paginationFields } from '../../../interfaces/pagination';
import { JwtPayload } from 'jsonwebtoken';


/**
 * Create registration for registered user
 */
const createRegisteredUserRegistration = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload).userId;
  const { eventId, successUrl, failUrl, cancelUrl } = req.body;

  const result = await EventRegistrationService.createRegisteredUserRegistration(
    userId,
    eventId,
    { successUrl, failUrl, cancelUrl }
  );

  sendResponse<{ registration: IEventRegistration; paymentUrl: string }>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Registration created successfully. Redirecting to payment.',
    data: result
  });
});

/**
 * Create registration for public user
 */
const createPublicUserRegistration = catchAsync(async (req: Request, res: Response) => {
  const { eventId, publicUserInfo, successUrl, failUrl, cancelUrl } = req.body;

  const result = await EventRegistrationService.createPublicUserRegistration(
    eventId,
    publicUserInfo,
    { successUrl, failUrl, cancelUrl }
  );

  sendResponse<{ registration: IEventRegistration; paymentUrl: string }>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Registration created successfully. Redirecting to payment.',
    data: result
  });
});

/**
 * Payment success callback
 */
const paymentSuccessCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;

  const result = await EventRegistrationService.processPaymentSuccess(callbackData);

  sendResponse<IEventRegistration>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment processed successfully. Registration confirmed.',
    data: result
  });
});

/**
 * Payment failure callback
 */
const paymentFailureCallback = catchAsync(async (req: Request, res: Response) => {
  const callbackData = req.body;

  const result = await EventRegistrationService.processPaymentFailure(callbackData);

  sendResponse<IEventRegistration>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment failure processed.',
    data: result
  });
});

/**
 * Verify registration by code
 */
const verifyRegistration = catchAsync(async (req: Request, res: Response) => {
  const { registrationCode } = req.body;

  const result = await EventRegistrationService.verifyRegistrationByCode(registrationCode);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: result.isValid,
    message: result.message,
    data: {
      isValid: result.isValid,
      registration: result.registration,
      event: result.event
    }
  });
});

/**
 * Get all registrations
 */
const getAllRegistrations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventRegistrationFilterables);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventRegistrationService.getAllRegistrations(filters, paginationOptions);

  sendResponse<IEventRegistration[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registrations retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get single registration
 */
const getSingleRegistration = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventRegistrationService.getSingleRegistration(id);

  sendResponse<IEventRegistration>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registration retrieved successfully',
    data: result
  });
});

/**
 * Update registration
 */
const updateRegistration = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await EventRegistrationService.updateRegistration(id, updateData);

  sendResponse<IEventRegistration>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registration updated successfully',
    data: result
  });
});

/**
 * Cancel registration
 */
const cancelRegistration = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const result = await EventRegistrationService.cancelRegistration(id, reason);

  sendResponse<IEventRegistration>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registration cancelled successfully',
    data: result
  });
});

/**
 * Resend confirmation email
 */
const resendConfirmationEmail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await EventRegistrationService.resendConfirmationEmail(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Confirmation email sent successfully'
  });
});

/**
 * Get registrations by event (for event organizers)
 */
const getRegistrationsByEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const filters = { ...pick(req.query, eventRegistrationFilterables), event: eventId };
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventRegistrationService.getAllRegistrations(filters, paginationOptions);

  sendResponse<IEventRegistration[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event registrations retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get user's registrations
 */
const getUserRegistrations = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const filters = { ...pick(req.query, eventRegistrationFilterables), user: userId };
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventRegistrationService.getAllRegistrations(filters, paginationOptions);

  sendResponse<IEventRegistration[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User registrations retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get registration statistics for an event
 */
const getEventRegistrationStats = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  
  // Get all registrations for the event
  const allRegistrations = await EventRegistrationService.getAllRegistrations(
    { event: eventId },
    { page: 1, limit: 1000 } // Get all registrations
  );

  const stats = {
    total: allRegistrations.data.length,
    confirmed: allRegistrations.data.filter((reg: IEventRegistration) => reg.registrationStatus === REGISTRATION_STATUS.CONFIRMED).length,
    pending: allRegistrations.data.filter((reg: IEventRegistration) => reg.registrationStatus === REGISTRATION_STATUS.PENDING).length,
    cancelled: allRegistrations.data.filter((reg: IEventRegistration) => reg.registrationStatus === REGISTRATION_STATUS.CANCELLED).length,
    paymentCompleted: allRegistrations.data.filter((reg: IEventRegistration) => reg.paymentStatus === PAYMENT_STATUS.COMPLETED).length,
    paymentPending: allRegistrations.data.filter((reg: IEventRegistration) => reg.paymentStatus === PAYMENT_STATUS.PENDING).length,
    paymentFailed: allRegistrations.data.filter((reg: IEventRegistration) => reg.paymentStatus === PAYMENT_STATUS.FAILED).length,
    registeredUsers: allRegistrations.data.filter((reg: IEventRegistration) => reg.userType === USER_TYPE.REGISTERED).length,
    publicUsers: allRegistrations.data.filter((reg: IEventRegistration) => reg.userType === USER_TYPE.PUBLIC).length
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Event registration statistics retrieved successfully',
    data: stats
  });
});

export const EventRegistrationController = {
  createRegisteredUserRegistration,
  createPublicUserRegistration,
  paymentSuccessCallback,
  paymentFailureCallback,
  verifyRegistration,
  getAllRegistrations,
  getSingleRegistration,
  updateRegistration,
  cancelRegistration,
  resendConfirmationEmail,
  getRegistrationsByEvent,
  getUserRegistrations,
  getEventRegistrationStats
};