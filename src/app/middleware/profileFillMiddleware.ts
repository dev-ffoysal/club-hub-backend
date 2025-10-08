import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../enum/user';
import validateRequest from './validateRequest';
import { UserValidations } from '../modules/user/user.validation';

const profileUpdateValidator = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;
  
  switch (user?.role) {
    case USER_ROLES.MEMBER:
      // Validate member profile update
      return validateRequest(UserValidations.memberProfileFillZodSchema)(req, res, next);
    case USER_ROLES.CLUB:
      // Validate club profile update
      return validateRequest(UserValidations.clubProfileUpdateFillZodSchema)(req, res, next);
    default:
      // If the role is invalid, return an error response and don't call next()
      return res.status(400).json({ message: 'Invalid role for profile update' });
  }
};

export default profileUpdateValidator;
