import express from 'express'
import { UserController } from './user.controller'
import { UserValidations } from './user.validation'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import {
  fileAndBodyProcessorUsingDiskStorage,
} from '../../middleware/processReqBody'


const router = express.Router()



router.patch(
  '/member-profile',
  auth(
    USER_ROLES.MEMBER
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(UserValidations.updateMemberProfileZodSchema),
  UserController.updateMemberProfile,
)

router.patch(
  '/club-profile',
  auth(
    USER_ROLES.CLUB
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(UserValidations.updateClubProfileInformationZodSchema),
  UserController.updateClubProfileInformation,
)

router.get(
  '/all-club',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB,
    USER_ROLES.GUEST,
    USER_ROLES.MEMBER
  ),
  UserController.getAllClubs,
)

router.get('/all-user', UserController.getAllUsers);


router.post(
  '/profile',
  auth(
    USER_ROLES.MEMBER,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB,
    USER_ROLES.GUEST,
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  // profileUpdateValidator(),
  UserController.fillUserProfileInformation,
)

router.get('/profile', auth(
  USER_ROLES.MEMBER,
  USER_ROLES.ADMIN,
  USER_ROLES.CLUB,
  USER_ROLES.GUEST,
), UserController.getUserProfile)

router.get('/:id', auth(
  USER_ROLES.MEMBER,
  USER_ROLES.ADMIN,
  USER_ROLES.CLUB,
  USER_ROLES.GUEST,
), UserController.getSingleUser);
export const UserRoutes = router
