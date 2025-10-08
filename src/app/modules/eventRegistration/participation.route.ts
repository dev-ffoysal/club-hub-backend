import express from 'express';
import { ParticipationController } from './participation.controller';
import { ParticipationValidation } from './participation.validation';
import validateRequest from '../../../app/middleware/validateRequest';
import auth from '../../../app/middleware/auth';
import { USER_ROLES } from '../../../enum/user';

const router = express.Router();

// Get event participants (with optional participation status filter)
router.get(
  '/event/:eventId',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ParticipationValidation.getEventParticipantsZodSchema),
  ParticipationController.getEventParticipants
);

// Get participation statistics for an event
router.get(
  '/stats/:eventId',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ParticipationValidation.getParticipationStatsZodSchema),
  ParticipationController.getParticipationStats
);

// Mark single participant
router.patch(
  '/single/:registrationId',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ParticipationValidation.markSingleParticipationZodSchema),
  ParticipationController.markSingleParticipation
);

// Mark bulk participants
router.patch(
  '/bulk',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ParticipationValidation.markBulkParticipationZodSchema),
  ParticipationController.markBulkParticipation
);

export const ParticipationRoutes = router;