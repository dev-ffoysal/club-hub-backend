import express from 'express';
import { ClubregistrationController } from './clubregistration.controller';
import { ClubregistrationValidations } from './clubregistration.validation';
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
  ClubregistrationController.getAllClubregistrations
);

router.get(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  ClubregistrationController.getSingleClubregistration
);

router.post(
  '/',
  auth(
    USER_ROLES.CLUB,
    USER_ROLES.MEMBER,
  ),
  
  validateRequest(ClubregistrationValidations.createClubregistrationZodSchema),
  ClubregistrationController.createClubregistration
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.CLUB
  ),
  
  validateRequest(ClubregistrationValidations.updateClubregistrationZodSchema),
  ClubregistrationController.updateClubregistration
);



// Payment callback routes
router.post(
  '/payment/success',
  validateRequest(ClubregistrationValidations.paymentSuccessZodSchema),
  ClubregistrationController.paymentSuccessCallback
);

router.post(
  '/payment/failure',
  validateRequest(ClubregistrationValidations.paymentFailZodSchema),
  ClubregistrationController.paymentFailureCallback
);

export const ClubregistrationRoutes = router;