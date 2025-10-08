import express from 'express';
import { AchievementController } from './achievement.controller';
import { AchievementValidations } from './achievement.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody';


const router = express.Router();

router.post('/',auth(USER_ROLES.CLUB),fileAndBodyProcessorUsingDiskStorage(),validateRequest(AchievementValidations.create),AchievementController.createAchievement)

router.get(
  '/',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.CLUB
  ),
  AchievementController.getAllAchievements
);

router.get(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.MEMBER,
    USER_ROLES.CLUB
  ),
  validateRequest(AchievementValidations.getSingleAchievement),
  AchievementController.getSingleAchievement
);



router.patch(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.CLUB
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(AchievementValidations.update),
  AchievementController.updateAchievement
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  AchievementController.deleteAchievement
);

router.get(
  '/club/:id',
  validateRequest(AchievementValidations.getClubAchievements),
  AchievementController.getAchievementByClub
);

export const AchievementRoutes = router;