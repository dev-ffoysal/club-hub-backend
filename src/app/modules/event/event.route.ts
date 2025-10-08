import express from 'express';
import { EventController } from './event.controller';
import { EventValidations } from './event.validation';
import validateRequest from '../../middleware/validateRequest';
import stepValidationMiddleware from '../../middleware/stepValidation';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody';


const router = express.Router();

// Get club events
router.get(
  '/club',
  auth(
    USER_ROLES.CLUB
  ),
  EventController.getClubsEvents
);

router.get(
  '/',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB,
    USER_ROLES.GUEST,
    USER_ROLES.MEMBER
  ),
  EventController.getAllEvents
);

router.get(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB,
    USER_ROLES.GUEST,
    USER_ROLES.MEMBER
  ),
  EventController.getSingleEvent
);

router.post(
  '/',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(EventValidations.createEventZodSchema),
  EventController.createEvent
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(EventValidations.updateEventZodSchema),
  EventController.updateEvent
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN
  ),
  EventController.deleteEvent
);


// Get event step information
router.get(
  '/step/:id',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.CLUB
  ),
  EventController.getEventStepInfo
);



export const EventRoutes = router;