import express from 'express';
import { ClubControllers } from './club.controller';
import validateRequest from '../../middleware/validateRequest';
import { ClubValidations } from './club.validation';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';

const router = express.Router();

router.get('/get-joining-url',auth(USER_ROLES.CLUB),validateRequest(ClubValidations.getClubJoiningUrlSchema), ClubControllers.getClubJoiningUrl);
router.get('/generate-event-joining-url',auth(USER_ROLES.CLUB),validateRequest(ClubValidations.generateEventJoiningUrlSchema), ClubControllers.generateEventJoiningUrl);

export const ClubRoutes = router;
