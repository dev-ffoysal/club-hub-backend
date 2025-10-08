import express from 'express';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementValidations } from './advertisement.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';

const router = express.Router();

// Admin routes (Super Admin only)
router.get(
  '/admin',
  auth(USER_ROLES.SUPER_ADMIN),
  AdvertisementController.getAllAdvertisements
);

router.get(
  '/admin/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AdvertisementController.getSingleAdvertisement
);

router.post(
  '/admin',
  auth(USER_ROLES.SUPER_ADMIN),
  validateRequest(AdvertisementValidations.create),
  AdvertisementController.createAdvertisement
);

router.patch(
  '/admin/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  validateRequest(AdvertisementValidations.update),
  AdvertisementController.updateAdvertisement
);

router.delete(
  '/admin/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AdvertisementController.deleteAdvertisement
);

// Analytics routes (Super Admin only)
router.get(
  '/admin/:id/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AdvertisementController.getAdvertisementStats
);

// Public routes for displaying advertisements
router.get(
  '/active',
  AdvertisementController.getActiveAdvertisements
);

router.get(
  '/position/:position',
  validateRequest(AdvertisementValidations.getAdsByPosition),
  AdvertisementController.getAdvertisementsByPosition
);

router.get(
  '/club/:clubId',
  AdvertisementController.getAdvertisementsByClub
);

// Tracking routes (Public - no authentication required)
router.post(
  '/:id/impression',
  validateRequest(AdvertisementValidations.trackImpression),
  AdvertisementController.trackImpression
);

router.post(
  '/:id/click',
  validateRequest(AdvertisementValidations.trackClick),
  AdvertisementController.trackClick
);

export const AdvertisementRoutes = router;