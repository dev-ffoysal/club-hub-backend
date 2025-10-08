import express from 'express';
import { MeetingController } from './meeting.controller';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';
import { MeetingValidation } from './meeting.validation';

const router = express.Router();

// Public routes (no authentication required)
router.get('/code/:code', MeetingController.getMeetingByCode);

// Protected routes (authentication required)
router.post(
  '/create',
  auth(USER_ROLES.CLUB),
  validateRequest(MeetingValidation.createMeetingZodSchema),
  MeetingController.createMeeting
);

router.get(
  '/my-meetings',
  auth(USER_ROLES.MEMBER, USER_ROLES.CLUB),
  MeetingController.getMyMeetings
);

router.get(
  '/stats',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  MeetingController.getMeetingStats
);

router.post(
  '/join',
  validateRequest(MeetingValidation.joinMeetingZodSchema),
  MeetingController.joinMeeting
);

router.patch(
  '/:id/start',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  validateRequest(MeetingValidation.startMeetingZodSchema),
  MeetingController.startMeeting
);

router.patch(
  '/:id/end',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  validateRequest(MeetingValidation.endMeetingZodSchema),
  MeetingController.endMeeting
);

router.delete(
  '/:meetingId/participants/:participantId',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  MeetingController.leaveMeeting
);

router.get(
  '/:id',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  validateRequest(MeetingValidation.getMeetingZodSchema),
  MeetingController.getMeetingById
);

router.patch(
  '/:id',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  validateRequest(MeetingValidation.updateMeetingZodSchema),
  MeetingController.updateMeeting
);

router.delete(
  '/:id',
  auth(USER_ROLES.MEMBER, USER_ROLES.ADMIN),
  validateRequest(MeetingValidation.getMeetingZodSchema),
  MeetingController.deleteMeeting
);

// Admin only routes
router.get(
  '/',
  auth(USER_ROLES.ADMIN),
  MeetingController.getAllMeetings
);

export const MeetingRoutes = router;