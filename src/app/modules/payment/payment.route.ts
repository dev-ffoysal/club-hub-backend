import express from 'express';
import { PaymentController } from './payment.controller';
import { PaymentValidations } from './payment.validation';
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
  PaymentController.getAllPayments
);

router.get(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  PaymentController.getSinglePayment
);




  



// Payment callback routes (no authentication required for AmarPay callbacks)
router.post(
  '/callback/success',
  PaymentController.paymentSuccessCallback
);

router.post(
  '/callback/failure',
  PaymentController.paymentFailureCallback
);

router.post(
  '/callback/cancel',
  PaymentController.paymentCancelCallback
);

export const PaymentRoutes = router;