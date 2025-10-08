import express from 'express';
import { USER_ROLES } from '../../../enum/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { EventRegistrationController } from './eventRegistration.controller';
import { EventRegistrationValidations } from './eventRegistration.validation';
import { ParticipationRoutes } from './participation.route';

const router = express.Router();

// Public routes (no authentication required)
router.post(
  '/public/register',
  validateRequest(EventRegistrationValidations.createPublicUserRegistrationZodSchema),
  EventRegistrationController.createPublicUserRegistration
);

router.post(
  '/verify',
  validateRequest(EventRegistrationValidations.verifyRegistrationZodSchema),
  EventRegistrationController.verifyRegistration
);

// Payment callback routes (no authentication required)
router.post(
  '/payment/success',
  validateRequest(EventRegistrationValidations.paymentSuccessZodSchema),
  EventRegistrationController.paymentSuccessCallback
);

router.post(
  '/payment/failure',
  validateRequest(EventRegistrationValidations.paymentFailZodSchema),
  EventRegistrationController.paymentFailureCallback
);

// Authenticated user routes
router.post(
  '/register',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.createRegisteredUserRegistrationZodSchema),
  EventRegistrationController.createRegisteredUserRegistration
);

router.get(
  '/my-registrations',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.getRegistrationsZodSchema),
  EventRegistrationController.getUserRegistrations
);

router.patch(
  '/:id/cancel',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.cancelRegistrationZodSchema),
  EventRegistrationController.cancelRegistration
);

// Admin routes
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.getRegistrationsZodSchema),
  EventRegistrationController.getAllRegistrations
);

router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  EventRegistrationController.getSingleRegistration
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.updateRegistrationZodSchema),
  EventRegistrationController.updateRegistration
);

router.post(
  '/:id/resend-email',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.resendEmailZodSchema),
  EventRegistrationController.resendConfirmationEmail
);

// Event organizer routes
router.get(
  '/event/:eventId',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(EventRegistrationValidations.getRegistrationsZodSchema),
  EventRegistrationController.getRegistrationsByEvent
);

router.get(
  '/event/:eventId/stats',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  EventRegistrationController.getEventRegistrationStats
);

// Participation management routes
router.use('/participation', ParticipationRoutes);

export const EventRegistrationRoutes = router;