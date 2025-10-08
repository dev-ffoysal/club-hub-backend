import express from 'express';
import { MessageController } from './message.controller';
import { MessageValidations } from './message.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/:chatId',
  auth(

    USER_ROLES.CLUB,
    USER_ROLES.MEMBER
  ),
  validateRequest(MessageValidations.get),
  MessageController.getMessageByChatId
);

router.post(
  '/:chatId',
  auth(

    USER_ROLES.CLUB,
    USER_ROLES.MEMBER
  ),
  
  validateRequest(MessageValidations.create),
  MessageController.sendMessage
);



export const MessageRoutes = router;