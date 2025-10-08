import express from 'express';
import { CommitteController } from './committe.controller';
import { CommitteValidations } from './committe.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  CommitteController.getAllCommittes
);

router.get(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB

  ),
  CommitteController.getSingleCommitte
);

router.post(
  '/',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  
  validateRequest(CommitteValidations.create),
  CommitteController.createCommitte
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  
  validateRequest(CommitteValidations.update),
  CommitteController.updateCommitte
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  validateRequest(CommitteValidations.changeStatus),
  CommitteController.deactivateCommitte
);

export const CommitteRoutes = router;