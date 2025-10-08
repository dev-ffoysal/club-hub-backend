import express from 'express';
import { EngagementController } from './engagement.controller';
import { EngagementValidations } from './engagement.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';

const router = express.Router();

// Vote on an event (upvote/downvote)
router.patch(
  '/vote/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.MEMBER
  ),
  validateRequest(EngagementValidations.upOrDownVote),
  EngagementController.upOrDownVote
);


export const EngagementRoutes = router;