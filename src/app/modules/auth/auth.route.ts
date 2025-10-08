import express from 'express'
import passport from 'passport'
import { PassportAuthController } from './passport.auth/passport.auth.controller'
import { CustomAuthController } from './custom.auth/custom.auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { AuthValidations } from './auth.validation'
import { USER_ROLES } from '../../../enum/user'
import auth, { tempAuth } from '../../middleware/auth'
import { ApplicationValidations } from '../application/application.validation'
import { UserValidations } from '../user/user.validation'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

router.post(
  '/signup',
  validateRequest(AuthValidations.createUserZodSchema),
  CustomAuthController.createMemberprofile,
)

router.post(
  '/admin-login',
  validateRequest(AuthValidations.loginZodSchema),
  CustomAuthController.adminLogin,
)
router.post(
  '/login',
  validateRequest(AuthValidations.loginZodSchema),
  CustomAuthController.customLogin,
)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  PassportAuthController.googleAuthCallback,
)

router.post(
  '/verify-account',
  validateRequest(AuthValidations.verifyAccountZodSchema),
  CustomAuthController.verifyAccount,
)

router.post(
  '/custom-login',
  validateRequest(AuthValidations.loginZodSchema),
  CustomAuthController.customLogin,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidations.resetPasswordZodSchema),
  CustomAuthController.forgetPassword,
)
router.post(
  '/reset-password',
  validateRequest(AuthValidations.resetPasswordZodSchema),
  CustomAuthController.resetPassword,
)

router.post(
  '/resend-otp',
  tempAuth(
    USER_ROLES.ADMIN,
    USER_ROLES.MEMBER,
    USER_ROLES.GUEST,
    USER_ROLES.CLUB,
  ),
  validateRequest(AuthValidations.resendOtpZodSchema),
  CustomAuthController.resendOtp,
)

router.post(
  '/change-password',
  auth(    USER_ROLES.ADMIN,
    USER_ROLES.MEMBER,
    USER_ROLES.GUEST,
    USER_ROLES.CLUB,
  ),
  validateRequest(AuthValidations.changePasswordZodSchema),
  CustomAuthController.changePassword,
)

router.delete(
  '/delete-account',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.MEMBER,
    USER_ROLES.GUEST,
    USER_ROLES.CLUB,
  ),
  validateRequest(AuthValidations.deleteAccount),
  CustomAuthController.deleteAccount,
)
router.post('/refresh-token', CustomAuthController.getRefreshToken)

router.post('/social-login', validateRequest(AuthValidations.socialLoginZodSchema), CustomAuthController.socialLogin)
router.get('/me',auth(USER_ROLES.ADMIN,
  USER_ROLES.MEMBER,
  USER_ROLES.GUEST,
  USER_ROLES.CLUB,), CustomAuthController.getUserProfile)


export const AuthRoutes = router
