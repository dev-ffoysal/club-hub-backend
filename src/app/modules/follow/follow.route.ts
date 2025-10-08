import express from 'express';
import { FollowController } from './follow.controller';
import { FollowValidations } from './follow.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.MEMBER,
  ),
  FollowController.getAllFollows
);


router.post(
  '/:clubId',
  auth(
    USER_ROLES.MEMBER,
  ),
  validateRequest(FollowValidations.createOrRemove),
  FollowController.createOrRemoveFollow
);




export const FollowRoutes = router;