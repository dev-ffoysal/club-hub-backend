import express from 'express';
import { ApplicationController } from './application.controller';
import { ApplicationValidations } from './application.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  ApplicationController.getAllApplications
);

router.get(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  ApplicationController.getSingleApplication
);

router.post('/create-club-application', validateRequest(ApplicationValidations.create), ApplicationController.createClubRegistrationApplication)

router.patch(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  
  validateRequest(ApplicationValidations.update),
  ApplicationController.updateApplication
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  ApplicationController.deleteApplication
);

export const ApplicationRoutes = router;